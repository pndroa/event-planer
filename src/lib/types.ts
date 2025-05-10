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
  startDate?: Date
  endDate?: Date
  createdAt: string
  trainerId: string
  joined: boolean // neu
  eventParticipation: EventParticipation[]
  users: Users
  surveys?: Survey
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
  eventDates?: PostEventDates[]
}

export interface PostEventDates {
  date: Date | null
  startTime: Date | null
  endTime: Date | null
}

export interface PostEventDatesUpdate {
  id?: string
  date: Date | null
  startTime: Date | null
  endTime: Date | null
}

export interface PostWishes {
  wishCreator: string
  title: string
  description?: string
}

export interface Survey {
  surveyId: string
  eventId: string
  title: string
  created_at: string
  surveyQuestions: SurveyQuestions[]
  Events: Events
}

export interface SurveyQuestions {
  questionId: string
  surveyId: string
  questionText: string
  isMultipleChoice: boolean
  created_at: string
  surveyAnswerOptions: SurveyAnswer[]
  surveys: Survey
}

export interface SurveyAnswer {
  answerId: string
  questionId: string
  answer: string
  created_at: string
  userId: string
  surveyQuestions: SurveyQuestions
  users: Users
}
