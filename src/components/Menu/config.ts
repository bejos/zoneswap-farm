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
  {
    label: 'Lucky draw',
    icon: 'LuckyDrawIcon',
    href: '/luckydraw',
    status: {
      text: "LIVE",
      color: "failure",
    }
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
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
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/pools',
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
    items: [
      {
        label: 'Dextools.io',
        href: 'https://www.dextools.io/app/pancakeswap/pair-explorer/0x7b4b7bb3d157e38c1497d894ccc1946715128ac2',
      },
      {
        label: 'Pancake (Gouda - BNB)',
        href: 'https://pancakeswap.info/pool/0x7b4b7bb3d157e38c1497d894ccc1946715128ac2',
      },
      {
        label: 'Poocoin',
        href: 'https://poocoin.app/tokens/0x14b06bf2c5b0afd259c47c4be39cb9368ef0be3f',
      },
      {
        label: 'Dex.guru',
        href: 'https://dex.guru/token/0x14B06bF2C5B0AFd259c47c4be39cB9368ef0be3f-bsc',
      },
    ],
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
    label: 'Audit',
    icon: 'AuditIcon',
    href: 'https://github.com/TechRate/Smart-Contract-Audits/blob/main/GoudaToken%20Full%20Smart%20Contract%20Security%20Audit.pdf',
  },
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
    ],
  },
]

export default config
