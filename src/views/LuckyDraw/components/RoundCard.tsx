/* eslint-disable no-nested-ternary */
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Text, Button, AutoRenewIcon, CardBody, CardHeader, Card, Flex } from '@cowswap/uikit'
import { useLuckyDrawApprove } from 'hooks/useApprove'
import { useLuckyDrawAllowance } from 'hooks/useAllowance'

import TicketIcon from '../icons/Ticket'
import SpinInput from './SpinInput'

const MAX_TIMES = 200

const CardBorder = styled.div`
  filter: blur(6px);
  position: absolute;
  top: -4px;
  right: -4px;
  bottom: -4px;
  left: -4px;
  z-index: -1;
  background: linear-gradient(45deg,rgb(255,0,0) 0%,rgb(255,154,0) 10%,rgb(208,222,33) 20%,rgb(79,220,74) 30%,#e67b57 40%,#ed4b9e 50%,rgb(28,127,238) 60%,rgb(95,21,242) 70%,rgb(186,12,248) 80%,rgb(251,7,217) 90%,rgb(255,0,0) 100%) 0% 0% / 300% 300%;
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

const RoundCard = ({ type, handleDraw, spinLoading, account, goudaBalance, goudaPerTime }) => {
  const [times, setTimes] = useState('0')
  const allowance = useLuckyDrawAllowance()
  const { onApprove, loading: approving } = useLuckyDrawApprove()

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.currentTarget
    setTimes(inputValue.replace(/[^0-9,]+/g, ''))
  }

  const handleSelectMax = useCallback(() => {
    const estimatedTimes = Math.floor(goudaBalance.toNumber() / goudaPerTime)
    setTimes((estimatedTimes > MAX_TIMES ? MAX_TIMES : estimatedTimes).toString())
  }, [goudaBalance, setTimes, goudaPerTime])

  const outOfMax = Number(times) > MAX_TIMES
  const disabled = Number(times) < 1

  return <CardOutter key={type}>
    <CardBorder />
    <CardHeader style={{
      borderRadius: '12px 12px 0 0 ',
      padding: 0
    }}>
      <Flex alignItems="center" justifyContent="space-between">
        <img style={{ borderRadius: '12px 12px 0 0 '}} src={`/images/luckydraw/${type}.png`} alt="cowswap" />
      </Flex>
    </CardHeader>
    <CardBody>
    {!allowance.toNumber() ? 
      <Button variant="subtle" disabled={approving} width="100%" onClick={onApprove} endIcon={approving ? <AutoRenewIcon spin color="currentColor" /> : null}>
        {approving ? 'Approving ...' : 'Approve'}
      </Button>
      : account ? <>
      <SpinInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={times}
        max={goudaBalance}
        symbol="GOUDA"
        inputTitle="buy"
      />
      <Text fontSize="12px" color="textSubtle" textAlign="left">~{Number(times) * goudaPerTime} GOUDA</Text>
      <Button
        variant="subtle"
        mt="5px"
        width="100%"
        isLoading={spinLoading}
        disabled={spinLoading || disabled || outOfMax}
        onClick={() => handleDraw(type, times)}
        endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : <TicketIcon color="currentColor" />}
      >
        {outOfMax ? `Out of maximum (${MAX_TIMES})` : 'Spin'}
      </Button>
      </> :
      <Button
        variant="success"
        mt="20px"
        width="100%"
        disabled
      >
        Wallet is not connected
      </Button>
    }
    </CardBody>
  </CardOutter>
}

export default RoundCard