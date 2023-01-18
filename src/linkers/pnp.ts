/* istanbul ignore file */
// this file is covered by CLI tests

import { getPnpPath } from '@yarnpkg/plugin-pnp'
import { Package, Project, structUtils } from '@yarnpkg/core'
import { VirtualFS, ZipOpenFS, PortablePath, ppath } from '@yarnpkg/fslib'
import { getLibzipSync } from '@yarnpkg/libzip'

/**
 * Get package path with `pnp` linker for a given Yarn project and package
 *
 * @param {Project} project - Yarn project
 * @param {Package} pkg - Yarn package
 * @returns {Promise<PortablePath | null>} Package path
 */
export const getPackagePath = async (project: Project, pkg: Package): Promise<PortablePath | null> => {
  makePnPApi(project)

  const locator = structUtils.convertPackageToLocator(pkg)
  const pnpLocator = {
    name: structUtils.stringifyIdent(locator),
    reference: locator.reference
  }

  const packageInformation = pnpApi.getPackageInformation(pnpLocator)
  if (!packageInformation) return null

  const { packageLocation } = packageInformation
  return packageLocation
}

export const getLicense = (project: Project, pkg: Package) => {
  makePnPApi(project)

  const locator = structUtils.convertPackageToLocator(pkg)
  const pnpLocator = {
    name: structUtils.stringifyIdent(locator),
    reference: locator.reference
  }

  const packageInformation = pnpApi.getPackageInformation(pnpLocator)
  if (!packageInformation) return

  const { packageLocation } = packageInformation
  const portablePath: PortablePath = ppath.join(
    ('/' + packageLocation.slice(0, -1).replace(/\\/g, '/')) as any,
    'LICENSE' as any
  )
  const license = fs.readFileSync(portablePath).toString()
  return license
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
 * Instantiate the virtual file system for reading package files in PnP
 */
export const fs = new VirtualFS({
  baseFs: new ZipOpenFS({
    libzip: getLibzipSync(),
    readOnlyArchives: true
  })
})
