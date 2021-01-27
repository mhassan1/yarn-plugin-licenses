/* istanbul ignore file */
// this file is covered by CLI tests

import { getPnpPath } from "@yarnpkg/plugin-pnp";
import { Package, Project, structUtils } from "@yarnpkg/core";
import { VirtualFS, ZipOpenFS, PortablePath } from "@yarnpkg/fslib";
import { getLibzipSync } from "@yarnpkg/libzip";

/**
 * Get package path with `pnp` linker for a given Yarn project and package
 *
 * @param {Project} project - Yarn project
 * @param {Package} pkg - Yarn package
 * @returns {Promise<PortablePath | null>} Package path
 */
export const getPackagePath = async (
  project: Project,
  pkg: Package
): Promise<PortablePath | null> => {
  makePnPApi(project);

  const locator = structUtils.convertPackageToLocator(pkg);
  const pnpLocator = {
    name: structUtils.stringifyIdent(locator),
    reference: locator.reference,
  };

  const packageInformation = pnpApi.getPackageInformation(pnpLocator);
  if (!packageInformation) return null;

  const { packageLocation } = packageInformation;
  return packageLocation;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pnpApi: any;

/**
 * Cache PnP API from `.pnp.js` (or similar), if it has not already been cached
 *
 * @param {Project} project - Yarn project
 * @returns {void}
 */
const makePnPApi = (project: Project) => {
  if (!pnpApi) {
    // use `eval` so webpack leaves this alone
    pnpApi = eval("module.require")(getPnpPath(project).main);
  }
};

/**
 * Instantiate the virtual file system for reading package files in PnP
 */
export const fs = new VirtualFS({
  baseFs: new ZipOpenFS({
    libzip: getLibzipSync(),
    readOnlyArchives: true,
  }),
});
