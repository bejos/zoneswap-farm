import React from 'react'
import styled from 'styled-components'
import SwiperCore, { Keyboard, Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Box } from '@cowswap/uikit'
import 'swiper/swiper.min.css'
import BigJackpot from './Jackpot'
import RoundCard from './components/RoundCard'
import useSwiper from './hooks/useSwiper'
import useOnNextRound from './hooks/useOnNextRound'

SwiperCore.use([Keyboard, Mousewheel])

const StyledSwiper = styled.div`
  .swiper-wrapper {
    align-items: center;
    display: flex;
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
  {
    label: 'Random Gouda',
    type: -1
  },
]

const factoryTime = {
  '-1': 5,
  '5': 1,
  '10': 1,
  '100': 2,
  '50': 1,
  '500': 4,
}

const Draws = ({ handleDraw, spinLoading, account, goudaBalance, jackpot }) => {
  const { setSwiper } = useSwiper()
  const initialIndex = Math.floor(prizes.length / 2)
  useOnNextRound()

  const half = Math.ceil(prizes.length / 2);    

  const firstHalf = prizes.slice(0, half)
  const secondHalf = prizes.slice(-half)

  return (
    <Box overflowX="hidden" overflowY="auto">
      <StyledSwiper>
        <Swiper
          initialSlide={initialIndex}
          onSwiper={setSwiper}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode
          freeModeSticky
          centeredSlides
          mousewheel
          keyboard
          resizeObserver
        >
          {firstHalf.map((round) => (
            <SwiperSlide key={round.type}>
              <RoundCard label={round.label} type={round.type} handleDraw={handleDraw} spinLoading={spinLoading} account={account} goudaBalance={goudaBalance} goudaPerTime={factoryTime[round.type]} />
            </SwiperSlide>
          ))}
          <SwiperSlide key={0}>
            <BigJackpot jackpot={jackpot} handleDraw={handleDraw} goudaBalance={goudaBalance} spinLoading={spinLoading} />
          </SwiperSlide>
          {secondHalf.map((round) => (
            <SwiperSlide key={round.type}>
              <RoundCard label={round.label} type={round.type} handleDraw={handleDraw} spinLoading={spinLoading} account={account} goudaBalance={goudaBalance} goudaPerTime={factoryTime[round.type]} />
            </SwiperSlide>
          ))}
        </Swiper>
      </StyledSwiper>
    </Box>
  )
}

export default Draws
