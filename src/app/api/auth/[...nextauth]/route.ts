// NextAuth v5: expose GET/POST so /api/auth/* and /api/auth/session work
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
