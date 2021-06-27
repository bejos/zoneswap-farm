import React, { useState } from 'react'
import { Flex, Box } from '@cowswap/uikit'
import styled from 'styled-components'
import MobileMenu from './components/MobileMenu'
import Rankings from './Rankings'
import Draws from './Draws'
import BigJackpot from './Jackpot'

const StyledDesktop = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
`

const View = styled.div<{ isVisible: boolean }>`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  justify-content: center;
`

const LuckyDraw = ({ claimJackpot, handleDraw, goudaBalance, spinLoading, account, topWinnersWithBalance, typeRankings, handleTypeRankingsClick, nftBalance }) => {
  const [activeIndex, setView] = useState(0)
  return (
    <>
      <StyledDesktop>
        <Box height="100%" overflow="hidden" position="relative">
          <View isVisible={activeIndex === 0}>
            <Flex alignItems="center" height="100%">
              <Draws claimJackpot={claimJackpot} nftBalance={nftBalance} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} />
            </Flex>
          </View>
          <View isVisible={activeIndex === 1}>
            <Flex alignItems="center" height="100%" justifyContent="center">
              <BigJackpot claimJackpot={claimJackpot} nftBalance={nftBalance} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} />
            </Flex>
          </View>
          <View isVisible={activeIndex === 2}>
            <Flex alignItems="center" height="100%" justifyContent="center">
              <Rankings handleTypeRankingsClick={handleTypeRankingsClick} typeRankings={typeRankings} isMobile={false} topWinnersWithBalance={topWinnersWithBalance} />
            </Flex>
          </View>
        </Box>
        <MobileMenu isMobile={false} setView={setView} activeIndex={activeIndex} />
      </StyledDesktop>
    </>
  )
}

export default LuckyDraw
