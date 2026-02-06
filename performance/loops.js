function processData(data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[i] === data[j]) {}
    }
  }
}

/* Non-blocking chunked processing (Node/browser friendly). Call with a chunkSize tuned to your environment (e.g., 1k). */
// Option A: Exact detection via in-place sort (lower auxiliary memory, O(n log n) time)
function processDataChunked_sortThenScan(data, chunkSize = 1000, onComplete) {
  // Danger: mutates `data`; only use if mutation is acceptable.
  data.sort();
  for (let i = 1; i < data.length; i++) {
    if (data[i] === data[i - 1]) {
      if (onComplete) onComplete(true);
      return;
    }
  }
  if (onComplete) onComplete(false);
}

// Option B: Bounded LRU cache – keeps memory capped at maxEntries (may miss duplicates that were evicted)
function processDataChunked_bounded(data, chunkSize = 1000, maxEntries = 100000, onComplete) {
  let i = 0;
  const seen = new Map(); // acts as LRU: key -> true

  function touch(key) {
    if (seen.has(key)) {
      seen.delete(key);
      seen.set(key, true);
    } else {
      seen.set(key, true);
      if (seen.size > maxEntries) {
        // remove oldest
        const it = seen.keys();
        seen.delete(it.next().value);
      }
    }
  }

  function doChunk() {
    const end = Math.min(i + chunkSize, data.length);
    for (; i < end; i++) {
      const v = data[i];
      if (seen.has(v)) {
        if (onComplete) onComplete(true);
        return;
      }
      touch(v);
    }
    if (i < data.length) {
      if (typeof setImmediate === 'function') setImmediate(doChunk);
      else setTimeout(doChunk, 0);
    } else {
      if (onComplete) onComplete(false);
    }
  }

  doChunk();
}

// Option C: Use a Bloom filter (approximate) – add npm package or implement one
// Choose a bitArraySize and hashCount depending on expected N and acceptable false-positive rate.
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
