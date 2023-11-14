import { Project, Package } from '@yarnpkg/core'
import * as pnp from './pnp'
import * as nodeModules from './node-modules'
import * as pnpm from './pnpm'
import { PortablePath, FakeFS } from '@yarnpkg/fslib'

/* istanbul ignore next */
/**
 * Resolve linker from `nodeLinker` configuration
 *
 * @param {string} nodeLinker - `nodeLinker` configuration
 * @returns {Linker} linker
 */
export const resolveLinker = (nodeLinker: string): Linker => {
  switch (nodeLinker) {
    case 'pnp':
      return pnp
    case 'node-modules':
      return nodeModules
    case 'pnpm':
      return pnpm
    default:
      throw new Error('Unsupported linker')
  }
}

type Linker = {
  getPackagePath: (project: Project, pkg: Package) => Promise<PortablePath | null>
  getFs: () => FakeFS<PortablePath>
}
