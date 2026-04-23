"use client"
import { Portal, Select, createListCollection } from "@chakra-ui/react"
import subjects from "@/data/subjects.json";
import SelectMenu from "../helper/SelectMenu";
import { useMemo } from "react";

const Selectsubject = ({ selection, setSelection }) => {

  const yearCollection = useMemo(() => createListCollection({
    items: Object.keys(subjects).map(y => ({ label: y, value: y }))
  }), []);

  const courseCollection = useMemo(() => {
    const y = selection?.year[0];
    if (!y || !subjects[y]) return createListCollection({ items: [] });
    return createListCollection({
      items: Object.keys(subjects[y]).map(c => ({ label: c, value: c }))
    });
  }, [selection?.year]);

  const semesterCollection = useMemo(() => {
    const y = selection?.year[0];
    const c = selection?.course[0];
    if (!y || !c || !subjects[y]?.[c]) return createListCollection({ items: [] });
    return createListCollection({
      items: Object.keys(subjects[y][c]).map(s => ({ label: s, value: s }))
    });
  }, [selection?.year, selection?.course]);

  const handleYearChange   = (e) => setSelection({ year: e.value, course: [], sem: [] });
  const handleCourseChange = (e) => setSelection(prev => ({ ...prev, course: e.value, sem: [] }));
  const handleSemChange    = (e) => setSelection(prev => ({ ...prev, sem: e.value }));

  return (
    <>
      <style>{`
        .ss-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .ss-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .ss-grid { grid-template-columns: 1fr 1fr 1fr; }
        }

        /* cascade lock visual for empty selects */
        .ss-locked .sm-trigger {
          opacity: 0.4;
          pointer-events: none;
          cursor: not-allowed;
        }
      `}</style>

      <div className="ss-grid">
        <SelectMenu
          value={selection.year}
          collection={yearCollection}
          handeChange={handleYearChange}
          label="Academic Year"
          placeholder="Select year"
        />

        <div className={!selection.year[0] ? 'ss-locked' : ''}>
          <SelectMenu
            value={selection.course}
            collection={courseCollection}
            handeChange={handleCourseChange}
            label="Course"
            placeholder="Select course"
          />
        </div>

        <div className={!selection.course[0] ? 'ss-locked' : ''}>
          <SelectMenu
            value={selection.sem}
            collection={semesterCollection}
            handeChange={handleSemChange}
            label="Semester"
            placeholder="Select semester"
          />
        </div>
      </div>
    </>
  )
}

export default Selectsubject