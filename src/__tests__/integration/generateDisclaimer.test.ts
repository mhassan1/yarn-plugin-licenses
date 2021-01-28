import { Configuration, Project } from "@yarnpkg/core";
import {
  xfs,
  ppath,
  npath,
  PortablePath,
  normalizeLineEndings,
} from "@yarnpkg/fslib";
import PnpPlugin from "@yarnpkg/plugin-pnp";
import { pluginRootDir, getDisclaimer } from "../../utils";
import { execSync } from "child_process";

const expectedNonRecursive = normalizeLineEndings(
  "\n",
  xfs.readFileSync(
    ppath.join(
      __dirname as PortablePath,
      "fixtures/expected/disclaimer.txt" as PortablePath
    ),
    "utf8"
  )
);

const expectedRecursive = normalizeLineEndings(
  "\n",
  xfs.readFileSync(
    ppath.join(
      __dirname as PortablePath,
      "fixtures/expected/disclaimerRecursive.txt" as PortablePath
    ),
    "utf8"
  )
);

describe.each(["pnp", "node-modules"])(
  "licenses generate-disclaimer (%s)",
  (linker) => {
    const cwd = npath.join(__dirname, "fixtures", `test-package-${linker}`);
    beforeAll(() => {
      execSync("yarn", { cwd });
    });

    it("should generate disclaimer", () => {
      const stdout = execSync("yarn licenses generate-disclaimer", {
        cwd,
      }).toString();
      expect(stdout).toBe(expectedNonRecursive);
    });

    it("should generate disclaimer recursively", () => {
      const stdout = execSync("yarn licenses generate-disclaimer --recursive", {
        cwd,
      }).toString();
      expect(stdout).toBe(expectedRecursive);
    });
  }
);

describe("getDisclaimer", () => {
  it.each([
    ["non-recursively", false, expectedNonRecursive],
    ["recursively", true, expectedRecursive],
  ])(
    "should generate disclaimer %s",
    async (description, recursive, expected) => {
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

      const disclaimer = await getDisclaimer(project, recursive);

      expect(disclaimer).toBe(expected);
    }
  );
});
