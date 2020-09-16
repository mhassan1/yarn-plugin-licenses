import { getPnpPath } from "@yarnpkg/plugin-pnp";
import { Package, Project, structUtils } from "@yarnpkg/core";
import {
  VirtualFS,
  ZipOpenFS,
  Filename,
  PortablePath,
  ppath,
} from "@yarnpkg/fslib";
import { getLibzipSync } from "@yarnpkg/libzip";

export const getPackageManifest = (project: Project, pkg: Package) => {
  makePnPApi(project);

  const locator = structUtils.convertPackageToLocator(pkg);
  const pnpLocator = {
    name: structUtils.stringifyIdent(locator),
    reference: locator.reference,
  };

  const packageInformation = pnpApi.getPackageInformation(pnpLocator);
  if (!packageInformation) return;

  const { packageLocation } = packageInformation;
  const portablePath: PortablePath = ppath.join(
    packageLocation,
    Filename.manifest
  );
  const packageJson = fs.readFileSync(portablePath).toString();

  return JSON.parse(packageJson);
};

let pnpApi;
const makePnPApi = (project: Project) => {
  if (!pnpApi) {
    // use `eval` so webpack leaves this alone
    // tslint:disable-next-line:no-eval
    pnpApi = eval("module.require")(getPnpPath(project).main);
  }
};

const fs = new VirtualFS({
  baseFs: new ZipOpenFS({
    libzip: getLibzipSync(),
    readOnlyArchives: true,
  }),
});
