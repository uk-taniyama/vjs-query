import {
  addPlugins, collect, fromElement, fromElements, isElement,
} from './core';
import {
  byClass, byId, byName, byTag, query, queryAll,
} from './selector.api';

export const fromId = (name: string) => fromElement(byId(name));
export const fromName = (name: string) => fromElements(byName(name));
export const fromTag = (name: string) => fromElements(byTag(name));
export const fromClass = (name: string) => fromElements(byClass(name));
export const fromQuery = (name: string) => fromElements(queryAll(name));
export const fromQuery1 = (name: string) => fromElement(query(name));

declare module '.' {
  export interface VjsQuery {
    findTag(name: string): VjsQuery;
    findClass(name: string): VjsQuery;
    find1(name: string): VjsQuery;
    find(name: string): VjsQuery;
  }
}

addPlugins({
  findTag: (q, name) => collect(q, (collector, el) => collector.addElements(byTag(name, el))),
  findClass: (q, name) => collect(q, (collector, el) => collector.addElements(byClass(name, el))),
  find: (q, name) => collect(q, (collector, el) => collector.addElements(queryAll(name, el))),
  find1: (q, name) => collect(q, (collector, el) => collector.addElement(query(name, el))),
});

export function vjsQuery(selector?: string | Element | undefined) {
  if (selector === undefined) {
    return fromElement(document.body);
  }
  if (isElement(selector)) {
    return fromElement(selector);
  }
  return fromQuery(selector);
}
