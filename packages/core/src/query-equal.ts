export function queryEqual(mock: any, request: any) {
  if (mock === request) {
    return true;
  }

  if (!mock && Object.entries(request).length === 0) {
    return true;
  }

  if (!mock) {
    return false;
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
    if (mock[key] instanceof RegExp) {
      mock[key].lastIndex = 0;
      if (!mock[key].test(request[key])) {
        return false;
      }
    } else {
      if (mock[key] !== request[key]) {
        return false;
      }
    }
  }

  return true;
}
