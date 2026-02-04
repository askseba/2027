/**
 * API Helper Functions
 * Provides utilities for safe API response handling and type validation
 */

import logger from '@/lib/logger'

/**
 * Safely parse JSON response with error handling
 * @param response - Fetch Response object
 * @returns Parsed JSON data
 * @throws Error if response is not ok or JSON parsing fails
 */
export async function safeJsonResponse<T = unknown>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    let errorMessage = 'حدث خطأ في الخادم'
    
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.error || errorJson.message || errorMessage
    } catch {
      // If error text is not JSON, use status text or default message
      errorMessage = response.statusText || errorMessage
    }
    
    throw new Error(errorMessage)
  }

  const text = await response.text()
  
  if (!text) {
    throw new Error('الاستجابة فارغة من الخادم')
  }

  try {
    return JSON.parse(text) as T
  } catch (error) {
    logger.error('Error parsing JSON:', { error, responseText: text })
    throw new Error('خطأ في تنسيق البيانات من الخادم')
  }
}

/**
 * Validate that data is an array
 * @param data - Data to validate
 * @param errorMessage - Custom error message
 * @returns The data as an array
 * @throws Error if data is not an array
 */
export function validateArray<T>(
  data: unknown,
  errorMessage = 'البيانات المتوقعة يجب أن تكون مصفوفة'
): T[] {
  if (!Array.isArray(data)) {
    throw new Error(errorMessage)
  }
  return data as T[]
}

/**
 * Validate that data is an object
 * @param data - Data to validate
 * @param errorMessage - Custom error message
 * @returns The data as an object
 * @throws Error if data is not an object
 */
export function validateObject<T extends Record<string, unknown>>(
  data: unknown,
  errorMessage = 'البيانات المتوقعة يجب أن تكون كائن'
): T {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error(errorMessage)
  }
  return data as T
}

/**
 * Safe fetch wrapper with error handling
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Parsed JSON response
 * @throws Error with user-friendly message
 */
export async function safeFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options)
    return await safeJsonResponse<T>(response)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('حدث خطأ غير متوقع أثناء الاتصال بالخادم')
  }
}

/**
 * Validate API response structure
 * @param data - Response data to validate
 * @param expectedKeys - Expected keys in the response object
 * @returns Validated data
 * @throws Error if structure is invalid
 */
export function validateResponseStructure<T extends Record<string, unknown>>(
  data: unknown,
  expectedKeys: string[] = []
): T {
  const obj = validateObject<T>(data, 'الاستجابة يجب أن تكون كائن')
  
  if (expectedKeys.length > 0) {
    const missingKeys = expectedKeys.filter(key => !(key in obj))
    if (missingKeys.length > 0) {
      throw new Error(`الاستجابة ناقصة: ${missingKeys.join(', ')}`)
    }
  }
  
  return obj
}
