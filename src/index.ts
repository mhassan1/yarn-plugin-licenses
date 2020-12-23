import { Plugin } from '@yarnpkg/core'
import { LicensesListCommand } from './commands/list'
import { LicensesGenerateDisclaimerCommand } from './commands/generateDisclaimer'
import { LicensesHtmlCommand } from "./commands/html";

const plugin: Plugin = {
  commands: [LicensesListCommand, LicensesGenerateDisclaimerCommand, LicensesHtmlCommand]
}

export default plugin
