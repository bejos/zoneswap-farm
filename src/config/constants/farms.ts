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
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: tokens.syrup,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 6,
    lpSymbol: 'GOUDA-BNB LP',
    lpAddresses: {
      97: '0xE1072Ca90B6CB4dafB55Cd26F2D8B19f7F99d8C1',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.cow,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 7,
    lpSymbol: 'GOUDA-BUSD LP CLONED',
    lpAddresses: {
      97: '0x40407d0b500ec2a0FfbB0f5fbc03f12a1CEebB93',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.cow,
    quoteToken: tokens.cusd,
  },
  {
    pid: 8,
    lpSymbol: 'GOUDA-PRESALE LP',
    lpAddresses: {
      97: '0x8577ce7d3a2A28Dc2e482D0a560A999655340bDF',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.cow,
    quoteToken: tokens.presale,
  },
]

export default farms
