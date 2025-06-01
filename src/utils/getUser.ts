import prisma from '@/lib/client'

export async function getUser(userId: string | null) {
  if (userId === null) {
    throw new Error('User ID cannot be null')
  }

  try {
    const user = await prisma.users.findUnique({
      where: { userId: userId },
    })

    if (user === null || user === undefined) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}
