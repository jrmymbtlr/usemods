// title: Actions
// description: A stack of handy functions you could write yourself, but don't want to.
// lead: JS karate chops

/**
 * Smoothly scrolls to the element with the specified ID without scuffing up your URLs.
 */
export function scrollToAnchor(
  id: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const selector = `#${id}`
      const element = document.querySelector(selector)
      if (!element) {
        console.warn(`[MODS] Element with id '${id}' not found.`)
        reject(`Element with id '${id}' not found.`)
        return
      }
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      resolve()
    }, 180)
  })
}

/**
 * Toggles the body scroll with specified class names and returns a promise
 * @info Use your own class names, or ensure fixed is within your Tailwindcss JIT
 */
export function toggleBodyScroll(
  className: string = 'fixed',
  action: 'add' | 'remove' | 'toggle' = 'toggle',
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const body = document.body
      const isFixed = body.classList.contains(className)
      const scrollY = isFixed ? parseInt(body.style.top, 10) : window.scrollY

      body.style.top = isFixed ? '' : `-${scrollY}px`

      if (action === 'add') {
        body.classList.add(className)
      }
      else if (action === 'remove') {
        body.classList.remove(className)
      }
      else {
        body.classList.toggle(className)
      }

      if (isFixed) window.scrollTo(0, -scrollY)

      resolve()
    }
    catch (error) {
      console.warn('[MODS] Failed to toggle body scroll.')
      reject(error)
    }
  })
}

/**
 * Toggles the element scroll with specified class names and returns a promise
 */
export function toggleElementScroll(
  element: HTMLElement,
): Promise<void> {
  return new Promise((resolve) => {
    if (!element) {
      console.warn('[MODS] Element is required to toggle scroll.')
      return resolve()
    }

    if (element.dataset.isScrollLocked === 'true') {
      element.style.overflow = ''
      delete element.dataset.isScrollLocked
    }
    else {
      element.style.overflow = 'hidden'
      element.dataset.isScrollLocked = 'true'
    }
    resolve()
  })
}

/**
 * Copies a convereted string to the clipboard
 */
export async function copyToClipboard(
  value: string | number,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(String(value))
  }
  catch (error) {
    console.error('[MODS] Failed to copy text: ', error)
    throw error
  }
}

/**
 * Toggles the fullscreen mode
 */
export function toggleFullScreen(): Promise<void> {
  return document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen()
}

/**
 * Resets a form to its initial state
 */
export function resetForm(
  form: HTMLFormElement,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      form.reset()
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * Focuses on and scrolls to the first invalid input, select, or textarea element within a form.
 */
export function focusOnInvalid(
  container: HTMLElement,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const input = container.querySelector('input:invalid, select:invalid, textarea:invalid') as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * Focuses on the nth element within the specified form, where 0 is the first element and -1 is the last element.
 */
export function focusOnNth(
  container: HTMLElement,
  index: number = 0,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const elements = container.querySelectorAll('input, textarea, select')
    const elementIndex = index === -1 ? elements.length - 1 : index

    if (elementIndex < 0 || elementIndex >= elements.length) {
      return reject(new Error(`Element at index ${index} is out of bounds.`))
    }

    const element = elements[elementIndex] as HTMLElement

    if (!element || typeof element.focus !== 'function') {
      return reject(new Error('[MODS] Failed to focus on the element.'))
    }

    try {
      element.focus({ preventScroll: true })
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      resolve()
    }
    catch (error) {
      reject(new Error('[MODS] Failed to focus on the element.' + error))
    }
  })
}

/**
 * Sets up a keyboard trap within an HTML element, allowing the focus to cycle between the first and last focusable elements when the Tab key is pressed.
 */
export function focusTrap(
  container: HTMLElement,
): void {
  const focusableElements = container.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select')
  const firstFocusableElement = focusableElements[0] as HTMLElement
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement

  container.addEventListener('keydown', (event) => {
    const isTabPressed = event.key === 'Tab'
    if (!isTabPressed) return

    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus()
        event.preventDefault()
      }
    }
    else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus()
        event.preventDefault()
      }
    }
  })
}

/**
 * Runs a function only if there are no new calls during the delay
 */
export function debounce<T extends (
  ...args: unknown[]) => unknown>(
  func: T,
  delay: number,
  { leading = false, trailing = true }:
  { leading?: boolean, trailing?: boolean } = {},
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const shouldCallNow = leading && !timer
    lastArgs = args

    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      if (trailing && lastArgs) {
        func.apply(this, lastArgs)
      }
      lastArgs = null
    }, delay)

    if (shouldCallNow) {
      func.apply(this, args)
    }
  }

  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
    lastArgs = null
  }

  return debounced
}

/**
 * Throttles a function to ensure it only runs once per threshold
 */
export function throttle<T extends (
  ...args: unknown[]) => void>(
  fn: T,
  threshold: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let lastRun = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  const throttledFn = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = performance.now()
    const remaining = threshold - (now - lastRun)

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastRun = now
      fn.apply(this, args)
    }
    else if (!timeout) {
      timeout = setTimeout(() => {
        lastRun = performance.now()
        timeout = null
        fn.apply(this, args)
      }, remaining)
    }
  }

  // Cancel any pending trailing execution
  throttledFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastRun = 0
  }

  return throttledFn
}
