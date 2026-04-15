import { Box } from '@chakra-ui/react'
import React from 'react'
import RightPage from '@/components/pages/RightPage'
import LeftPage from '@/components/pages/LeftPage'

const App = () => {
  return (
    <Box  w="100vw" h="100vh" >
      <LeftPage />
      {/* <RightPage /> */}
    </Box>
  )
}

export default App