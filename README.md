# html-validate-markdown

> Transform Html blocks in Markdown files for use with [html-validate].

[![Build](https://github.com/OlofFredriksson/html-validate-markdown/workflows/Build/badge.svg)](https://github.com/OlofFredriksson/html-validate-markdown/actions)
[![npm](https://img.shields.io/npm/v/html-validate-markdown)](https://www.npmjs.com/package/html-validate-markdown)

````html
<div>
    This is a html block. View Source to see me. Remember to always add ```html
    before your code in order to transform it.
</div>
````

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
