import { Project, Package, structUtils } from '@yarnpkg/core'
import { parseSyml } from '@yarnpkg/parsers'
import { xfs, ppath, PortablePath, Filename, XFS } from '@yarnpkg/fslib'
import { getArchitectureSet } from './utils'

/**
 * Get package path with `node-modules` linker for a given Yarn project and package
 * @param {Project} project - Yarn project
 * @param {Package} pkg - Yarn package
 * @returns {Promise<PortablePath | null>} Package path
 */
export const getPackagePath = async (project: Project, pkg: Package): Promise<PortablePath | null> => {
  await makeYarnState(project)

  if (!structUtils.isPackageCompatible(pkg, getArchitectureSet())) return null

  const locator = structUtils.convertPackageToLocator(pkg)
  const stringifiedLocator = structUtils.stringifyLocator(locator)
  const entry = yarnState[stringifiedLocator] || yarnStateAliases[stringifiedLocator]
  if (!entry) return null

  const location = entry.locations[0]
  return location ? ppath.join(project.cwd, location) : project.cwd
}

type YarnState = Record<string, YarnStateEntry>

type YarnStateEntry = {
  locations: PortablePath[]
  aliases?: string[]
}

let yarnState: YarnState
let yarnStateAliases: YarnState

/**
 * Cache Yarn state from `yarn-state.yml`, if it has not already been cached
 * @param {Project} project - Yarn project
 * @returns {Promise<void>}
 */
const makeYarnState = async (project: Project): Promise<void> => {
  if (!yarnState) {
    const portablePath = ppath.join(
      project.configuration.projectCwd as PortablePath,
      Filename.nodeModules,
      '.yarn-state.yml' as Filename
    )
    yarnState = parseSyml(await xfs.readFilePromise(portablePath, 'utf8'))
    yarnStateAliases = _getYarnStateAliases(yarnState)
  }
}

/**
 * Expose the virtual file system for reading package files
 * @returns {XFS} Virtual file system
 */
export const getFs = (): XFS => xfs

/**
 * Get Yarn State for aliases from raw Yarn State
 * @param {YarnState} yarnState Raw Yarn State
 * @returns {YarnState} Yarn State for aliases
 * @private
 */
export const _getYarnStateAliases = (yarnState: YarnState): YarnState => {
  return Object.entries(yarnState).reduce((acc, [stringifiedLocator, yarnStateValue]) => {
    if (!yarnStateValue.aliases) return acc
    const locator = structUtils.parseLocator(stringifiedLocator)
    for (const reference of yarnStateValue.aliases) {
      const newLocator = structUtils.makeLocator(locator, reference)
      const newStringifiedLocator = structUtils.stringifyLocator(newLocator)
      acc[newStringifiedLocator] = yarnStateValue
    }
    return acc
  }, {} as YarnState)
}
