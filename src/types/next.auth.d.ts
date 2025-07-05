import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            isAdmin: boolean
            isCashier: boolean
        } & DefaultSession["user"]
    }

    interface User {
        isAdmin: boolean
        isCashier: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        isAdmin: boolean
        isCashier: boolean
    }
}