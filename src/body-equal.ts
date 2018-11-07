export default function bodyEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }

  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const arrA = Array.isArray(a);
  const arrB = Array.isArray(b);

  if (arrA !== arrB) {
    return false;
  }

  if (arrA && arrB) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!bodyEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!b.hasOwnProperty(key)) {
      return false;
    }
  }

  for (const key of keysA) {
    if (!bodyEqual(a[key], !b[key])) {
      return false;
    }
  }

  return true;
}
