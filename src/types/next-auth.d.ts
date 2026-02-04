import 'next-auth'

/** Extended session user role – use for type-safe admin checks (runtime: 'admin' | 'user') */
export type UserRole = 'admin' | 'user'

declare module 'next-auth' {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    bio?: string
    role?: string
    statsVerified?: boolean
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      bio?: string
      role?: string
      statsVerified?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    bio?: string
    image?: string
    role?: string
    statsVerified?: boolean
  }
}
