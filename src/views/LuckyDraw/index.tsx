import React, { useState, useCallback, useMemo, useEffect } from 'react'
import Confetti from 'react-confetti'
import BigNumber from 'bignumber.js';
import { useMatchBreakpoints } from '@cowswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { getLuckyDrawContract, getLuckyDrawNFTContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getLuckyDrawAddress, getAddress, getLuckyDrawNFTAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import useToast from 'hooks/useToast'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import styled from 'styled-components'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import luckyDrawAbi from 'config/abi/luckyDraw.json'
import luckyDrawNftAbi from 'config/abi/luckyDrawNFT.json'
import { BIG_ZERO } from 'utils/bigNumber';
import { useERC20 } from 'hooks/useContract'
import SwiperProvider from './context/SwiperProvider'
import Container from './components/Container'
import Desktop from './Desktop'
import Mobile from './Mobile'

const StyledImage = styled.img`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: -1;
  opacity: 0.8;
`

const JACKPOT_TYPE = 0
const MAGIC_TYPE = 1

const LuckyDraw = () => {
  const { isLg, isXl } = useMatchBreakpoints()
  const isDesktop = isLg || isXl

  const web3 = useWeb3()
  const { toastSuccess, toastError } = useToast()
  const [confettiShown, setConfettiShown] = useState(false)
  const [wonGouda, setWonGouda] = useState(undefined)
  const [nfts, setNfts] = useState([])
  const [topWinners, setTopWinners] = useState([])
  const [topPlayers, setTopPlayers] = useState([])
  const [topWinnersWithBalance, setTopWinnersWithBalance] = useState([])
  const { currentBlock } = useBlock()
  const { account } = useWeb3React()
  const [typeRankings, setTypeRankings] = useState(0);
  const [spinLoading, setSpinLoading] = useState(false)
  const [goudaBalance, setGoudaBalance] = useState(BIG_ZERO)
  const [bigJackpot, setBigJackpot] = useState(BIG_ZERO)

  const luckyDrawAddress = getLuckyDrawAddress()
  const luckyDrawNFTAddress = getLuckyDrawNFTAddress()

  const goudaContract = useERC20(getAddress(tokens.cow.address))

  const luckyDrawContract = useMemo(() => {
    return getLuckyDrawContract(luckyDrawAddress, web3)
  }, [luckyDrawAddress, web3])

  const luckyDrawNFTContract = useMemo(() => {
    return getLuckyDrawNFTContract(luckyDrawNFTAddress, web3)
  }, [luckyDrawNFTAddress, web3])

  const handleTypeRankingsClick = (newIndex) => setTypeRankings(newIndex)

  const fetchNftJackpot = useCallback(async () => {
    const nftBalance = await luckyDrawNFTContract.methods.balanceOf(account).call()
    const tokenIdCalls= Array.from(Array(Number(nftBalance)).keys()).map(index => ({
      address: luckyDrawNFTAddress,
      name: 'tokenOfOwnerByIndex',
      params: [account, index],
    }))

    const tokenIds = await multicall(luckyDrawNftAbi, tokenIdCalls).catch(error => {
       // eslint-disable-next-line no-console
      console.debug({
        error,
        method: 'tokenOfOwnerByIndex'
      })
      return []
    })

    if (!tokenIds) {
      return {}
    }

    const metadataCalls = tokenIds.map(tokenId => ({
      address: luckyDrawNFTAddress,
      name: 'metadatas',
      params: [new BigNumber(tokenId).toNumber()],
    }))

    const metadatas = await multicall(luckyDrawNftAbi, metadataCalls).catch(error => {
       // eslint-disable-next-line no-console
      console.debug({
        error,
        method: 'metadatas',
        metadataCalls,
      })
      return []
    })

    const result = metadatas.map(({ image, _type }, index) => {
      try {
        return {
          image,
          type: _type.toNumber(),
          tokenId: tokenIds[index][0]
        }
      } catch (err) {
        return []
      }
    }).filter(i => i)

    setNfts(result)
    return result
  }, [account, luckyDrawNFTContract, luckyDrawNFTAddress])

  useEffect(() => {
    try {
      if (account) {
        luckyDrawContract.methods.bigJackpot().call()
          .then(balance => {
            setBigJackpot(new BigNumber(balance).div(DEFAULT_TOKEN_DECIMAL))
          })
        luckyDrawContract.methods.getTop10Winner().call()
          .then(resp => {
            setTopWinners(resp)
          })
        luckyDrawContract.methods.getTop10Player().call()
          .then(resp => {
            setTopPlayers(resp)
          })
        luckyDrawContract.methods.getUser(account).call()
          .then(([, won]) => {
            setWonGouda(won)
          })
        goudaContract.methods.balanceOf(account).call()
          .then(balance => {
            setGoudaBalance(new BigNumber(balance).div(DEFAULT_TOKEN_DECIMAL))
          })
        fetchNftJackpot()
      }
    } catch (error) {
      console.error(error)
    }
  }, [luckyDrawContract, account, currentBlock, goudaContract, luckyDrawNFTContract, fetchNftJackpot])

  useEffect(() => {
    try {
      if (account) {
        const list = typeRankings ? topPlayers : topWinners
        const calls = list.map(address => ({
          address: luckyDrawAddress,
          name: 'getUser',
          params: [address],
        }))
        multicall(luckyDrawAbi, calls).then(resp => {
          setTopWinnersWithBalance(list.map((address, index) => {
            return {
              address,
              won: new BigNumber(resp[index][0][typeRankings]._hex).div(DEFAULT_TOKEN_DECIMAL).toNumber()
          }}).sort((a, b) => a.won < b.won ? 1 : -1))
        })
      }
    } catch (error) {
      console.error(error)
    }
    
  }, [currentBlock, luckyDrawContract, account, luckyDrawAddress, topWinners, topPlayers, typeRankings])

  const claimJackpot = useCallback(async () => {
    try {
      const tokenId = await luckyDrawNFTContract.methods.tokenOfOwnerByIndex(account, 0).call()
      setSpinLoading(true)
      await luckyDrawContract.methods.claimBigJackpot(tokenId)
        .send({ from: account, gas: 200000 })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })

      setSpinLoading(false)
      setConfettiShown(true)
      setTimeout(() => setConfettiShown(false), 5000)
      return toastSuccess(
        'Lucky Draw',
        `Congratulations! You have claimed NFT`,
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.debug(e)
      toastError('Claim BigJackpot', 'Please try again !')
      return setSpinLoading(false)
    }
  }, [luckyDrawContract, luckyDrawNFTContract, account, setSpinLoading, toastError, toastSuccess])

  const spinByMagicNft = useCallback(async (tokenId) => {
    setSpinLoading(true)
    const gasAmount = await luckyDrawContract.methods.spinBigJackpotByMagicNFT(tokenId)
      .estimateGas({from: account, tokenId})
      // eslint-disable-next-line no-console
      .catch(error => console.debug({
        error,
        method: 'estimateGas'
      }))

    await luckyDrawContract.methods
      .spinBigJackpotByMagicNFT(tokenId)
      .send({ from: account, gas: Math.floor(gasAmount * 1.1), to: luckyDrawAddress })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
    
    const ntfs = await fetchNftJackpot()
    setSpinLoading(false)
    if (ntfs.find((item) => item.type === JACKPOT_TYPE)) {
      setConfettiShown(true)
      setTimeout(() => setConfettiShown(false), 5000)
      return toastSuccess(
        'Lucky Draw',
        `Congratulations! You Won Big Jackpot`,
      )
    }
    return toastError('Lucky Draw', 'Better luck next time!!!')
  }, [luckyDrawContract, account, luckyDrawAddress, setSpinLoading, fetchNftJackpot, toastSuccess, toastError])

  const handleDraw = useCallback(async (type, xtimes) => {
    try {
      setSpinLoading(true)
      const times = Number(xtimes)
      const isJackpotSpin = String(type) === String(JACKPOT_TYPE)
      const args = String(type) === String(MAGIC_TYPE) ? [times] : [type, times]
      const gasAmount = await luckyDrawContract.methods.randoms(...args)
        .estimateGas({from: account, ...args})
        // eslint-disable-next-line no-console
        .catch(error => console.debug({
          error,
          method: 'estimateGas'
        }))

      // eslint-disable-next-line no-console
      console.debug({
        args,
        gasAmount
      })

      await luckyDrawContract.methods
        .randoms(...args)
        .send({ from: account, gas: Math.floor(gasAmount * 1.2), to: luckyDrawAddress })
        .on('transactionHash', (tx) => {
          return tx.transactionHash
        })

      const [, resWon] = await luckyDrawContract.methods.getUser(account).call()
      const wonThisRound = new BigNumber(resWon - wonGouda).div(DEFAULT_TOKEN_DECIMAL)
      
      const resGoudaBalance = await goudaContract.methods.balanceOf(account).call()

      setGoudaBalance(new BigNumber(resGoudaBalance).div(DEFAULT_TOKEN_DECIMAL))
      
      setSpinLoading(false)

      if (!isJackpotSpin && resWon > wonGouda) {
        setWonGouda(resWon)
        setConfettiShown(true)
        setTimeout(() => setConfettiShown(false), 5000)
        return toastSuccess(
          'Lucky Draw',
          `Congratulations! You Won ${wonThisRound} Gouda`,
        )
      }
      if (isJackpotSpin) {
        const ntfs = await fetchNftJackpot()
        
        if (ntfs.find((item) => item.type === JACKPOT_TYPE)) {
          setConfettiShown(true)
          setTimeout(() => setConfettiShown(false), 5000)
          return toastSuccess(
            'Lucky Draw',
            `Congratulations! You Won Big Jackpot`,
          )
        }
      }
      return toastError('Lucky Draw', 'Better luck next time!!!')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.debug(e)
      toastError('Lucky Draw', 'Please try again !')
      return setSpinLoading(false)
    }
  }, [wonGouda, luckyDrawContract, account, luckyDrawAddress, setSpinLoading, toastSuccess, toastError, goudaContract, fetchNftJackpot])


  return (
    <>
      <SwiperProvider>
        <Container>
          {confettiShown ? <Confetti /> : null}
          {isDesktop ? 
            <Desktop bigJackpot={bigJackpot} nfts={nfts} spinByMagicNft={spinByMagicNft} claimJackpot={claimJackpot} typeRankings={typeRankings} handleTypeRankingsClick={handleTypeRankingsClick} topWinnersWithBalance={topWinnersWithBalance} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} /> :
            <Mobile bigJackpot={bigJackpot} nfts={nfts} spinByMagicNft={spinByMagicNft} claimJackpot={claimJackpot} isMobile typeRankings={typeRankings} handleTypeRankingsClick={handleTypeRankingsClick} topWinnersWithBalance={topWinnersWithBalance} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} />
          }
        </Container>
      </SwiperProvider>
      <StyledImage src="/images/green-field.svg" />
    </>
  )
}

export default LuckyDraw
