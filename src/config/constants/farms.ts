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
    pid: 1,
    lpSymbol: 'GOUDA-BNB LP',
    lpAddresses: {
      97: '0x286254C0C9B48ad88EBC0537e08dE2CFFB33dA2d',
      56: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
    },
    token: tokens.cow,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'GOUDA-BUSD LP',
    lpAddresses: {
      97: '0xA561D49d531354Be0ee95D52605b917c7e903F24',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.cow,
    quoteToken: tokens.busd,
  },
  {
    pid: 4,
    lpSymbol: 'GOUDA-BUSD LP CLONED',
    lpAddresses: {
      97: '0x12aE57f0Dae724b9944F970fF55b2e462948190E',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: tokens.cow,
    quoteToken: tokens.busd,
  },
]

export default farms
