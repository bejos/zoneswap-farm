import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@cowswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
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

  const renderStakeAction = () => {
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
        isPresaleToken={isPresaleToken}
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
