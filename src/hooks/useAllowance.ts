import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { getLotteryAddress, getLuckyDrawAddress, getLuckyDrawNFTAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { useCake, useLuckyDrawNFT } from './useContract'
import useRefresh from './useRefresh'

// Retrieve lottery allowance
export const useLotteryAllowance = () => {
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await cakeContract.methods.allowance(account, getLotteryAddress()).call()
      setAllowance(new BigNumber(res))
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, cakeContract, fastRefresh])

  return allowance
}

// Retrieve IFO allowance
export const useIfoAllowance = (tokenContract: Contract, spenderAddress: string, dependency?: any): BigNumber => {
  const { account } = useWeb3React()
  const [allowance, setAllowance] = useState(BIG_ZERO)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract.methods.allowance(account, spenderAddress).call()
        setAllowance(new BigNumber(res))
      } catch (e) {
        console.error(e)
      }
    }

    if (account) {
      fetch()
    }
  }, [account, spenderAddress, tokenContract, dependency])

  return allowance
}

export const useLuckyDrawAllowance = () => {
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await cakeContract.methods.allowance(account, getLuckyDrawAddress()).call()
      setAllowance(new BigNumber(res))
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, cakeContract, fastRefresh])

  return allowance
}

export const useLuckyDrawNFTAllowance = (tokenId) => {
  const [allowance, setAllowance] = useState(false)
  const { account } = useWeb3React()
  const luckyDrawNFTContract = useLuckyDrawNFT(getLuckyDrawNFTAddress())
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await luckyDrawNFTContract.methods.getApproved(tokenId).call()
      setAllowance(res === getLuckyDrawAddress())
    }

    if (account) {
      fetchAllowance()
    }
  }, [account, fastRefresh, luckyDrawNFTContract, tokenId])

  return allowance
}
