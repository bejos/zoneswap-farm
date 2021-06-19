import React from 'react'
import styled from 'styled-components'
import { BaseLayout, CardBody, Card, Text, Heading } from '@cowswap/uikit'
import Page from 'components/layout/Page'
import { TwitterTimelineEmbed, TwitterFollowButton } from 'react-twitter-embed';
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
// import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
// import EarnAPRCard from 'views/Home/components/EarnAPRCard'
// import EarnAssetCard from 'views/Home/components/EarnAssetCard'
// import WinCard from 'views/Home/components/WinCard'
import cowSrc from './images/cow.png'
import goudaSrc from './images/gouda.png'

const ShareBtnStyled = styled.div`
  margin-top: 15px;
  margin-bottom: 15px
`

const TwitterStyled = styled.div`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      width: 100%;
    }
  }
`

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
      grid-column: span 6;
    }
  }
`

const FlexColumn = styled(Cards)`
  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;

    & > div:first-child {
      grid-column: span 5;
      margin-bottom: 30px
    }

    & > div:last-child {
      grid-column: span 7 !important;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: flex;
    flex-direction: column;
    grid-gap: 0px;
    margin-bottom: 0px;
  }
`

const Home: React.FC = () => {

  return (
    <Page>
      <div>
        <Cards>
          <FlexColumn>
            <Card>
              <div style={{ display: 'flex' }}>
                <div>
                  <img style={{ width: 100, marginLeft: 15, marginTop: 15 }} src={cowSrc} alt="cowswap" />
                </div>
                <div style={{ width: '50%', marginLeft: 25, marginTop: 50 }}>
                  <Heading size="xl" mb="24px">Welcome All</Heading>
                  {/* <Text color="#323063">Why be a human, when you can be an cow :)) ?</Text> */}
                </div>
                <div>
                  <img style={{ marginLeft: 5, marginTop: 70 }} src={goudaSrc} alt="cowswap" />
                </div>
              </div>
            </Card>
            <FarmStakingCard />
          </FlexColumn>
          <Card>
            <CardBody>
              <TwitterStyled>
                <TwitterTimelineEmbed
                  borderColor="#323063"
                  sourceType="profile"
                  screenName="cowswap_finance"
                  noFooter
                  noHeader
                  placeholder="Loading..."
                  options={{ height: 500 }}
                  style={{ width: "90%"}}
                />
              </TwitterStyled>
              <ShareBtnStyled>
                <TwitterFollowButton screenName="cowswap_finance" options={{size: 'large'}} />
              </ShareBtnStyled>
            </CardBody>
          </Card>
        </Cards>
        <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards>
      </div>
    </Page>
  )
}

export default Home
