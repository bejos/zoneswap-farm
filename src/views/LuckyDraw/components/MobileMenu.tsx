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
  IconButton,
} from '@cowswap/uikit'
import TicketIcon from '../icons/Nft'
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
`

const MobileMenu = ({setView, activeIndex, isMobile, jackpot}) => {
  const { swiper } = useSwiper()
  const { account } = useWeb3React()

  return (
    <StyledMobileMenu>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slidePrev()} disabled={activeIndex !== 0}>
          <ArrowBackIcon width="24px" color="#323063" />
        </IconButton>
      </ButtonNav>
      <TabNav>
        <ButtonMenu activeIndex={activeIndex} scale={isMobile ? 'sm' : 'md'} variant="subtle" onItemClick={setView}>
          <ButtonMenuItem>
            <Cards color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem style={{ position: 'relative'}}>
            <TicketIcon color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem disabled={!account}>
            <ChartIcon color="currentColor" />
          </ButtonMenuItem>
        </ButtonMenu>
      </TabNav>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slideNext()} disabled={activeIndex !== 0}>
          <ArrowForwardIcon width="24px" color="#323063" />
        </IconButton>
      </ButtonNav>
    </StyledMobileMenu>
  )
}

export default MobileMenu
