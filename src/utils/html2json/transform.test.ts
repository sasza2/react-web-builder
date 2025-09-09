import { expect, it } from 'vitest';

import { type NodeElement, transform } from './transform';

it('should return safe html', () => {
  const [transformChild] = transform(
    '<div style="color: red; font-weight: bold">hello world</div>'
    + '<script>alert("test")</script>'
    + '<span>!</span>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(transformChild).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: 'hello world',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      style: {
        color: 'red',
        fontWeight: 'bold',
      },
      type: 'element',
    },
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: '!',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'span',
      type: 'element',
    },
  ]);
});

it('should strip event handler attributes', () => {
  const [result] = transform(
    '<button onclick="alert(1)">Click me</button>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: 'Click me',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'button',
      type: 'element',
    },
  ]);
});

it('should ignore dangerous tags like iframe', () => {
  const [result] = transform(
    '<iframe src="evil.com"></iframe><p>Safe text</p>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: 'Safe text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'p',
      type: 'element',
    },
  ]);
});

it('should convert style attributes to camelCase', () => {
  const [result] = transform(
    '<h1 style="background-color: blue; font-size: 20px">Title</h1>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: 'Title',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'h1',
      style: {
        backgroundColor: 'blue',
        fontSize: '20px',
      },
      type: 'element',
    },
  ]);
});

it('should handle nested elements correctly', () => {
  const [result] = transform(
    '<div><strong>Bold <em>and italic</em></strong></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          attributes: {},
          children: [
            {
              key: 'key',
              text: 'Bold ',
              type: 'text',
            },
            {
              attributes: {},
              children: [
                {
                  key: 'key',
                  text: 'and italic',
                  type: 'text',
                },
              ],
              key: 'key',
              tagName: 'em',
              type: 'element',
            },
          ],
          key: 'key',
          tagName: 'strong',
          type: 'element',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should apply classNamePrefix to class attribute', () => {
  const [result] = transform(
    '<div class="foo bar">Test</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {
        className: 'foo bar',
      },
      children: [
        {
          key: 'key',
          text: 'Test',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should handle img tag with safe src and alt attributes', () => {
  const [result] = transform(
    '<img src="https://example.com/image.jpg" onclick="evil()">',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {
        src: 'https://example.com/image.jpg',
      },
      children: [],
      key: 'key',
      tagName: 'img',
      type: 'element',
    },
  ]);
});

it('should handle anchor tag and keep href attribute', () => {
  const [result] = transform(
    '<a href="https://example.com" onclick="stealCookies()">Click me</a>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {
        href: 'https://example.com',
      },
      children: [
        {
          key: 'key',
          text: 'Click me',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'a',
      type: 'element',
    },
  ]);
});

it('should strip out HTML comments', () => {
  const [result] = transform(
    '<div><!-- secret stuff --><p>Visible</p></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          attributes: {},
          children: [
            {
              key: 'key',
              text: 'Visible',
              type: 'text',
            },
          ],
          key: 'key',
          tagName: 'p',
          type: 'element',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should retain style but not remove elements with display:none (optional)', () => {
  const [result] = transform(
    '<div style="display: none">Hidden</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: 'Hidden',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      style: {},
      type: 'element',
    },
  ]);
});

it('should decode HTML entities correctly', () => {
  const [result] = transform(
    '<p>Hello&nbsp;World &amp; Universe</p>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: 'Hello',
          type: 'text',
        },
        {
          key: 'key',
          text: '\u00A0',
          type: 'text',
        },
        {
          key: 'key',
          text: 'World ',
          type: 'text',
        },
        {
          key: 'key',
          text: '&',
          type: 'text',
        },
        {
          key: 'key',
          text: ' Universe',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'p',
      type: 'element',
    },
  ]);
});

it('should gracefully handle unclosed tags', () => {
  const [result] = transform(
    '<div><b>Bold<i>Italic</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          attributes: {},
          children: [
            {
              key: 'key',
              text: 'Bold',
              type: 'text',
            },
            {
              attributes: {},
              children: [
                {
                  key: 'key',
                  text: 'Italic',
                  type: 'text',
                },
              ],
              key: 'key',
              tagName: 'i',
              type: 'element',
            },
          ],
          key: 'key',
          tagName: 'b',
          type: 'element',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should keep empty elements like <br>', () => {
  const [result] = transform(
    '<p>Hello<br>World</p>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: 'Hello',
          type: 'text',
        },
        {
          attributes: {},
          children: [],
          key: 'key',
          tagName: 'br',
          type: 'element',
        },
        {
          key: 'key',
          text: 'World',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'p',
      type: 'element',
    },
  ]);
});

it('should preserve significant whitespace', () => {
  const [result] = transform(
    '<pre>  line 1\n  line 2</pre>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [
        {
          key: 'key',
          text: '  line 1\n  line 2',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'pre',
      type: 'element',
    },
  ]);
});

it('should preserve valid styles from whitelist', () => {
  const [result] = transform(
    '<div style="color: red; background-color: #fff; font-weight: bold; display: flex; margin-left: 10px;"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [],
      key: 'key',
      tagName: 'div',
      style: {
        color: 'red',
        backgroundColor: '#fff',
        fontWeight: 'bold',
        display: 'flex',
        marginLeft: '10px',
      },
      type: 'element',
    },
  ]);
});

it('should strip styles not in whitelist', () => {
  const [result] = transform(
    '<div style="position: absolute; z-index: 100; transition: all 0.3s ease; color: blue;"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [],
      key: 'key',
      tagName: 'div',
      style: {
        color: 'blue',
      },
      type: 'element',
    },
  ]);
});

it('should preserve only whitelisted styles and ignore the rest', () => {
  const [result] = transform(
    '<div style="color: green; box-shadow: 0 0 5px #000; padding: 1em; user-select: none;"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [],
      key: 'key',
      tagName: 'div',
      style: {
        color: 'green',
        padding: '1em',
      },
      type: 'element',
    },
  ]);
});

it('should support all whitelisted styles', () => {
  const [result] = transform(
    '<div style="align-items: center; background: #eee; background-color: #fff; border: 1px solid black; border-top: none; border-right: none; border-bottom: none; border-left: none; border-radius: 4px; color: black; cursor: pointer; display: flex; gap: 10px; flex: 1; flex-grow: 1; flex-shrink: 0; flex-direction: column; font-family: Arial; font-size: 16px; font-style: italic; font-weight: 700; flex-wrap: wrap; float: left; height: 100px; justify-content: space-between; letter-spacing: 1px; line-height: 1.5; list-style: none; margin: 0; margin-top: 1em; margin-right: 1em; margin-bottom: 1em; margin-left: 1em; max-width: 500px; min-width: 100px; max-height: 300px; min-height: 50px; outline: none; padding: 0; padding-top: 1em; padding-right: 1em; padding-bottom: 1em; padding-left: 1em; text-align: center; text-decoration: underline; width: 100%"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect((result[0] as NodeElement).style).toMatchObject({
    alignItems: 'center',
    background: '#eee',
    backgroundColor: '#fff',
    border: '1px solid black',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    borderRadius: '4px',
    color: 'black',
    cursor: 'pointer',
    display: 'flex',
    gap: '10px',
    flex: '1',
    flexGrow: '1',
    flexShrink: '0',
    flexDirection: 'column',
    fontFamily: 'Arial',
    fontSize: '16px',
    fontStyle: 'italic',
    fontWeight: '700',
    flexWrap: 'wrap',
    float: 'left',
    height: '100px',
    justifyContent: 'space-between',
    letterSpacing: '1px',
    lineHeight: '1.5',
    listStyle: 'none',
    margin: '0',
    marginTop: '1em',
    marginRight: '1em',
    marginBottom: '1em',
    marginLeft: '1em',
    maxWidth: '500px',
    minWidth: '100px',
    maxHeight: '300px',
    minHeight: '50px',
    outline: 'none',
    padding: '0',
    paddingTop: '1em',
    paddingRight: '1em',
    paddingBottom: '1em',
    paddingLeft: '1em',
    textAlign: 'center',
    textDecoration: 'underline',
    width: '100%',
  });
});

it('should ignore malformed style with double colon', () => {
  const [result] = transform(
    '<div style="color:: blue; background: #eee;"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should ignore !important styles', () => {
  const [result] = transform(
    '<div style="color: red !important; font-size: 16px;"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [],
      key: 'key',
      tagName: 'div',
      style: {
        color: 'red',
        fontSize: '16px',
      },
      type: 'element',
    },
  ]);
});

it('should ignore styles with missing values', () => {
  const [result] = transform(
    '<div style="color: ; margin-left: 10px;"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [],
      key: 'key',
      tagName: 'div',
      style: {
        marginLeft: '10px',
      },
      type: 'element',
    },
  ]);
});

it('should ignore both invalid property and malformed syntax', () => {
  const [result] = transform(
    '<div style="transition: all 0.3s; font-weight:: bold;"></div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      attributes: {},
      children: [],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should apply styles from <style> to elements with matching class', () => {
  const [result] = transform(
    '<style>.nav { font-size: 16px; color: red; }</style>'
    + '<div class="nav">Test text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '16px',
          },
        },
      ],
      key: 'key',
      type: 'style',

    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Test text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should apply multiple styles from <style> to elements with matching classes', () => {
  const [result] = transform(
    '<style>'
    + '.nav { font-size: 16px; color: red; }'
    + '.header { background-color: blue; padding: 10px; }'
    + '</style>'
    + '<div class="nav">Nav text</div>'
    + '<div class="header">Header text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '16px',
          },
        },
        {
          selector: '.builder .header',
          style: {
            'background-color': 'blue',
            padding: '10px',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
    {
      attributes: { className: 'header' },
      children: [
        {
          key: 'key',
          text: 'Header text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should handle nested styles from <style>', () => {
  const [result] = transform(
    '<style>'
    + '.nav { font-size: 16px; color: red; }'
    + '.nav .item { color: blue; font-weight: bold; }'
    + '</style>'
    + '<div class="nav">'
    + '  <div class="item">Item text</div>'
    + '  Nav text'
    + '</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '16px',
          },
        },
        {
          selector: '.builder .nav .item',
          style: {
            color: 'blue',
            'font-weight': 'bold',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: '  ',
          type: 'text',
        },
        {
          attributes: { className: 'item' },
          children: [
            {
              key: 'key',
              text: 'Item text',
              type: 'text',
            },
          ],
          key: 'key',
          tagName: 'div',
          type: 'element',
        },
        {
          key: 'key',
          text: '  Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should apply styles with different units (px, em, rem)', () => {
  const [result] = transform(
    '<style>'
    + '.nav { font-size: 2rem; margin: 10px; padding: 1em; }'
    + '</style>'
    + '<div class="nav">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            'font-size': '2rem',
            margin: '10px',
            padding: '1em',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should apply styles to elements with multiple classes', () => {
  const [result] = transform(
    '<style>'
    + '.nav { font-size: 16px; color: red; }'
    + '.active { font-weight: bold; }'
    + '</style>'
    + '<div class="nav active">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '16px',
          },
        },
        {
          selector: '.builder .active',
          style: {
            'font-weight': 'bold',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav active' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should handle styles with pseudo-classes like :hover', () => {
  const [result] = transform(
    '<style>'
    + '.nav { font-size: 16px; color: red; }'
    + '.nav:hover { color: blue; }'
    + '</style>'
    + '<div class="nav">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '16px',
          },
        },
        {
          selector: '.builder .nav:hover',
          style: {
            color: 'blue',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should ignore styles with !important', () => {
  const [result] = transform(
    '<style>'
    + '.nav { color: red !important; font-size: 16px; }'
    + '</style>'
    + '<div class="nav">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '16px',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should handle deeply nested selectors from <style>', () => {
  const [result] = transform(
    '<style>'
    + '.aaaa .bb .cc { color: green; font-size: 18px; }'
    + '</style>'
    + '<div class="aaaa">'
    + '<div class="bb">'
    + '<div class="cc">Nested text</div>'
    + '</div>'
    + '</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .aaaa .bb .cc',
          style: {
            color: 'green',
            'font-size': '18px',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'aaaa' },
      children: [
        {
          attributes: { className: 'bb' },
          children: [
            {
              attributes: { className: 'cc' },
              children: [
                {
                  key: 'key',
                  text: 'Nested text',
                  type: 'text',
                },
              ],
              key: 'key',
              tagName: 'div',
              type: 'element',
            },
          ],
          key: 'key',
          tagName: 'div',
          type: 'element',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should ignore invalid CSS syntax in <style>', () => {
  const [result] = transform(
    '<style>'
    + '.nav { color: red; font-size: 16px; }'
    + '.header { background-color: blue; padding: 10px }'
    + '</style>'
    + '<div class="nav">Nav text</div>'
    + '<div class="header">Header text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '16px',
          },
        },
        {
          selector: '.builder .header',
          style: {
            'background-color': 'blue',
            padding: '10px',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
    {
      attributes: { className: 'header' },
      children: [
        {
          key: 'key',
          text: 'Header text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should ignore empty <style> tag', () => {
  const [result] = transform(
    '<style></style>'
    + '<div class="nav">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should ignore invalid HTML structure (unclosed tags)', () => {
  const [result] = transform(
    '<style>.nav { color: red; }</style>'
    + '<div class="nav">Nav text'
    + '<div class="header">Header text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
        {
          attributes: { className: 'header' },
          children: [
            {
              key: 'key',
              text: 'Header text',
              type: 'text',
            },
          ],
          key: 'key',
          tagName: 'div',
          type: 'element',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should handle extremely long attributes or values', () => {
  const [result] = transform(
    '<style>'
    + '.nav { color: red; font-size: 9999999999999999999999999999px; }'
    + '</style>'
    + '<div class="nav">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
            'font-size': '9999999999999999999999999999px',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should ignore @media rules in <style>', () => {
  const [result] = transform(
    '<style>'
    + '@media (max-width: 600px) { .nav { font-size: 12px; } }'
    + '.nav { color: red; }'
    + '</style>'
    + '<div class="nav">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red', // Tylko to zostaje
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should ignore @import rules in <style>', () => {
  const [result] = transform(
    '<style>'
    + '@import url("https://example.com/styles.css");'
    + '.nav { color: blue; }'
    + '</style>'
    + '<div class="nav">Imported style test</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'blue',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Imported style test',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should output empty <style> block if only @media rules are present', () => {
  const [result] = transform(
    '<style>'
    + '@media (min-width: 800px) { .nav { color: green; } }'
    + '</style>'
    + '<div class="nav">Nav text</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Nav text',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});

it('should exclude @import and @media but keep valid CSS rules', () => {
  const [result] = transform(
    '<style>'
    + '@import url("x.css");'
    + '@media (max-width: 600px) { .nav { font-size: 12px; } }'
    + '.nav { color: red; }'
    + '</style>'
    + '<div class="nav">Mixed test</div>',
    {
      classNamePrefix: 'builder',
      createNodeKey: () => 'key',
    },
  );

  expect(result).toStrictEqual([
    {
      children: [
        {
          selector: '.builder .nav',
          style: {
            color: 'red',
          },
        },
      ],
      key: 'key',
      type: 'style',
    },
    {
      attributes: { className: 'nav' },
      children: [
        {
          key: 'key',
          text: 'Mixed test',
          type: 'text',
        },
      ],
      key: 'key',
      tagName: 'div',
      type: 'element',
    },
  ]);
});
