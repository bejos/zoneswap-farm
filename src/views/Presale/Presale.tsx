import React, { useState, useMemo, useEffect } from 'react'
import { Flex, Heading, Image, Text, MetamaskIcon, LinkExternal } from '@cowswap/uikit'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getPresaleContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import { getPresaleAddress, getAddress, getAirdropAddress } from 'utils/addressHelpers'
import useWeb3 from 'hooks/useWeb3'
import { useBlock } from 'state/hooks'
import tokens from 'config/constants/tokens'
import { DEFAULT_TOKEN_DECIMAL, BASE_URL, BASE_BSC_SCAN_URL } from 'config'
import presaleAbi from 'config/abi/presale.json'
import airdropAbi from 'config/abi/airdrop.json'
import { registerToken } from 'utils/wallet'

import presaleBackground from './images/presale.svg'

const goudaSrc = `${BASE_URL}/images/tokens/GOUDA.png`

const Presale: React.FC = () => {
  const web3 = useWeb3()
  const { currentBlock } = useBlock()
  const { account } = useWeb3React()
  const [unlockedBlocknumber, setUnlockedBlocknumber] = useState('')
  const [yourGouda, setYourGouda] = useState('0,00')
  const [remainingToken, setRemainingToken] = useState('0')

  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const presaleAddress = getPresaleAddress()

  const presaleContract = useMemo(() => {
    return getPresaleContract(presaleAddress, web3)
  }, [presaleAddress, web3])

  const airdropAddress = getAirdropAddress()

  useEffect(() => {
    try {
      if (account) {
        multicall(presaleAbi, [
          {
            address: presaleAddress,
            name: 'getRemainPresale',
            params: [],
          },
          {
            address: presaleAddress,
            name: 'buyers',
            params: [account],
          },
          {
            address: presaleAddress,
            name: 'unlockPresaleBlock',
            params: [],
          }
        ]).then(([presaleTotal, boughtGouda, blockToUnblock]) => {
          const tokenLeft = new BigNumber(presaleTotal).div(DEFAULT_TOKEN_DECIMAL)

          setRemainingToken(tokenLeft.toNumber().toLocaleString('en-US', { maximumFractionDigits: 0 }))
          setUnlockedBlocknumber(new BigNumber(blockToUnblock).toString())
          multicall(airdropAbi, [
            {
              address: airdropAddress,
              name: 'buyers',
              params: [account],
            },
          ]).then(([boughtOldGouda]) => {
            setYourGouda(new BigNumber(boughtOldGouda).plus(new BigNumber(boughtGouda)).div(DEFAULT_TOKEN_DECIMAL).toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 }))
          })
        })
      }
    } catch (error) {
      console.error(error)
    }
    
  }, [currentBlock, presaleContract, account, presaleAddress, airdropAddress])

  return (
    <>
      <Page>
        <FlexLayout>
          <div>
            <Heading as="h1" textAlign="left" size="xl" mb="24px" color="text">
              Presale
            </Heading>
            <LinkExternal style={{ color: '#E67B56' }} href={`${BASE_BSC_SCAN_URL}/address/${getAddress(tokens.cow.address)}`}>
              Gouda address
            </LinkExternal>
            <p style={{ fontSize: 20, color: '#323063', marginTop: 15, textAlign: "left" }}>
              Total: <span style={{ fontSize: 30 }}>3,000,000</span> Gouda
            </p>
            <p style={{ fontSize: 20, color: '#323063', marginTop: 15, textAlign: "left" }}>
              Remaining: <span style={{ fontSize: 30 }}>{remainingToken}</span> Gouda
            </p>
            <p style={{ fontSize: 20, color: '#E67B56', marginTop: 25, textAlign: "left", borderTop: "1px solid #E67B56", paddingTop: 15 }}>
              Your locked: <span style={{ fontSize: 30 }}>{yourGouda}</span> Gouda
            </p>
            <div style={{ background: '#EBEBEB', borderRadius: 12, padding: 8, marginTop: 15, width: '75%' }}>
              <p style={{ fontSize: 13, color: '#1DA1F2', textAlign: "center" }}>
                Unlock time remaining:
              </p>
              <p style={{ fontSize: 13, color: '#1DA1F2', textAlign: "center", marginTop: 6 }}>
                {/* {countdown} */}
                {unlockedBlocknumber !== '' ? <a rel="noreferrer" target="_blank" href={`https://bscscan.com/block/countdown/${unlockedBlocknumber}`}>View {unlockedBlocknumber}</a> : 'fetching ...'}
              </p>
            </div>
            {account && isMetaMaskInScope && (
              <Flex justifyContent="flex-start" style={{
                cursor: 'pointer',
                marginTop: 15
              }} onClick={() => registerToken(getAddress(tokens.cow.address), 'GOUDA', 18, goudaSrc)}>
                <Text
                  color="textSubtle"
                  small
                >
                  Add GOUDA to Metamask
                </Text>
                <MetamaskIcon ml="4px" />
              </Flex>
            )}
          </div>
          <div>
            <Image
              mx="auto"
              mt="12px"
              src={presaleBackground}
              alt="cowswap illustration"
              width={300}
              height={230}
            />
          </div>
        </FlexLayout>
      </Page>
    </>
  )
}

export default Presale
