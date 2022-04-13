import { PortablePath } from '@yarnpkg/fslib'
import { _getYarnStateAliases } from '../../../linkers/node-modules'

describe('node-modules', () => {
  describe('_getYarnStateAliases', () => {
    it('should build yarn state for aliases', () => {
      const yarnStateValue = {
        locations: ['node_modules/p2' as PortablePath],
        aliases: ['virtual:def#npm:4.5.6', 'virtual:ghi#npm:4.5.6']
      }
      const yarnState = {
        'p1@npm:1.2.3': {
          locations: ['node_modules/p1' as PortablePath]
        },
        'p2@virtual:abc#npm:4.5.6': yarnStateValue
      }
      expect(_getYarnStateAliases(yarnState)).toEqual({
        'p2@virtual:def#npm:4.5.6': yarnStateValue,
        'p2@virtual:ghi#npm:4.5.6': yarnStateValue
      })
    })
  })
})
