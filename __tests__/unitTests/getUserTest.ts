/**
 * @jest-environment node
 */

import { getUser } from '../../src/utils/getUser'
import { test, expect } from '@jest/globals'

test('uset id is null', async () => {
  await expect(getUser(null)).rejects.toThrow('User ID cannot be null')
})

test('user found', async () => {
  const userId: string | undefined = 'b09b935e-9a37-48f1-bb29-e8f9698b69f5'
  if (userId === undefined) {
    throw new Error('b09b935e-9a37-48f1-bb29-e8f9698b69f5')
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
