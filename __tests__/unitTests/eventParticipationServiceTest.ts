/**
 * @jest-environment node
 */
import { getParticipantsForEvent } from '../../src/lib/eventParticipationService'
import { getEventWithParticipation } from '../../src/lib/eventParticipationService'
import { test, expect } from '@jest/globals'

test('test getting participants', async () => {
  const eventId = '74b0cb43-572d-442a-b5ec-282c3ebfc653'
  const participants = await getParticipantsForEvent(eventId)

  expect(Array.isArray(participants)).toBe(true)
  expect(participants.length).not.toBe(0)
})

test('check if user participated event', async () => {
  const userId = 'f10ba7ae-b7d0-4bcb-9119-2a233db2cf90'
  const eventId = '74b0cb43-572d-442a-b5ec-282c3ebfc653'
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
