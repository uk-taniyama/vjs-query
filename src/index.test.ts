import { readFileSync } from 'fs';

import {
  fromClass, fromId, fromName, fromQuery, fromQuery1, fromTag,
} from '.';

describe('vjs-query', () => {
  beforeAll(() => {
    const html = readFileSync(`${__dirname}/test.html`, 'utf-8');
    document.write(html);
  });

  it('init', () => {
    expect(document.getElementById('main-content')).not.toBeNull();
  });

  it.each([
    ['main-content', true],
    ['invalid-name', false],
  ])('fromId:%s:%d', (name, expected) => {
    const v = fromId(name);
    expect(v).not.toBeNull();
    expect(v.empty).not.toBe(expected);
    expect(v.one).toBe(expected);
  });

  it.each([
    ['name', true],
    ['invalid-name', false],
  ])('fromName:%s:%d', (name, expected) => {
    const v = fromName(name);
    expect(v).not.toBeNull();
    expect(v.empty).not.toBe(expected);
    expect(v.one).toBe(expected);
  });

  it.each([
    ['input', 3],
    ['invalid-name', 0],
  ])('fromTag:%s:%d', (name, expected) => {
    const v = fromTag(name);
    expect(v).not.toBeNull();
    expect(v.length).toBe(expected);
  });

  it.each([
    ['blue', 1],
    ['invalid-name', 0],
  ])('fromClass:%s:%d', (name, expected) => {
    const v = fromClass(name);
    expect(v).not.toBeNull();
    expect(v.length).toBe(expected);
  });

  it.each([
    ['li', 7],
    ['invalid-name', 0],
  ])('fromQuery:%s:%d', (name, expected) => {
    const v = fromQuery(name);
    expect(v).not.toBeNull();
    expect(v.length).toBe(expected);
  });

  it.each([
    ['li', 1],
    ['invalid-name', 0],
  ])('fromQuery1:%s:%d', (name, expected) => {
    const v = fromQuery1(name);
    expect(v).not.toBeNull();
    expect(v.length).toBe(expected);
  });

  function body() {
    return fromTag('body');
  }
  it('findTag', () => {
    const v = body().findTag('li');
    expect(v.length).toBe(7);
  });
});
