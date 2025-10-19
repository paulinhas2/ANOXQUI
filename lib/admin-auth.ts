"use client"

const ADMIN_USERNAME = "ANOXADMIN"
const ADMIN_PASSWORD = "anoxaipim"
const AUTH_KEY = "anox_admin_auth"

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Store authentication in localStorage
    localStorage.setItem(AUTH_KEY, "authenticated")
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "authenticated"
}
