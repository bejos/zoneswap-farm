import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Text, CardRibbon, LinkExternal, Skeleton } from '@cowswap/uikit'
import { NFT_URI, BASE_BSC_SCAN_URL } from 'config'
import { getLuckyDrawNFTContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getLuckyDrawNFTAddress } from 'utils/addressHelpers'
import styled from 'styled-components'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import luckyDrawNftAbi from 'config/abi/luckyDrawNFT.json'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 180px;
    max-width: 21.8%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
  }
`

const CardStyled = styled(Card)`
  border-radius: 16px;
  position: relative;
  :hover {
    .details {
      visibility: visible;
      opacity: 0.9;
    }
  }
`

const FlexCardDetails = styled.div`
  width: 100%;
  position: absolute;
  background: white;
  bottom: 0;
  padding: 18px;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
`

const MAGIC_TYPE = 1

const NftProfile = () => {
  const [loading, setLoading] = useState(false)
  const [nfts, setNfts] = useState({})
  const [metas, setMetas] = useState([])
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
    setLoading(true)
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
      setLoading(false)
      return {}
    }

    const metadataCalls = tokenIds.map(tokenId => ({
      address: luckyDrawNFTAddress,
      name: 'metadatas',
      params: [new BigNumber(tokenId).toNumber()],
    }))

    const metadatas = await multicall(luckyDrawNftAbi, metadataCalls).catch(error => {
      // eslint-disable-next-line no-console
      console.debug({
        error,
        method: 'metadatas',
        metadataCalls,
      })
      setLoading(false)
      return []
    })

    setMetas(metadatas)
    setLoading(false)
    return metadatas
  }, [account, luckyDrawNFTContract, luckyDrawNFTAddress])

  useEffect(() => {
    const nftsByType = {}
    metas.forEach(item => {
      const { image, _type, author, name, description } = item
      const type = _type.toNumber()
      if (type === MAGIC_TYPE) {
        return
      }
      const isExistedType = Boolean(nftsByType[type])
      if (isExistedType) {
        nftsByType[type].count ++
        return
      }
      nftsByType[type] = {
        image: `${NFT_URI}/${image}`,
        author, name, description,
        count: 1
      }
    })
    setNfts(nftsByType)
  }, [metas])

  useEffect(() => {
    fetchNftJackpot()
  }, [fetchNftJackpot, currentBlock])

  return (
    <>
      <Heading size="lg" mb="15px">My gallery ({metas.length} nfts)</Heading>
      { loading && !metas.length ?
        <Skeleton /> :
        <FlexLayout>
          {Object.keys(nfts).map((type) => {
            const { image, name, author, description, count } = nfts[type]
            return (
              <CardStyled key={type} p="0px" ribbon={<CardRibbon variantColor="success" text={name} />}>
                <CardBody p="0px">
                  <img width="100%" src={image} alt="cow-nft" />
                </CardBody>
                <FlexCardDetails className="details">
                  <LinkExternal href={`${BASE_BSC_SCAN_URL}/address/${author}`}>Author address</LinkExternal>
                  <Text mt="15px">Amount: {count}</Text>
                  <Text mt="15px" color="textSubtle">Description: {description}</Text>
                </FlexCardDetails>
              </CardStyled>
            )
          })}
        </FlexLayout>
      }
    </>
  )
}

export default NftProfile
