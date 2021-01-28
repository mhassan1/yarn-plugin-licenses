import { Configuration, Project, treeUtils } from "@yarnpkg/core";
import { xfs, ppath, npath, PortablePath } from "@yarnpkg/fslib";
import PnpPlugin from "@yarnpkg/plugin-pnp";
import { pluginRootDir, getTree } from "../../utils";
import { execSync } from "child_process";
import { Writable } from "stream";

const expectedNonRecursive = xfs.readFileSync(
  ppath.join(
    __dirname as PortablePath,
    "fixtures/expected/list.txt" as PortablePath
  ),
  "utf8"
);

const expectedRecursive = xfs.readFileSync(
  ppath.join(
    __dirname as PortablePath,
    "fixtures/expected/listRecursive.txt" as PortablePath
  ),
  "utf8"
);

const expectedJson = xfs.readFileSync(
  ppath.join(
    __dirname as PortablePath,
    "fixtures/expected/listJson.txt" as PortablePath
  ),
  "utf8"
);

describe.each(["pnp", "node-modules"])("licenses list (%s)", (linker) => {
  const cwd = npath.join(__dirname, "fixtures", `test-package-${linker}`);
  beforeAll(() => {
    execSync("yarn", { cwd });
  });

  it("should list licenses", () => {
    const stdout = execSync("yarn licenses list", { cwd }).toString();
    expect(stdout).toBe(expectedNonRecursive);
  });

  it("should list licenses recursively", () => {
    const stdout = execSync("yarn licenses list --recursive", {
      cwd,
    }).toString();
    expect(stdout).toBe(expectedRecursive);
  });

  it("should list licenses as json", () => {
    const stdout = execSync("yarn licenses list --json", { cwd }).toString();
    expect(stdout).toBe(expectedJson);
  });
});

describe("getTree", () => {
  it.each([
    ["non-recursively", false, expectedNonRecursive],
    ["recursively", true, expectedRecursive],
  ])("should list licenses %s", async (description, recursive, expected) => {
    const cwd = ppath.join(
      pluginRootDir,
      "src/__tests__/integration/fixtures/test-package-node-modules" as PortablePath
    );
    const configuration = await Configuration.find(
      cwd,
      {
        modules: new Map([[`@yarnpkg/plugin-pnp`, PnpPlugin]]),
        plugins: new Set([`@yarnpkg/plugin-pnp`]),
      },
      { useRc: false }
    );
    const { project } = await Project.find(configuration, cwd);

    await project.restoreInstallState();

    const tree = await getTree(project, false, recursive);

    let stdout = "";
    const stdoutStream = new Writable({
      write: (chunk, enc, next) => {
        stdout += chunk.toString();
        next();
      },
    });

    treeUtils.emitTree(tree, {
      configuration,
      stdout: stdoutStream,
      json: false,
      separators: 1,
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(stdout).toBe(expected);
  });
});
