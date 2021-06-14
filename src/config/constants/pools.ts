import { getAddress } from 'utils/addressHelpers'
import tokens from './tokens'
import contracts from './contracts'
import { PoolConfig, PoolCategory } from './types'

export const masterPids = [0, 8]

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.cow,
    earningToken: tokens.cow,
    contractAddress: {
      97: getAddress(contracts.masterChef),
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 8,
    stakingToken: tokens.presale,
    earningToken: tokens.cow,
    contractAddress: {
      97: getAddress(contracts.masterChef),
      56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 1,
    isFinished: false,
  },
  // {
  //   sousId: 116,
  //   stakingToken: tokens.cake,
  //   earningToken: tokens.dfd,
  //   contractAddress: {
  //     97: '',
  //     56: '0xAF3EfE5fCEeBc603Eada6A2b0172be11f7405102',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 999,
  //   tokenPerBlock: '0.46296',
  //   isFinished: false,
  // },
  // {
  //   sousId: 115,
  //   stakingToken: tokens.cake,
  //   earningToken: tokens.alpaca,
  //   contractAddress: {
  //     97: '',
  //     56: '0xf73fdeb26a8c7a4abf3809d3db11a06ba5c13d0e',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   sortOrder: 999,
  //   tokenPerBlock: '0.22743',
  //   isFinished: false,
  // },
]

export default pools
