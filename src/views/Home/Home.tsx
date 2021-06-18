import React from 'react'
import styled from 'styled-components'
import { BaseLayout, CardBody, Card } from '@cowswap/uikit'
// import { useTranslation } from 'contexts/Localization'
import Page from 'components/layout/Page'
import { TwitterTimelineEmbed, TwitterFollowButton } from 'react-twitter-embed';
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
// import LotteryCard from 'views/Home/components/LotteryCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
// import EarnAPRCard from 'views/Home/components/EarnAPRCard'
// import EarnAssetCard from 'views/Home/components/EarnAssetCard'
// import WinCard from 'views/Home/components/WinCard'

const Hero = styled.div`
  align-items: center;
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    background-position: left center, right center;
    height: auto;
    padding-top: 0;
  }
`

const ShareBtnStyled = styled.div`
  margin-top: 15px;
  margin-bottom: 15px
`

const TwitterStyled = styled.div`
  width: 80%;
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

// const CTACards = styled(BaseLayout)`
//   align-items: start;
//   margin-bottom: 32px;

//   & > div {
//     grid-column: span 6;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     & > div {
//       grid-column: span 8;
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     & > div {
//       grid-column: span 4;
//     }
//   }
// `

const Home: React.FC = () => {

  return (
    <Page>
      {/* <Hero>
        <TwitterStyled>
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName="cowswap_finance"
            noFooter
            noHeader
            placeholder="Loading..."
            options={{ height: 450 }}
            style={{ width: "80%"}}
          />
        </TwitterStyled>
        <ShareBtnStyled>
          <TwitterFollowButton screenName="cowswap_finance" options={{size: 'large'}} />
        </ShareBtnStyled>
      </Hero> */}
      <div>
        <Cards>
          <FarmStakingCard />
          {/* <LotteryCard /> */}
          <Card>
            <CardBody>
              <TwitterStyled>
                <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="cowswap_finance"
                  noFooter
                  noHeader
                  placeholder="Loading..."
                  options={{ height: 450 }}
                  style={{ width: "100%"}}
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
          {/* <TotalValueLockedCard /> */}
        </Cards>
        {/* <CTACards>
          <EarnAPRCard />
          <EarnAssetCard />
          <WinCard />
        </CTACards>
        <Cards>
          <CakeStats />
          <TotalValueLockedCard />
        </Cards> */}
      </div>
    </Page>
  )
}

export default Home
