import { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useAppDispatch } from 'state'
import { updateUserAllowance, fetchFarmUserDataAsync } from 'state/actions'
import { approve } from 'utils/callHelpers'
import { getLuckyDrawAddress, getLuckyDrawNFTAddress } from 'utils/addressHelpers'
import { useMasterchef, useCake, useSousChef, useLottery, useLuckyDrawNFT } from './useContract'

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      dispatch(fetchFarmUserDataAsync(account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  // console.log({
  //   lpContract, sousChefContract
  // })
  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account)
      dispatch(updateUserAllowance(sousId, account))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId])

  return { onApprove: handleApprove }
}

// Approve the lottery
export const useLotteryApprove = () => {
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const lotteryContract = useLottery()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, cakeContract, lotteryContract])

  return { onApprove: handleApprove }
}

// Approve an IFO
export const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { account } = useWeb3React()
  const onApprove = useCallback(async () => {
    const tx = await tokenContract.methods.approve(spenderAddress, ethers.constants.MaxUint256).send({ from: account })
    return tx
  }, [account, spenderAddress, tokenContract])

  return onApprove
}

// Approve the lottery
export const useLuckyDrawApprove = () => {
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()
  const cakeContract = useCake()
  const luckyDrawAddress = getLuckyDrawAddress()

  const handleApprove = useCallback(async () => {
    try {
      setLoading(true)
      const tx = await cakeContract.methods.approve(luckyDrawAddress, ethers.constants.MaxUint256).send({ from: account })
      setLoading(false)
      return tx
    } catch (e) {
      setLoading(false)
      return false
    }
  }, [account, cakeContract, luckyDrawAddress])

  return { onApprove: handleApprove, loading }
}

export const useLuckyDrawNFTApprove = (tokenId) => {
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()
  const luckyDrawNFTContract = useLuckyDrawNFT(getLuckyDrawNFTAddress())

  const handleApprove = useCallback(async () => {
    try {
      setLoading(true)
      const tx = await luckyDrawNFTContract.methods.approve(getLuckyDrawAddress(), tokenId).send({ from: account })
      setLoading(false)
      return tx
    } catch (e) {
      setLoading(false)
      return false
    }
  }, [account, luckyDrawNFTContract, tokenId])

  return { onApprove: handleApprove, loading }
}
