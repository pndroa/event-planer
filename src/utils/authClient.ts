'use client'
import { getOAuthSignInUrl, signOut, signUp } from './authServer'

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

export async function handleSignUp(name: string, email: string, password: string) {
  try {
    const result = await signUp(name, email, password)

    if (result.success) {
      window.location.href = '/signIn?registered=true'
    } else {
      console.error(result.error || 'Unkown Error')
    }

    return result
  } catch (error) {
    return { success: false, error, message: 'Sign up failed' }
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
    return { success: false, error, message: 'Sign out failed' }
  }
}
