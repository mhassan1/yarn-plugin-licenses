/* istanbul ignore file */
// this file is covered by CLI tests

import { Project, Package, structUtils, Locator, LinkType } from '@yarnpkg/core'
import { xfs, ppath, PortablePath, Filename, XFS } from '@yarnpkg/fslib'
import { getArchitectureSet } from './utils'

/**
 * Get package path with `pnpm` linker for a given Yarn project and package
 * @param {Project} project - Yarn project
 * @param {Package} pkg - Yarn package
 * @returns {Promise<PortablePath | null>} Package path
 */
export const getPackagePath = async (project: Project, pkg: Package): Promise<PortablePath | null> => {
  if (!structUtils.isPackageCompatible(pkg, getArchitectureSet())) return null

  const locator = structUtils.convertPackageToLocator(pkg)
  const slugifiedLocator = structUtils.slugifyLocator(locator)
  const stringifiedIdent = structUtils.stringifyIdent(locator)

  const workspace = project.tryWorkspaceByLocator(locator)
  if (workspace) return workspace.cwd

  const localPath = pkg.linkType === LinkType.SOFT ? _getLocalPath(project, locator) : null
  if (localPath) return localPath

  return ppath.join(
    project.configuration.projectCwd as PortablePath,
    Filename.nodeModules,
    '.store' as PortablePath,
    slugifiedLocator as PortablePath,
    Filename.nodeModules,
    stringifiedIdent as PortablePath
  )
}

/**
 * Expose the virtual file system for reading package files
 * @returns {XFS} Virtual file system
 */
export const getFs = (): XFS => xfs

/**
 * Find a local package's path by recursively following parent links until a workspace is found
 * @param {Project} project - Yarn project
 * @param {Locator} locator - Yarn package locator
 * @returns {PortablePath | null} Package path
 */
const _getLocalPath = (project: Project, locator: Locator): PortablePath | null => {
  const parsedRange = structUtils.tryParseRange(locator.reference)
  if (!parsedRange?.params?.locator) return null
  const parentLocator = structUtils.parseLocator(parsedRange.params.locator)
  const parentWorkspace = project.tryWorkspaceByLocator(parentLocator)
  if (parentWorkspace) {
    return ppath.join(parentWorkspace.cwd, parsedRange.selector as PortablePath)
  }
  return _getLocalPath(project, parentLocator)
}
