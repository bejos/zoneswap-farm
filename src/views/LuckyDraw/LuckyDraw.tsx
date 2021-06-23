import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Lottie from 'react-lottie';
import BigNumber from 'bignumber.js';
import { Flex, Heading, Text, Button, AutoRenewIcon, BaseLayout, Card, Image, MetamaskIcon, CardBody, ButtonMenu, ButtonMenuItem, NotificationDot } from '@cowswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useWeb3React } from '@web3-react/core'
import { getLuckyDrawContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { useLuckyDrawApprove } from 'hooks/useApprove'
import { getLuckyDrawAddress, getAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import useToast from 'hooks/useToast'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import { BASE_BSC_SCAN_URL, BASE_URL, DEFAULT_TOKEN_DECIMAL } from 'config'
import luckyDrawAbi from 'config/abi/luckyDraw.json'
import { registerToken } from 'utils/wallet'
import { BIG_ZERO } from 'utils/bigNumber';
import { useERC20 } from 'hooks/useContract'
import { useLuckyDrawAllowance } from 'hooks/useAllowance'
import SpinInput from './components/SpinInput'
import luckyCow from './images/luckyCow-animation.json'
import feedMeSrc from './images/feed-me.png'
import fieldSrc from './images/field.png'
import goudaJackpotSrc from './images/gouda.png'

const goudaSrc = `${BASE_URL}/images/tokens/GOUDA.png`

const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: luckyCow,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const PageStyled = styled(Page)`
  ${({ theme }) => theme.mediaQueries.xs} {
    background-image: url(${fieldSrc});
    background-size: cover;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    background-image: none;
  }
  background-image: none;
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-top: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const StyledImage = styled.img`
  ${({ theme }) => theme.mediaQueries.xs} {
    display: none;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: -1;
  }
`

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 32px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
  margin-top: 25px;
`

const CardHeading = styled(Flex)`
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  svg {
    margin-right: 4px;
  }
  h2 {
    font-size: 27px !important
  }
`

const FlexColumn = styled.div`
  display: flex;
  flex-direction: row;
  .balance {
    display: flex;
    flex-direction: row;
  }
`

const FlexJackpotColumn = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  div:first-child {
    flex-grow: 1
  }
`

const draws = [
  {
    label: 'Win 500 Gouda',
    type: 500
  },
  {
    label: 'Win 100 Gouda',
    type: 100
  },
  {
    label: 'Win 10 Gouda',
    type: 10
  },
]

const factoryColor = {
  '10': '#e67b57',
  '100': '#7c7c89',
  '500': '#FFB130',
}

const factoryTime = {
  '10': 1,
  '100': 2,
  '500': 4,
}

const BigJackpot = ({ goudaBalance, jackpot, spinLoading, handleDraw }) => {
  const [jackpotTimes, setJackpotTimes] = useState('0')
  const allowance = useLuckyDrawAllowance()
  const { onApprove, loading: approving } = useLuckyDrawApprove()
  const handleChangeJackpot = (e: React.FormEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.currentTarget
    setJackpotTimes(inputValue.replace(/[^0-9,]+/g, ''))
  }

  const handleSelectMaxJackpot = useCallback(() => {
    setJackpotTimes(Math.floor(goudaBalance.toNumber() / 1).toString())
  }, [goudaBalance, setJackpotTimes])

  return (
    <Card>
      <CardBody>
        <Text fontSize="20px" mb="24px">
          Big Jackpot
        </Text>
        <FlexColumn>
          <Image src={goudaJackpotSrc} alt="gouda" width={85} height={85} />
          <div style={{ marginLeft: 20 }}>
            <Text color="textSubtle">Total prize:</Text>
            <Text fontSize="30px">{jackpot}</Text>
          </div>
        </FlexColumn>
        {allowance.toNumber() ? (<><FlexJackpotColumn style={{ justifyContent: "space-between" }}>
          <SpinInput
            onSelectMax={handleSelectMaxJackpot}
            onChange={handleChangeJackpot}
            value={jackpotTimes}
            max={goudaBalance.toString()}
            symbol="GOUDA"
            inputTitle="buy"
          />
          <Button
            // variant="success"
            height="89px"
            ml="20px"
            isLoading={spinLoading}
            disabled={spinLoading}
            onClick={() => handleDraw('0', jackpotTimes)}
            endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
          >
            Spin
          </Button>
        </FlexJackpotColumn>
        <Text color="textSubtle" textAlign="left">~{Number(jackpotTimes)} GOUDA</Text></>) : 
          <Button mt="20px" disabled={approving} width="100%" onClick={onApprove} endIcon={approving ? <AutoRenewIcon spin color="currentColor" /> : null}>
            {approving ? 'Approving ...' : 'Approve'}
          </Button>}
      </CardBody>
    </Card>
  )
}

const LuckyDrawActions = ({type, handleDraw, spinLoading, account, goudaBalance}) => {
  const [times, setTimes] = useState('0')
  const allowance = useLuckyDrawAllowance()
  const { onApprove, loading: approving } = useLuckyDrawApprove()

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.currentTarget
    setTimes(inputValue.replace(/[^0-9,]+/g, ''))
  }

  const handleSelectMax = useCallback(() => {
    setTimes(Math.floor(goudaBalance.toNumber() / factoryTime[type]).toString())
  }, [goudaBalance, setTimes, type])

  if (!allowance.toNumber()) {
    return (
      <Button disabled={approving} width="100%" onClick={onApprove} endIcon={approving ? <AutoRenewIcon spin color="currentColor" /> : null}>
        {approving ? 'Approving ...' : 'Approve'}
      </Button>
    )
  }

  if (account) {
    return (<>
      <SpinInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={times}
        max={goudaBalance}
        symbol="GOUDA"
        inputTitle="buy"
      />
      <Text color="textSubtle" textAlign="left">~{Number(times) * factoryTime[type]} GOUDA</Text>
      <Button
        // variant="success"
        mt="20px"
        width="100%"
        isLoading={spinLoading}
        disabled={spinLoading}
        onClick={() => handleDraw(type, times)}
        endIcon={spinLoading ? <AutoRenewIcon spin color="currentColor" /> : null}
      >
        Spin
      </Button>
    </>)
  }
  return <Button
    variant="success"
    mt="20px"
    width="100%"
    disabled
  >
    Wallet is not connected
  </Button>
}

const LuckyDraw: React.FC = () => {
  const web3 = useWeb3()
  const { toastSuccess, toastError } = useToast()
  const [wonGouda, setWonGouda] = useState(undefined)
  const [jackpot, setJackpot] = useState('0,0')
  const [topWinners, setTopWinners] = useState([])
  const [topPlayers, setTopPlayers] = useState([])
  const [topWinnersWithBalance, setTopWinnersWithBalance] = useState([])
  const { currentBlock } = useBlock()
  const { account } = useWeb3React()
  const [typeRankings, setTypeRankings] = useState(0);
  const [spinLoading, setSpinLoading] = useState(false)
  const [goudaBalance, setGoudaBalance] = useState(BIG_ZERO)

  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const luckyDrawAddress = getLuckyDrawAddress()

  const goudaContract = useERC20(getAddress(tokens.cow.address))

  const luckyDrawContract = useMemo(() => {
    return getLuckyDrawContract(luckyDrawAddress, web3)
  }, [luckyDrawAddress, web3])

  const handleTypeRankingsClick = (newIndex) => setTypeRankings(newIndex)

  useEffect(() => {
    try {
      if (account) {
        luckyDrawContract.methods.getTop10Winner().call()
          .then(resp => {
            setTopWinners(resp)
          })
        luckyDrawContract.methods.getTop10Player().call()
          .then(resp => {
            setTopPlayers(resp)
          })
        luckyDrawContract.methods.bigJackpot().call()
          .then(resp => {
            setJackpot(new BigNumber(resp).div(DEFAULT_TOKEN_DECIMAL).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 }))
          })
        luckyDrawContract.methods.getUser(account).call()
          .then(([, won]) => {
            setWonGouda(won)
          })
        goudaContract.methods.balanceOf(account).call()
          .then(balance => {
            setGoudaBalance(new BigNumber(balance).div(DEFAULT_TOKEN_DECIMAL))
          })
      }
    } catch (error) {
      console.error(error)
    }
  }, [luckyDrawContract, account, currentBlock, goudaContract])

  useEffect(() => {
    try {
      if (account) {
        const calls = (typeRankings ? topPlayers : topWinners).map(address => ({
          address: luckyDrawAddress,
          name: 'getUser',
          params: [address],
        }))
        multicall(luckyDrawAbi, calls).then(resp => {
          setTopWinnersWithBalance(topWinners.map((address, index) => {
            return {
              address,
              won: new BigNumber(resp[index][0][typeRankings]._hex).div(DEFAULT_TOKEN_DECIMAL).toNumber()
          }}))
        })
      }
    } catch (error) {
      console.error(error)
    }
    
  }, [currentBlock, luckyDrawContract, account, luckyDrawAddress, topWinners, topPlayers, typeRankings])

  const handleDraw = useCallback(async (type, times) => {
    try {
      setSpinLoading(true)
      window.scrollTo(0, 200);
      const gasAmount = await luckyDrawContract.methods.randoms(type, times).estimateGas({from: account, to: luckyDrawAddress})

      await luckyDrawContract.methods
        .randoms(type, times)
        .send({ from: account, gas: gasAmount, to: luckyDrawAddress })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })

      const [, resWon] = await luckyDrawContract.methods.getUser(account).call()
      setSpinLoading(false)
      const wonThisRound = new BigNumber(resWon - wonGouda).div(DEFAULT_TOKEN_DECIMAL)

      if (resWon > wonGouda) {
        setWonGouda(resWon)
        return toastSuccess(
          'Lucky Draw',
          `Congratulations! You Won ${wonThisRound} Gouda`,
        )
      }
      return toastError('Lucky Draw', 'Better luck next time!!!')
    } catch (e) {
      toastError('Lucky Draw', 'Please try again !')
      return setSpinLoading(false)
    }
  }, [wonGouda, luckyDrawContract, account, luckyDrawAddress, setSpinLoading, toastSuccess, toastError])

  return (
    <>
      <PageStyled>
        <Heading as="h1" textAlign="center" size="xl" mb="24px" color="text">
          Lucky draw
        </Heading>
        {spinLoading ? <Lottie options={defaultOptions}
          width={250}
        /> : <Image mx="auto"
          src={feedMeSrc}
          alt="lucky-draw"
          width={250}
          height={250}/>}
        {account && isMetaMaskInScope && (
          <Flex justifyContent="center" style={{
            cursor: 'pointer',
          }} onClick={() => registerToken(getAddress(tokens.cow.address), 'GOUDA', 18, goudaSrc)}>
            <Text
              color="textSubtle"
              small
            >
              Add GOUDA to Metamask
            </Text>
            <MetamaskIcon ml="4px" />
          </Flex>
        )}
        <Cards>
          <BigJackpot
            goudaBalance={goudaBalance}
            handleDraw={handleDraw}
            spinLoading={spinLoading}
            jackpot={jackpot}
          />
          <Card>
            <CardBody>
              <FlexColumn style={{
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 15
              }}>
                <Text fontSize="20px" mb="24px">
                  Rankings
                </Text>
                <ButtonMenu activeIndex={typeRankings} onItemClick={handleTypeRankingsClick}>
                  <NotificationDot show={typeRankings === 0}>
                    <ButtonMenuItem>Top Players</ButtonMenuItem>
                  </NotificationDot>
                  <NotificationDot show={typeRankings === 1}>
                    <ButtonMenuItem>Top Winners</ButtonMenuItem>
                  </NotificationDot>
                </ButtonMenu>
              </FlexColumn>
              <FlexColumn style={{ justifyContent: "space-between" }}>
                <div className="ranking"><Text color="textSubtle">Ranks</Text></div>
                <div className="address"><Text color="textSubtle">Address</Text></div>
                <div className="balance">
                  <Text mr="5px" color="textSubtle">Balance</Text>
                </div>
              </FlexColumn>
              {topWinnersWithBalance.map((winner, index) => (
                <FlexColumn style={{ justifyContent: "space-between" }}>
                  <div className="ranking"><Text color="textSubtle">{index + 1}</Text></div>
                  <div className="address"><Text color="textSubtle"><a rel="noreferrer" target="_blank" href={`${BASE_BSC_SCAN_URL}/address/${winner.address}`}>{winner.address.substring(0, 11)}...{winner.address.slice(-4)}</a></Text></div>
                  <div className="balance"><Text color="textSubtle">{winner.won}</Text></div>
                </FlexColumn>
              ))}
            </CardBody>
          </Card>
        </Cards>
        <FlexLayout>
          {draws.map(({ label, type }) => {
            return <FCard key={type}>
              <CardHeading>
                <Flex justifyContent="center" alignItems="center">
                  <Heading color={factoryColor[type]} mb="20px">{label}</Heading>
                </Flex>
              </CardHeading>
              <LuckyDrawActions
                type={type}
                handleDraw={handleDraw}
                spinLoading={spinLoading}
                account={account}
                goudaBalance={goudaBalance}
              />
            </FCard>
          })}
        </FlexLayout>
      </PageStyled>
      <StyledImage src={fieldSrc} />
    </>
  )
}

export default LuckyDraw
