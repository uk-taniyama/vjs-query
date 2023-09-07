import { addPlugins, collect, traverse } from './core';

import type { VjsQueryPlugin } from './core';

function parentElement(el: Element): Element | null {
  const p = el.parentElement;
  if (p == null) {
    return null;
  }
  if (p instanceof HTMLBodyElement) {
    return null;
  }
  return p;
}

declare module '.' {
  export interface VjsQuery {
    parent(): VjsQuery;
    parents(): VjsQuery;
    closest(selectors: string): VjsQuery;

    prev(): VjsQuery;
    prevAll(): VjsQuery;
    next(): VjsQuery;
    nextAll(): VjsQuery;

    children(): VjsQuery;
  }
}

const parent: VjsQueryPlugin<'parent'> = (q) => collect(q, (collector, el) => {
  collector.addElement(parentElement(el));
});

const parents: VjsQueryPlugin<'parents'> = (q) => collect(q, (collector, el) => traverse(collector, el, parentElement));

const closest: VjsQueryPlugin<'closest'> = (q, selectors: string) => collect(q, (collector, el) => {
  collector.addElement(el.closest(selectors));
});

const prev: VjsQueryPlugin<'prev'> = (q) => collect(q, (collector, el) => collector.addElement(el.previousElementSibling));

const prevAll: VjsQueryPlugin<'prevAll'> = (q) => collect(q, (collector, el) => traverse(collector, el, (it) => it.previousElementSibling));

const next: VjsQueryPlugin<'next'> = (q) => collect(q, (collector, el) => collector.addElement(el.nextElementSibling));

const nextAll: VjsQueryPlugin<'nextAll'> = (q) => collect(q, (collector, el) => traverse(collector, el, (it) => it.nextElementSibling));

const children: VjsQueryPlugin<'children'> = (q) => collect(q, (collector, el) => collector.addElements(el.children));

addPlugins({
  parent,
  parents,
  closest,
  prev,
  prevAll,
  next,
  nextAll,
  children,
});
