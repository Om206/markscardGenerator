import { Box, Input, Table, Badge, Text, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react'
import React, { useCallback } from 'react'

const GRADE_MAP = [
  { min: 9,        label: 'O',  color: 'green'  },
  { min: 8,        label: 'A+', color: 'teal'   },
  { min: 7,        label: 'A',  color: 'blue'   },
  { min: 6,        label: 'B+', color: 'cyan'   },
  { min: 5,        label: 'B',  color: 'yellow' },
  { min: 4,        label: 'C',  color: 'orange' },
  { min: -Infinity, label: 'F', color: 'red'    },
];

const getLetterGrade = (gp) =>
  GRADE_MAP.find((g) => gp >= g.min) ?? GRADE_MAP[GRADE_MAP.length - 1];

const recomputeSubject = (sub, overrides = {}) => {
  const merged      = { ...sub, ...overrides };
  const sec         = parseFloat(merged.secMarks) || 0;
  const ia          = parseFloat(merged.iaMarks)  || 0;
  const obtMarks    = sec + ia;
  const gradePoint  = Math.round((obtMarks / 10) * 100) / 100;
  const credits     = parseFloat(merged.credits)  || 0;
  const creditPoints = Math.round(gradePoint * credits * 100) / 100;
  const { label: letterGrade, color: gradeColor } = getLetterGrade(gradePoint);
  const status = obtMarks >= (parseFloat(merged.minMarks) || 0);
  return { ...merged, obtMarks, grade: gradePoint, creditPoints, letterGrade, gradeColor, status };
};

const computeTotals = (subjects) => {
  let totalMarks = 0, totalCredits = 0, totalCreditPoints = 0;
  for (const s of subjects) {
    totalMarks        += parseFloat(s.obtMarks)     || 0;
    totalCredits      += parseFloat(s.credits)      || 0;
    totalCreditPoints += parseFloat(s.creditPoints) || 0;
  }
  const sgpa = totalCredits > 0
    ? Math.round((totalCreditPoints / totalCredits) * 100) / 100
    : 0;
  return {
    totalMarks,
    totalCredits,
    totalCreditPoints: Math.round(totalCreditPoints * 100) / 100,
    sgpa,
  };
};

const hasData = (sub) =>
  sub.obtMarks !== undefined &&
  sub.secMarks !== '' &&
  sub.secMarks !== undefined;

/* ─── Shared style tokens ────────────────────────────────────────────── */
const inputStyle = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '0.85rem',
  padding: '6px 10px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const labelStyle = {
  color: 'rgba(255,255,255,0.38)',
  fontSize: '0.62rem',
  fontWeight: 600,
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  marginBottom: '3px',
};

const valueStyle = {
  color: 'rgba(255,255,255,0.82)',
  fontSize: '0.82rem',
  fontWeight: 500,
};

/* ─── Mobile Subject Card ────────────────────────────────────────────── */
const SubjectCard = ({ sub, index, onInputChange }) => {
  const passed = sub.status;
  const dataReady = hasData(sub);

  return (
    <Box
      borderRadius="14px"
      overflow="hidden"
      border="1px solid rgba(255,255,255,0.08)"
      boxShadow="0 4px 24px rgba(0,0,0,0.3)"
      mb={3}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Card Header */}
      <Box
        px={4} py={3}
        style={{
          background: 'linear-gradient(90deg, rgba(100,160,255,0.15) 0%, rgba(100,160,255,0.04) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Text style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
            {sub.name}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: '2px' }}>
            {sub.code}
          </Text>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {dataReady && (
            <Badge colorPalette={sub.gradeColor} size="sm" variant="solid" borderRadius="full" px={2}>
              {sub.letterGrade}
            </Badge>
          )}
          {dataReady && (
            <Box
              display="inline-flex" alignItems="center" gap={1}
              px={2} py="3px" borderRadius="full"
              style={{
                background: passed ? 'rgba(110,231,183,0.12)' : 'rgba(252,165,165,0.12)',
                border: `1px solid ${passed ? 'rgba(110,231,183,0.3)' : 'rgba(252,165,165,0.3)'}`,
              }}
            >
              <Box
                w="5px" h="5px" borderRadius="full"
                style={{ background: passed ? '#6ee7b7' : '#fca5a5' }}
              />
              <Text style={{ color: passed ? '#6ee7b7' : '#fca5a5', fontSize: '0.7rem', fontWeight: 700 }}>
                {passed ? 'Pass' : 'Fail'}
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Card Body */}
      <Box px={4} py={3}>

        {/* Input Row */}
        <Grid templateColumns="1fr 1fr" gap={3} mb={4}>
          <GridItem>
            <Text style={labelStyle}>SEC Marks</Text>
            <Input
              type="number"
              size="sm"
              value={sub.secMarks || ''}
              placeholder="Enter marks"
              onChange={(e) => onInputChange(index, 'secMarks', e.target.value)}
              style={inputStyle}
              _focus={{ borderColor: 'rgba(100,160,255,0.7) !important', boxShadow: '0 0 0 3px rgba(100,160,255,0.12) !important' }}
              _placeholder={{ color: 'rgba(255,255,255,0.18)' }}
            />
          </GridItem>
          <GridItem>
            <Text style={labelStyle}>IA Marks</Text>
            <Input
              type="number"
              size="sm"
              value={sub.iaMarks || ''}
              placeholder="Enter marks"
              onChange={(e) => onInputChange(index, 'iaMarks', e.target.value)}
              style={inputStyle}
              _focus={{ borderColor: 'rgba(100,160,255,0.7) !important', boxShadow: '0 0 0 3px rgba(100,160,255,0.12) !important' }}
              _placeholder={{ color: 'rgba(255,255,255,0.18)' }}
            />
          </GridItem>
        </Grid>

        {/* Stats Grid */}
        <Grid templateColumns="repeat(4, 1fr)" gap={2}>
          {[
            { label: 'Max',        value: sub.maxMarks },
            { label: 'Min',        value: sub.minMarks },
            { label: 'Credits',    value: sub.credits  },
            {
              label: 'Obtained',
              value: dataReady ? sub.obtMarks : '—',
              accent: dataReady ? (passed ? '#6ee7b7' : '#fca5a5') : undefined,
            },
            { label: 'Grade Pts',    value: dataReady ? sub.grade        : '—' },
            { label: 'Credit Pts',   value: dataReady ? sub.creditPoints : '—' },
          ].map(({ label, value, accent }) => (
            <Box
              key={label}
              px={2} py={2}
              borderRadius="8px"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Text style={labelStyle}>{label}</Text>
              <Text style={{ ...valueStyle, color: accent ?? valueStyle.color, fontWeight: accent ? 700 : 500 }}>
                {value}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

/* ─── Summary Footer (mobile) ────────────────────────────────────────── */
const MobileSummary = ({ total }) => (
  <Box
    borderRadius="14px"
    border="1px solid rgba(255,255,255,0.1)"
    overflow="hidden"
    style={{ background: 'rgba(100,160,255,0.07)' }}
  >
    <Box px={4} py={2} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
        Semester Summary
      </Text>
    </Box>
    <Grid templateColumns="repeat(2, 1fr)" gap={0}>
      {[
        { label: 'Total Marks',    value: total?.totalMarks        ?? 0 },
        { label: 'Total Credits',  value: total?.totalCredits      ?? 0 },
        { label: 'Credit Points',  value: total?.totalCreditPoints ?? 0 },
      ].map(({ label, value }, i) => (
        <Box
          key={label}
          px={4} py={3}
          style={{ borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Text style={labelStyle}>{label}</Text>
          <Text style={{ color: '#93c5fd', fontSize: '1rem', fontWeight: 700 }}>{value}</Text>
        </Box>
      ))}

      {/* SGPA spans full width */}
      <Box px={4} py={3} style={{ gridColumn: '1 / -1', background: 'rgba(251,191,36,0.06)', borderTop: '1px solid rgba(251,191,36,0.15)' }}>
        <Text style={{ ...labelStyle, color: 'rgba(251,191,36,0.6)' }}>SGPA</Text>
        <Text style={{ color: '#fbbf24', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {total?.sgpa ?? '—'}
        </Text>
      </Box>
    </Grid>
  </Box>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const Subjects = ({ subjects, setSubjects, total }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleInputChange = useCallback((index, field, value) => {
    const updatedSubjects = subjects.map((sub, i) =>
      i === index ? recomputeSubject(sub, { [field]: value }) : sub
    );
    setSubjects(updatedSubjects, computeTotals(updatedSubjects));
  }, [subjects, setSubjects]);

  /* ── Mobile: Card layout ── */
  if (isMobile) {
    return (
      <Box w="100%" px={1}>
        {subjects?.map((sub, index) => (
          <SubjectCard
            key={index}
            sub={sub}
            index={index}
            onInputChange={handleInputChange}
          />
        ))}
        <MobileSummary total={total} />
      </Box>
    );
  }

  /* ── Desktop: Table layout ── */
  return (
    <Box
      borderRadius="16px"
      overflow="hidden"
      border="1px solid rgba(255,255,255,0.15)"
      boxShadow="0 8px 32px rgba(0,0,0,0.25)"
      mt={4} w="100%"
      bg="linear-gradient(135deg, #1a2a4a 0%, #0f1e3d 100%)"
    >
      <Box
        px={5} py={3}
        bg="linear-gradient(90deg, #1e3a6e 0%, #162d57 100%)"
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Text fontWeight="700" color="white" fontSize="sm" letterSpacing="0.08em" textTransform="uppercase">
          Marks Entry
        </Text>
      </Box>

      <Box overflowX="auto">
        <Table.Root size="sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <Table.Header>
            <Table.Row>
              {[
                'Course Name','Course Code','Max','Min',
                'SEC Marks','IA Marks','Obtained','Credits',
                'Grade Pts','Credit Pts','Letter','Status'
              ].map((h) => (
                <Table.ColumnHeader
                  key={h}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(0, 0, 0, 0.55)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '10px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {subjects?.map((sub, index) => (
              <Table.Row
                key={index}
                style={{ background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.045)', transition: 'background 0.15s' }}
                _hover={{ background: 'rgba(100,160,255,0.08) !important' }}
              >
                {[sub.name, sub.code, sub.maxMarks, sub.minMarks].map((val, ci) => (
                  <Table.Cell key={ci} style={{ color: ci === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)', fontSize: '0.8rem', padding: '8px 12px', fontWeight: ci === 0 ? 500 : 400, borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: ci === 0 ? 'nowrap' : 'normal' }}>
                    {val}
                  </Table.Cell>
                ))}

                <Table.Cell style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Input type="number" size="sm" value={sub.secMarks || ''} placeholder="—"
                    onChange={(e) => handleInputChange(index, 'secMarks', e.target.value)}
                    style={{ ...inputStyle, width: '72px' }}
                    _focus={{ borderColor: 'rgba(100,160,255,0.6)', boxShadow: '0 0 0 2px rgba(100,160,255,0.15)' }}
                    _placeholder={{ color: 'rgba(255,255,255,0.2)' }}
                  />
                </Table.Cell>

                <Table.Cell style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Input type="number" size="sm" value={sub.iaMarks || ''} placeholder="—"
                    onChange={(e) => handleInputChange(index, 'iaMarks', e.target.value)}
                    style={{ ...inputStyle, width: '72px' }}
                    _focus={{ borderColor: 'rgba(100,160,255,0.6)', boxShadow: '0 0 0 2px rgba(100,160,255,0.15)' }}
                    _placeholder={{ color: 'rgba(255,255,255,0.2)' }}
                  />
                </Table.Cell>

                <Table.Cell style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Text style={{ color: hasData(sub) ? (sub.status ? '#6ee7b7' : '#fca5a5') : 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: '0.82rem' }}>
                    {hasData(sub) ? sub.obtMarks : '—'}
                  </Text>
                </Table.Cell>

                <Table.Cell style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{sub.credits}</Table.Cell>
                <Table.Cell style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>{hasData(sub) ? sub.grade : '—'}</Text>
                </Table.Cell>
                <Table.Cell style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>{hasData(sub) ? sub.creditPoints : '—'}</Text>
                </Table.Cell>

                <Table.Cell style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {hasData(sub) ? (
                    <Badge colorPalette={sub.gradeColor} size="sm" variant="solid" borderRadius="full" px={2}>{sub.letterGrade}</Badge>
                  ) : <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>—</Text>}
                </Table.Cell>

                <Table.Cell style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {hasData(sub) ? (
                    <Box display="inline-flex" alignItems="center" gap={1} px={2} py="2px" borderRadius="full"
                      style={{ background: sub.status ? 'rgba(110,231,183,0.12)' : 'rgba(252,165,165,0.12)', border: `1px solid ${sub.status ? 'rgba(110,231,183,0.35)' : 'rgba(252,165,165,0.35)'}` }}
                    >
                      <Box w="5px" h="5px" borderRadius="full" style={{ background: sub.status ? '#6ee7b7' : '#fca5a5' }} />
                      <Text style={{ color: sub.status ? '#6ee7b7' : '#fca5a5', fontSize: '0.72rem', fontWeight: 600 }}>
                        {sub.status ? 'Pass' : 'Fail'}
                      </Text>
                    </Box>
                  ) : <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>—</Text>}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row style={{ background: 'rgba(100,160,255,0.06)' }}>
              <Table.Cell colSpan={6} style={{ textAlign: 'right', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>Totals</Table.Cell>
              <Table.Cell style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#93c5fd', fontWeight: 700 }}>{total?.totalMarks ?? 0}</Table.Cell>
              <Table.Cell style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#93c5fd', fontWeight: 700 }}>{total?.totalCredits ?? 0}</Table.Cell>
              <Table.Cell style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
              <Table.Cell style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.1)', color: '#93c5fd', fontWeight: 700 }}>{total?.totalCreditPoints ?? 0}</Table.Cell>
              <Table.Cell colSpan={2} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
            </Table.Row>
            <Table.Row style={{ background: 'rgba(100,160,255,0.04)' }}>
              <Table.Cell colSpan={10} style={{ textAlign: 'right', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 12px' }}>SGPA</Table.Cell>
              <Table.Cell colSpan={2} style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 800, fontSize: '1rem' }}>{total?.sgpa ?? '—'}</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default Subjects;