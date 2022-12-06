export function* infiniteGenerator(initalValue, step) {
  while (true) {
    yield (initalValue += step);
  }
}

export function getNextValue(generator) {
  return generator.next().value;
}
