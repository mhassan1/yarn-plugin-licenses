import { Plugin } from "@yarnpkg/core";
import { LicensesListCommand } from "./commands/list";

const plugin: Plugin = {
  commands: [LicensesListCommand],
};

export default plugin;
