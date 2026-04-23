import { Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import logo from "@/assets/gug_logo.jpg"

const TopBar = () => {
  return (
    <Box bgColor={"#1E3A8A"} width={"100vw"} display={"flex"} alignItems={"center"} justifyContent={"space-around"}  h="5rem">
        <Box  display={"flex"} >
          <Box >
          <Image  src={logo} h="4rem"/>
          </Box>
          <VStack mx={"1rem"}>
          <Text fontSize={"2xl"} color={"white"} fontWeight={"bold"}>Gulbarga University</Text>
          <Text marginTop={"-1"} fontSize={"sm"} color={"#F1F5F9"} fontWeight={"lighter"}>Kalaburagi - Karnataka - INDIA</Text>
          </VStack>
        </Box>
    </Box>
  )
}

export default TopBar