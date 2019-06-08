# html-validate-markdown

[![CircleCI](https://circleci.com/gh/OlofFredriksson/html-validate-markdown.svg?style=svg)](https://circleci.com/gh/OlofFredriksson/html-validate-markdown)

Transform Html blocks in Markdown files for use with [html-validate].

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
