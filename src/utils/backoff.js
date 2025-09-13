// utils/backoff.js
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function retryWithBackoff(fn, attempts = 4, baseDelay = 500) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const delay = baseDelay * Math.pow(2, i); // 0.5s, 1s, 2s, 4s
      console.warn(`Retry ${i + 1} failed, waiting ${delay}ms...`);
      await wait(delay);
    }
  }
  throw lastErr;
}
