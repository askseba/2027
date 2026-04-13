"use client"
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  setTheme: (t: Theme) => void
}

const STORAGE_KEY = "theme"

const ThemeCtx = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  systemTheme: "light",
  setTheme: () => {},
})

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme, sysTheme: ResolvedTheme): ResolvedTheme {
  const resolved: ResolvedTheme = theme === "system" ? sysTheme : (theme as ResolvedTheme)
  document.documentElement.classList.toggle("dark", resolved === "dark")
  document.documentElement.style.colorScheme = resolved
  return resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")

  useEffect(() => {
    let stored: Theme = "system"
    try {
      stored = (localStorage.getItem(STORAGE_KEY) as Theme) || "system"
    } catch {}

    const sys = getSystemTheme()
    setSystemTheme(sys)
    setThemeState(stored)
    setResolvedTheme(applyTheme(stored, sys))

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      const newSys: ResolvedTheme = e.matches ? "dark" : "light"
      setSystemTheme(newSys)
      setThemeState(prev => {
        setResolvedTheme(applyTheme(prev, newSys))
        return prev
      })
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const setTheme = useCallback((t: Theme) => {
    const sys = getSystemTheme()
    setThemeState(t)
    const resolved = applyTheme(t, sys)
    setResolvedTheme(resolved)
    try { localStorage.setItem(STORAGE_KEY, t) } catch {}
  }, [])

  return (
    <ThemeCtx.Provider value={{ theme, resolvedTheme, systemTheme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeCtx)
}
