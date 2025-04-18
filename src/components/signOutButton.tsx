import { signOut } from '@/utils/auth'

const SignOutButton = () => {
  return (
    <div>
      <form>
        <button formAction={signOut}>sign out</button>
      </form>
    </div>
  )
}

export default SignOutButton
