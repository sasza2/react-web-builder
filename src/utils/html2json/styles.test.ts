import { expect, it } from 'vitest';

import { isValidSelector, transformStyles, transformStylesForReact } from './styles';

it('should return safe styles', () => {
  expect(transformStyles([
    {
      prop: 'background-image',
      value: 'url(something.png)',
    },
    {
      prop: 'width',
      value: 'abc',
    },
    {
      prop: 'font-weight',
      value: 'bold',
    },
    {
      prop: 'display',
      value: 'flex',
    },
  ])).toStrictEqual({ 'font-weight': 'bold', display: 'flex' });

  expect(transformStyles([
    {
      prop: 'width',
      value: '200px',
    },
  ])).toStrictEqual({ width: '200px' });

  expect(transformStylesForReact([
    {
      prop: 'font-weight',
      value: 'bold',
    },
  ])).toStrictEqual({ fontWeight: 'bold' });
});

const validSelectors = [
  '.valid-class',
  'div#id:hover',
  '.hello--a, .another-class',
  '.class name',
  '[type="text"]',
  'ul > li.active',
  'input[type="checkbox"]:checked',
  'article h2::first-line',
  '[data-attr="val with spaces"]',
  'div[class~="foo"]',
  'body > header + main',
];

const invalidSelectors = [
  '@media',
  '@import',
  '.bad|name',
  'svg|circle',
  '',
  '.class..another',
  '*|*',
  '#',
  '.',
  '>',
  '.a\\@b',
  ':hover,',
  '[type=]',
  '[type',
  ':nth-child()',
  'div > > p',
  'a[href^=]',
  'a[href^="https"]:not(.disabled)',
  'section > *:nth-child(2n)',
  '#id\\:weird',
  '.class\\#hash',
  'a:has(img)',
  'form :is(input, select, textarea)',
  'something *',
];

it('should return true for valid selectors', () => {
  validSelectors.forEach((selector) => {
    expect(isValidSelector(selector)).toBe(true);
  });
});

it('should return false for invalid selectors', () => {
  invalidSelectors.forEach((selector) => {
    expect(isValidSelector(selector)).toBe(false);
  });
});
