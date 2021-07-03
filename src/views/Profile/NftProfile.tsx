import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Box, Text } from '@cowswap/uikit'
import { NFT_URI } from 'config'
import { getLuckyDrawNFTContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getLuckyDrawNFTAddress } from 'utils/addressHelpers'
import styled from 'styled-components'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import luckyDrawNftAbi from 'config/abi/luckyDrawNFT.json'
import SwiperCore, { Mousewheel } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.min.css'

SwiperCore.use([Mousewheel])

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

const NftProfile = () => {
  const [nfts, setNfts] = useState([])
  const { currentBlock } = useBlock()
  const { account } = useWeb3React()
  const web3 = useWeb3()

  const luckyDrawNFTAddress = getLuckyDrawNFTAddress()

  const luckyDrawNFTContract = useMemo(() => {
    return getLuckyDrawNFTContract(luckyDrawNFTAddress, web3)
  }, [luckyDrawNFTAddress, web3])

  const fetchNftJackpot = useCallback(async () => {
    if (!account) {
      return []
    }
    const nftBalance = await luckyDrawNFTContract.methods.balanceOf(account).call()
    const tokenIdCalls= Array.from(Array(Number(nftBalance)).keys()).map(index => ({
      address: luckyDrawNFTAddress,
      name: 'tokenOfOwnerByIndex',
      params: [account, index],
    }))

    // eslint-disable-next-line no-console
    const tokenIds = await multicall(luckyDrawNftAbi, tokenIdCalls).catch(error => console.debug({
      error,
      method: 'tokenOfOwnerByIndex'
    }))

    if (!tokenIds) {
      return {}
    }

    const metadataCalls = tokenIds.map(tokenId => ({
      address: luckyDrawNFTAddress,
      name: 'metadatas',
      params: [new BigNumber(tokenId).toNumber()],
    }))

    // eslint-disable-next-line no-console
    const metadatas = await multicall(luckyDrawNftAbi, metadataCalls).catch(error => console.debug({
      error,
      method: 'metadatas',
      metadataCalls,
    }))
    
    setNfts(metadatas
      .map(({ image, _type }, index) => {
        return {
          image: `${NFT_URI}/${image}`,
          tokenId: tokenIds[index][0].toNumber(),
          _type
        }
      })
      .filter(({ _type }) => {
      return _type.toNumber() !== 1
      })
    )

    return metadatas
  }, [account, luckyDrawNFTContract, luckyDrawNFTAddress])
  useEffect(() => {
    fetchNftJackpot()
  }, [fetchNftJackpot, currentBlock])

  return (
    <>
      <Heading size="lg" mb="15px">My gallery ({nfts.length} nfts)</Heading>
      <Box overflowX="hidden" overflowY="auto">
        <StyledSwiper>
          <Swiper
            spaceBetween={15}
            slidesPerView="auto"
            mousewheel
            pagination={{
              "clickable": true
            }}
            className="mySwiper"
          >
            {nfts.map(({ image, tokenId }) => (
              <SwiperSlide key={tokenId}>
                <Card isSuccess>
                  <CardBody>
                  <img src={image} alt="cow-nft" />
                  <Text mt="15px">Token ID: {tokenId}</Text>
                  </CardBody>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </StyledSwiper>
      </Box>
    </>
  )
}

export default NftProfile
