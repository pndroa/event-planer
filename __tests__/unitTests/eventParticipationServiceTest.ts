/**
 * @jest-environment node
 */
import { getEventsWithParticipation } from '../../src/lib/eventParticipationService'
import { getParticipantsForEvent } from '../../src/lib/eventParticipationService'
import { getEventWithParticipation } from '../../src/lib/eventParticipationService'
import { test, expect } from '@jest/globals'

test('test getting participants', async () => {
  const eventId = '239bb18f-ef42-48ca-8e2b-3ce3874e6156'
  const participants = await getParticipantsForEvent(eventId)

  expect(Array.isArray(participants)).toBe(true)
  expect(participants.length).toBe(0)
})

test('check if user participated event', async () => {
  const userId = 'b09b935e-9a37-48f1-bb29-e8f9698b69f5'
  const eventId = 'edffc4e6-1430-4339-accd-b73fc3f32c5e'
  const event = await getEventWithParticipation(userId, eventId)

  expect(event).toBeDefined()
  expect(event?.eventId).toBe(eventId)
  expect(event?.joined).toBe(false)
})

test('check if user participated event, with wrong', async () => {
  const userId = 'b09b935e-9a37-48f1-bb29-e8f9698b69f5'
  const eventId = '239bb18f-ef42-48ca-8e2b-3ce3874e6157'
  const event = await getEventWithParticipation(userId, eventId)
  expect(event).toBeNull()
})
