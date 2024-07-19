import { npath } from '@yarnpkg/fslib'
import { execSync } from 'child_process'

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
      ['blocked', `--blocked Apache-2.0`]
    ])(`with %s licenses`, (description, licenses) => {
      const stdout = execSync(`yarn licenses audit ${licenses} ${flags}`, { cwd }).toString()
      expect(stdout).toMatchSnapshot()
    })
  })

  it('should throw an error if both --allowed and --blocked are passed', () => {
    expect(() => execSync(`yarn licenses audit --allowed 0BSD --blocked ISC`, { cwd })).toThrowError(
      expect.objectContaining({ status: 1 })
    )
  })
})
