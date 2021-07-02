import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@cowswap/uikit'
import MobileMenu from './components/MobileMenu'
import Rankings from './Rankings'
import Draws from './Draws'
import BigJackpot from './Jackpot'
// import { ErrorNotification, PauseNotification } from './components/Notification'


const StyledMobile = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const View = styled.div<{ isVisible: boolean }>`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`

const Mobile = ({ claimJackpot, handleDraw, goudaBalance, spinLoading, account, topWinnersWithBalance, isMobile, typeRankings, handleTypeRankingsClick, nfts, spinByMagicNft }) => {
  const [activeIndex, setView] = useState(0)

  return (
    <StyledMobile>
      <Box height="100%" overflow="hidden" position="relative">
        <View isVisible={activeIndex === 0}>
          <Flex alignItems="center" height="100%">
            <Draws isMobile spinByMagicNft={spinByMagicNft}  nfts={nfts} claimJackpot={claimJackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} />
          </Flex>
        </View>
        <View isVisible={activeIndex === 1}>
          <Flex flexDirection="column" alignItems="center" height="100%" justifyContent="center">
            <BigJackpot spinByMagicNft={spinByMagicNft}  nfts={nfts} claimJackpot={claimJackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} />
          </Flex>
        </View>
        <View isVisible={activeIndex === 2}>
          <Flex alignItems="center" height="100%" justifyContent="center">
            <Rankings handleTypeRankingsClick={handleTypeRankingsClick} typeRankings={typeRankings} isMobile={isMobile} topWinnersWithBalance={topWinnersWithBalance} />
          </Flex>
        </View>
      </Box>
      <MobileMenu isMobile={isMobile} setView={setView} activeIndex={activeIndex} />
    </StyledMobile>
  )
}

export default Mobile
