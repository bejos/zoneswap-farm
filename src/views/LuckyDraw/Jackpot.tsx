import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Button, AutoRenewIcon, Card, CardBody, CardHeader, Flex, Heading } from '@cowswap/uikit'
import { useLuckyDrawApprove, useLuckyDrawNFTApprove } from 'hooks/useApprove'
import { useLuckyDrawAllowance, useLuckyDrawNFTAllowance } from 'hooks/useAllowance'
import TicketIcon from './icons/Ticket'
import SpinInput from './components/SpinInput'


const CardBorder = styled.div`
  filter: blur(6px);
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  z-index: -1;
  background: linear-gradient(45deg, rgb(255, 0, 0) 0%, rgb(255, 154, 0) 10%, rgb(208, 222, 33) 20%, rgb(79, 220, 74) 30%, rgb(63, 218, 216) 40%, rgb(47, 201, 226) 50%, rgb(28, 127, 238) 60%, rgb(95, 21, 242) 70%, rgb(186, 12, 248) 80%, rgb(251, 7, 217) 90%, rgb(255, 0, 0) 100%) 0% 0% / 300% 300%;
  animation: 2s linear 0s infinite normal none running ilqnTz;
  border-radius: 16px;
`

const CardOutter = styled(Card)`
  align-self: baseline;
  border-radius: 16px;
  box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  position: relative;
  overflow: inherit;
`

const MAX_TIMES = 200

const Jackpot = ({ handleDraw, spinLoading, goudaBalance, nftBalance, claimJackpot }) => {
  const [jackpotTimes, setJackpotTimes] = useState('0')
  const allowance = useLuckyDrawAllowance()
  const allowanceNFT = useLuckyDrawNFTAllowance()
  const { onApprove, loading: approving } = useLuckyDrawApprove()
  const { onApprove: onApproveNFT, loading: approvingNFT } = useLuckyDrawNFTApprove()
  const handleChangeJackpot = (e: React.FormEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.currentTarget
    setJackpotTimes(inputValue.replace(/[^0-9,]+/g, ''))
  }

  const handleSelectMaxJackpot = useCallback(() => {
    const estimatedTimes = Math.floor(goudaBalance.toNumber() / 1)
    setJackpotTimes((estimatedTimes > MAX_TIMES ? MAX_TIMES : estimatedTimes).toString())
  }, [goudaBalance, setJackpotTimes])

  const disabled = Number(jackpotTimes) < 1
  const outOfMax = Number(jackpotTimes) > MAX_TIMES

  const renderAction = () => {
    if (nftBalance.gt(0)) {
      return (
        <CardBody>
          {allowanceNFT ? (<>
            <Heading color="#FFA600" size="lg">
              You Won Big Jackpot
            </Heading>
            <Button
              variant="subtle"
              width="100%"
              mt="15px"
              isLoading={spinLoading}
              disabled={spinLoading}
              onClick={claimJackpot}
              endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : <TicketIcon color="currentColor" />}
            >
              Claim NFT
            </Button>
            </>) :
          <>
            <Heading color="#FFA600" size="lg">
              You Won Big Jackpot
            </Heading>
            <Button variant="subtle" mt="15px" disabled={approvingNFT} width="100%" onClick={onApproveNFT} endIcon={approvingNFT ? <AutoRenewIcon spin color="currentColor" /> : null}>
              {approvingNFT ? 'Approving ...' : 'Approve'}
            </Button>
          </>}
        </CardBody>
      )
    }
    return (
      <CardBody>
        {allowance.toNumber() ? (<>
          <SpinInput
            onSelectMax={handleSelectMaxJackpot}
            onChange={handleChangeJackpot}
            value={jackpotTimes}
            max={goudaBalance.toString()}
            symbol="GOUDA"
            inputTitle="buy"
          />
          <Text fontSize="12px" color="textSubtle" textAlign="left">~{Number(jackpotTimes)} GOUDA</Text>
          <Flex alignItems="center" justifyContent="center">
            <Button
              variant="subtle"
              width="80%"
              mt="15px"
              isLoading={spinLoading}
              disabled={spinLoading || disabled || outOfMax}
              onClick={() => handleDraw('0', jackpotTimes)}
              endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : <TicketIcon color="currentColor" />}
            >
              {outOfMax ? `Out of maximum (${MAX_TIMES})` : 'SPIN'}
            </Button>
          </Flex>
          </>): 
        <Button variant="subtle" mt="15px" disabled={approving} width="100%" onClick={onApprove} endIcon={approving ? <AutoRenewIcon spin color="currentColor" /> : null}>
          {approving ? 'Approving ...' : 'Approve'}
        </Button>}
      </CardBody>
    )
  }

  return (
    <CardOutter>
      <CardBorder />
      <CardHeader style={{
        borderRadius: '12px 12px 0 0 ',
        padding: 0
      }}>
        <Flex alignItems="center" justifyContent="space-between">
          <img style={{ borderRadius: '12px 12px 0 0 '}} src='/images/luckydraw/jackpot.png' alt="cowswap" />
        </Flex>
      </CardHeader>
      {renderAction()}
    </CardOutter>
  )
}

export default Jackpot
