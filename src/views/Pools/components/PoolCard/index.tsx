import BigNumber from 'bignumber.js'
import React, { useState, useEffect, useMemo } from 'react'
import { CardBody, Flex, Text, CardRibbon } from '@cowswap/uikit'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { getAddress, getPresaleLPAddress } from 'utils/addressHelpers'
import { useGetApiPrice } from 'state/hooks'
import { Pool } from 'state/types'
import tokens from 'config/constants/tokens'
import { getPresaleLPContract } from 'utils/contractHelpers'
import useWeb3 from 'hooks/useWeb3'
import AprRow from './AprRow'
import StyledCard from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const presalePrice = 0.5

const PoolCard: React.FC<{ pool: Pool; account: string }> = ({ pool, account }) => {
  const web3 = useWeb3()
  const [presaleAmount, setPresaleAmount] = useState()
  const { sousId, stakingToken, earningToken, isFinished, userData } = pool
  const presaleToken = getAddress(tokens.presale.address)
  const isPresaleToken = getAddress(stakingToken.address) === presaleToken
  const { t } = useTranslation()
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')

  const presaleLPAddress = getPresaleLPAddress()

  const presaleLPContract = useMemo(() => {
    return getPresaleLPContract(presaleLPAddress, web3)
  }, [presaleLPAddress, web3])
  
  useEffect(() => {
    if (account) {
      presaleLPContract.methods.checkPresaleAmount(account).call().then(setPresaleAmount)
    }
  }, [account, presaleLPContract])

  if (isPresaleToken && presaleAmount === '0') {
    return null
  }
  return (
    <StyledCard
      isStaking={!isFinished && accountHasStakedBalance}
      isFinished={isFinished && sousId !== 0}
      ribbon={isFinished && <CardRibbon variantColor="textDisabled" text={`${t('Finished')}`} />}
    >
      <StyledCardHeader
        earningTokenSymbol={earningToken.symbol}
        stakingTokenSymbol={stakingToken.symbol}
        isFinished={isFinished && sousId !== 0}
      />
      <CardBody>
        <AprRow pool={pool} stakingTokenPrice={isPresaleToken ? presalePrice : stakingTokenPrice} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            <CardActions
              pool={pool}
              stakedBalance={stakedBalance}
              stakingTokenPrice={isPresaleToken ? presalePrice : stakingTokenPrice}
              accountHasStakedBalance={accountHasStakedBalance}
              isPresaleToken={isPresaleToken}
            />
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <UnlockButton />
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
