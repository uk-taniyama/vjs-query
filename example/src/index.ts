import { addPlugin } from 'vjs-query';

// declare the plugin to be added.

declare module 'vjs-query' {
  interface VjsQuery {
    join(): string;
  }
}

// Execute addPlugin to incorporate the implementation of the declared plugin.

addPlugin('join', (q) => {
  return q.nodes.map((el) => el.textContent).join(',');
});
