let cache = [];

setInterval(() => {
  const data = new Array(100000).fill(Math.random());
  cache.push(data);
}, 100);
