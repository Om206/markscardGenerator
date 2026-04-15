"use client"

import { Box, Portal, Select, createListCollection } from "@chakra-ui/react"
import subjects from "@/data/subjects.json"; // Adjust path as needed
import SelectMenu from "../helper/SelectMenu";
import { useMemo } from "react";

const Selectsubject = ({selection, setSelection}) => {
    
    

   const yearCollection = useMemo(() => createListCollection({
    items: Object.keys(subjects).map(y => ({ label: y, value: y }))
  }), []);

  const courseCollection = useMemo(() => {
    const selectedYear = selection?.year[0]
    if (!selectedYear || !subjects[selectedYear]) {
      return createListCollection({ items: [] });
    }
    return createListCollection({
      items: Object.keys(subjects[selectedYear]).map(c => ({
        label: c,
        value: c
      }))
    });
    }, [selection?.year]);

    const semesterCollection = useMemo(() => {
  const selectedYear = selection?.year[0];
  const selectedCourse = selection?.course[0];

  // If we don't have a year and course, return an empty list
  if (!selectedYear || !selectedCourse || !subjects[selectedYear][selectedCourse]) {
    return createListCollection({ items: [] });
  }

  // subjects[year][course] is an array: ["Semester 1", "Semester 2"]
  return createListCollection({
    items: Object.keys(subjects[selectedYear][selectedCourse]).map(s => ({
      label: s,
      value: s
    }))
  });
}, [selection?.year, selection?.course]);


  
    const handleYearChange = (e) => {
    console.log("Event from SelectMenu: ", e); // Check the key property of the event

    setSelection({
      year: e.value,
      course: [],
      sem: []
    });

    console.log("Updated selection state: ", selection); // Check the state after update (note: this will show the old state due to async nature of setState)
  };
  const handleCourseChange = (e) => {
    // Reset semester when subject changes
    setSelection(prev => ({
      ...prev,
      course: e.value,
      sem: []
    }));
  };

  const handleSemChange = (e) => {
    setSelection(prev => ({ ...prev, sem: e.value }));
  };    
  return (
    <>
      <Box shadow={"2xl"} bgColor={"gray.100"} borderRadius={"1rem"}  padding={"1rem"} width={"30vw"} marginX={"auto"} display="flex" flexDirection={"row"} gap={4}>

          <SelectMenu value={selection.year} collection={yearCollection} handeChange={handleYearChange} label="Select year" placeholder="Select year" />
          <SelectMenu value={selection.course} collection={courseCollection} handeChange={handleCourseChange} label="Select course" placeholder="Select course" />
          <SelectMenu value={selection.sem} collection={semesterCollection} handeChange={handleSemChange} label="Select semester" placeholder="Select semester" />
      </Box>
    </>
  )
}

const frameworks = createListCollection({
  items: [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
})

export default Selectsubject;