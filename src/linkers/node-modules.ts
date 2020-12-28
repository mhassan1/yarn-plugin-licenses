import { Project, Package, structUtils } from "@yarnpkg/core";
import { parseSyml } from "@yarnpkg/parsers";
import { readFileSync } from "fs";
import { npath, ppath, PortablePath, Filename } from "@yarnpkg/fslib";
import { ManifestWithLicenseInfo } from ".";

/**
 * Get package manifest with `node-modules` linker for a given Yarn project and package
 *
 * @param {Project} project - Yarn project
 * @param {Package} pkg - Yarn package
 * @returns {ManifestWithLicenseInfo | null} Package manifest
 */
export const getPackageManifest = (
  project: Project,
  pkg: Package
): ManifestWithLicenseInfo | null => {
  makeYarnState(project);

  const locator = structUtils.convertPackageToLocator(pkg);
  const entry = yarnState[structUtils.stringifyLocator(locator)];
  if (!entry) return null;

  const location = entry.locations[0];
  const relativePath = location
    ? ppath.join(location, Filename.manifest)
    : Filename.manifest;
  const portablePath = ppath.join(project.cwd, relativePath);
  const nativePath = npath.fromPortablePath(portablePath);
  const packageJson = readFileSync(nativePath).toString();

  return JSON.parse(packageJson);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yarnState: any;

/**
 * Cache Yarn state from `yarn-state.yml`, if it has not already been cached
 *
 * @param {Project} project - Yarn project
 * @returns {void}
 */
const makeYarnState = (project: Project): void => {
  if (!yarnState) {
    const portablePath = ppath.join(
      project.configuration.projectCwd as PortablePath,
      Filename.nodeModules,
      ".yarn-state.yml" as Filename
    );
    const nativePath = npath.fromPortablePath(portablePath);
    yarnState = parseSyml(readFileSync(nativePath).toString());
  }
};
