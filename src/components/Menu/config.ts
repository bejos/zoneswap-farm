import { MenuEntry } from '@pancakeswap-libs/uikit'
import tokens from 'config/constants/tokens'
import { BASE_BSC_SCAN_URL } from 'config'
import { getAddress, isMainnet } from 'utils/addressHelpers'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Presale',
    icon: 'PresaleIcon',
    href: isMainnet ? '/presale' : '/',
  },
  // {
  //   label: 'Airdrop',
  //   icon: 'AirdropIcon',
  //   href: '/airdrop',
  // },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    status: {
      text: "LIVE",
      color: "failure",
    },
    items: [
      {
        label: 'Exchange',
        href: isMainnet ? 'https://exchange.cowswap.app/#/swap' : 'https://exchange-testnet.cowswap.app/#/swap', // https://exchange.cowswap.app/#/swap
      },
      {
        label: 'Liquidity',
        href: isMainnet ? 'https://exchange.cowswap.app/#/pool' : 'https://exchange-testnet.cowswap.app/#/pool', // https://exchange.cowswap.app/#/pool
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
    status: {
      text: "LIVE",
      color: "failure",
    },
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/pools',
    status: {
      text: "LIVE",
      color: "failure",
    },
  },
  // {
  //   label: 'Prediction',
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  //   status: {
  //     text: 'BETA',
  //     color: 'warning',
  //   },
  // },
  {
    label: 'Lottery',
    icon: 'TicketIcon',
    href: '/',
    status: {
      text: 'COMING',
      color: 'warning',
    },
  },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  {
    label: 'NFT',
    icon: 'NftIcon',
    href: '/',
    status: {
      text: 'COMING',
      color: 'warning',
    },
  },
  // {
  //   label: 'Teams & Profile',
  //   icon: 'GroupsIcon',
  //   href: '/',
  //   // items: [
  //   //   {
  //   //     label: 'Leaderboard',
  //   //     href: '/teams',
  //   //   },
  //   //   {
  //   //     label: 'Task Center',
  //   //     href: '/profile/tasks',
  //   //   },
  //   //   {
  //   //     label: 'Your Profile',
  //   //     href: '/profile',
  //   //   },
  //   // ],
  // },
  {
    label: 'Info',
    icon: 'InfoIcon',
    href: '/',
    // items: [
    //   {
    //     label: 'Overview',
    //     href: 'https://cowswap.info',
    //   },
    //   {
    //     label: 'Tokens',
    //     href: 'https://cowswap.info/tokens',
    //   },
    //   {
    //     label: 'Pairs',
    //     href: 'https://cowswap.info/pairs',
    //   },
    //   {
    //     label: 'Accounts',
    //     href: 'https://cowswap.info/accounts',
    //   },
    // ],
  },
  // {
  //   label: 'IFO',
  //   icon: 'IfoIcon',
  //   href: '/',
  //   status: {
  //     text: 'COMING',
  //     color: 'warning',
  //   },
  // },
  {
    label: 'More',
    icon: 'MoreIcon',
    href: '/',
    items: [
      // {
      //   label: 'Contact',
      //   href: 'https://docs.cowswap.app/contact-us',
      // },
      // {
      //   label: 'Voting',
      //   href: 'https://voting.cowswap.app',
      // },
      {
        label: 'Github',
        href: 'https://github.com/cowswap',
      },
      {
        label: 'Docs',
        href: 'https://docs.cowswap.app',
      },
      {
        label: 'Gouda Contract',
        href: `${BASE_BSC_SCAN_URL}/address/${getAddress(tokens.cow.address)}`,
      },
      {
        label: 'Audit',
        href: 'https://github.com/TechRate/Smart-Contract-Audits/blob/main/GoudaToken%20Full%20Smart%20Contract%20Security%20Audit.pdf',
      },
    ],
  },
]

export default config
