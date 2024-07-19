import { Configuration, Project } from '@yarnpkg/core'
import { ppath, npath, PortablePath } from '@yarnpkg/fslib'
import PnpPlugin from '@yarnpkg/plugin-pnp'
import NpmPlugin from '@yarnpkg/plugin-npm'
import { pluginRootDir, getDisclaimer } from '../../utils'
import { execSync } from 'child_process'

describe.each(['pnp', 'node-modules', 'pnpm'])('licenses generate-disclaimer (%s)', (linker) => {
  const cwd = npath.join(__dirname, 'fixtures', `test-package-${linker}`)
  beforeAll(() => {
    execSync('yarn', { cwd })
  })

  it.each([
    ['non-recursively', ''],
    ['recursively', '--recursive'],
    ['non-recursively for production', '--production'],
    ['recursively for production', '--recursive --production'],
    ['non-recursively with focus', '--focus package1'],
    ['recursively with focus', '--recursive --focus package1'],
    ['non-recursively for production with focus', '--production --focus package1'],
    ['recursively for production with focus', '--recursive --production --focus package1'],
    ['non-recursively with focus on a leaf workspace', '--focus package2'],
    ['recursively with focus on a leaf workspace', '--recursive --focus package2'],
    ['non-recursively for production with focus on a leaf', '--production --focus package2'],
    ['recursively for production with focus on a leaf workspace', '--recursive --production --focus package2']
  ])(`should generate disclaimer %s`, (description, flags) => {
    const stdout = execSync(`yarn licenses generate-disclaimer ${flags}`, { cwd }).toString()
    expect(stdout).toMatchSnapshot()
  })
})

describe('getDisclaimer', () => {
  it.each([
    ['non-recursively', false, false],
    ['recursively', true, false],
    ['non-recursively for production', false, true],
    ['recursively for production', true, true]
  ])('should generate disclaimer %s', async (description, recursive, production) => {
    const cwd = ppath.join(
      pluginRootDir,
      'src/__tests__/integration/fixtures/test-package-node-modules' as PortablePath
    )
    const configuration = await Configuration.find(
      cwd,
      {
        modules: new Map([
          [`@yarnpkg/plugin-pnp`, PnpPlugin],
          [`@yarnpkg/plugin-npm`, NpmPlugin]
        ]),
        plugins: new Set([`@yarnpkg/plugin-pnp`, `@yarnpkg/plugin-npm`])
      },
      { useRc: false }
    )
    const { project } = await Project.find(configuration, cwd)

    await project.restoreInstallState()

    const disclaimer = await getDisclaimer(project, recursive, production)

    expect(disclaimer).toMatchSnapshot()
  })
})
