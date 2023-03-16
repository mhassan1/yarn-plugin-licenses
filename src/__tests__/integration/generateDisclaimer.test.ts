import { Configuration, Project } from '@yarnpkg/core'
import { xfs, ppath, npath, PortablePath, normalizeLineEndings } from '@yarnpkg/fslib'
import PnpPlugin from '@yarnpkg/plugin-pnp'
import NpmPlugin from '@yarnpkg/plugin-npm'
import { pluginRootDir, getDisclaimer } from '../../utils'
import { execSync } from 'child_process'

const expectedNonRecursive = normalizeLineEndings(
  '\n',
  xfs.readFileSync(ppath.join(__dirname as PortablePath, 'fixtures/expected/disclaimer.txt' as PortablePath), 'utf8')
)

const expectedRecursive = normalizeLineEndings(
  '\n',
  xfs.readFileSync(
    ppath.join(__dirname as PortablePath, 'fixtures/expected/disclaimerRecursive.txt' as PortablePath),
    'utf8'
  )
)

const expectedNonRecursiveProduction = normalizeLineEndings(
  '\n',
  xfs.readFileSync(
    ppath.join(__dirname as PortablePath, 'fixtures/expected/disclaimerProduction.txt' as PortablePath),
    'utf8'
  )
)

const expectedRecursiveProduction = normalizeLineEndings(
  '\n',
  xfs.readFileSync(
    ppath.join(__dirname as PortablePath, 'fixtures/expected/disclaimerRecursiveProduction.txt' as PortablePath),
    'utf8'
  )
)

describe.each(['pnp', 'node-modules', 'pnpm'])('licenses generate-disclaimer (%s)', (linker) => {
  const cwd = npath.join(__dirname, 'fixtures', `test-package-${linker}`)
  beforeAll(() => {
    execSync('yarn', { cwd })
  })

  it('should generate disclaimer', () => {
    const stdout = execSync('yarn licenses generate-disclaimer', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedNonRecursive)
  })

  it('should generate disclaimer recursively', () => {
    const stdout = execSync('yarn licenses generate-disclaimer --recursive', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedRecursive)
  })

  it('should generate disclaimer for production', () => {
    const stdout = execSync('yarn licenses generate-disclaimer --production', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedNonRecursiveProduction)
  })

  it('should generate disclaimer recursively for production', () => {
    const stdout = execSync('yarn licenses generate-disclaimer --recursive --production', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedRecursiveProduction)
  })
})

describe('getDisclaimer', () => {
  it.each([
    ['non-recursively', false, false, expectedNonRecursive],
    ['recursively', true, false, expectedRecursive],
    ['non-recursively for production', false, true, expectedNonRecursiveProduction],
    ['recursively for production', true, true, expectedRecursiveProduction]
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

    expect(disclaimer).toBe(expected)
  })
})
