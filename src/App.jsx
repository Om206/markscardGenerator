import { Box } from '@chakra-ui/react'
import React from 'react'
import RightPage from '@/components/pages/RightPage'
import LeftPage from '@/components/pages/LeftPage'
import Homepage from '@/components/newDesign/Homepage'

const App = () => {
  return (
    <Box  w="100vw">
      {/* <Homepage /> */}
      <LeftPage />
      {/* <RightPage /> */}
    </Box>
  )
}

export default App