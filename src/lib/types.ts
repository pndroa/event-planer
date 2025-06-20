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
  currentUpvotes: number
  isUpvotedByMe?: boolean
}

export interface WishUpvote {
  upvoteId: string
  userId: string
  wishId: string
  created_at: string
}

export interface EventDates {
  dateId: string
  eventId?: string
  date: string
  startTime?: string
  endTime?: string
  created_at: string
}

export interface Events {
  eventId: string
  wishId?: string
  title: string
  description?: string
  room?: string
  createdAt: string
  trainerId: string
  joined: boolean
  eventDates: EventDates[]
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
  surveyQuestions?: SurveyQuestions[]
}

export interface SurveyResponse {
  surveyId: string
  eventId: string
  title: string
  created_at: string
  answered: boolean
  surveyQuestions: {
    questionText: string
    answered: boolean
  }[]
}

export interface SurveyQuestions {
  questionId: string
  surveyId: string
  questionText: string
  created_at: string
  type: string
  surveyAnswerOptions?: SurveyAnswerOptions[]
}

export interface SurveyAnswerOptions {
  answerOptionsId: string
  questionId: string
  answerText: string
  created_at: string
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

export interface multipleChoiceOption {
  answerText: string
  questionId?: string
  answerOptionsId?: string
  delete?: boolean
}

export interface multipleDateOption {
  answerText: Date | null | string
  questionId?: string
  answerOptionsId?: string
  delete?: boolean
}

export interface Question {
  questionId?: string
  type: 'multiple' | 'text' | 'date' | null
  question: string
  options?: multipleChoiceOption[]
  dates?: multipleDateOption[]
  selectedDateIndex?: number
  selectedOptionIndex?: number
}

export interface SurveyStatistics {
  eventId: string
  title: string
  trainerId: string
  eventParticipation: {
    participantId: string
  }[]
  surveys: {
    title: string
    surveyQuestions: SurveyQuestion[]
  } | null
}

export interface SurveyQuestion {
  questionId: string
  type: 'multiple' | 'text' | 'date'
  questionText: string
  surveyAnswerOptions: {
    answerOptionsId: string
    answerText: string
  }[]
  surveyAnswers: {
    answerId: string
    userId: string
    answer: string
  }[]
}

export interface Notification {
  id: string
  senderId?: string
  eventId?: string
  message: string
  read: boolean
  createdAt: string
}

export interface dateData {
  id: string
  date: string
  startTime: string
  endTime: string
}
