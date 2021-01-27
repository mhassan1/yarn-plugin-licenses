import {
  Project,
  Descriptor,
  treeUtils,
  structUtils,
  miscUtils,
  formatUtils,
} from "@yarnpkg/core";
import { PortablePath, ppath, npath } from "@yarnpkg/fslib";
import { ManifestWithLicenseInfo, resolveLinker } from "./linkers";

/**
 * Root directory of this plugin, for use in automated tests
 */
export const pluginRootDir: PortablePath =
  npath.basename(__dirname) === "@yarnpkg"
    ? // __dirname = `<rootDir>/bundles/@yarnpkg`
      ppath.join(npath.toPortablePath(__dirname), "../.." as PortablePath)
    : // __dirname = `<rootDir>/src`
      ppath.join(npath.toPortablePath(__dirname), ".." as PortablePath);

/**
 * Get the license tree for a project
 *
 * @param {Project} project - Yarn project
 * @param {boolean} json - Whether to output as JSON
 * @param {boolean} recursive - Whether to compute licenses recursively
 * @returns {treeUtils.TreeNode} Root tree node
 */
export const getTree = async (
  project: Project,
  json: boolean,
  recursive: boolean
): Promise<treeUtils.TreeNode> => {
  const rootChildren: treeUtils.TreeMap = {};
  const root: treeUtils.TreeNode = { children: rootChildren };

  let storedDescriptors: Iterable<Descriptor>;
  if (recursive) {
    storedDescriptors = project.storedDescriptors.values();
  } else {
    storedDescriptors = project.workspaces.flatMap((workspace) => {
      const dependencies = [workspace.anchoredDescriptor];
      dependencies.push(...workspace.dependencies.values());
      return dependencies;
    });
  }

  const sortedDescriptors = miscUtils.sortMap(storedDescriptors, (pkg) =>
    structUtils.stringifyDescriptor(pkg)
  );

  const linker = resolveLinker(project.configuration.get("nodeLinker"));

  for (const descriptor of sortedDescriptors.values()) {
    const identHash = project.storedResolutions.get(descriptor.descriptorHash);
    if (!identHash) continue;
    const pkg = project.storedPackages.get(identHash);
    if (!pkg) continue;
    const locator = structUtils.convertPackageToLocator(pkg);

    const packageManifest = await linker.getPackageManifest(project, pkg);
    if (packageManifest === null) continue;

    const { license, url, vendorName, vendorUrl } = getLicenseInfoFromManifest(
      packageManifest
    );

    if (!rootChildren[license]) {
      rootChildren[license] = {
        value: formatUtils.tuple(formatUtils.Type.NO_HINT, license),
        children: {} as treeUtils.TreeMap,
      } as treeUtils.TreeNode;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nodeValue = formatUtils.tuple(formatUtils.Type.DEPENDENT, {
      locator,
      descriptor,
    });
    const node: treeUtils.TreeNode = {
      value: nodeValue,
      children: {
        ...(url
          ? {
              url: {
                value: formatUtils.tuple(
                  formatUtils.Type.NO_HINT,
                  stringifyKeyValue("URL", url, json)
                ),
              },
            }
          : {}),
        ...(vendorName
          ? {
              vendorName: {
                value: formatUtils.tuple(
                  formatUtils.Type.NO_HINT,
                  stringifyKeyValue("VendorName", vendorName, json)
                ),
              },
            }
          : {}),
        ...(vendorUrl
          ? {
              vendorUrl: {
                value: formatUtils.tuple(
                  formatUtils.Type.NO_HINT,
                  stringifyKeyValue("VendorUrl", vendorUrl, json)
                ),
              },
            }
          : {}),
      },
    };

    const key = structUtils.stringifyLocator(locator);
    const licenseChildren = rootChildren[license].children as treeUtils.TreeMap;
    licenseChildren[key] = node;
  }

  return root;
};

/**
 * Get license information from a manifest
 *
 * @param {ManifestWithLicenseInfo} manifest - Manifest with license information
 * @returns {LicenseInfo} License information
 */
const getLicenseInfoFromManifest = (
  manifest: ManifestWithLicenseInfo
): LicenseInfo => {
  const { license, repository, homepage, author } = manifest;

  return {
    license:
      (typeof license !== "string" ? license?.type : license) || "UNKNOWN",
    url: repository?.url || homepage,
    vendorName: author?.name,
    vendorUrl: homepage || author?.url,
  };
};

type LicenseInfo = {
  license: string;
  url?: string;
  vendorName?: string;
  vendorUrl?: string;
};

const stringifyKeyValue = (key: string, value: string, json: boolean) => {
  return json ? value : `${key}: ${value}`;
};
