# `yarn-plugin-licenses`

This is a Yarn v3 plugin that adds `yarn licenses` commands (similar to what Yarn v1 had).

For Yarn v2 support, install [v0.6.0](https://github.com/mhassan1/yarn-plugin-licenses/tree/v0.6.0) or earlier.

## Install

```
yarn plugin import https://raw.githubusercontent.com/mhassan1/yarn-plugin-licenses/v0.11.0/bundles/@yarnpkg/plugin-licenses.js
```

## Usage

```shell script
yarn licenses list --help
yarn licenses generate-disclaimer --help
```

## Testing

`yarn test`

NOTE: Integration tests require `yarn build` first.

## Publishing

`npm version <version>`

## License

MIT
