import * as pnp from "./pnp";
import * as nodeModules from "./node-modules";

export const resolveLinker = (nodeLinker) => {
  switch (nodeLinker) {
    case "pnp":
      return pnp;
    case "node-modules":
      return nodeModules;
    default:
      throw new Error("Unsupported linker");
  }
};
