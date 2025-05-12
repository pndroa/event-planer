import Joi from 'joi'

export const postEventDateSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  date: Joi.date().required().messages({
    'string.pattern.base': 'date must be in YYYY-MM-DD format',
  }),
  startTime: Joi.string()
    .pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'startTime must be a valid time in HH:MM format',
    }),
  endTime: Joi.string()
    .pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
    .allow(null)
    .optional()
    .messages({
      'string.pattern.base': 'endTime must be a valid time in HH:MM format',
    }),
})

export const postEventSchema = Joi.object({
  trainerId: Joi.string().uuid().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(null).optional(),
  room: Joi.string().allow(null).optional(),
  eventDates: Joi.array().items(postEventDateSchema).optional(),
  wishId: Joi.string().uuid().allow(null).optional(),
  eventDatesToCompare: Joi.array().items(postEventDateSchema).optional(),
})

export const postWishSchema = Joi.object({
  wishCreator: Joi.string().required().uuid(),
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
})
