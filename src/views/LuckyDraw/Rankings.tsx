import React from 'react'
import { Text, Card, CardBody, ButtonMenu, ButtonMenuItem, NotificationDot } from '@cowswap/uikit'
import styled from 'styled-components'
import { BASE_BSC_SCAN_URL } from 'config'

const FlexColumn = styled.div`
  display: flex;
  flex-direction: row;
`

const FlexAddressColumn = styled.div`
  display: flex;
  flex-direction: row;
  .balance {
    display: flex;
    flex-direction: row;
  }
  >div:nth-of-type(1) {
    color: #FFC700
  }
  >div:nth-of-type(2) {
    color: #ADADB2
  }
  >div:nth-of-type(3) {
    color: #FFA487
  }
`

const factoryColorPrize = {
  '0': "#FFC700",
  '1': "#ADADB2",
  '2': "#FFA487",
}

const factoryFontPrize = {
  '0': "20px",
  '1': "18px",
  '2': "16px",
}

const Rankings = ({ topWinnersWithBalance, isMobile, handleTypeRankingsClick, typeRankings }) => {

  return (
    <Card style={{
      width: isMobile ? "90%" : "600px"
    }}>
      <CardBody>
        <FlexColumn style={{
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 15
        }}>
          {!isMobile ? <Text fontSize="20px" mr="100px">
            Rankings
          </Text> : null}
          <ButtonMenu activeIndex={typeRankings} onItemClick={handleTypeRankingsClick} scale="sm" variant="subtle">
            <NotificationDot show={typeRankings === 0}>
              <ButtonMenuItem>Top Players</ButtonMenuItem>
            </NotificationDot>
            <NotificationDot show={typeRankings === 1}>
              <ButtonMenuItem>Top Winners</ButtonMenuItem>
            </NotificationDot>
          </ButtonMenu>
        </FlexColumn>
        <FlexColumn style={{ justifyContent: "space-between", marginBottom: 15 }}>
          <div className="ranking"><Text color="textSubtle">Ranks</Text></div>
          <div className="address"><Text color="textSubtle">Address</Text></div>
          <div className="balance">
            <Text color="textSubtle">Balance(Gouda)</Text>
          </div>
        </FlexColumn>
        {topWinnersWithBalance.map((winner, index) => (
          <FlexAddressColumn style={{ justifyContent: "space-between" }}>
            <div className="ranking"><Text fontSize={factoryFontPrize[index] || "16px"} color={factoryColorPrize[index] || "textSubtle"}>{index + 1}</Text></div>
            <div className="address"><Text fontSize={factoryFontPrize[index] || "16px"}  color={factoryColorPrize[index] || "textSubtle"}><a rel="noreferrer" target="_blank" href={`${BASE_BSC_SCAN_URL}/address/${winner.address}`}>{winner.address.substring(0, 11)}...{winner.address.slice(-4)}</a></Text></div>
            <div className="balance"><Text fontSize={factoryFontPrize[index] || "16px"} color={factoryColorPrize[index] || "textSubtle"}>{winner.won}</Text></div>
          </FlexAddressColumn>
        ))}
      </CardBody>
    </Card>
  )
}

export default Rankings
