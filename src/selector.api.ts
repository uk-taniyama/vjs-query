export function byId(name: string): HTMLElement | null {
  return document.getElementById(name);
}

export function byName(name: string): NodeListOf<HTMLElement> {
  return document.getElementsByName(name);
}

export function byTag(name: string, el?: Element): HTMLCollectionOf<Element> {
  return (el || document).getElementsByTagName(name);
}

export function byClass(name: string, el?: Element): HTMLCollectionOf<Element> {
  return (el || document).getElementsByClassName(name);
}

export function queryAll(name: string, el?: Element): NodeListOf<HTMLElement> {
  return (el || document).querySelectorAll(name);
}

export function query(name: string, el?: Element): HTMLElement | null {
  return (el || document).querySelector(name);
}
