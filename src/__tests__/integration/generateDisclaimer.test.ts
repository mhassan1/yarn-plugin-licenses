import { Configuration, Project } from '@yarnpkg/core'
import { xfs, ppath, npath, PortablePath, normalizeLineEndings } from '@yarnpkg/fslib'
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
    ['non-recursively', '', 'disclaimer.txt'],
    ['recursively', '--recursive', 'disclaimerRecursive.txt'],
    ['non-recursively for production', '--production', 'disclaimerProduction.txt'],
    ['recursively for production', '--recursive --production', 'disclaimerRecursiveProduction.txt']
  ])(`should generate disclaimer %s`, (description, flags, expected) => {
    const stdout = execSync(`yarn licenses generate-disclaimer ${flags}`, { cwd }).toString()
    expect(stdout).toBe(
      normalizeLineEndings(
        '\n',
        xfs.readFileSync(ppath.join(__dirname as PortablePath, `fixtures/expected/${expected}` as PortablePath), 'utf8')
      )
    )
  })
})

describe('getDisclaimer', () => {
  it.each([
    ['non-recursively', false, false, 'disclaimer.txt'],
    ['recursively', true, false, 'disclaimerRecursive.txt'],
    ['non-recursively for production', false, true, 'disclaimerProduction.txt'],
    ['recursively for production', true, true, 'disclaimerRecursiveProduction.txt']
  ])('should generate disclaimer %s', async (description, recursive, production, expected) => {
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

    expect(disclaimer).toBe(
      normalizeLineEndings(
        '\n',
        xfs.readFileSync(ppath.join(__dirname as PortablePath, `fixtures/expected/${expected}` as PortablePath), 'utf8')
      )
    )
  })
})
