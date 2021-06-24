/* eslint-disable no-nested-ternary */
import React, { useState, useCallback } from 'react'

import { Text, Button, AutoRenewIcon, Flex, Heading, CardBody, CardHeader, Card } from '@cowswap/uikit'
import { useLuckyDrawApprove } from 'hooks/useApprove'
import { useLuckyDrawAllowance } from 'hooks/useAllowance'
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
      <Flex justifyContent="center" alignItems="center">
        <Heading mb="20px">{label}</Heading>
      </Flex>
    </CardHeader>
    <CardBody>
    {!allowance.toNumber() ? 
      <Button disabled={approving} width="100%" onClick={onApprove} endIcon={approving ? <AutoRenewIcon spin color="currentColor" /> : null}>
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
      <Text color="textSubtle" textAlign="left">~{Number(times) * goudaPerTime} GOUDA</Text>
      <Button
        mt="20px"
        width="100%"
        isLoading={spinLoading}
        disabled={spinLoading || disabled || outOfMax}
        onClick={() => handleDraw(type, times)}
        endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
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