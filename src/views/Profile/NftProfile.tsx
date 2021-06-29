import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core'
import { Card, BaseLayout, CardBody } from '@cowswap/uikit'
import { getLuckyDrawNFTContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getLuckyDrawNFTAddress } from 'utils/addressHelpers'
import styled from 'styled-components'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import luckyDrawNftAbi from 'config/abi/luckyDrawNFT.json'


const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

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
      grid-column: span 3;
    }
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
    setNfts(metadatas)

    return metadatas
  }, [account, luckyDrawNFTContract, luckyDrawNFTAddress])

  useEffect(() => {
    fetchNftJackpot()
  }, [fetchNftJackpot, currentBlock])

  return (
    <Cards>
      {nfts.map(({ image }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Card key={image + index}>
          <CardBody>
            <img src={image} alt="cow-nft" />
          </CardBody>
        </Card>
      ))}
    </Cards>
  )
}

export default NftProfile
