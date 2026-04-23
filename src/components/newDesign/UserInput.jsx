import { Box, Field, Input, Text } from '@chakra-ui/react'
import React from 'react'

const UserInput = () => {
  return (
    <>
        <Box  mx="auto" bgColor={"#1E3A8A"} mt="1rem" pt="0.5rem" pb="1rem" pl="1.5rem" w={"80vw"}>
             <Text fontSize={"xl"} color="white">Student Details</Text>
             
             <form>
                    <Field.Root required>
                        <Field.Label color="white">
                            Name <Field.RequiredIndicator />

                        </Field.Label>
                        <Input color={'white'} placeholder='Enter name' _placeholder={{"color":"white"}} />
                    </Field.Root>
             </form>
        </Box>
    </>
  )
}

export default UserInput