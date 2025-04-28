import '@testing-library/jest-dom/jest-globals'
import '@testing-library/jest-dom'
import { expect, describe, it, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import Homepage from '../../src/components/home'

function sum(a: number, b: number) {
  return a + b
}

async function getResponse() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ value: 'Hello World' })
    }, 100)
  })
}

test('adds 2+3 should be equal to 5 & 8+9 should not be 10', () => {
  expect(sum(2, 3)).toBe(5)
  expect(sum(8, 9)).not.toBe(10)
})

test('object assignment', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = { one: 1 }
  data['two'] = 2
  expect(data).toEqual({ one: 1, two: 2 })
})

test('async get Response should return hello world', async () => {
  const response = await getResponse()
  expect(response).toEqual({ value: 'Hello World' })
})

//Grouping Unit Tests
describe('Combine promise response value', () => {
  test('async get Response should return hello world', async () => {
    const response = await getResponse()
    expect(response).toEqual({ value: 'Hello World' })
  })

  test('async get Response should not return abcd', async () => {
    const response = await getResponse()
    expect(response).not.toEqual({ value: 'Hello abcd' })
  })
})

describe('Home Component Test', () => {
  it('renders homepage with Homepage text', () => {
    render(<Homepage />) // ARRANGE
    const text = screen.getByText(/Homepage/i) // ACT
    expect(text).toBeInTheDocument() // ASSERT
  })
})
