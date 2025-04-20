import { signInWithGoogle } from '@/utils/auth'

export async function GET() {
  return await signInWithGoogle()
}
