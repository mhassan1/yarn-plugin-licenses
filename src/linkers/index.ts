import { Project, Package, Manifest } from "@yarnpkg/core";
import * as pnp from "./pnp";
import * as nodeModules from "./node-modules";

/* istanbul ignore next */
/**
 * Resolve linker from `nodeLinker` configuration
 *
 * @param {string} nodeLinker - `nodeLinker` configuration
 * @returns {Linker} linker
 */
export const resolveLinker = (nodeLinker: string): Linker => {
  switch (nodeLinker) {
    case "pnp":
      return pnp;
    case "node-modules":
      return nodeModules;
    default:
      throw new Error("Unsupported linker");
  }
};

type Linker = {
  getPackageManifest: (
    project: Project,
    pkg: Package
  ) => ManifestWithLicenseInfo | null;
};

export type ManifestWithLicenseInfo = Manifest & {
  license?: string | { type: string };
  repository?: { url: string };
  homepage?: string;
  author?: { name: string; url: string };
};
