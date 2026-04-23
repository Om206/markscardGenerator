import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'

const fields = [
  { label: "Student Name",       placeholder: "Enter full name",               type: "text", name: "name"           },
  { label: "Registration No.",   placeholder: "e.g. 1BG22CS001",               type: "text", name: "rollNo"         },
  { label: "College Name",       placeholder: "Enter institution name",         type: "text", name: "college"        },
  { label: "Exam Month & Year",  placeholder: "e.g. May 2024",                 type: "text", name: "examMonthYear"  },
]

const UserDetails = ({ studentInfo, handleStudent }) => {
  return (
    <>
      <style>{`
        .ud-field { display: flex; flex-direction: column; gap: 6px; }

        .ud-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }

        .ud-input-wrap {
          position: relative;
        }

        .ud-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.88);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .ud-input::placeholder {
          color: rgba(255,255,255,0.18);
        }
        .ud-input:hover {
          border-color: rgba(99,102,241,0.25);
          background: rgba(255,255,255,0.05);
        }
        .ud-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .ud-input:not(:placeholder-shown) {
          border-color: rgba(99,102,241,0.2);
        }

        /* filled indicator bar */
        .ud-input-wrap::after {
          content: '';
          position: absolute;
          bottom: 0; left: 12px; right: 12px;
          height: 2px;
          border-radius: 0 0 10px 10px;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          opacity: 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: opacity 0.2s, transform 0.25s ease;
          pointer-events: none;
        }
        .ud-input:focus + .ud-bar,
        .ud-input-wrap:focus-within::after {
          opacity: 1;
          transform: scaleX(1);
        }
      `}</style>

      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 4, md: 5 }}>
        {fields.map(({ label, placeholder, type, name }) => (
          <div key={name} className="ud-field">
            <label className="ud-label" htmlFor={name}>{label}</label>
            <div className="ud-input-wrap">
              <input
                id={name}
                className="ud-input"
                type={type}
                name={name}
                placeholder={placeholder}
                value={studentInfo[name]}
                onChange={handleStudent}
                autoComplete="off"
              />
            </div>
          </div>
        ))}
      </SimpleGrid>
    </>
  )
}

export default UserDetails