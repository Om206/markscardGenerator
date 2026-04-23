import React, { useState, useEffect } from "react";
import { Box, VStack, Button, Text } from "@chakra-ui/react";
import UserDetails from "./UserDetails";
import Selectsubject from "./Selectsubject";
import MarksCardView from "./MarksCardView";
import TranscriptView from "./TranscriptView";
import subjectData from "@/data/subjects";
import { generateUniversityDoc } from "../docs/generateDocx";
import TopBar from "../newDesign/TopBar";
import RadioButton from "../helper/RadioButton";

/* ── Injected global styles ─────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

    :root {
      --bg-deep:    #080e1a;
      --bg-mid:     #0d1628;
      --bg-card:    rgba(255,255,255,0.03);
      --border:     rgba(255,255,255,0.07);
      --accent:     #6366f1;
      --accent-glow:rgba(99,102,241,0.35);
      --accent-soft:rgba(99,102,241,0.12);
      --gold:       #f59e0b;
      --text-primary:   rgba(255,255,255,0.92);
      --text-secondary: rgba(255,255,255,0.45);
      --text-muted:     rgba(255,255,255,0.22);
    }

    body { background: var(--bg-deep);
       input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Hide spin buttons in Firefox */
        input[type="number"] {
            -moz-appearance: textfield;
        }
    }
    

    /* Mesh grid background */
    .lp-root {
      min-height: 100vh;
      background:
        linear-gradient(135deg, #080e1a 0%, #0b1120 50%, #0d1628 100%);
      position: relative;
      overflow-x: hidden;
    }
    .lp-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
      z-index: 0;
    }
    /* Ambient orbs */
    .lp-root::after {
      content: '';
      position: fixed;
      top: -120px; left: -120px;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
    .lp-orb2 {
      position: fixed;
      bottom: -80px; right: -80px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .lp-content {
      position: relative;
      z-index: 1;
    }

    /* Section cards */
    .lp-section {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      backdrop-filter: blur(12px);
      padding: 1.5rem;
      transition: border-color 0.2s;
    }
    .lp-section:hover {
      border-color: rgba(99,102,241,0.2);
    }

    /* Section label */
    .lp-section-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.62rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .lp-section-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    /* Download button */
    .lp-btn {
      width: 100%;
      padding: 14px 24px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      position: relative;
      overflow: hidden;
      transition: transform 0.15s, box-shadow 0.15s;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      box-shadow: 0 4px 24px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
    }
    .lp-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
      pointer-events: none;
    }
    .lp-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
    }
    .lp-btn:active { transform: translateY(0); }

    .lp-btn-icon {
      display: inline-block;
      margin-right: 8px;
      font-size: 1rem;
      vertical-align: middle;
    }

    /* Divider */
    .lp-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 0.25rem 0;
    }

    /* Page title */
    .lp-title {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(1.6rem, 4vw, 2.6rem);
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1.1;
      text-align: center;
    }
    .lp-title em {
      font-style: italic;
      background: linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .lp-subtitle {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-align: center;
      letter-spacing: 0.04em;
      margin-top: 4px;
    }

    /* Step counter chips */
    .lp-step {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px; height: 20px;
      border-radius: 50%;
      background: var(--accent-soft);
      border: 1px solid rgba(99,102,241,0.3);
      color: #818cf8;
      font-size: 0.6rem;
      font-weight: 700;
      font-family: 'DM Sans', sans-serif;
      flex-shrink: 0;
      margin-right: 8px;
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .lp-animate {
      animation: fadeSlideUp 0.5s ease both;
    }
    .lp-animate:nth-child(1) { animation-delay: 0.05s; }
    .lp-animate:nth-child(2) { animation-delay: 0.12s; }
    .lp-animate:nth-child(3) { animation-delay: 0.19s; }
    .lp-animate:nth-child(4) { animation-delay: 0.26s; }
    .lp-animate:nth-child(5) { animation-delay: 0.33s; }
    .lp-animate:nth-child(6) { animation-delay: 0.40s; }
    .lp-animate:nth-child(7) { animation-delay: 0.47s; }
  `}</style>
);

/* ── Component ──────────────────────────────────────────────────────── */
const LeftPage = () => {
  const [mode, setMode] = useState("1");
  const [selection, setSelection] = useState({ year: [], course: [], sem: [] });
  const [studentInfo, setStudentInfo] = useState({ name: "", rollNo: "", college: "", examMonthYear: "" });
  const [allSemestersData, setAllSemestersData] = useState({});

  const handleStudent = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const y = selection.year[0];
    const c = selection.course[0];
    const s = selection.sem[0];

    if (mode === "2") {
      if (y && c) {
        const semesters = subjectData[y]?.[c] || {};
        const newData = {};
        Object.keys(semesters).forEach((sem) => {
          newData[sem] = { subjects: semesters[sem], totals: {} };
        });
        if (Object.keys(newData).length > 0) {
          setAllSemestersData({ ...newData });
        }
      }
    } else {
      if (y && c && s && !allSemestersData[s]) {
        setAllSemestersData({});
        const found = subjectData[y]?.[c]?.[s] || [];
        setAllSemestersData((prev) => ({
          ...prev,
          [s]: { subjects: found, totals: {} }
        }));
      } else {
        setAllSemestersData({});
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

  const isTranscript = mode === "2";

  return (
    <>
      <GlobalStyles />
      <div className="lp-root">
        <div className="lp-orb2" />
        <div className="lp-content">
          <TopBar />

          <Box
            px={{ base: '1rem', md: '2rem' }}
            py="2rem"
            mx="auto"
            maxW={{ base: '100%', md: '90vw', xl: '1100px' }}
          >
            <VStack gap={4} align="stretch">

              {/* ── Title ── */}
              <Box className="lp-animate" textAlign="center" pb={2}>
                <h1 className="lp-title">
                  Academic <em>Document</em> Generator
                </h1>
                <p className="lp-subtitle">
                  Generate marks cards &amp; transcripts for university records
                </p>
              </Box>

              {/* ── Mode Toggle ── */}
              <Box className="lp-section lp-animate">
                <div className="lp-section-label">
                  <span className="lp-step">1</span>
                  Document Type
                </div>
                <RadioButton mode={mode} setMode={setMode} />
              </Box>

              <div className="lp-divider" />

              {/* ── Student Info ── */}
              <Box className="lp-section lp-animate">
                <div className="lp-section-label">
                  <span className="lp-step">2</span>
                  Student Information
                </div>
                <UserDetails studentInfo={studentInfo} handleStudent={handleStudent} />
              </Box>

              {/* ── Subject Selection ── */}
              <Box className="lp-section lp-animate">
                <div className="lp-section-label">
                  <span className="lp-step">3</span>
                  {isTranscript ? 'Year & Course' : 'Year, Course & Semester'}
                </div>
                <Selectsubject selection={selection} setSelection={setSelection} />
              </Box>

              {/* ── Marks / Transcript ── */}
              <Box className="lp-animate">
                <div className="lp-section-label" style={{ paddingLeft: '0.25rem' }}>
                  <span className="lp-step">4</span>
                  {isTranscript ? 'Transcript Preview' : 'Marks Entry'}
                </div>
                {isTranscript ? (
                  <TranscriptView
                    allData={allSemestersData}
                    setAllData={setAllSemestersData}
                  />
                ) : (
                  <MarksCardView
                    activeSem={selection.sem[0]}
                    allData={allSemestersData}
                    setAllData={setAllSemestersData}
                  />
                )}
              </Box>

              {/* ── Generate Button ── */}
              <Box className="lp-animate" pt={2} pb={6}>
                <button className="lp-btn" onClick={handleDownload}>
                  <span className="lp-btn-icon">
                    {isTranscript ? '📋' : '📄'}
                  </span>
                  Generate {isTranscript ? 'Transcript' : 'Marks Card'}
                </button>
              </Box>

            </VStack>
          </Box>
        </div>
      </div>
    </>
  );
};

export default LeftPage;