[![https://img.shields.io/npm/v/mermaid-parse](https://img.shields.io/npm/v/mermaid-parse)](https://www.npmjs.com/package/mermaid-parse)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![https://img.shields.io/github/languages/top/yousifalraheem/mermaid-parse](https://img.shields.io/github/languages/top/yousifalraheem/mermaid-parse)
![https://img.shields.io/npm/l/mermaid-parse](https://img.shields.io/npm/l/mermaid-parse)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/mermaid-parse)
[![codecov](https://codecov.io/gh/yousifalraheem/mermaid-parse/branch/main/graph/badge.svg)](https://codecov.io/gh/yousifalraheem/mermaid-parse)

# mermaid-parse

Parses Mermaid definitions into mermaid svg diagram.

## Installation

### Npm

```shell
npm i mermaid-parse
```

### Yarn

```shell
yarn add mermaid-parse
```

## Usage

```js
import mermaidParse from 'mermaid-parse';

const definition = `
    graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F
`;

mermaidParse(definition).then(doSomething);
```

### Configuration

Currently supported configurations:

| option     | type      | description          | default |
|------------|-----------|----------------------|---------|
| extension? | `svg,png` | The output extension | `svg`   |

Note 💡: By selecting type `png` the returned value type is `Buffer`.

## Documentation

This package uses Mermaid-js to transform the definition to svg diagram in string format.

If you want to know how the definition is composed please
read [mermaid-js documentation](https://mermaid-js.github.io/mermaid/#/).

This version does not support theming and other customization. Instead, it uses mermaid defaults. There are plans to
support further configurations in the future.

The intended use for this package is to transform diagrams in node backend service and return it as a response.

## License

MIT
<!-- github-only-end -->
