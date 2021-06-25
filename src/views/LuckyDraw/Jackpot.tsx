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
  margin-bottom: 15px;
  width: 100%
`

const MAX_TIMES = 200

const Jackpot = ({ handleDraw, spinLoading, jackpot, goudaBalance }) => {
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
    <Card>
      <CardHeader style={{
        // color: "#FFA600",
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <FlexColumn>
            <div>
              <Text fontSize="22px" color="#FFA600"> BIG JACKPOT</Text>
              <Image src={goudaJackpotSrc} alt="gouda" width={60} height={60} />
              <Text fontSize="20px">Prize: {jackpot}</Text>
            </div>
          </FlexColumn>
          <img width="100px" src={bullSrc} alt="cowswap" />
        </div>
      </CardHeader>
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
        <Button variant="subtle" mt="15px" disabled={approving} width="100%" onClick={onApprove} endIcon={approving ? <AutoRenewIcon spin color="currentColor" /> : null}>
          {approving ? 'Approving ...' : 'Approve'}
        </Button>}
      </CardBody>
    </Card>
  )
}

export default Jackpot
