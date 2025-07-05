'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { DollarSign } from 'lucide-react'

export default function StartCashSessionPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [startingCash, setStartingCash] = useState('')
    const [notes, setNotes] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!startingCash || parseFloat(startingCash) < 0) {
            toast.error('Por favor ingrese un monto válido')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/cash-sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startingCash: parseFloat(startingCash),
                    notes,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to start cash session')
            }

            toast.success('Sesión de caja iniciada exitosamente')
            router.push('/')
        } catch (error) {
            console.error('Error starting cash session:', error)
            toast.error('Error al iniciar la sesión de caja')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Iniciar Sesión de Caja</h1>
                        <p className="text-muted-foreground">
                            Ingrese el monto inicial en caja para comenzar
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="startingCash" className="block text-sm font-medium mb-2">
                                Monto Inicial en Caja
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                    L.
                                </span>
                                <input
                                    id="startingCash"
                                    type="number"
                                    value={startingCash}
                                    onChange={(e) => setStartingCash(e.target.value)}
                                    className="input pl-10 text-xl font-bold"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium mb-2">
                                Notas (Opcional)
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="input min-h-[100px]"
                                placeholder="Agregar notas sobre el inicio de turno..."
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                className="w-full btn btn-primary btn-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Iniciando...' : 'Iniciar Sesión de Caja'}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="w-full btn btn-ghost btn-lg"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>

                    {session?.user && (
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p>Cajero: {session.user.name || session.user.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}