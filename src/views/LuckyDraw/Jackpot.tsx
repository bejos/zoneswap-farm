import React, { useState, useCallback } from 'react'
import { Text, Button, AutoRenewIcon, Card, Image, CardBody, CardHeader } from '@cowswap/uikit'
import styled from 'styled-components'
import { useLuckyDrawApprove } from 'hooks/useApprove'
import { useLuckyDrawAllowance } from 'hooks/useAllowance'
import bullSrc from './images/02.png'
import TicketIcon from './icons/Ticket'
import SpinInput from './components/SpinInput'
import goudaJackpotSrc from './images/gouda.png'

const FlexColumn = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px
`

const MAX_TIMES = 200

const Jackpot = ({ handleDraw, spinLoading, jackpot, goudaBalance, isMobile}) => {
  const [jackpotTimes, setJackpotTimes] = useState('0')
  const allowance = useLuckyDrawAllowance()
  const { onApprove, loading: approving } = useLuckyDrawApprove()
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

  return (
    <Card style={{
      width: isMobile ? "90%" : "500px"
    }}>
      <CardHeader style={{
        // color: "#FFA600",
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <img width="150px" src={bullSrc} alt="cowswap" />
          <Text color="#FFA600" fontSize="30px" mb="15px">
            Big Jackpot
          </Text>
        </div>
      </CardHeader>
      <CardBody>
        <FlexColumn>
          <Image src={goudaJackpotSrc} alt="gouda" width={50} height={50} />
          <div style={{ marginLeft: 30 }}>
            <Text color="textSubtle">Total prize:</Text>
            <Text fontSize="22px">{jackpot}</Text>
          </div>
        </FlexColumn>
        {allowance.toNumber() ? (<>
          <SpinInput
            onSelectMax={handleSelectMaxJackpot}
            onChange={handleChangeJackpot}
            value={jackpotTimes}
            max={goudaBalance.toString()}
            symbol="GOUDA"
            inputTitle="buy"
          />
          <Text fontSize="14px" color="textSubtle" textAlign="left">~{Number(jackpotTimes)} GOUDA</Text>
          <Button
            style={disabled || outOfMax ? {} : {
              color: "#FFA600"
            }}
            variant="subtle"
            width="100%"
            mt="15px"
            isLoading={spinLoading}
            disabled={spinLoading || disabled || outOfMax}
            onClick={() => handleDraw('0', jackpotTimes)}
            endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : <TicketIcon color="currentColor" />}
          >
            {outOfMax ? `Out of maximum (${MAX_TIMES})` : 'SPIN'}
          </Button>
          </>): 
        <Button mt="15px" disabled={approving} width="100%" onClick={onApprove} endIcon={approving ? <AutoRenewIcon spin color="currentColor" /> : null}>
          {approving ? 'Approving ...' : 'Approve'}
        </Button>}
      </CardBody>
    </Card>
  )
}

export default Jackpot
