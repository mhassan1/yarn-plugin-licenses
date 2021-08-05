import { Plugin } from '@yarnpkg/core'
import { LicensesListCommand } from './commands/list'
import { LicensesGenerateDisclaimerCommand } from './commands/generateDisclaimer'

const plugin: Plugin = {
  commands: [LicensesListCommand, LicensesGenerateDisclaimerCommand]
}

export default plugin
