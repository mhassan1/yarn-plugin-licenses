import { WorkspaceRequiredError } from '@yarnpkg/cli'
import { CommandContext, Configuration, Project, treeUtils } from '@yarnpkg/core'
import { Command, Usage, Option } from 'clipanion'
import { getTree, focusWorkspaces } from '../utils'

export class LicensesAuditCommand extends Command<CommandContext> {
  static paths = [[`licenses`, `audit`]]

  recursive = Option.Boolean(`-R,--recursive`, false, {
    description: `Include transitive dependencies (dependencies of direct dependencies)`
  })

  production = Option.Boolean(`--production`, false, {
    description: `Exclude development dependencies`
  })

  json = Option.Boolean(`--json`, false, {
    description: `Format output as JSON`
  })

  excludeMetadata = Option.Boolean(`--exclude-metadata`, false, {
    description: `Exclude dependency metadata from output`
  })

  focus = Option.Array(`--focus`, [], {
    description: `Focus on one or more workspaces`
  })

  allowedLicenses = Option.Array(`--allowed`, [], {
    description: `List of allowed licenses`
  })

  blockedLicenses = Option.Array(`--blocked`, [], {
    description: `List of blocked licenses`
  })

  static usage: Usage = Command.Usage({
    description: `audits the licenses for all packages in the project`,
    details: `
      This command audits and prints the license information for packages in the project according to rules set. By default, only direct dependencies are audited.

      If \`-R,--recursive\` is set, the auditing will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the auditing will exclude development dependencies.

      If \`--focus\` is passed, the auditing will only include dependencies of the specified workspaces.

      If \`--allowed\` is passed, the auditing will accept dependencies with the specified allowed licenses.

      If \`--blocked\` is passed, the auditing will reject dependencies with the specified blocked licenses.
    `,
    examples: [
      [`Audit all licenses of direct dependencies`, `$0 licenses audit --blocked GPL-3.0`],
      [`Audit all licenses of direct and transitive dependencies`, `$0 licenses audit --blocked GPL-3.0 --recursive`],
      [`Audit all licenses of production dependencies only`, `$0 licenses audit --blocked GPL-3.0 --production`],
      [
        `Audit all licenses for specified workspaces only`,
        `$0 licenses audit --blocked GPL-3.0 --focus <workspace-a> --focus <workspace-b>`
      ]
    ]
  })

  async execute(): Promise<void> {
    if ((this.allowedLicenses.length === 0) === (this.blockedLicenses.length === 0)) {
      throw new Error('You must provide at least one of --allowed or --blocked, but not both')
    }

    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd)
    }

    await project.restoreInstallState()

    await focusWorkspaces(project, this.focus, this.recursive, this.production)

    const tree = await getTree(project, this.json, this.recursive, this.production, this.excludeMetadata)

    const reportedLicenses: treeUtils.TreeNode[] = []

    for (const [license, child] of Object.entries(tree.children)) {
      if (!child) continue

      const isAllowed = this.allowedLicenses.length === 0 || this.allowedLicenses.includes(license)
      const isBlocked = this.blockedLicenses.length !== 0 && this.blockedLicenses.includes(license)
      if (!isAllowed || isBlocked) {
        reportedLicenses.push(child)
      }
    }

    treeUtils.emitTree(
      { children: reportedLicenses },
      {
        configuration,
        stdout: this.context.stdout,
        json: this.json,
        separators: 1
      }
    )
  }
}
