import { WorkspaceRequiredError } from "@yarnpkg/cli";
import {
  CommandContext,
  Plugin,
  Configuration,
  Project,
  Descriptor,
  treeUtils,
  structUtils,
  miscUtils,
  formatUtils,
} from "@yarnpkg/core";
import { Command, Usage } from "clipanion";
import { ManifestWithLicenseInfo, resolveLinker } from "./linkers";

class LicensesListCommand extends Command<CommandContext> {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Command.Boolean(`-R,--recursive`)
  recursive: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Command.Boolean(`--json`)
  json: boolean = false;

  static usage: Usage = Command.Usage({
    description: `display the licenses for all packages in the project`,
    details: `
      This command prints the license information for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).
    `,
    examples: [
      [`List all licenses of direct dependencies`, `$0 licenses list`],
      [
        `List all licenses of direct and transitive dependencies`,
        `$0 licenses list --recursive`,
      ],
    ],
  });

  @Command.Path(`licenses`, `list`)
  async execute(): Promise<void> {
    const configuration = await Configuration.find(
      this.context.cwd,
      this.context.plugins
    );
    const { project, workspace } = await Project.find(
      configuration,
      this.context.cwd
    );

    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd);
    }

    await project.restoreInstallState();

    const tree = await getTree(project, this.json, this.recursive);

    treeUtils.emitTree(tree, {
      configuration,
      stdout: this.context.stdout,
      json: this.json,
      separators: 1,
    });
  }
}

const plugin: Plugin = {
  commands: [LicensesListCommand],
};

export default plugin;

/**
 * Get the license tree for a project
 *
 * @param {Project} project - Yarn project
 * @param {boolean} json - Whether to output as JSON
 * @param {boolean} recursive - Whether to compute licenses recursively
 * @returns {treeUtils.TreeNode} Root tree node
 */
const getTree = async (project: Project, json: boolean, recursive: boolean) => {
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
    if (!identHash) continue
    const pkg = project.storedPackages.get(identHash);
    if (!pkg) continue
    const locator = structUtils.convertPackageToLocator(pkg);

    const packageManifest = linker.getPackageManifest(project, pkg);
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
    const licenseChildren = rootChildren[license].children as treeUtils.TreeMap
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
const getLicenseInfoFromManifest = (manifest: ManifestWithLicenseInfo): LicenseInfo => {
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
