export interface GetEvents {
  trainerId: string
  title: string
  description?: string
  room?: string
  startDate: Date
  endDate: Date
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
