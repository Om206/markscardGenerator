import { Box, For, Input, Stack, Table } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { toaster } from '../ui/toaster';

const Subjects = ({subjects, setSubjects,total,setTotal}) => {




  const handleInputChange = (index, field, value) => {
  const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
      const sec = parseFloat(updatedSubjects[index].secMarks) || 0;
      const ia = parseFloat(updatedSubjects[index].iaMarks) || 0;
      updatedSubjects[index].obtMarks = sec + ia;
      updatedSubjects[index].grade = updatedSubjects[index].obtMarks/10;
      const cp = updatedSubjects[index].grade * parseFloat(updatedSubjects[index].credits)
      updatedSubjects[index].creditPoints =cp.toFixed(2);

      
      const newTotals = updatedSubjects.reduce((acc, s) => {
        return {
          totalMarks: acc.totalMarks + (parseFloat(s.obtMarks) || 0),
          totalCredits: acc.totalCredits + (parseFloat(s.credits) || 0),
          totalCreditPoints: (acc.totalCreditPoints + (parseFloat(s.creditPoints) || 0)),
          sgpa: acc.totalCreditPoints / acc.totalCredits
        };
      }, { totalMarks: 0, totalCredits: 0 ,totalCreditPoints: 0});
      const formattedTotals = {
          totalMarks: newTotals.totalMarks,
          totalCredits: newTotals.totalCredits,
          totalCreditPoints: newTotals.totalCreditPoints.toFixed(2),
          sgpa: newTotals.sgpa.toFixed(2)    // Move it here
};
      setSubjects(updatedSubjects,formattedTotals); 

};




  return (
    <Box bgColor={"blue.300"} borderRadius={"1rem"} marginTop={"1rem"}   border={'1px solid black'} p="1rem" w="100%">

    
          <Table.Root border={'1px solid rgba(58, 91, 144, 0.5)'} size="sm" variant={'outline'} striped >
            <Table.Header bgColor={"blue.500"} color="white">
              <Table.Row >
                <Table.ColumnHeader color={"white"}>Course Name</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Course Code</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Max Marks</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Min Marks</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>SEC Marks</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>IA Marks</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Marks Scored</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Credit</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Grade</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Grade Points</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Letter Grade</Table.ColumnHeader>
                <Table.ColumnHeader color={"white"}>Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
             
          {
          subjects?.map((sub, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{sub.name}</Table.Cell>
                  <Table.Cell>{sub.code}</Table.Cell>
                  <Table.Cell>{sub.maxMarks}</Table.Cell>
                  <Table.Cell>{sub.minMarks}</Table.Cell>

                  <Table.Cell>
                      <Input type='number'
                      
                      size="sm"

                      variant={"outline"}
                      value={sub.secMarks || ""}
                      placeholder='Marks'
                      onChange={(e) => handleInputChange(index, "secMarks",e.target.value)}
                      />

                  </Table.Cell>
                  <Table.Cell>
                      <Input type='number'
                      
                      size="sm"

                      variant={"outline"}
                      value={sub.iaMarks || ""}
                      placeholder='Marks'
                      onChange={(e) => handleInputChange(index, "iaMarks",e.target.value)}
                      />

                  </Table.Cell>
            
                  <Table.Cell>{sub.obtMarks}</Table.Cell>
                  <Table.Cell>{sub.credits}</Table.Cell>
                  <Table.Cell>{sub.grade}</Table.Cell>
                  <Table.Cell>{sub.creditPoints}</Table.Cell>
                  <Table.Cell>{sub.letterGrade}</Table.Cell>
                  <Table.Cell>{sub.status ? "Pass":"Fail"}</Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
            <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={6} textAlign="right" fontWeight="bold">Total</Table.Cell>
              <Table.Cell fontWeight="bold">{total.totalMarks}</Table.Cell>
              <Table.Cell>{total.totalCredits}</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>{total.totalCreditPoints}</Table.Cell>
              
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan={10} textAlign="right" fontWeight="bold">SGPA</Table.Cell>
              <Table.Cell >{total.sgpa}</Table.Cell>
            </Table.Row>

            </Table.Footer>
          </Table.Root>
            
      </Box>
   
  )
}

export default Subjects