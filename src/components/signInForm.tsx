'use client'
import { signInWithGoogle } from '@/utils/auth'

const SignIn = () => {
  return (
    <div>
      <form>
        <button formAction={signInWithGoogle}>Sign In with Google</button>
      </form>
    </div>
  )
}

export default SignIn
