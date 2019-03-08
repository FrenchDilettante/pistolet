export default function bodyEqual(mock: any, request: any) {
  if (mock === request) {
    return true;
  }

  if (!mock || !request) {
    return false;
  }

  if (mock instanceof RegExp) {
    return mock.test(request);
  }

  if (typeof mock !== 'object' || typeof request !== 'object') {
    return false;
  }

  const arrA = Array.isArray(mock);
  const arrB = Array.isArray(request);

  if (arrA !== arrB) {
    return false;
  }

  if (arrA && arrB) {
    if (mock.length !== request.length) {
      return false;
    }
    for (let i = 0; i < mock.length; i++) {
      if (!bodyEqual(mock[i], request[i])) {
        return false;
      }
    }
    return true;
  }

  const keysA = Object.keys(mock);
  const keysB = Object.keys(request);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!request.hasOwnProperty(key)) {
      return false;
    }
  }

  for (const key of keysA) {
    if (!bodyEqual(mock[key], request[key])) {
      return false;
    }
  }

  return true;
}
