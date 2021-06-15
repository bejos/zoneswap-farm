import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { provider as ProviderType } from 'web3-core'
import BigNumber from 'bignumber.js'
import { useLocation } from 'react-router-dom'
import { getAddress, getPresaleLPAddress } from 'utils/addressHelpers'
import { getBep20Contract, getPresaleLPContract } from 'utils/contractHelpers'
import { Button, Flex, Text } from '@cowswap/uikit'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useWeb3 from 'hooks/useWeb3'
import { useApprove } from 'hooks/useApprove'
import UnlockButton from 'components/UnlockButton'
import useToast from 'hooks/useToast'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apr?: number
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  provider?: ProviderType
  account?: string
  addLiquidityUrl?: string
  isPresaleToken: boolean
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl, isPresaleToken }) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = farm
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
  } = farm.userData || {}
  const allowance = new BigNumber(allowanceAsString)
  const tokenBalance = new BigNumber(tokenBalanceAsString)
  const stakedBalance = new BigNumber(stakedBalanceAsString)
  const earnings = new BigNumber(earningsAsString)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const web3 = useWeb3()
  const location = useLocation()

  const [isAbleToClaim, setIsAbleToClaim] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const lpContract = getBep20Contract(lpAddress, web3)

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const presaleLPAddress = getPresaleLPAddress()

  const presaleLPContract = useMemo(() => {
    return getPresaleLPContract(presaleLPAddress, web3)
  }, [presaleLPAddress, web3])

  useEffect(() => {
    if (account) {
      presaleLPContract.methods.checkCanClaim(account).call()
      .then(setIsAbleToClaim)
    }
  }, [account, presaleLPContract])

  const handleClaimPresale = useCallback( async() => {
    setIsClaiming(true)
    try {
      await presaleLPContract.methods
        .claim()
        .send({ from: account, gas: 200000 })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })
      presaleLPContract.methods.checkCanClaim(account).call()
        .then(setIsAbleToClaim)
      toastSuccess(
        'Buy Presale',
        'Your GOUDA have been transferred to your wallet!',
      )
      setIsClaiming(false)
    } catch (e) {
      toastError('Canceled', 'Please try again and confirm the transaction.')
      setIsClaiming(false)
    }
  }, [account, toastSuccess, toastError, presaleLPContract])

  const renderApprovalOrStakeButton = () => {
    if (isPresaleToken && isAbleToClaim) {
      return <Button disabled={isClaiming} onClick={handleClaimPresale}>{isClaiming ? 'Claiming' : 'Claim Presale LP'}</Button>
    }

    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button
        variant="primary"
        mt="8px"
        width="100%"
        disabled={requestedApproval || location.pathname.includes('archived')}
        onClick={handleApprove}
      >
        {t('Approve Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <Flex>
        <Text textTransform="uppercase" color="text" fontSize="12px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          GOUDA
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} />
      <Flex>
        <Text textTransform="uppercase" color="text" fontSize="12px" pr="3px">
          {lpName}
        </Text>
        <Text textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
