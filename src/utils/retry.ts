type RetryOptions = {
  maxRetries: number;
  initialDelay: number;
  factor: number;
  jitter: boolean;
};

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  initialDelay: 300,
  factor: 2,
  jitter: true,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error;
  
  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < opts.maxRetries - 1) {
        const delay = calculateDelay(attempt, opts);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}

function calculateDelay(attempt: number, options: RetryOptions): number {
  const delay = options.initialDelay * Math.pow(options.factor, attempt);
  if (options.jitter) {
    return Math.random() * delay;
  }
  return delay;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}