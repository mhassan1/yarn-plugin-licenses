import { Configuration, Project, treeUtils } from '@yarnpkg/core'
import { xfs, ppath, npath, PortablePath, normalizeLineEndings } from '@yarnpkg/fslib'
import PnpPlugin from '@yarnpkg/plugin-pnp'
import NpmPlugin from '@yarnpkg/plugin-npm'
import { pluginRootDir, getTree } from '../../utils'
import { execSync } from 'child_process'
import { Writable } from 'stream'

describe.each(['pnp', 'node-modules', 'pnpm'])('licenses list (%s)', (linker) => {
  const cwd = npath.join(__dirname, 'fixtures', `test-package-${linker}`)
  beforeAll(() => {
    execSync('yarn', { cwd })
  })

  it.each([
    ['non-recursively', '', 'list.txt'],
    ['recursively', '--recursive', 'listRecursive.txt'],
    ['non-recursively for production', '--production', 'listProduction.txt'],
    ['recursively for production', '--recursive --production', 'listRecursiveProduction.txt'],
    ['non-recursively with focus', '--focus package1', 'listFocus.txt'],
    ['recursively with focus', '--recursive --focus package1', 'listRecursiveFocus.txt'],
    ['non-recursively for production with focus', '--production --focus package1', 'listProductionFocus.txt'],
    [
      'recursively for production with focus',
      '--recursive --production --focus package1',
      'listRecursiveProductionFocus.txt'
    ],
    ['non-recursively with focus on a leaf workspace', '--focus package2', 'listFocusLeaf.txt'],
    ['recursively with focus on a leaf workspace', '--recursive --focus package2', 'listRecursiveFocusLeaf.txt'],
    [
      'non-recursively for production with focus on a leaf',
      '--production --focus package2',
      'listProductionFocusLeaf.txt'
    ],
    [
      'recursively for production with focus on a leaf workspace',
      '--recursive --production --focus package2',
      'listRecursiveProductionFocusLeaf.txt'
    ],
    ['as json', '--json', 'listJson.txt'],
    ['without metadata', '--exclude-metadata', 'listExcludeMetadata.txt'],
    ['without metadata as json', '--json --exclude-metadata', 'listExcludeMetadataJson.txt']
  ])(`should list licenses %s`, (description, flags, expected) => {
    const stdout = execSync(`yarn licenses list ${flags}`, { cwd }).toString()
    expect(stdout).toBe(
      normalizeLineEndings(
        '\n',
        xfs.readFileSync(ppath.join(__dirname as PortablePath, `fixtures/expected/${expected}` as PortablePath), 'utf8')
      )
    )
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
    ['non-recursively', false, false, false, 'list.txt'],
    ['recursively', true, false, false, 'listRecursive.txt'],
    ['non-recursively for production', false, true, false, 'listProduction.txt'],
    ['recursively for production', true, true, false, 'listRecursiveProduction.txt'],
    ['exclude metadata', false, false, true, 'listExcludeMetadata.txt']
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

    expect(stdout).toBe(
      normalizeLineEndings(
        '\n',
        xfs.readFileSync(ppath.join(__dirname as PortablePath, `fixtures/expected/${expected}` as PortablePath), 'utf8')
      )
    )
  })
})
