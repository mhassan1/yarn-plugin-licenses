import { Command, Option, Usage } from 'clipanion'
import { CommandContext, Configuration, Descriptor, miscUtils, Project, structUtils } from '@yarnpkg/core'
import { WorkspaceRequiredError } from '@yarnpkg/cli'
import { resolveLinker } from '../linkers'
import * as fs from 'fs'
import * as util from 'util'
import { Filename, ppath } from '@yarnpkg/fslib'

const writeFileAsync = util.promisify(fs.writeFile)

const header = `
<html>
<head>
<style>
.entry {
    background-color: lightyellow;
    padding: 8px;
    margin-bottom: 8px;
}
a {
    color: darkblue;
}
label {
  float: right;
}
label::before {
  color: darkblue;
  text-decoration: underline;
}
.right {
    float: right;
}
input + label + pre {
    display: none;
}
input + label::before {
    content: "show";
    cursor: pointer;
}
input:checked + label + pre {
    display: block;
}
input:checked + label::before {
    content: "hide ";
    cursor: pointer;
}
</style>
</style>
</head>
<body>
`.substr(1)

const entry = (id: number, name: string, url: string, license: string, vendorName: string, licenseContents: string) =>
  `
<div class="entry">
    <span>${name}${vendorName ? ` by ${vendorName}` : ''}</span>
    ${url ? `(<a target="_blank" href="${url}">Homepage</a>)` : ''}
    ${
      licenseContents
        ? `<input type="checkbox" hidden id="${id}">
    <label for="${id}"> ${license || 'unknown'} license</label>
    <pre>${licenseContents}</pre>`
        : `<span class="right">${license || 'unknown'} license</span>`
    }
</div>
`.substr(1)

const footer = `
</body>
</html>
`.substr(1)

export class LicensesHtmlCommand extends Command<CommandContext> {
  static paths = [[`licenses`, `html`]]

  recursive = Option.Boolean(`-R,--recursive`, false, {
    description: `Include transitive dependencies (dependencies of direct dependencies)`
  })

  output = Option.String(`-O,--output`, 'licenses.html', {
    description: `Include transitive dependencies (dependencies of direct dependencies)`
  })

  static usage: Usage = Command.Usage({
    description: `produces an html file containing the licenses for all packages in the project`,
    details: `
      This command produces an html file containing the license information for packages in the project. By default, only direct dependencies are included.

      If \`-R,--recursive\` is set, the listing will include transitive dependencies (dependencies of direct dependencies).
    `,
    examples: [
      [`List all licenses of direct dependencies`, `$0 licenses list`],
      [`List all licenses of direct and transitive dependencies`, `$0 licenses list --recursive`]
    ]
  })

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd)
    }

    await project.restoreInstallState()

    let storedDescriptors: Iterable<Descriptor>
    if (this.recursive) {
      storedDescriptors = project.storedDescriptors.values()
    } else {
      storedDescriptors = project.workspaces.flatMap((workspace) => {
        const dependencies = [workspace.anchoredDescriptor]
        dependencies.push(...workspace.dependencies.values())
        return dependencies
      })
    }

    const sortedDescriptors = miscUtils.sortMap(storedDescriptors, (pkg) => structUtils.stringifyDescriptor(pkg))

    const linker = resolveLinker(project.configuration.get('nodeLinker'))

    let html = header
    let id = 0

    const seen = new Set<string>()

    for (const descriptor of sortedDescriptors.values()) {
      const identHash = project.storedResolutions.get(descriptor.descriptorHash)!
      const pkg = project.storedPackages.get(identHash)!
      const locator = structUtils.convertPackageToLocator(pkg)

      const packagePath = await linker.getPackagePath(project, pkg)
      if (packagePath === null) continue

      const packageManifest = JSON.parse(
        await linker.fs.readFilePromise(ppath.join(packagePath, Filename.manifest), 'utf8')
      )
      if (!packageManifest) continue
      if (seen.has(packageManifest.name)) continue

      const { license, url, vendorName, vendorUrl } = getLicenseInfoFromManifest(packageManifest)

      try {
        const licenseContents = linker.getLicense(project, pkg)
        if(licenseContents) {
          html += entry(id++, packageManifest.name, vendorUrl || url, license, vendorName, licenseContents)
        }
      } catch (e) {}


      seen.add(packageManifest.name)
    }

    html += footer

    await writeFileAsync(this.output, html)
  }
}

const getLicenseInfoFromManifest = (manifest: any) => {
  const { license, repository, homepage, author } = manifest

  return {
    license: (typeof license !== 'string' ? license?.type : license) || 'UNKNOWN',
    url: repository?.url || homepage,
    vendorName: author?.name,
    vendorUrl: homepage || author?.url
  }
}
