import React, { useMemo } from "react";
import Subjects from "./Subjects";
import { VStack, Box, Text, SimpleGrid } from "@chakra-ui/react";

const TranscriptView = ({ allData, setAllData }) => {
  const semesterKeys = Object.keys(allData);

  const cgpa = useMemo(() => {
    const validSems = Object.values(allData).filter(s => s.totals?.sgpa > 0);
    if (validSems.length === 0) return "—";
    const sumTotalCP = validSems.reduce((acc, s) => acc + parseFloat(s.totals.totalCreditPoints), 0);
    const sumTotalCredit = validSems.reduce((acc, s) => acc + parseFloat(s.totals.totalCredits), 0);
    return (sumTotalCP /sumTotalCredit).toFixed(2);
  }, [allData]);

  // ── fix: forward BOTH updatedSubjects AND updatedTotals ──
  const makeSetSubjects = (sem) => (updatedSubjects, updatedTotals) => {
    setAllData(prev => ({
      ...prev,
      [sem]: {
        ...prev[sem],
        subjects: updatedSubjects,
        totals: updatedTotals ?? prev[sem].totals,
      },
    }));
  };

  if (semesterKeys.length === 0) {
    return (
      <>
        <style>{`
          .tv-empty {
            padding: 3rem 2rem;
            text-align: center;
            border-radius: 14px;
            border: 1px dashed rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.02);
          }
          .tv-empty-icon { font-size: 2rem; margin-bottom: 12px; opacity: 0.4; }
          .tv-empty-text {
            font-family: 'DM Sans', sans-serif;
            font-size: 0.85rem;
            color: rgba(255,255,255,0.3);
          }
        `}</style>
        <div className="tv-empty">
          <div className="tv-empty-icon">📂</div>
          <p className="tv-empty-text">
            No semester data found. Select a Year &amp; Course to load transcript data.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        /* ── Summary card ── */
        .tv-summary {
          border-radius: 16px;
          border: 1px solid rgba(99,102,241,0.2);
          overflow: hidden;
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.04) 100%);
        }
        .tv-summary-header {
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(99,102,241,0.08);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tv-summary-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .tv-summary-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        @media (max-width: 480px) {
          .tv-summary-body { grid-template-columns: 1fr; }
        }
        .tv-stat {
          padding: 16px 20px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .tv-stat:last-child { border-right: none; }
        .tv-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 4px;
        }
        .tv-stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          font-weight: 400;
          line-height: 1;
          color: white;
        }
        .tv-stat-value.cgpa {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Per-semester block ── */
        .tv-sem-block {
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          background: rgba(255,255,255,0.015);
          transition: border-color 0.2s;
        }
        .tv-sem-block:hover {
          border-color: rgba(99,102,241,0.2);
        }
        .tv-sem-header {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .tv-sem-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.75);
        }
        .tv-sem-sgpa {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.2);
        }
        .tv-sem-sgpa-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(251,191,36,0.6);
        }
        .tv-sem-sgpa-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fbbf24;
        }
        .tv-sem-body { padding: 12px; }
      `}</style>

      <VStack gap={4} w="100%" align="stretch">

        {/* ── Summary ── */}
        <div className="tv-summary">
          <div className="tv-summary-header">
            <span style={{ fontSize: '0.8rem' }}>🎓</span>
            <span className="tv-summary-title">Transcript Summary</span>
          </div>
          <div className="tv-summary-body">
            <div className="tv-stat">
              <div className="tv-stat-label">Semesters</div>
              <div className="tv-stat-value">{semesterKeys.length}</div>
            </div>
            <div className="tv-stat">
              <div className="tv-stat-label">Cumulative CGPA</div>
              <div className="tv-stat-value cgpa">{cgpa}</div>
            </div>
          </div>
        </div>

        {/* ── Per-semester blocks ── */}
        {semesterKeys.map((sem) => {
          const sgpa = allData[sem]?.totals?.sgpa;
          return (
            <div key={sem} className="tv-sem-block">
              <div className="tv-sem-header">
                <span className="tv-sem-name">{sem}</span>
                {sgpa > 0 && (
                  <div className="tv-sem-sgpa">
                    <span className="tv-sem-sgpa-label">SGPA</span>
                    <span className="tv-sem-sgpa-value">{sgpa}</span>
                  </div>
                )}
              </div>
              <div className="tv-sem-body">
                <Subjects
                  subjects={allData[sem].subjects}
                  setSubjects={makeSetSubjects(sem)}
                  total={allData[sem].totals ?? {}}
                />
              </div>
            </div>
          );
        })}

      </VStack>
    </>
  );
};

export default TranscriptView;