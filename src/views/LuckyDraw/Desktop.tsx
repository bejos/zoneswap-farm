import React, { useState } from 'react'
import { Flex, Box } from '@cowswap/uikit'
import styled from 'styled-components'
import MobileMenu from './components/MobileMenu'
import Menu from './components/Menu'
import Rankings from './Rankings'
import Draws from './Draws'
import BigJackpot from './Jackpot'

const PositionsPane = styled.div`
  align-items: center;
  display: flex;
  min-height: 50px;
`

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

const LuckyDraw = ({ claimJackpot, handleDraw, goudaBalance, spinLoading, account, topWinnersWithBalance, typeRankings, handleTypeRankingsClick, nfts, spinByMagicNft, bigJackpot }) => {
  const [activeIndex, setView] = useState(0)
  return (
    <>
      <StyledDesktop>
        <Box height="100%" overflow="hidden" position="relative">
          <View isVisible={activeIndex === 0}>
            <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
              <PositionsPane>
                <Menu />
              </PositionsPane>
              <Draws bigJackpot={bigJackpot} isMobile={false} spinByMagicNft={spinByMagicNft}  nfts={nfts} claimJackpot={claimJackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} />
            </Flex>
          </View>
          <View isVisible={activeIndex === 1}>
            <Flex flexDirection="column" alignItems="center" height="100%" justifyContent="center">
              <BigJackpot bigJackpot={bigJackpot} spinByMagicNft={spinByMagicNft}  nfts={nfts} claimJackpot={claimJackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} />
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
