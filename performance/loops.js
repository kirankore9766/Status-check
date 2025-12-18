function processData(data) {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[i] === data[j]) {}
    }
  }
}

const bigArray = new Array(50000).fill("x");
processData(bigArray);
