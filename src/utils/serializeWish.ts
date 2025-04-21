interface RawWish {
  wishId: bigint
  userId: bigint
  title: string
  description: string
  currentUpvotes: number // Prisma: Int
  createdAt: Date // Prisma: DateTime
  isConvertedToEvent: boolean

  user: {
    userId: bigint
    username: string
    email: string
  }
}

interface SerializedWish {
  wishId: number
  userId: number
  title: string
  description: string
  currentUpvotes: number
  createdAt: Date // bleibt Date, wird erst bei JSON.stringify zu string
  isConvertedToEvent: boolean

  user: {
    userId: number
    username: string
    email: string
  }
}

export function serializeWish(wish: RawWish): SerializedWish {
  return {
    ...wish,
    wishId: Number(wish.wishId),
    userId: Number(wish.userId),
    //createdAt: wish.createdAt.toISOString(), // implizites Verhalten von JSON.stringify()!
    user: {
      ...wish.user,
      userId: Number(wish.user.userId),
    },
  }
}
