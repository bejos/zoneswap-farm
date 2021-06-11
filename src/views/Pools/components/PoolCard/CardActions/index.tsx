import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button } from '@cowswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import { useWeb3React } from '@web3-react/core'
import { getPresaleLPAddress } from 'utils/addressHelpers'
import { getPresaleLPContract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import useToast from 'hooks/useToast'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool
  stakedBalance: BigNumber
  accountHasStakedBalance: boolean
  stakingTokenPrice: number
  isPresaleToken: boolean
}

const CardActions: React.FC<CardActionsProps> = ({
  pool,
  stakedBalance,
  accountHasStakedBalance,
  stakingTokenPrice,
  isPresaleToken,
}) => {
  const web3 = useWeb3()
  const [isClaiming, setIsClaiming] = useState(false)
  const [isAbleToClaim, setIsAbleToClaim] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)
  const needsApproval = !accountHasStakedBalance && !allowance.gt(0) && !isBnbPool
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData
  const { account } = useWeb3React()

  const presaleLPAddress = getPresaleLPAddress()

  const presaleLPContract = useMemo(() => {
    return getPresaleLPContract(presaleLPAddress, web3)
  }, [presaleLPAddress, web3])

  useEffect(() => {
    presaleLPContract.methods.checkCanClaim().call()
      .then(setIsAbleToClaim)
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

  const renderStakeAction = () => {
    if (isPresaleToken && isAbleToClaim) {
      return <Button onClick={handleClaimPresale}>Claim Presale</Button>
    }
    return needsApproval ? (
      <ApprovalAction pool={pool} isLoading={isLoading} />
    ) : (
      <StakeActions
        isLoading={isLoading}
        pool={pool}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenPrice={stakingTokenPrice}
        stakedBalance={stakedBalance}
        isBnbPool={isBnbPool}
        isStaked={isStaked}
      />
    )
  }

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="text" textTransform="uppercase" fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" fontSize="12px">
                {t(`earned`)}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={earnings}
              earningToken={earningToken}
              sousId={sousId}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
            />
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? 'text' : 'textSubtle'} textTransform="uppercase" fontSize="12px">
            {isStaked ? stakingToken.symbol : t(`stake`)}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'text'} textTransform="uppercase" fontSize="12px">
            {isStaked ? t(`staked`) : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {renderStakeAction()}
      </Flex>
    </Flex>
  )
}

export default CardActions
