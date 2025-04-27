import Joi from 'joi'

//Schemas for GET requests
export const getEventSchema = Joi.object({
  eventId: Joi.string().required().uuid(),
  trainerId: Joi.string().required().uuid(),
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  room: Joi.string().optional().allow(null),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.min': 'The end date cannot be before the start date.',
    'any.required': 'The end date is required.',
  }),
  createdAt: Joi.date()
    .required()
    .default(() => new Date()),
})

export const getWishSchema = Joi.object({
  wishId: Joi.string().required().uuid(),
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  isConvertedToEvent: Joi.boolean().required().default(false),
  createdAt: Joi.date()
    .required()
    .default(() => new Date()),
})

//Schemas for POST requests
export const postEventSchema = Joi.object({
  trainerId: Joi.string().required().uuid(),
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  room: Joi.string().optional().allow(null),
  startDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.min': 'The end date cannot be before the start date.',
    'any.required': 'The end date is required.',
  }),
})
