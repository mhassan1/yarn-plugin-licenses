import { getLicenseInfoFromManifest } from '../../utils'

describe('getLicenseInfoFromManifest', () => {
  const baseManifest = {
    name: 'my-package',
    repository: { url: 'my-repo' },
    homepage: 'my-homepage',
    author: { name: 'my-name', url: 'my-url' }
  }

  const baseExpectedManifest = {
    license: 'UNKNOWN',
    url: 'my-repo',
    vendorName: 'my-name',
    vendorUrl: 'my-homepage'
  }

  it('should read license information from a manifest', () => {
    expect(getLicenseInfoFromManifest(baseManifest)).toStrictEqual(baseExpectedManifest)

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        homepage: undefined
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      vendorUrl: 'my-url'
    })

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        repository: undefined
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      url: 'my-homepage'
    })

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        license: 'MIT'
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      license: 'MIT'
    })

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        license: { type: 'MIT' }
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      license: 'MIT'
    })

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        licenses: ['MIT']
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      license: 'MIT'
    })

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        licenses: [{ type: 'MIT' }]
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      license: 'MIT'
    })

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        licenses: ['MIT', 'WTFPL']
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      license: '(MIT OR WTFPL)'
    })

    expect(
      getLicenseInfoFromManifest({
        ...baseManifest,
        licenses: [{ type: 'MIT' }, { type: 'WTFPL' }]
      })
    ).toStrictEqual({
      ...baseExpectedManifest,
      license: '(MIT OR WTFPL)'
    })
  })
})
