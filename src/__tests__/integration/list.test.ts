import { Configuration, Project, treeUtils } from '@yarnpkg/core'
import { ppath, npath, PortablePath } from '@yarnpkg/fslib'
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
    ['recursively for production with focus on a leaf workspace', '--recursive --production --focus package2'],
    ['as json', '--json'],
    ['without metadata', '--exclude-metadata'],
    ['without metadata as json', '--json --exclude-metadata']
  ])(`should list licenses %s`, (description, flags) => {
    const stdout = execSync(`yarn licenses list ${flags}`, { cwd }).toString()
    expect(stdout).toMatchSnapshot()
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
    ['non-recursively', false, false, false],
    ['recursively', true, false, false],
    ['non-recursively for production', false, true, false],
    ['recursively for production', true, true, false],
    ['exclude metadata', false, false, true]
  ])('should list licenses %s', async (description, recursive, production, excludeMetadata) => {
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

    expect(stdout).toMatchSnapshot()
  })
})
