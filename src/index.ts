import { Plugin } from '@yarnpkg/core'
import { LicensesListCommand } from './commands/list'
import { LicensesGenerateDisclaimerCommand } from './commands/generateDisclaimer'
import { LicensesAuditCommand } from './commands/audit'

const plugin: Plugin = {
  commands: [LicensesListCommand, LicensesGenerateDisclaimerCommand, LicensesAuditCommand]
}

export default plugin
