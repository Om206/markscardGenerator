import { Box, Field, Grid, Input } from '@chakra-ui/react'
import React from 'react'

const UserDetails = ({studentInfo, handleStudent}) => {
  return (
    <Box p={'1rem'} bgColor={'white'} marginTop={'1rem'} w='full'  borderRadius={"1rem"} shadow={'0.3rem 0.3rem 0.3rem 0.3rem  rgba(0, 0, 255, .2)'}>
    
    
    <Box display={'flex'} flexDirection={{ base: 'column', md: 'row' }} gap={4} p={4} flexWrap={'wrap'}>

        <InputField  label="Name" placeholder="Enter student name" type="text" name="name" value={studentInfo.name} onChange={handleStudent}/>
        <InputField label="Registration Number" placeholder="Enter student registration number" type="text" name="rollNo" value={studentInfo.rollNo} onChange={handleStudent} />
        <InputField label="College Name" placeholder="Enter student college name" type="text" name="college" value={studentInfo.college} onChange={handleStudent} />
        <InputField label="Exam Month and Year" placeholder="Enter month and year of exam ie May 2024" type="text" name="examMonthYear" value={studentInfo.examMonthYear} onChange={handleStudent} />
    
    </Box>
    


    </Box>

  )
}


const InputField = ({ label, placeholder,type,name,value,onChange }) => (
    <Box w='48%'>

  <Field.Root>
    <Field.Label>{label}</Field.Label>
    <Input fontSize={"1rem"} fontWeight={"medium"}  css={{ "--focus-color": "rgba(0, 0, 255, 0.61)" }} type={type} placeholder={placeholder}
        onChange={onChange}
        valye={value}
        name={name}
/>
  </Field.Root>
</Box>
)

export default UserDetails