'use client'
import { getOAuthSignInUrl, signOut } from './authServer'

export async function signInWithGoogle() {
  try {
    const result = await getOAuthSignInUrl('google')

    if (result.error) {
      console.error('Login error:', result.error)
      return { success: false, error: result.error }
    }

    if (result.url) {
      window.location.href = result.url
      return { success: true }
    }

    return { success: false, error: 'No URL returned' }
  } catch (error) {
    console.error('Failed to sign in:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

export async function handleSignOut() {
  try {
    const result = await signOut()
    if (result.success) {
      window.location.href = '/signIn'
      return { success: true }
    }
    return { success: false }
  } catch (error) {
    console.error('Failed to sign out:', error)
    return { success: false, error: 'Sign out failed' }
  }
}
