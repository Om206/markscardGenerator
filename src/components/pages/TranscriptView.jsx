import React, { useMemo } from "react";
import Subjects from "./Subjects";
import { VStack, Heading, Box, Text, SimpleGrid, Stack } from "@chakra-ui/react";

const TranscriptView = ({ allData, setAllData }) => {
  const semesterKeys = Object.keys(allData);

  // Calculate Cumulative CGPA
  const cgpa = useMemo(() => {
    const sems = Object.values(allData);
    const validSems = sems.filter(s => s.totals?.sgpa && s.totals.sgpa > 0);
    
    if (validSems.length === 0) return "0.00";
    
    const sumSGPA = validSems.reduce((acc, curr) => acc + parseFloat(curr.totals.sgpa), 0);
    return (sumSGPA / validSems.length).toFixed(2);
  }, [allData]);

  if (semesterKeys.length === 0) {
    return (
      <Box p="10" textAlign="center" bg="white" borderRadius="md" border="2px dashed gray">
        <Text color="gray.500">No semester data found. Select a semester in Marks Card mode to add it here.</Text>
      </Box>
    );
  }

  return (
    <VStack gap={8} w="100%" align="stretch">
      {/* Summary Section - Replacing the broken Stat components */}
      <Box w="100%" p="6" bg="blue.600" color="white" borderRadius="lg" shadow="md">
        <Heading size="md" mb="4" borderBottom="1px solid" pb="2">
          Transcript Summary
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
           <Stack gap="0">
             <Text fontSize="sm" opacity="0.8">Total Semesters</Text>
             <Text fontSize="2xl" fontWeight="bold">{semesterKeys.length}</Text>
           </Stack>
           <Stack gap="0">
             <Text fontSize="sm" opacity="0.8">Cumulative CGPA</Text>
             <Text fontSize="2xl" fontWeight="bold">{cgpa}</Text>
           </Stack>
        </SimpleGrid>
      </Box>

      {/* List of Semester Tables */}
      {semesterKeys.map((sem) => (
        <Box key={sem} w="100%" bg="white" p="4" borderRadius="md" shadow="sm">
          <Heading size="sm" p="3" bg="gray.100" mb="4" borderRadius="sm" color="blue.800">
            {sem}
          </Heading>
          <Subjects 
            subjects={allData[sem].subjects} 
            setSubjects={(newSubs) => {
              setAllData(prev => ({
                ...prev,
                [sem]: { ...prev[sem], subjects: newSubs }
              }));
            }} 
          />
        </Box>
      ))}
    </VStack>
  );
};

export default TranscriptView;