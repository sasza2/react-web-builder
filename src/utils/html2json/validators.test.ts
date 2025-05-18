import { expect, it } from 'vitest';

import { alignItemsValidator, allowedCSSProperties, flexValidator } from './validators';

it('valid flex values', () => {
  expect(flexValidator('1')).toBeTruthy();
  expect(flexValidator('1 0')).toBeTruthy();
  expect(flexValidator('1 0 auto')).toBeTruthy();
  expect(flexValidator('0 1 100px')).toBeTruthy();
  expect(flexValidator('2 2 10%')).toBeTruthy();
  expect(flexValidator('0 0 auto')).toBeTruthy();
  expect(flexValidator('initial')).toBeTruthy();
  expect(flexValidator('inherit')).toBeTruthy();
  expect(flexValidator('unset')).toBeTruthy();
  expect(flexValidator('none')).toBeTruthy();
  expect(flexValidator('auto')).toBeTruthy();
});

it('invalid flex values', () => {
  expect(flexValidator('abc')).toBeFalsy();
  expect(flexValidator('1 0 auto something')).toBeFalsy();
  expect(flexValidator('1px 0 auto')).toBeFalsy();
  expect(flexValidator('auto auto')).toBeFalsy();
  expect(flexValidator('none none')).toBeFalsy();
  expect(flexValidator('1 1 -10px')).toBeFalsy();
});

it('valid align-items values', () => {
  expect(alignItemsValidator('stretch')).toBeTruthy();
  expect(alignItemsValidator('center')).toBeTruthy();
  expect(alignItemsValidator('flex-start')).toBeTruthy();
  expect(alignItemsValidator('flex-end')).toBeTruthy();
  expect(alignItemsValidator('baseline')).toBeTruthy();
});

it('invalid align-items values', () => {
  expect(alignItemsValidator('top')).toBeFalsy();
  expect(alignItemsValidator('bottom')).toBeFalsy();
  expect(alignItemsValidator('middle')).toBeFalsy();
  expect(alignItemsValidator('flexstart')).toBeFalsy();
  expect(alignItemsValidator('centered')).toBeFalsy();
});

it('invalid values', () => {
  Object.entries(allowedCSSProperties).forEach(([, validator]) => {
    expect(validator('')).toBeFalsy();
    expect(validator(':')).toBeFalsy();
    expect(validator(';')).toBeFalsy();
  });
});
