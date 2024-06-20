import { WorkspaceRequiredError } from '@yarnpkg/cli'
import { CommandContext, Configuration, Project } from '@yarnpkg/core'
import { Command, Usage, Option } from 'clipanion'
import { getDisclaimer, focusWorkspaces } from '../utils'

export class LicensesGenerateDisclaimerCommand extends Command<CommandContext> {
  static paths = [[`licenses`, `generate-disclaimer`]]

  recursive = Option.Boolean(`-R,--recursive`, false, {
    description: `Include transitive dependencies (dependencies of direct dependencies)`
  })

  production = Option.Boolean(`--production`, false, {
    description: `Exclude development dependencies`
  })

  focus = Option.Array(`--focus`, [], {
    description: `Focus on one or more workspaces`
  })

  static usage: Usage = Command.Usage({
    description: `display the license disclaimer including all packages in the project`,
    details: `
      This command prints the license disclaimer for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the disclaimer will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the disclaimer will exclude development dependencies.

      If \`--focus\` is passed, the disclaimer will only include dependencies of the specified workspaces.
    `,
    examples: [
      [`Include licenses of direct dependencies`, `$0 licenses generate-disclaimer`],
      [`Include licenses of direct and transitive dependencies`, `$0 licenses generate-disclaimer --recursive`],
      [`Include licenses of production dependencies only`, `$0 licenses generate-disclaimer --production`],
      [
        `Include licenses for specified workspaces only`,
        `$0 licenses generate-disclaimer --focus <workspace-a> --focus <workspace-b>`
      ]
    ]
  })

  async execute(): Promise<void> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd)
    }

    await project.restoreInstallState()

    await focusWorkspaces(project, this.focus, this.recursive, this.production)

    const disclaimer = await getDisclaimer(project, this.recursive, this.production)
    this.context.stdout.write(disclaimer)
  }
}
