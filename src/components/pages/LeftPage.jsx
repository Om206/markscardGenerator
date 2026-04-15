import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, RadioGroup, HStack, Button } from "@chakra-ui/react";
import UserDetails from "./UserDetails";
import Selectsubject from "./Selectsubject";
import MarksCardView from "./MarksCardView";
import TranscriptView from "./TranscriptView";
import subjectData from "@/data/subjects";
import { generateUniversityDoc } from "../docs/generateDocx";

const LeftPage = () => {
  const [mode, setMode] = useState("1"); // "1" = Marks Card, "2" = Transcript
  const [selection, setSelection] = useState({ year: [], course: [], sem: [] });
  const [studentInfo, setStudentInfo] = useState({ name: "", rollNo: "", college: "", examMonthYear: "" });
  
  // This stores EVERY semester the user interacts with
  const [allSemestersData, setAllSemestersData] = useState({});

  const handleStudent = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Load subjects into the master state when selection changes
  useEffect(() => {
    const y = selection.year[0];
    const c = selection.course[0];
    const s = selection.sem[0];
    
    if(mode === "2") {
      // For Transcript, we want to load ALL semesters for the selected year and course
      if (y && c) {
        const semesters = subjectData[y]?.[c] || {};
        const newData = {};
        Object.keys(semesters).forEach((sem) => {
          
            newData[sem] = { subjects: semesters[sem], totals: {} };
        });

        if (Object.keys(newData).length > 0) {
          setAllSemestersData((prev) => ({  ...newData }));
        }
      }
    } else {
              
    if (y && c && s && !allSemestersData[s]) {
      setAllSemestersData({});
      const found = subjectData[y]?.[c]?.[s] || [];
      console.log("Found subjects for", s, ":", found);
      setAllSemestersData((prev) => ({
        ...prev,
        [s]: { subjects: found, totals: {} }
      }));
      console.log("Updated allSemestersData:", allSemestersData);
    }
    else
    {
      setAllSemestersData({}); // Clear data if selection is incomplete
    }
  }
}, [selection]);


const handleDownload = async () => {
  const currentSem = selection.sem[0];
  const data = allSemestersData[currentSem];

  if (data && data.subjects.length > 0) {
    try {
      await generateUniversityDoc(studentInfo, selection, data);
    } catch (error) {
      console.error("Error generating docx:", error);
      alert("Failed to generate document. Ensure logo paths are correct.");
    }
  } else {
    alert("Please select a semester and enter marks first.");
  }
};

  return (
    <Box mx="auto" mt="2rem" p="6" width="80%" bgColor="gray.100" border="1px solid black" borderRadius="md">
      <VStack gap={6} align="stretch">
        <Heading textAlign="center" size="xl">Gulbarga University</Heading>

        <RadioGroup.Root defaultValue="2" value={mode} onValueChange={e => setMode(e.value)} >
          <HStack gap="10" justify="center" p="4" bg="white" borderRadius="md" shadow="sm">
            <RadioGroup.Item value="1">
              <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText fontWeight="bold">Single Marks Card</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value="2">
              <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText fontWeight="bold">Full Transcript</RadioGroup.ItemText>
            </RadioGroup.Item>
          </HStack>
        </RadioGroup.Root>

        <Selectsubject selection={selection} setSelection={setSelection} />
        <UserDetails studentInfo={studentInfo} handleStudent={handleStudent} />

        {mode === "1" ? (
          <MarksCardView 
            activeSem={selection.sem[0]} 
            allData={allSemestersData} 
            setAllData={setAllSemestersData} 
          />
        ) : (
          <TranscriptView 
            allData={allSemestersData} 
            setAllData={setAllSemestersData} 
          />
        )}

        <Button colorPalette="blue" size="lg" w="100%" mt="4" onClick={handleDownload}>
          Generate {mode === "1" ? "Marks Card" : "Transcript"}
        </Button>
      </VStack>
    </Box>
  );
};

export default LeftPage;