# Changelog

## [0.7.2] - 2021-12-09
[0.7.2]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.7.1...v0.7.2

- Handle strings and objects in `licenses` property

## [0.7.1] - 2021-08-09
[0.7.1]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.7.0...v0.7.1

- Remove `eval` from `pnp` linker

## [0.7.0] - 2021-08-05
[0.7.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.6.0...v0.7.0

- Improve linting and formatting
- BREAKING: Upgrade to Yarn 3

## [0.6.0] - 2021-06-16
[0.6.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.5.0...v0.6.0

- Add `--exclude-metadata` flag for excluding `URL` and other metadata

## [0.5.0] - 2021-02-18
[0.5.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.4.0...v0.5.0

- Consider deprecated `licenses` property in `package.json`

## [0.4.0] - 2021-02-18
[0.4.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.3.0...v0.4.0

- Add `--production` flag for excluding `devDependencies`

## [0.3.0] - 2021-01-28
[0.3.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.2.1...v0.3.0

- Normalize expected output line endings in tests
- Exclude duplicated virtual/non-virtual descriptors from output
- Add `generate-disclaimer` command
- Refactor `getPackageManifest` into `getPackagePath` in linkers
- Compress paths in `ppath.join`

## [0.2.1] - 2020-12-30
[0.2.1]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.2.0...v0.2.1

- Cache yarn cache in travis-ci

## [0.2.0] - 2020-12-30
[0.2.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.1.0...v0.2.0

- Upgrade yarn for `fs` support of `BigInt` (https://github.com/yarnpkg/berry/issues/2232)
- Use `fs.readFilePromise` in `linker.getPackageManifest` implementations
- Add jest test coverage
- Bump dev dependencies
- Migrate from tslint to eslint

## [0.1.0] - 2020-12-08
[0.1.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/cb369b3...v0.1.0

- Initial release
