/**
 * Safe JSON parser that doesn't throw errors
 * Use this instead of JSON.parse() to prevent crashes
 */
export function safeJSONParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Safe JSON stringifier
 */
export function safeJSONStringify(value: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('Failed to stringify JSON:', error);
    return fallback;
  }
}
