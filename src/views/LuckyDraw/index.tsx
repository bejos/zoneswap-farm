import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Confetti from 'react-confetti'
import BigNumber from 'bignumber.js';
import { useMatchBreakpoints } from '@cowswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getLuckyDrawContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getLuckyDrawAddress, getAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import useToast from 'hooks/useToast'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import luckyDrawAbi from 'config/abi/luckyDraw.json'
import { BIG_ZERO } from 'utils/bigNumber';
import { useERC20 } from 'hooks/useContract'
import SwiperProvider from './context/SwiperProvider'
import Container from './components/Container'
import Desktop from './Desktop'
import Mobile from './Mobile'

const LuckyDraw = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl

  const web3 = useWeb3()
  const { toastSuccess, toastError } = useToast()
  const [confettiShown, setConfettiShown] = useState(false)
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
      const gasAmount = await luckyDrawContract.methods.randoms(type, times).estimateGas({from: account, to: luckyDrawAddress})
      console.log({
        gasAmount
      })
      await luckyDrawContract.methods
        .randoms(type, times)
        .send({ from: account, gas: Math.floor(gasAmount * 1.2), to: luckyDrawAddress })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })

      const [, resWon] = await luckyDrawContract.methods.getUser(account).call()
      setSpinLoading(false)
      const wonThisRound = new BigNumber(resWon - wonGouda).div(DEFAULT_TOKEN_DECIMAL)

      if (resWon > wonGouda) {
        setWonGouda(resWon)
        setConfettiShown(true)
        setTimeout(() => setConfettiShown(false), 5000)
        return toastSuccess(
          'Lucky Draw',
          `Congratulations! You Won ${wonThisRound} Gouda`,
        )
      }
      return toastError('Lucky Draw', 'Better luck next time!!!')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.debug(e)
      toastError('Lucky Draw', 'Please try again !')
      return setSpinLoading(false)
    }
  }, [wonGouda, luckyDrawContract, account, luckyDrawAddress, setSpinLoading, toastSuccess, toastError])


  return (
    <SwiperProvider>
      <Container>
        {confettiShown ? <Confetti /> : null}
        {isDesktop ? <Desktop typeRankings={typeRankings} handleTypeRankingsClick={handleTypeRankingsClick} topWinnersWithBalance={topWinnersWithBalance} jackpot={jackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} />
        : <Mobile isMobile typeRankings={typeRankings} handleTypeRankingsClick={handleTypeRankingsClick} topWinnersWithBalance={topWinnersWithBalance} jackpot={jackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} />}
      </Container>
    </SwiperProvider>
  )
}

export default LuckyDraw
