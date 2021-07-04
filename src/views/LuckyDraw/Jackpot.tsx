import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Button, AutoRenewIcon, Card, CardBody, CardHeader, Flex, Heading, Toggle } from '@cowswap/uikit'
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

const MAX_TIMES = 100
const JACKPOT_TYPE = 0
const MAGIC_TYPE = 1

const JackpotNftAction = ({ jackpotNft, spinLoading, claimJackpot }) => {
  const allowanceJackpotNft = useLuckyDrawNFTAllowance(jackpotNft.tokenId)
  const { onApprove: onApproveJackpotNFT, loading: approvingJackpotNFT } = useLuckyDrawNFTApprove(jackpotNft ? jackpotNft.tokenId : -1)
  return (
    <div>
      {allowanceJackpotNft ? (<>
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
        <Button variant="subtle" mt="15px" disabled={approvingJackpotNFT} width="100%" onClick={onApproveJackpotNFT} endIcon={approvingJackpotNFT ? <AutoRenewIcon spin color="currentColor" /> : null}>
          {approvingJackpotNFT ? 'Approving ...' : 'Approve'}
        </Button>
      </>}
    </div>
  )
}

const MagicNftAction = ({ magicNft, spinLoading, handleDraw }) => {
  const allowanceMagicNft = useLuckyDrawNFTAllowance(magicNft.tokenId)
  const { onApprove: onApproveMagicNft, loading: approvingMagicNft } = useLuckyDrawNFTApprove(magicNft.tokenId)
  const cardHeader = (
    <div>
      <Heading size="md" mb="15px">
        Use Magic NFT
      </Heading>
      <Text color="textSubtle">
        Token id: {magicNft.tokenId.toNumber()}
      </Text>
    </div>
  )
  return (
    <div>
      {allowanceMagicNft ? (<>
        {cardHeader}
        <Button
          variant="subtle"
          width="100%"
          mt="15px"
          isLoading={spinLoading}
          disabled={spinLoading}
          onClick={() => handleDraw(magicNft.tokenId)}
          endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : <TicketIcon color="currentColor" />}
        >
          Spin
        </Button>
        </>) :
      <>
        {cardHeader}
        <Button variant="subtle" mt="15px" disabled={approvingMagicNft} width="100%" onClick={onApproveMagicNft} endIcon={approvingMagicNft ? <AutoRenewIcon spin color="currentColor" /> : null}>
          {approvingMagicNft ? 'Approving ...' : 'Approve'}
        </Button>
      </>}
    </div>
  )
}

const Jackpot = ({ handleDraw, spinLoading, goudaBalance, claimJackpot, nfts, spinByMagicNft, bigJackpot }) => {
  const magicNft = nfts.find(({ type }) => type === MAGIC_TYPE)
  const jackpotNft = nfts.find(({ type }) => type === JACKPOT_TYPE)
  const [jackpotTimes, setJackpotTimes] = useState('0')
  const [magicPayment, setMagicPayment] = useState(false)
  const allowance = useLuckyDrawAllowance()
  const { onApprove, loading: approving } = useLuckyDrawApprove()

  useEffect(() => {
    setMagicPayment(Boolean(magicNft))
  }, [magicNft])

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
    if (jackpotNft) {
      return (<JackpotNftAction jackpotNft={jackpotNft} spinLoading={spinLoading} claimJackpot={claimJackpot} />)
    }
    if (magicPayment && magicNft) {
      return <MagicNftAction magicNft={magicNft} spinLoading={spinLoading} handleDraw={spinByMagicNft} />
    }
    return (
      <div>
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
              width="100%"
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
      </div>
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
          <img style={{ borderRadius: '12px 12px 0 0 '}} src='/images/luckydraw/jackpot.jpg' alt="cowswap" />
          <div style={{
            width: '100%',
            position: 'absolute',
            color: 'white',
            left: 20,
            top: 125
          }}>Jackpot: {bigJackpot.toNumber()}</div>
        </Flex>
      </CardHeader>
      <CardBody>
        {magicNft ?
          <Flex flexDirection="row-reverse" mb="15px" alignContent="center">
            <Toggle background-color="#323063" scale="sm" checked={magicPayment} onChange={() => setMagicPayment((prev) => !prev)} />
            <Text fontSize="14px" mr="5px">Magic NFT paid</Text>
          </Flex> :
          null
        }
        {renderAction()}
      </CardBody>
    </CardOutter>
  )
}

export default Jackpot
