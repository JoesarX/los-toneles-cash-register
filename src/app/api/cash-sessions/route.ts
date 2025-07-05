import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session || (!session.user.isAdmin && !session.user.isCashier)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const cashSessions = await prisma.cashSession.findMany({
            where: session.user.isAdmin ? {} : { userId: session.user.id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                startTime: 'desc',
            },
        })

        return NextResponse.json(cashSessions)
    } catch (error) {
        console.error('Error fetching cash sessions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch cash sessions' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session || (!session.user.isAdmin && !session.user.isCashier)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { startingCash, notes } = body

        // Check if user already has an active session
        const existingActiveSession = await prisma.cashSession.findFirst({
            where: {
                userId: session.user.id,
                isActive: true,
            },
        })

        if (existingActiveSession) {
            return NextResponse.json(
                { error: 'Ya tienes una sesión de caja activa' },
                { status: 400 }
            )
        }

        // Create new cash session
        const cashSession = await prisma.cashSession.create({
            data: {
                userId: session.user.id,
                startingCash,
                notes,
            },
        })

        return NextResponse.json(cashSession, { status: 201 })
    } catch (error) {
        console.error('Error creating cash session:', error)
        return NextResponse.json(
            { error: 'Failed to create cash session' },
            { status: 500 }
        )
    }
}