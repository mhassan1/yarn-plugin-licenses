import { WorkspaceRequiredError } from "@yarnpkg/cli";
import { CommandContext, Configuration, Project } from "@yarnpkg/core";
import { Command, Usage } from "clipanion";
import { getDisclaimer } from "../utils";

export class LicensesGenerateDisclaimerCommand extends Command<CommandContext> {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Command.Boolean(`-R,--recursive`)
  recursive: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @Command.Boolean(`--production`)
  production: boolean = false;

  static usage: Usage = Command.Usage({
    description: `display the license disclaimer including all packages in the project`,
    details: `
      This command prints the license disclaimer for packages in the project. By default, only direct dependencies are listed.

      If \`-R,--recursive\` is set, the disclaimer will include transitive dependencies (dependencies of direct dependencies).

      If \`--production\` is set, the disclaimer will exclude development dependencies.
    `,
    examples: [
      [
        `Include licenses of direct dependencies`,
        `$0 licenses generate-disclaimer`,
      ],
      [
        `Include licenses of direct and transitive dependencies`,
        `$0 licenses generate-disclaimer --recursive`,
      ],
      [
        `Include licenses of production dependencies only`,
        `$0 licenses list --production`,
      ],
    ],
  });

  @Command.Path(`licenses`, `generate-disclaimer`)
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

    const disclaimer = await getDisclaimer(
      project,
      this.recursive,
      this.production
    );
    this.context.stdout.write(disclaimer);
  }
}
