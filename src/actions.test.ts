import { expect, test, vi } from 'vitest'
import * as mod from './actions'

test('debounce', async () => {
  vi.useFakeTimers()
  const fn = vi.fn()
  const debounced = mod.debounce(fn, 1000)

  debounced()
  expect(fn).not.toHaveBeenCalled()

  await vi.runAllTimersAsync()
  expect(fn).toHaveBeenCalledTimes(1)

  vi.useRealTimers()
})

test('debounce with leading', () => {
  const fn = vi.fn()
  const debounced = mod.debounce(fn, 1000, { leading: true })

  debounced()
  expect(fn).toHaveBeenCalledTimes(1)
})

test('debounce with trailing', async () => {
  vi.useFakeTimers()
  const fn = vi.fn()
  const debounced = mod.debounce(fn, 1000, { trailing: true })

  debounced()
  expect(fn).not.toHaveBeenCalled()

  await vi.runAllTimersAsync()
  expect(fn).toHaveBeenCalledTimes(1)

  vi.useRealTimers()
})

test('throttle', () => {
  const fn = vi.fn()
  const throttled = mod.throttle(fn, 1000)

  throttled()
  expect(fn).toHaveBeenCalledTimes(1)
})
