import {
  Project,
  Cache,
  ThrowReport,
  Descriptor,
  Package,
  treeUtils,
  structUtils,
  miscUtils,
  formatUtils
} from '@yarnpkg/core'
import { PortablePath, ppath, npath, Filename } from '@yarnpkg/fslib'
import { resolveLinker } from './linkers'

/**
 * Root directory of this plugin, for use in automated tests
 */
export const pluginRootDir: PortablePath =
  npath.basename(__dirname) === '@yarnpkg'
    ? // __dirname = `<rootDir>/bundles/@yarnpkg`
      ppath.join(npath.toPortablePath(__dirname), '../..' as PortablePath)
    : // __dirname = `<rootDir>/src`
      ppath.join(npath.toPortablePath(__dirname), '..' as PortablePath)

/**
 * Get the license tree for a project
 *
 * @param {Project} project - Yarn project
 * @param {boolean} json - Whether to output as JSON
 * @param {boolean} recursive - Whether to compute licenses recursively
 * @param {boolean} production - Whether to exclude devDependencies
 * @param {boolean} excludeMetadata - Whether to exclude metadata in tree
 * @returns {treeUtils.TreeNode} Root tree node
 */
export const getTree = async (
  project: Project,
  json: boolean,
  recursive: boolean,
  production: boolean,
  excludeMetadata: boolean
): Promise<treeUtils.TreeNode> => {
  const rootChildren: treeUtils.TreeMap = {}
  const root: treeUtils.TreeNode = { children: rootChildren }

  const sortedPackages = await getSortedPackages(project, recursive, production)

  const linker = resolveLinker(project.configuration.get('nodeLinker'))

  for (const [descriptor, pkg] of sortedPackages.entries()) {
    const packagePath = await linker.getPackagePath(project, pkg)
    if (packagePath === null) continue

    const packageManifest: ManifestWithLicenseInfo = JSON.parse(
      await linker.fs.readFilePromise(ppath.join(packagePath, Filename.manifest), 'utf8')
    )

    const { license, url, vendorName, vendorUrl } = getLicenseInfoFromManifest(packageManifest)

    if (!rootChildren[license]) {
      rootChildren[license] = {
        value: formatUtils.tuple(formatUtils.Type.NO_HINT, license),
        children: {} as treeUtils.TreeMap
      } as treeUtils.TreeNode
    }

    const locator = structUtils.convertPackageToLocator(pkg)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nodeValue = formatUtils.tuple(formatUtils.Type.DEPENDENT, {
      locator,
      descriptor
    })

    const children = excludeMetadata
      ? {}
      : {
          ...(url
            ? {
                url: {
                  value: formatUtils.tuple(formatUtils.Type.NO_HINT, stringifyKeyValue('URL', url, json))
                }
              }
            : {}),
          ...(vendorName
            ? {
                vendorName: {
                  value: formatUtils.tuple(formatUtils.Type.NO_HINT, stringifyKeyValue('VendorName', vendorName, json))
                }
              }
            : {}),
          ...(vendorUrl
            ? {
                vendorUrl: {
                  value: formatUtils.tuple(formatUtils.Type.NO_HINT, stringifyKeyValue('VendorUrl', vendorUrl, json))
                }
              }
            : {})
        }

    const node: treeUtils.TreeNode = {
      value: nodeValue,
      children
    }

    const key = structUtils.stringifyLocator(locator)
    const licenseChildren = rootChildren[license].children as treeUtils.TreeMap
    licenseChildren[key] = node
  }

  return root
}

/**
 * Get a sorted map of packages for the project
 *
 * @param {Project} project - Yarn project
 * @param {boolean} recursive - Whether to get packages recursively
 * @param {boolean} production - Whether to exclude devDependencies
 * @returns {Promise<Map<Descriptor, Package>>} Map of packages in the project
 */
export const getSortedPackages = async (
  project: Project,
  recursive: boolean,
  production: boolean
): Promise<Map<Descriptor, Package>> => {
  const packages = new Map<Descriptor, Package>()
  let storedDescriptors: Iterable<Descriptor>
  if (recursive) {
    if (production) {
      for (const workspace of project.workspaces) {
        workspace.manifest.devDependencies.clear()
      }
      const cache = await Cache.find(project.configuration)
      await project.resolveEverything({ report: new ThrowReport(), cache })
    }
    storedDescriptors = project.storedDescriptors.values()
  } else {
    storedDescriptors = project.workspaces.flatMap((workspace) => {
      const dependencies = [workspace.anchoredDescriptor]
      for (const [identHash, dependency] of workspace.dependencies.entries()) {
        if (production && workspace.manifest.devDependencies.has(identHash)) {
          continue
        }
        dependencies.push(dependency)
      }
      return dependencies
    })
  }

  const sortedDescriptors = miscUtils.sortMap(storedDescriptors, [
    (descriptor) => structUtils.stringifyIdent(descriptor),
    // store virtual descriptors before non-virtual descriptors because the `node-modules` linker prefers virtual
    (descriptor) => (structUtils.isVirtualDescriptor(descriptor) ? '0' : '1'),
    (descriptor) => descriptor.range
  ])

  const seenDescriptorHashes = new Set<string>()

  for (const descriptor of sortedDescriptors.values()) {
    const identHash = project.storedResolutions.get(descriptor.descriptorHash)
    if (!identHash) continue
    const pkg = project.storedPackages.get(identHash)
    if (!pkg) continue

    const { descriptorHash } = structUtils.isVirtualDescriptor(descriptor)
      ? structUtils.devirtualizeDescriptor(descriptor)
      : descriptor
    if (seenDescriptorHashes.has(descriptorHash)) continue
    seenDescriptorHashes.add(descriptorHash)

    packages.set(descriptor, pkg)
  }

  return packages
}

/**
 * Get license information from a manifest
 *
 * @param {ManifestWithLicenseInfo} manifest - Manifest with license information
 * @returns {LicenseInfo} License information
 */
export const getLicenseInfoFromManifest = (manifest: ManifestWithLicenseInfo): LicenseInfo => {
  const { license, licenses, repository, homepage, author } = manifest

  const getNormalizedLicense = () => {
    if (license) {
      return normalizeManifestLicenseValue(license)
    }
    if (licenses) {
      if (licenses.length === 1) {
        return normalizeManifestLicenseValue(licenses[0])
      } else if (licenses.length) {
        return `(${licenses.map(normalizeManifestLicenseValue).join(' OR ')})`
      }
    }
    return UNKNOWN_LICENSE
  }

  return {
    license: getNormalizedLicense(),
    url: repository?.url || homepage,
    vendorName: author?.name,
    vendorUrl: homepage || author?.url
  }
}

type ManifestWithLicenseInfo = {
  name: string
  license?: ManifestLicenseValue
  licenses?: ManifestLicenseValue[]
  repository?: { url: string }
  homepage?: string
  author?: { name: string; url: string }
}

type ManifestLicenseValue = string | { type: string }

const UNKNOWN_LICENSE = 'UNKNOWN'

/**
 * Normalize a manifest license value into a license string
 *
 * @param {ManifestLicenseValue} manifestLicenseValue - Manifest license value
 * @returns {string} License string
 */
const normalizeManifestLicenseValue = (manifestLicenseValue: ManifestLicenseValue): string =>
  (typeof manifestLicenseValue !== 'string' ? manifestLicenseValue.type : manifestLicenseValue) || UNKNOWN_LICENSE

type LicenseInfo = {
  license: string
  url?: string
  vendorName?: string
  vendorUrl?: string
}

const stringifyKeyValue = (key: string, value: string, json: boolean) => {
  return json ? value : `${key}: ${value}`
}

/**
 * Get the license disclaimer for a project
 *
 * @param {Project} project - Yarn project
 * @param {boolean} recursive - Whether to include licenses recursively
 * @param {boolean} production - Whether to exclude devDependencies
 * @returns {string} License disclaimer
 */
export const getDisclaimer = async (project: Project, recursive: boolean, production: boolean): Promise<string> => {
  const sortedPackages = await getSortedPackages(project, recursive, production)

  const linker = resolveLinker(project.configuration.get('nodeLinker'))

  const manifestsByLicense: Map<string, Map<string, ManifestWithLicenseInfo>> = new Map()

  for (const pkg of sortedPackages.values()) {
    const packagePath = await linker.getPackagePath(project, pkg)
    if (packagePath === null) continue

    const packageManifest: ManifestWithLicenseInfo = JSON.parse(
      await linker.fs.readFilePromise(ppath.join(packagePath, Filename.manifest), 'utf8')
    )

    const directoryEntries = await linker.fs.readdirPromise(packagePath, {
      withFileTypes: true
    })
    const files = directoryEntries.filter((dirEnt) => dirEnt.isFile()).map(({ name }) => name)

    const licenseFilename = files.find((filename): boolean => {
      const lower = filename.toLowerCase()
      return (
        lower === 'license' || lower.startsWith('license.') || lower === 'unlicense' || lower.startsWith('unlicense.')
      )
    })

    if (!licenseFilename) continue

    const licenseText = await linker.fs.readFilePromise(ppath.join(packagePath, licenseFilename), 'utf8')

    const noticeFilename = files.find((filename): boolean => {
      const lower = filename.toLowerCase()
      return lower === 'notice' || lower.startsWith('notice.')
    })

    let noticeText
    if (noticeFilename) {
      noticeText = await linker.fs.readFilePromise(ppath.join(packagePath, noticeFilename), 'utf8')
    }

    const licenseKey = noticeText ? `${licenseText}\n\nNOTICE\n\n${noticeText}` : licenseText

    const manifestMap = manifestsByLicense.get(licenseKey)
    if (!manifestMap) {
      manifestsByLicense.set(licenseKey, new Map([[packageManifest.name, packageManifest]]))
    } else {
      manifestMap.set(packageManifest.name, packageManifest)
    }
  }

  let disclaimer =
    'THE FOLLOWING SETS FORTH ATTRIBUTION NOTICES FOR THIRD PARTY SOFTWARE THAT MAY BE CONTAINED ' +
    `IN PORTIONS OF THE ${String(project.topLevelWorkspace.manifest.raw.name)
      .toUpperCase()
      .replace(/-/g, ' ')} PRODUCT.\n\n`

  for (const [licenseKey, packageMap] of manifestsByLicense.entries()) {
    disclaimer += '-----\n\n'

    const names = []
    const urls = []
    for (const { name, repository } of packageMap.values()) {
      names.push(name)
      if (repository?.url) {
        urls.push(packageMap.size === 1 ? repository.url : `${repository.url} (${name})`)
      }
    }

    const heading = []
    heading.push(`The following software may be included in this product: ${names.join(', ')}.`)
    if (urls.length > 0) {
      heading.push(`A copy of the source code may be downloaded from ${urls.join(', ')}.`)
    }
    heading.push('This software contains the following license and notice below:')

    disclaimer += `${heading.join(' ')}\n\n`
    disclaimer += `${licenseKey.trim()}\n\n`
  }

  return disclaimer
}
