import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const isMainnet = process.env.REACT_APP_CHAIN_ID === '56'

export const getAddress = (address: Address, chainId?: string): string => {
  const mainNetChainId = 56
  const foundChainId = chainId || process.env.REACT_APP_CHAIN_ID

  return address[foundChainId] ? address[foundChainId] : address[mainNetChainId]
}

export const getPresaleLPAddress = () => {
  return getAddress(tokens.presale.address)
}
export const getLuckyDrawAddress = () => {
  return getAddress(addresses.luckyDraw)
}
export const getLuckyDrawNFTAddress = () => {
  return getAddress(addresses.luckyDrawNFT)
}
export const getAirdropAddress = () => {
  return getAddress(addresses.airdrop)
}
export const getPresaleAddress = () => {
  return getAddress(addresses.presale)
}
export const getCakeAddress = () => {
  return getAddress(tokens.cow.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getLotteryAddress = () => {
  return getAddress(addresses.lottery)
}
export const getLotteryTicketAddress = () => {
  return getAddress(addresses.lotteryNFT)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition)
}
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}
export const getPredictionsAddress = () => {
  return getAddress(addresses.predictions)
}
