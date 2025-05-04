export interface Users {
  userId: string
  name: string
  email: string
}

export interface Wishes {
  wishId: string
  title: string
  description?: string
  isConvertedToEvent: boolean
  createdAt: string
  wishCreator: string
  wishUpvote: WishUpvote[]
  users: Users
  currentUpvotes: number // neu
  isUpvotedByMe?: boolean
}

export interface WishUpvote {
  upvoteId: string
  userId: string
  wishId: string
  created_at: string
}

export interface Events {
  eventId: string
  title: string
  description?: string
  room?: string
  startDate: Date
  endDate: Date
  createdAt: string
  trainerId: string
  joined: boolean // neu
  eventParticipation: EventParticipation[]
  users: Users
}

export interface EventParticipation {
  created_at: string
  participantId: string
  eventId: string
}

export interface PostEvents {
  trainerId: string
  title: string
  description?: string
  room?: string
  startDate: Date
  endDate: Date
}

export interface PostWishes {
  wishCreator: string
  title: string
  description?: string
}
