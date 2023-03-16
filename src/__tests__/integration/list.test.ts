import { Configuration, Project, treeUtils } from '@yarnpkg/core'
import { xfs, ppath, npath, PortablePath, normalizeLineEndings } from '@yarnpkg/fslib'
import PnpPlugin from '@yarnpkg/plugin-pnp'
import NpmPlugin from '@yarnpkg/plugin-npm'
import { pluginRootDir, getTree } from '../../utils'
import { execSync } from 'child_process'
import { Writable } from 'stream'

const expectedNonRecursive = normalizeLineEndings(
  '\n',
  xfs.readFileSync(ppath.join(__dirname as PortablePath, 'fixtures/expected/list.txt' as PortablePath), 'utf8')
)

const expectedRecursive = normalizeLineEndings(
  '\n',
  xfs.readFileSync(ppath.join(__dirname as PortablePath, 'fixtures/expected/listRecursive.txt' as PortablePath), 'utf8')
)

const expectedNonRecursiveProduction = normalizeLineEndings(
  '\n',
  xfs.readFileSync(
    ppath.join(__dirname as PortablePath, 'fixtures/expected/listProduction.txt' as PortablePath),
    'utf8'
  )
)

const expectedRecursiveProduction = normalizeLineEndings(
  '\n',
  xfs.readFileSync(
    ppath.join(__dirname as PortablePath, 'fixtures/expected/listRecursiveProduction.txt' as PortablePath),
    'utf8'
  )
)

const expectedJson = normalizeLineEndings(
  '\n',
  xfs.readFileSync(ppath.join(__dirname as PortablePath, 'fixtures/expected/listJson.txt' as PortablePath), 'utf8')
)

const expectedExcludeMetadata = normalizeLineEndings(
  '\n',
  xfs.readFileSync(
    ppath.join(__dirname as PortablePath, 'fixtures/expected/listExcludeMetadata.txt' as PortablePath),
    'utf8'
  )
)

const expectedExcludeMetadataJson = normalizeLineEndings(
  '\n',
  xfs.readFileSync(
    ppath.join(__dirname as PortablePath, 'fixtures/expected/listExcludeMetadataJson.txt' as PortablePath),
    'utf8'
  )
)

describe.each(['pnp', 'node-modules', 'pnpm'])('licenses list (%s)', (linker) => {
  const cwd = npath.join(__dirname, 'fixtures', `test-package-${linker}`)
  beforeAll(() => {
    execSync('yarn', { cwd })
  })

  it('should list licenses', () => {
    const stdout = execSync('yarn licenses list', { cwd }).toString()
    expect(stdout).toBe(expectedNonRecursive)
  })

  it('should list licenses recursively', () => {
    const stdout = execSync('yarn licenses list --recursive', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedRecursive)
  })

  it('should list licenses for production', () => {
    const stdout = execSync('yarn licenses list --production', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedNonRecursiveProduction)
  })

  it('should list licenses recursively for production', () => {
    const stdout = execSync('yarn licenses list --recursive --production', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedRecursiveProduction)
  })

  it('should list licenses as json', () => {
    const stdout = execSync('yarn licenses list --json', { cwd }).toString()
    expect(stdout).toBe(expectedJson)
  })

  it('should list licenses without metadata', () => {
    const stdout = execSync('yarn licenses list --exclude-metadata', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedExcludeMetadata)
  })

  it('should list licenses without metadata as json', () => {
    const stdout = execSync('yarn licenses list --json --exclude-metadata', {
      cwd
    }).toString()
    expect(stdout).toBe(expectedExcludeMetadataJson)
  })
})

describe('licenses list (node-modules with aliases)', () => {
  const cwd = npath.join(__dirname, 'fixtures', `test-package-node-modules-aliases`)
  beforeAll(() => {
    execSync('yarn', { cwd })
  })

  it('should include aliases in licenses list', () => {
    const stdout = execSync('yarn licenses list', { cwd }).toString()
    expect(stdout).toContain('babel-loader@npm:8.2.4 [dc3fc] (via npm:^8.2.4 [dc3fc])')
  })
})

describe('getTree', () => {
  it.each([
    ['non-recursively', false, false, false, expectedNonRecursive],
    ['recursively', true, false, false, expectedRecursive],
    ['non-recursively for production', false, true, false, expectedNonRecursiveProduction],
    ['recursively for production', true, true, false, expectedRecursiveProduction],
    ['exclude metadata', false, false, true, expectedExcludeMetadata]
  ])('should list licenses %s', async (description, recursive, production, excludeMetadata, expected) => {
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

    const tree = await getTree(project, false, recursive, production, excludeMetadata)

    let stdout = ''
    const stdoutStream = new Writable({
      write: (chunk, enc, next) => {
        stdout += chunk.toString()
        next()
      }
    })

    treeUtils.emitTree(tree, {
      configuration,
      stdout: stdoutStream,
      json: false,
      separators: 1
    })
    await new Promise((resolve) => setImmediate(resolve))

    expect(stdout).toBe(expected)
  })
})
