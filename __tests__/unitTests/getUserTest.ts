/**
 * @jest-environment node
 */

import { getUser } from '../../src/utils/getUser'
import { test, expect } from '@jest/globals'

test('uset id is null', async () => {
  await expect(getUser(null)).rejects.toThrow('User ID cannot be null')
})

test('user found', async () => {
  const userId: string | undefined = process.env.DUMMY_ID
  if (userId === undefined) {
    throw new Error('DUMMY_ID environment variable is not set')
  }
  const user = await getUser(userId)
  expect(user).toBeDefined()
  if (user !== null && user !== undefined) {
    expect(user.userId).toBe(userId)
  }
})

test('gibt genaue Fehlermeldung in der Konsole aus, wenn User nicht gefunden wird', async () => {
  let consoleOutput = ''
  console.error = (msg: string) => {
    consoleOutput += msg
  }

  const fakeId = '00000000-0000-0000-0000-000000000000'
  await getUser(fakeId)
  expect(consoleOutput).toBe('Error fetching user data:')
})
