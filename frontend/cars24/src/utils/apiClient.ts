interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  logLabel?: string;
}

class FetchTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchTimeoutError";
  }
}

class FetchRetryError extends Error {
  constructor(message: string, public lastError?: Error) {
    super(message);
    this.name = "FetchRetryError";
  }
}

type TimeoutHandle = {
  signal: AbortSignal;
  clear: () => void;
};

export const withTimeout = (timeout: number): TimeoutHandle => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeout = 8000,
    retries = 1,
    retryDelay = 500,
    logLabel = "API",
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  const timerLabel = `${logLabel} ${url}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const timeoutHandle = withTimeout(timeout);
    let timerStarted = false;

    try {
      console.time(timerLabel);
      timerStarted = true;
      console.log(`[${logLabel}] Fetching ${url} (attempt ${attempt + 1}/${retries + 1})...`);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: timeoutHandle.signal,
      });

      timeoutHandle.clear();
      console.timeEnd(timerLabel);
      timerStarted = false;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`[${logLabel}] Success: ${url}`);
      return response;
    } catch (error: any) {
      timeoutHandle.clear();
      if (timerStarted) {
        console.timeEnd(timerLabel);
      }

      if (error.name === "AbortError") {
        lastError = new FetchTimeoutError(`Request timeout after ${timeout}ms: ${url}`);
        console.error(`[${logLabel}] Timeout:`, lastError.message);
      } else {
        lastError = error;
        console.error(`[${logLabel}] Error:`, error.message);
      }

      if (attempt < retries) {
        console.log(`[${logLabel}] Retrying in ${retryDelay}ms...`);
        await delay(retryDelay);
      }
    }
  }

  throw new FetchRetryError(`Failed after ${retries + 1} attempts: ${url}`, lastError || undefined);
}

export async function fetchJson<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options);
  return response.json();
}
