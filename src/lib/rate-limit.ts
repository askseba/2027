const rateLimit = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimit.get(ip)
  
  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  return { allowed: true, remaining: limit - record.count }
}
