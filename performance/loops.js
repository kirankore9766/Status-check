function processData(data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[i] === data[j]) {}
    }
  }
}

/* Non-blocking chunked processing (Node/browser friendly). Call with a chunkSize tuned to your environment (e.g., 1k). */
function processDataChunked(data, chunkSize = 1000, onChunkProcessed) {
  let i = 0;
  const seen = new Set(); // example: duplicate detection while yielding

  function doChunk() {
    const end = Math.min(i + chunkSize, data.length);
    for (; i < end; i++) {
      const v = data[i];
      if (seen.has(v)) {
        if (onChunkProcessed) onChunkProcessed(true);
        return; // duplicate found, early exit
      }
      seen.add(v);
    }
    if (i < data.length) {
      // yield to event loop before next chunk
      if (typeof setImmediate === 'function') setImmediate(doChunk);
      else setTimeout(doChunk, 0);
    } else {
      if (onChunkProcessed) onChunkProcessed(false);
    }
  }

  doChunk();
}

/* Example usage (non-blocking): */
const bigArray = new Array(50000).fill('x');
processDataChunked(bigArray, 1000, (hasDuplicate) => {
  console.log('hasDuplicate:', hasDuplicate);
});

/* Alternative (Node): use worker_threads for CPU-bound tasks to leverage multiple cores */
// In main thread file:
// const { Worker } = require('worker_threads');
// const worker = new Worker('./worker.js');
// worker.postMessage(bigArray);
// worker.on('message', result => console.log(result));

// worker.js: receive data and run heavy computation synchronously (safe because it's not main thread)
