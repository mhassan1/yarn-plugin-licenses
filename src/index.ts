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
import { resolveLinker } from "./linkers";

class LicensesListCommand extends Command<CommandContext> {
  @Command.Boolean(`-R,--recursive`)
  recursive: boolean = false;

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
  async execute() {
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
    const pkg = project.storedPackages.get(identHash);
    const locator = structUtils.convertPackageToLocator(pkg);

    const packageManifest = linker.getPackageManifest(project, pkg);
    if (!packageManifest) continue;

    const { license, url, vendorName, vendorUrl } = getLicenseInfoFromManifest(
      packageManifest
    );

    if (!rootChildren[license]) {
      rootChildren[license] = {
        value: [license, formatUtils.Type.NO_HINT],
        children: {},
      };
    }

    const node: treeUtils.TreeNode = {
      value: [
        {
          descriptor,
          locator,
        },
        formatUtils.Type.DEPENDENT,
      ],
      children: {
        ...(url
          ? {
              url: {
                value: [
                  stringifyKeyValue("URL", url, json),
                  formatUtils.Type.NO_HINT,
                ],
              },
            }
          : {}),
        ...(vendorName
          ? {
              vendorName: {
                value: [
                  stringifyKeyValue("VendorName", vendorName, json),
                  formatUtils.Type.NO_HINT,
                ],
              },
            }
          : {}),
        ...(vendorUrl
          ? {
              vendorUrl: {
                value: [
                  stringifyKeyValue("VendorUrl", vendorUrl, json),
                  formatUtils.Type.NO_HINT,
                ],
              },
            }
          : {}),
      },
    };

    const key = structUtils.stringifyLocator(locator);
    rootChildren[license].children[key] = node;
  }

  return root;
};

const getLicenseInfoFromManifest = (manifest) => {
  const { license, repository, homepage, author } = manifest;

  return {
    license:
      (typeof license !== "string" ? license?.type : license) || "UNKNOWN",
    url: repository?.url || homepage,
    vendorName: author?.name,
    vendorUrl: homepage || author?.url,
  };
};

const stringifyKeyValue = (key: string, value: string, json: boolean) => {
  return json ? value : `${key}: ${value}`;
};
