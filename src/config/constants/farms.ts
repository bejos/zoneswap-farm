import { isMainnet } from 'utils/addressHelpers'
import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'GOUDA',
    lpAddresses: {
      97: '0xbA36B1732B0b55DA418e7910F95b3299C021d58a',
      56: '0x14B06bF2C5B0AFd259c47c4be39cB9368ef0be3f',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  {
    pid: isMainnet ? 1 : 6,
    lpSymbol: 'GOUDA-BNB LP',
    lpAddresses: {
      97: '0xE1072Ca90B6CB4dafB55Cd26F2D8B19f7F99d8C1',
      56: '0x2f9e7fa4b2abf2f5286badcf6f1501c4ac87ebb1',
    },
    token: tokens.cow,
    quoteToken: tokens.wbnb,
  },
  {
    pid: isMainnet ? 2 : 7,
    lpSymbol: 'GOUDA-BUSD LP',
    lpAddresses: {
      97: '0x40407d0b500ec2a0FfbB0f5fbc03f12a1CEebB93',
      56: '0xbe80e97015606d443abafb2fd58fa8373e71001b',
    },
    token: tokens.cow,
    quoteToken: isMainnet ? tokens.busd : tokens.cusd,
  },
  {
    pid: isMainnet ? 3 : 8,
    lpSymbol: 'GOUDA-PRESALE LP',
    lpAddresses: {
      97: '0x8577ce7d3a2A28Dc2e482D0a560A999655340bDF',
      56: '0xffa8d21df91e0fb644189a73ecc3884b8b6deae9',
    },
    token: tokens.cow,
    quoteToken: tokens.presale,
  },
]

const farmsExported = isMainnet ? farms : farms.filter(({ lpSymbol }) => lpSymbol !== 'GOUDA-PRESALE LP')

export default farmsExported
