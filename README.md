# mermaid-parse
Parses Mermaid definitions into mermaid svg diagram

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
const mermaidParse = require('mermaid-parse');

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

## Documentation
This package uses Mermaid-js to transform the definition to svg diagram in string format.

If you want to know how the definition is composed please read [mermaid-js documentation](https://mermaid-js.github.io/mermaid/#/).

This version does not support theming and other customization.
Instead, it uses mermaid defaults.
There are plans to support further configurations in the future.

The intended use for this package is to transform diagrams in node backend service and return it as a response.

## License

MIT
<!-- github-only-end -->
