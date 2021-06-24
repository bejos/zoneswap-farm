import React from 'react'
import Lottie from 'react-lottie';
import { Heading, BaseLayout, Image, LinkExternal } from '@cowswap/uikit'
import styled from 'styled-components'
import Page from 'components/layout/Page'
import Rankings from './Rankings'
import Draws from './Draws'
import BigJackpot from './Jackpot'
import luckyCow from './images/luckyCow-animation.json'
import feedMeSrc from './images/feed-me.png'
import fieldSrc from './images/field.png'

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
  margin-top: 15px;
  margin-bottom: 15px;

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

const LuckyDraw = ({ handleDraw, goudaBalance, spinLoading, account, jackpot, topWinnersWithBalance, typeRankings, handleTypeRankingsClick}) => {

  return (
    <>
      <PageStyled>
        <Heading as="h1" textAlign="left" size="xl" color="text">
          Lucky draw <LinkExternal href="https://docs.cowswap.app/products/gamble">Learn more</LinkExternal>
        </Heading>
        {spinLoading ? <Lottie options={defaultOptions}
          width={250}
        /> : <Image mx="auto"
          src={feedMeSrc}
          alt="lucky-draw"
          width={250}
          height={250}/>}
        <Cards>
          <BigJackpot isMobile={false} jackpot={jackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} />
          <Rankings handleTypeRankingsClick={handleTypeRankingsClick} typeRankings={typeRankings} isMobile={false} topWinnersWithBalance={topWinnersWithBalance} />
        </Cards>
        <Draws handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} account={account} />
      </PageStyled>
      <StyledImage src={fieldSrc} />
    </>
  )
}

export default LuckyDraw
