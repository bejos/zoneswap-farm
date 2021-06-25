/* eslint-disable no-nested-ternary */
import React, { useState, useCallback } from 'react'

import { Text, Button, AutoRenewIcon, Heading, CardBody, CardHeader, Card } from '@cowswap/uikit'
import { useLuckyDrawApprove } from 'hooks/useApprove'
import { useLuckyDrawAllowance } from 'hooks/useAllowance'

import TicketIcon from '../icons/Ticket'
import SpinInput from './SpinInput'

const MAX_TIMES = 200

const RoundCard = ({type, handleDraw, spinLoading, account, goudaBalance, goudaPerTime, label}) => {
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

  return <Card key={type}>
    <CardHeader>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <img width="120px" src={`../images/luckydraw/${type}.png`} alt="cowswap" />
        <Heading>{label}</Heading>
      </div>
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
  </Card>
}

export default RoundCard