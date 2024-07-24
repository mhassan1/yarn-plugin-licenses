import { npath } from '@yarnpkg/fslib'
import { execSync, spawnSync } from 'child_process'

describe.each(['pnp', 'node-modules', 'pnpm'])('licenses audit (%s)', (linker) => {
  const cwd = npath.join(__dirname, 'fixtures', `test-package-${linker}`)
  beforeAll(() => {
    execSync('yarn', { cwd })
  })

  describe.each([
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
  ])(`should audit %s`, (description, flags) => {
    it.each([
      ['allowed', '--allowed MIT'],
      ['blocked', `--blocked Apache-2.0 --blocked UNKNOWN`]
    ])(`with %s licenses`, async (description, licenses) => {
      const { stdout, status } = spawnSync(`yarn licenses audit ${licenses} ${flags}`, { cwd, shell: true })
      expect(stdout.toString()).toMatchSnapshot()
      expect(status).toBe(1)
    })
  })

  it('should exit with 0 if no violations are found', () => {
    const { stdout, status } = spawnSync(`yarn licenses audit --blocked GPL-3.0`, { cwd, shell: true })
    expect(stdout.length).toBe(0)
    expect(status).toBe(0)
  })

  it('should throw an error if both --allowed and --blocked are passed', () => {
    const { status } = spawnSync(`yarn licenses audit --allowed MIT --blocked Apache-2.0`, { cwd, shell: true })
    expect(status).toBe(1)
  })
})
