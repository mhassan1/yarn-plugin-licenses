type ArchitectureSet = {
  os: string[] | null
  cpu: string[] | null
  libc: string[] | null
}

/**
 * Polyfill for `nodeUtils.getArchitectureSet`,
 * because `nodeUtils` is not exported from `@yarnpkg/core` in early versions of Yarn v3.
 * See https://github.com/yarnpkg/berry/blob/ebc3796c/packages/yarnpkg-core/sources/nodeUtils.ts#L87.
 * TODO: Use `nodeUtils` directly when we move to Yarn v4.
 * @returns {ArchitectureSet} Architecture set
 */
export const getArchitectureSet = (): ArchitectureSet => ({ os: [process.platform], cpu: [process.arch], libc: [] })
