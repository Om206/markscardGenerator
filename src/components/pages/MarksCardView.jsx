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