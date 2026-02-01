/**
 * Enhanced Fetch Utility with Retry Logic, Timeout, and Performance Tracking
 * 
 * This utility provides robust API fetching with:
 * - Automatic retry on failure (handles cold start scenarios)
 * - AbortController with configurable timeout
 * - Performance timing for debugging
 * - Error handling and logging
 */

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  logLabel?: string;
}

export class FetchTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchTimeoutError';
  }
}

export class FetchRetryError extends Error {
  constructor(message: string, public lastError?: Error) {
    super(message);
    this.name = 'FetchRetryError';
  }
}

/**
 * Fetch with automatic retry, timeout, and performance tracking
 * 
 * @param url - URL to fetch
 * @param options - Fetch options with retry and timeout configuration
 * @returns Promise with the Response object
 * 
 * @example
 * ```typescript
 * const response = await fetchWithRetry('https://api.example.com/data', {
 *   timeout: 8000, // 8 seconds
 *   retries: 1,    // Retry once on failure
 *   logLabel: 'UserAPI'
 * });
 * const data = await response.json();
 * ```
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeout = 8000,
    retries = 1,
    retryDelay = 500,
    logLabel = 'API',
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  const timerLabel = `${logLabel} ${url}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    let timerStarted = false;

    try {
      // Start performance timer
      console.time(timerLabel);
      timerStarted = true;
      console.log(`[${logLabel}] Fetching ${url} (attempt ${attempt + 1}/${retries + 1})...`);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      // Clear timeout and log timing
      clearTimeout(timeoutId);
      console.timeEnd(timerLabel);
      timerStarted = false;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`[${logLabel}] Success: ${url}`);
      return response;

    } catch (error: any) {
      clearTimeout(timeoutId);
      if (timerStarted) {
        console.timeEnd(timerLabel);
      }

      // Handle abort/timeout
      if (error.name === 'AbortError') {
        lastError = new FetchTimeoutError(
          `Request timeout after ${timeout}ms: ${url}`
        );
        console.error(`[${logLabel}] Timeout:`, lastError.message);
      } else {
        lastError = error;
        console.error(`[${logLabel}] Error:`, error.message);
      }

      // Retry if not the last attempt
      if (attempt < retries) {
        console.log(`[${logLabel}] Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  // All retries exhausted
  throw new FetchRetryError(
    `Failed after ${retries + 1} attempts: ${url}`,
    lastError || undefined
  );
}

/**
 * Convenience wrapper that returns parsed JSON data
 * 
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Promise with parsed JSON data
 */
export async function fetchJsonWithRetry<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options);
  return response.json();
}
