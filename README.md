# html-validate-markdown

[![CircleCI](https://circleci.com/gh/OlofFredriksson/html-validate-markdown.svg?style=svg&circle-token=561e1c028dbdc112bf9928e54b67eab4c717e00e)](https://circleci.com/gh/OlofFredriksson/html-validate-markdown)

Transform Html blocks in Markdown files for use with [html-validate].

[html-validate]: https://www.npmjs.com/package/html-validate

## Usage

`npm install --save-dev html-validate-markdown`

In `.htmlvalidate.json`:

```js
{
  "transform": {
    "^.*\\.md$": "html-validate-markdown"
  }
}
```

### Development

```bash
$ npm install
$ npm run build
$ npm test
```

> Copied from
> https://gitlab.com/html-validate/html-validate-vue
