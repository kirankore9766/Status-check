// Instantiate worker (using modern URL pattern)
const worker = new Worker(new URL('./worker.js', import.meta.url));

// Send data to worker
worker.postMessage({ data: largeArray });

// Listen for the result
worker.onmessage = (event) => {
  console.log('Result from worker:', event.data.result);
};
