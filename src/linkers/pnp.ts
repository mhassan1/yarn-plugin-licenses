/* istanbul ignore file */
// this file is covered by CLI tests

import { getPnpPath } from '@yarnpkg/plugin-pnp'
import { Package, Project, structUtils } from '@yarnpkg/core'
import { VirtualFS, PortablePath } from '@yarnpkg/fslib'
import { getLibzipSync, ZipOpenFS } from '@yarnpkg/libzip'
import { getArchitectureSet } from './utils'

/**
 * Get package path with `pnp` linker for a given Yarn project and package
 *
 * @param {Project} project - Yarn project
 * @param {Package} pkg - Yarn package
 * @returns {Promise<PortablePath | null>} Package path
 */
export const getPackagePath = async (project: Project, pkg: Package): Promise<PortablePath | null> => {
  makePnPApi(project)

  if (!structUtils.isPackageCompatible(pkg, getArchitectureSet())) return null

  const locator = structUtils.convertPackageToLocator(pkg)
  const pnpLocator = {
    name: structUtils.stringifyIdent(locator),
    reference: locator.reference.startsWith('virtual:') ? locator.reference.split('#')[1] : locator.reference
  }

  const packageInformation = pnpApi.getPackageInformation(pnpLocator)
  if (!packageInformation) return null

  const { packageLocation } = packageInformation
  return packageLocation
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pnpApi: any

/**
 * Cache PnP API from `.pnp.cjs` (or similar), if it has not already been cached
 *
 * @param {Project} project - Yarn project
 * @returns {void}
 */
const makePnPApi = (project: Project) => {
  if (!pnpApi) {
    // use `module.require` so webpack leaves this alone
    pnpApi = module.require(getPnpPath(project).cjs)
  }
}

/**
 * Get the virtual file system for reading package files in PnP
 *
 * @returns {VirtualFS} Virtual file system
 */
export const getFs = (): VirtualFS => {
  makeFs()
  return fs
}

let fs: VirtualFS

/**
 * Make the virtual file system for reading package files in PnP
 *
 * @returns {void}
 */
const makeFs = (): void => {
  if (!fs) {
    fs = new VirtualFS({
      baseFs: new ZipOpenFS({
        libzip: getLibzipSync(),
        readOnlyArchives: true
      })
    })
  }
}
