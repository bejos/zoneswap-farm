import React from 'react'
import styled from 'styled-components'
import SwiperCore, { Mousewheel, EffectCoverflow } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@cowswap/uikit'
import 'swiper/swiper.min.css'
import "swiper/components/effect-coverflow/effect-coverflow.min.css"
import BigJackpot from './Jackpot'
import RoundCard from './components/RoundCard'
import useSwiper from './hooks/useSwiper'
import useOnNextRound from './hooks/useOnNextRound'

SwiperCore.use([Mousewheel, EffectCoverflow])

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
    padding: 15px 0;
  }

  .swiper-slide {
    width: 320px;
  }
`

const prizes = [
  {
    label: '500 Gouda',
    type: 500
  },
  {
    label: '100 Gouda',
    type: 100
  },
  {
    label: 'Magic Gouda',
    type: 1
  },
  {
    label: '50 Gouda',
    type: 50
  },
  {
    label: '10 Gouda',
    type: 10
  },
  {
    label: '5 Gouda',
    type: 5
  },
]

const factoryTime = {
  '1': 5,
  '5': 1,
  '10': 1,
  '100': 2,
  '50': 1,
  '500': 4,
}

const SwiperWeb = ({ children, setSwiper, initialIndex }) => (
  <Swiper
    initialSlide={initialIndex}
    onSwiper={setSwiper}
    spaceBetween={0}
    effect='coverflow'
    coverflowEffect={{
      "rotate": 50,
      "stretch": 0,
      "depth": 100,
      "modifier": 1,
      "slideShadows": true
    }}
    loop
    slidesPerView="auto"
    freeModeSticky
    centeredSlides
    mousewheel
  >
    {children}
  </Swiper>)

const SwiperMobile = ({ children, setSwiper, initialIndex }) => (
  <Swiper
    initialSlide={initialIndex}
    onSwiper={setSwiper}
    spaceBetween={15}
    loop
    slidesPerView="auto"
    freeModeSticky
    centeredSlides
  >
    {children}
  </Swiper>)

const Draws = ({ handleDraw, spinLoading, account, goudaBalance, claimJackpot, nfts, spinByMagicNft, isMobile, bigJackpot }) => {
  const { setSwiper } = useSwiper()
  const initialIndex = Math.floor(prizes.length / 2)
  useOnNextRound()

  const half = Math.ceil(prizes.length / 2);    

  const firstHalf = prizes.slice(0, half)
  const secondHalf = prizes.slice(-half)

  const SwiperComponent = isMobile ? SwiperMobile : SwiperWeb

  return (
    <Box overflowX="hidden" overflowY="auto">
      <StyledSwiper>
        
        <SwiperComponent
          setSwiper={setSwiper}
          initialIndex={initialIndex}
        >
          {firstHalf.map((round) => (
            <SwiperSlide key={round.type}>
              <RoundCard type={round.type} handleDraw={handleDraw} spinLoading={spinLoading} account={account} goudaBalance={goudaBalance} goudaPerTime={factoryTime[round.type]} />
            </SwiperSlide>
          ))}
          <SwiperSlide key={0}>
            <BigJackpot bigJackpot={bigJackpot} spinByMagicNft={spinByMagicNft} nfts={nfts} claimJackpot={claimJackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} />
          </SwiperSlide>
          {secondHalf.map((round) => (
            <SwiperSlide key={round.type}>
              <RoundCard type={round.type} handleDraw={handleDraw} spinLoading={spinLoading} account={account} goudaBalance={goudaBalance} goudaPerTime={factoryTime[round.type]} />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      </StyledSwiper>
    </Box>
  )
}

export default Draws
