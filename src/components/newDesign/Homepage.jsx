import React from 'react'
import TopBar from './TopBar'
import { Box, RadioCard, Text } from '@chakra-ui/react'
import RadioButton from "@/components/helper/RadioButton"
import UserInput from './UserInput'
const Homepage = () => {
  return (
    <>
    <TopBar />
    <Box bgColor={"#F8FAFC"}>

    <Box  w="100vw">
    <Text textAlign={"center"} color={"#1E3A8A"}  fontSize={"2xl"} >Academic Markscard/Transcript</Text>
    
    </Box>

    <Box  marginTop={"1rem"} width="80vw" mx={"auto"}>
        
        <RadioButton />
    </Box>

      <UserInput />
    </Box>
    </>
  )
}

export default Homepage