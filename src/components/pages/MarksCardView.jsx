import React, { useMemo } from "react";
import Subjects from "./Subjects";
import { Box, Heading, Text } from "@chakra-ui/react";

const MarksCardView = ({ activeSem, allData, setAllData }) => {
  if (!activeSem || !allData[activeSem]) {
    return (
      <Box p="10" textAlign="center" bg="white" borderRadius="md" border="2px dashed gray">
        <Text color="gray.500">Please select a Year, Course, and Semester to begin.</Text>
      </Box>
    );
  }

  console.log("Rendering MarksCardView for", activeSem, "with data:", allData[activeSem], "and allData:", allData);  
  const handleUpdate = (updatedSubjects,total) => {1
    setAllData((prev) => ({
      ...prev,
      [activeSem]: { ...prev[activeSem], subjects: updatedSubjects, totals: total }
    }));
  };

  // useMemo(() => {
  //   const totalMarksCal = allData[activeSem].subjects.reduce((sum, sub) => {
  //     const obt = parseFloat(sub.obtMarks) || 0;
  //     const cred = parseFloat(sub.credits) || 0;
  //     const cp = parseFloat(sub.creditPoints) || 0;
  //     const grade = parseFloat(sub.grade) || 0;
      
  //     // update the subject object with calculated values
  //     return {
  //       totalMakrs: sum.totalMarks + obt,
  //       totalCredits: sum.totalCredits + cred,
  //       totalCreditPoints: sum.totalCreditPoints + cp,
  //       totalGradePoints: sum.totalGradePoints + grade
  //     };
  //   }, { totalMarks: 0, totalCredits: 0, totalCreditPoints: 0, totalGradePoints: 0 });

  //   setAllData((prev) => ({
  //     ...prev,
  //     [activeSem]: {  ...prev[activeSem], totals: totalMarksCal }
  //   }));

  // },[allData[activeSem].subjects]);

  return (
    <Box>
      <Heading size="md" mb="4" color="blue.700">Preview: {activeSem}</Heading>
      <Subjects 
        subjects={allData[activeSem].subjects} 
        setSubjects={handleUpdate} 
        total={allData[activeSem].totals}
      />
    </Box>
  );
};

export default MarksCardView;