import type { VjsQuery } from '.';

export type Elements = HTMLCollectionOf<Element> | NodeListOf<HTMLElement>;

export function isElements(selector: string | Elements | Element): selector is Elements {
  const list = selector as Elements;
  return list.item != null;
}

export function isElement(selector: unknown): selector is Element {
  return selector instanceof Element;
}

export interface Collector {
  addElement(element: Element | null): number;
  addElements(elements: Elements | null): number;
}

export type CollectHandler = (collector: Collector, el: Element, index: number) => void;

export type ErrorHandler = (error: unknown) => void;

// eslint-disable-next-line no-console
let errorHandler: ErrorHandler = (error) => console.error('vjs-error', error);

export function setErrorHandler(handler: ErrorHandler) {
  errorHandler = handler;
}

declare module '.' {
  export interface VjsQuery {
    get nodes(): Element[];
    get length(): number;

    get empty(): boolean;
    get one(): boolean;

    at(index: number): Element | undefined;
    eq(index: number): VjsQuery;
    first(): VjsQuery;
    last(): VjsQuery;

    tap(fn: (nodes: Element[]) => void): VjsQuery;
    ensure(length: number): VjsQuery;

    forEach(handler: (el: Element, index: number) => void): void;
    collect(handler: CollectHandler): VjsQuery;
    filter(handler: (el: Element, index: number) => boolean): void;
  }
}

function asVjsQuery(impl: unknown): VjsQuery {
  return impl as VjsQuery;
}

function toVjsQuery(nodes: Element[]): VjsQuery {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return asVjsQuery(new VjsQueryImpl(nodes));
}

function addElement(nodes: Element[], el: Element | null) {
  if (el == null) {
    return 0;
  }
  if (nodes.includes(el)) {
    return 0;
  }
  nodes.push(el);
  return 1;
}

function addElements(nodes: Element[], list: Elements | null) {
  if (list == null || list.length === 0) {
    return 0;
  }
  let count = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const el of list) {
    if (!nodes.includes(el)) {
      count += 1;
      nodes.push(el);
    }
  }
  return count;
}

export function collect(v: VjsQuery, handler: CollectHandler): VjsQuery {
  const nodes: Element[] = [];
  const collector: Collector = {
    addElement: (el) => addElement(nodes, el),
    addElements: (list) => addElements(nodes, list),
  };
  v.forEach((el, index) => handler(collector, el, index));
  if (nodes == null || nodes.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return EMPTY;
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return toVjsQuery(nodes);
}

export function traverse(collector: Collector, el: Element, next: (el: Element) => Element | null) {
  let curr = el;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const it = next(curr);
    if (it == null) {
      return;
    }
    if (!collector.addElement(it)) {
      return;
    }
    curr = it;
  }
}

class VjsQueryImpl {
  nodes: Element[] = [];

  constructor(nodes: Element[]) {
    this.nodes = nodes;
  }

  get length() {
    return this.nodes.length;
  }

  get empty() {
    return this.nodes.length === 0;
  }

  get one() {
    return this.nodes.length === 1;
  }

  at(index: number): Element | undefined {
    if (index >= 0) {
      return this.nodes[index];
    }
    return this.nodes[this.nodes.length - index];
  }

  forEach(handler: (el: Element, index: number) => void): void {
    this.nodes.forEach((el, index) => {
      try {
        handler(el, index);
      } catch (error) {
        errorHandler(error);
      }
    });
  }

  collect(handler: CollectHandler): VjsQuery {
    return collect(asVjsQuery(this), handler);
  }
}

export const EMPTY: VjsQuery = asVjsQuery(new VjsQueryImpl([]));

export function isVjsQuery(val: unknown): val is VjsQuery {
  return val instanceof VjsQueryImpl;
}

export function fromElement(el: Element | null | undefined): VjsQuery {
  if (el == null) {
    return EMPTY;
  }
  return toVjsQuery([el]);
}

export function fromElements(list: HTMLCollectionOf<Element> | NodeListOf<HTMLElement> | null) {
  if (list == null || list.length === 0) {
    return EMPTY;
  }
  return toVjsQuery([...list]);
}

export type IsMethod<T, K extends keyof T> = T[K] extends (...args: any[]) => any ? T[K] : never;

export type VjsQueryPlugin<K extends keyof VjsQuery> =
IsMethod<VjsQuery, K> extends never
  ? never
  : (q: VjsQuery, ...args: Parameters<IsMethod<VjsQuery, K>>) => ReturnType<IsMethod<VjsQuery, K>>;

export type VjsQueryPlugins = {
  [K in keyof VjsQuery]: IsMethod<VjsQuery, K> extends never ? never : VjsQueryPlugin<K>;
};

const vQueryPrototype = VjsQueryImpl.prototype as any;

export function addPlugin<K extends keyof VjsQuery>(name: K, plugin: VjsQueryPlugin<K>): void {
  // eslint-disable-next-line func-names
  vQueryPrototype[name] = function () {
    // eslint-disable-next-line prefer-rest-params
    return (plugin as any)(this, ...arguments);
  };
}

export function addPlugins(plugins: Partial<VjsQueryPlugins>): void {
  Object.entries(plugins).forEach(([name, plugin]) => addPlugin<any>(name, plugin));
}

addPlugin('filter', (q, fn) => {
  return collect(q, (collector, el, index) => {
    if (fn(el, index)) {
      collector.addElement(el);
    }
  });
});

addPlugins({
  eq: (q, index) => fromElement(q.at(index)),
  first: (q) => q.eq(0),
  last: (q) => q.eq(-1),
});

addPlugin('tap', (q, fn) => { fn(q.nodes); return q; });

addPlugin('ensure', (q, length) => {
  if (q.length === length) {
    return q;
  }
  throw new Error(`length(${q.length}) must be "${length}".`);
});
