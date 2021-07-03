import React from 'react'
import styled from 'styled-components'
import { Flex, IconButton } from '@cowswap/uikit'
import ruleSrc from '../icons/rule.png'
import FlexRow from './FlexRow'
import PrevNextNav from './PrevNextNav'

const SetCol = styled.div`
  position: absolute;
  right: 100px
`

const HelpButtonWrapper = styled.div`
  background-color: white;
  padding: 5px 10px;
  border-radius: 16px;
  box-shadow: 0px 2px 12px -8px rgb(25 19 38 / 10%), 0px 1px 1px rgb(25 19 38 / 5%);
`

const Menu = () => {
  return (
    <FlexRow alignItems="center" p="16px">
      <FlexRow justifyContent="center">
        <PrevNextNav />
      </FlexRow>
      <SetCol>
        <Flex alignItems="center" justifyContent="flex-end">
          <HelpButtonWrapper>
            <IconButton
              variant="subtle"
              as="a"
              href="https://docs.cowswap.app/products/gamble"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img width="30px" src={ruleSrc} alt="cowswap" />
            </IconButton>
          </HelpButtonWrapper>
        </Flex>
      </SetCol>
    </FlexRow>
  )
}

export default Menu
