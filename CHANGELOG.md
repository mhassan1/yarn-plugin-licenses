# Changelog

## [0.3.0] - 2021-01-28
[0.3.0]: https://github.com/mhassan1/yarn-plugin-licenses/compare/v0.2.1...v0.3.0

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
