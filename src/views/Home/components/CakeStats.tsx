import React, { useEffect, useState } from 'react'
import { Card, CardBody, Heading, Text } from '@cowswap/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getCakeAddress } from 'utils/addressHelpers'
import { useMasterchef } from 'hooks/useContract'
import CardValue from './CardValue'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const [newGoudaPerBlock, setNewGoudaPerBlock] = useState(0)
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const masterChefContract = useMasterchef()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress()))
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  useEffect(() => {
    masterChefContract.methods.BONUS_MULTIPLIER().call().then(setNewGoudaPerBlock)
  }, [masterChefContract])

  return (
    <StyledCakeStats>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('Gouda Stats')}
        </Heading>
        <Row>
          <Text fontSize="14px">{t('Total GOUDA Supply')}</Text>
          {cakeSupply && <CardValue fontSize="14px" value={cakeSupply} />}
        </Row>
        <Row>
          <Text fontSize="14px">{t('Total GOUDA Burned')}</Text>
          <CardValue fontSize="14px" decimals={0} value={burnedBalance} />
        </Row>
        <Row>
          <Text fontSize="14px">{t('New GOUDA/block')}</Text>
          <CardValue fontSize="14px" decimals={0} value={newGoudaPerBlock} />
        </Row>
      </CardBody>
    </StyledCakeStats>
  )
}

export default CakeStats
