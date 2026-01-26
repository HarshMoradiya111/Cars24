/**
 * Robust fetch wrapper with timeout, retry, and performance measurement
 * Handles Render free tier cold starts and flaky network connections
 */

interface FetchOptions extends RequestInit {
  timeout?: number;
  retryDelay?: number;
  performanceLabel?: string;
}

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  isTimeout: boolean;
  duration: number;
}

/**
 * Fetch with automatic retry, timeout, and performance tracking
 * @param url - API endpoint
 * @param options - Fetch options with timeout and retry config
 * @returns Promise with data, error, and metadata
 */
export async function robustFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResult<T>> {
  const {
    timeout = 8000, // 8 second timeout
    retryDelay = 2000, // 2 second delay before retry
    performanceLabel = url,
    ...fetchOptions
  } = options;

  const startTime = performance.now();
  const label = `API: ${performanceLabel}`;

  console.time(label);

  let lastError: string | null = null;
  let isTimeout = false;

  // Try twice: initial attempt + one retry
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      console.log(`[${label}] Attempt ${attempt}/2 - Starting fetch...`);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const duration = performance.now() - startTime;

      console.timeEnd(label);
      console.log(`[${label}] ✓ Success in ${duration.toFixed(0)}ms`);

      return {
        data: data || null,
        error: null,
        isTimeout: false,
        duration,
      };
    } catch (error: any) {
      const duration = performance.now() - startTime;

      if (error.name === 'AbortError') {
        isTimeout = true;
        lastError = `Request timeout after ${timeout}ms`;
        console.warn(`[${label}] ⏱ Timeout on attempt ${attempt}`);
      } else {
        lastError = error.message || 'Network request failed';
        console.warn(`[${label}] ✗ Error on attempt ${attempt}:`, lastError);
      }

      // If first attempt failed, wait and retry
      if (attempt === 1) {
        console.log(`[${label}] Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        // Second attempt failed, give up
        console.timeEnd(label);
        console.error(`[${label}] Failed after 2 attempts in ${duration.toFixed(0)}ms`);
      }
    }
  }

  // Both attempts failed
  return {
    data: null,
    error: lastError,
    isTimeout,
    duration: performance.now() - startTime,
  };
}

/**
 * Safe array extractor with fallback
 */
export function safeArray<T>(data: any, fallback: T[] = []): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.cars)) return data.cars;
  if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
  return fallback;
}

/**
 * Safe object extractor with fallback
 */
export function safeObject<T>(data: any, fallback: T | null = null): T | null {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as T;
  }
  return fallback;
}

/**
 * Delay utility for retries
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
