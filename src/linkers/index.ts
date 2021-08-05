import { Project, Package } from '@yarnpkg/core'
import * as pnp from './pnp'
import * as nodeModules from './node-modules'
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
    default:
      throw new Error('Unsupported linker')
  }
}

type Linker = {
  getPackagePath: (project: Project, pkg: Package) => Promise<PortablePath | null>
  fs: FakeFS<PortablePath>
}
