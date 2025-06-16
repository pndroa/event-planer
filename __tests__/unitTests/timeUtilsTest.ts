import { formatTimeAgo } from '../../src/utils/timeUtils'
import { afterAll, beforeAll, test, expect, jest } from '@jest/globals'

const fixedNow = new Date('2025-06-16T12:00:00Z')

// freeze system time to fixed point in test environment
beforeAll(() => {
  jest.useFakeTimers()
  jest.setSystemTime(fixedNow)
})

//unfreeze
afterAll(() => {
  jest.useRealTimers()
})

test('should return minutes ago when less than 60 minutes have passed', () => {
  const date = new Date('2025-06-16T11:45:00Z').toISOString()
  expect(formatTimeAgo(date)).toBe('15 min ago')
})

test('should return 1 hr ago when exactly 1 hour has passed', () => {
  const date = new Date('2025-06-16T11:00:00Z').toISOString()
  expect(formatTimeAgo(date)).toBe('1 hr ago')
})

test('should return hrs ago when more than 1 hour but less than 24', () => {
  const date = new Date('2025-06-16T03:00:00Z').toISOString()
  expect(formatTimeAgo(date)).toBe('9 hrs ago')
})

test('should return 1 day ago when exactly 24 hours have passed', () => {
  const date = new Date('2025-06-15T12:00:00Z').toISOString()
  expect(formatTimeAgo(date)).toBe('1 day ago')
})

test('should return days ago when more than 1 day has passed', () => {
  const date = new Date('2025-06-13T12:00:00Z').toISOString()
  expect(formatTimeAgo(date)).toBe('3 days ago')
})
