import { transform } from '@babel/core';
import { IOpts } from './index';

function transformWithPlugin(code: string, opts: IOpts) {
  const filename = 'file.js';
  return transform(code, {
    filename,
    presets: [[require.resolve('@babel/preset-env'), {
      "targets": {
        "node": "current",
      },
      "modules": false,
    }]],
    plugins: [[require.resolve('./index.ts'), opts]],
    caller: {
      name: 'test',
      supportsTopLevelAwait: true
    },
  })!.code;
}

test('normal', () => {
  expect(
    transformWithPlugin(
      `
const {
  default: a,
  b: b,
  c: d
} = await import("foo/antd");
foo;
    `.trim(),
    {
      libs: [/antd/],
      remoteName: 'foo',
      matchAll: false,
    })
  ).toEqual(
    `
const {
  default: a,
  b: b,
  c: d
} = await import("foo/antd");
foo;
    `.trim(),
  );
});

