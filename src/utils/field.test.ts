import { expect, it } from 'vitest';

import { get, set } from './field';

it('should set valid value', () => {
  const obj = {};

  expect(set(obj, 'a', 10)).toStrictEqual({ a: 10 });
});

it('should set valid value', () => {
  const obj = {};

  expect(set(obj, 'aa.b.c.d', 10)).toStrictEqual({ aa: { b: { c: { d: 10 } } } });
});

it('should get valid value', () => {
  const obj = {
    aa: {
      b: {
        ccc: {
          d: 111,
        },
      },
    },
  };

  expect(get(obj, 'aa.b.ccc.d')).toBe(111);
});
