import React from 'react'
import { ArrowBackIcon, ArrowForwardIcon, Card, IconButton } from '@cowswap/uikit'
import styled from 'styled-components'
import CowCardsSrc from '../icons/cowCardsIcon.png'
import useSwiper from '../hooks/useSwiper'

const StyledPrevNextNav = styled(Card)`
  align-items: center;
  display: none;
  justify-content: space-between;
  overflow: initial;
  position: relative;
  width: 128px;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

const Icon = styled.div`
  cursor: pointer;
  left: 50%;
  margin-left: -32px;
  position: absolute;
`

const PrevNextNav = () => {
  const { swiper } = useSwiper()

  const handlePrevSlide = () => {
    swiper.slidePrev()
  }

  const handleNextSlide = () => {
    swiper.slideNext()
  }

  return (
    <StyledPrevNextNav>
      <IconButton variant="text" scale="sm" onClick={handlePrevSlide}>
        <ArrowBackIcon color="#323063" width="24px" />
      </IconButton>
      <Icon>
        <img src={CowCardsSrc} alt="cowswap" />
      </Icon>
      <IconButton variant="text" scale="sm" onClick={handleNextSlide}>
        <ArrowForwardIcon color="#323063" width="24px" />
      </IconButton>
    </StyledPrevNextNav>
  )
}

export default PrevNextNav
