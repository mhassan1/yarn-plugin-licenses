import { execSync } from "child_process";
import { npath } from "@yarnpkg/fslib";

describe.each(["pnp", "node-modules"])("licenses list (%s)", (linker) => {
  const cwd = npath.join(__dirname, "fixtures", `test-package-${linker}`);
  beforeAll(() => {
    execSync("yarn", { cwd });
  });

  it("should list licenses", () => {
    const stdout = execSync("yarn licenses list", { cwd }).toString();
    expect(stdout).toBe(`├─ MIT
│  ├─ axios@npm:0.20.0 (via npm:^0.20.0)
│  │  ├─ URL: https://github.com/axios/axios.git
│  │  └─ VendorUrl: https://github.com/axios/axios
│  └─ is-promise@npm:4.0.0 (via npm:^4.0.0)
│     └─ URL: https://github.com/then/is-promise.git
│
└─ UNKNOWN
   ├─ package1-82e61e@workspace:packages/package1 (via workspace:packages/package1)
   └─ root-workspace-0b6124@workspace:. (via workspace:.)
`);
  });

  it("should list licenses recursively", () => {
    const stdout = execSync("yarn licenses list --recursive", {
      cwd,
    }).toString();
    expect(stdout).toBe(`├─ MIT
│  ├─ axios@npm:0.20.0 (via npm:^0.20.0)
│  │  ├─ URL: https://github.com/axios/axios.git
│  │  └─ VendorUrl: https://github.com/axios/axios
│  ├─ follow-redirects@npm:1.13.0 (via npm:^1.10.0)
│  │  ├─ URL: git@github.com:follow-redirects/follow-redirects.git
│  │  └─ VendorUrl: https://github.com/follow-redirects/follow-redirects
│  └─ is-promise@npm:4.0.0 (via npm:^4.0.0)
│     └─ URL: https://github.com/then/is-promise.git
│
└─ UNKNOWN
   ├─ package1-82e61e@workspace:packages/package1 (via workspace:packages/package1)
   └─ root-workspace-0b6124@workspace:. (via workspace:.)
`);
  });

  it("should list licenses as json", () => {
    const stdout = execSync("yarn licenses list --json", { cwd }).toString();
    expect(stdout)
      .toBe(`{"value":"MIT","children":{"axios@npm:0.20.0":{"value":{"locator":"axios@npm:0.20.0","descriptor":"axios@npm:^0.20.0"},"children":{"url":"https://github.com/axios/axios.git","vendorUrl":"https://github.com/axios/axios"}},"is-promise@npm:4.0.0":{"value":{"locator":"is-promise@npm:4.0.0","descriptor":"is-promise@npm:^4.0.0"},"children":{"url":"https://github.com/then/is-promise.git"}}}}
{"value":"UNKNOWN","children":{"package1-82e61e@workspace:packages/package1":{"value":{"locator":"package1-82e61e@workspace:packages/package1","descriptor":"package1-82e61e@workspace:packages/package1"},"children":{}},"root-workspace-0b6124@workspace:.":{"value":{"locator":"root-workspace-0b6124@workspace:.","descriptor":"root-workspace-0b6124@workspace:."},"children":{}}}}
`);
  });
});
