import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ButtonMenu,
  ButtonMenuItem,
  Cards,
  ChartIcon,
  HistoryIcon,
  IconButton,
} from '@cowswap/uikit'
import useSwiper from '../hooks/useSwiper'

const ButtonNav = styled.div`
  flex: none;
`

const TabNav = styled.div`
  flex: 1;
  text-align: center;
`

const StyledMobileMenu = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex: none;
  height: 64px;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const MobileMenu = ({setView, activeIndex}) => {
  const { swiper } = useSwiper()
  const { account } = useWeb3React()

  return (
    <StyledMobileMenu>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slidePrev()} disabled={activeIndex !== 0}>
          <ArrowBackIcon width="24px" color="primary" />
        </IconButton>
      </ButtonNav>
      <TabNav>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle" onItemClick={setView}>
          <ButtonMenuItem>
            <Cards color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem>
            <ChartIcon color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem disabled={!account}>
            <HistoryIcon color="currentColor" />
          </ButtonMenuItem>
        </ButtonMenu>
      </TabNav>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slideNext()} disabled={activeIndex !== 0}>
          <ArrowForwardIcon width="24px" color="primary" />
        </IconButton>
      </ButtonNav>
    </StyledMobileMenu>
  )
}

export default MobileMenu
