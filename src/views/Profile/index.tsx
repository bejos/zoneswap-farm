import React from 'react'
// import { Route } from 'react-router-dom'
// import { useWeb3React } from '@web3-react/core'
import Page from 'components/layout/Page'
// import PageLoader from 'components/PageLoader'
// import { useFetchAchievements, useProfile } from 'state/hooks'
// import ProfileCreation from './ProfileCreation'
// import Header from './components/Header'
// import TaskCenter from './TaskCenter'
// import PublicProfile from './PublicProfile'
import NftProfile from './NftProfile'

const Profile = () => {
  // const { isInitialized, isLoading, hasProfile } = useProfile()
  // const { account } = useWeb3React()

  // useFetchAchievements()

  // if (!isInitialized || isLoading) {
  //   return <PageLoader />
  // }

  // if (account && !hasProfile) {
  //   return (
  //     <Page>
  //       <ProfileCreation />
  //     </Page>
  //   )
  // }

  return (
    <Page>
      <NftProfile />
      {/* <Header /> */}
      {/* <Route exact path="/profile">
        <NftProfile />
      </Route> */}
      {/* <Route path="/profile/tasks">
        <TaskCenter />
      </Route> */}
    </Page>
  )
}

export default Profile
