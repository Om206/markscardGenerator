import React from 'react'
import { Portal, Select } from "@chakra-ui/react"

const SelectMenu = ({ collection, handeChange, label, placeholder, value }) => {
  return (
    <>
      <style>{`
        .sm-root { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }

        .sm-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }

        .sm-trigger {
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
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          box-sizing: border-box;
          user-select: none;
        }
        .sm-trigger:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(255,255,255,0.05);
        }
        .sm-trigger[data-state="open"] {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.07);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        /* placeholder text color */
        .sm-trigger [data-placeholder] {
          color: rgba(255,255,255,0.2);
        }

        /* chevron */
        .sm-trigger svg {
          color: rgba(255,255,255,0.3);
          transition: transform 0.2s, color 0.18s;
          flex-shrink: 0;
        }
        .sm-trigger[data-state="open"] svg {
          transform: rotate(180deg);
          color: #818cf8;
        }

        /* dropdown content */
        .sm-content {
          background: #111827;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
          backdrop-filter: blur(16px);
          min-width: 180px;
          z-index: 9999;
          animation: sm-drop 0.15s ease;
        }
        @keyframes sm-drop {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }

        /* individual items */
        .sm-item {
          padding: 9px 12px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.12s, color 0.12s;
          outline: none;
        }
        .sm-item:hover,
        .sm-item[data-highlighted] {
          background: rgba(99,102,241,0.12);
          color: rgba(255,255,255,0.95);
        }
        .sm-item[data-state="checked"] {
          background: rgba(99,102,241,0.18);
          color: #818cf8;
          font-weight: 600;
        }
        /* check indicator */
        .sm-item[data-state="checked"]::after {
          content: '✓';
          font-size: 0.7rem;
          color: #6366f1;
        }

        /* divider between items */
        .sm-item + .sm-item {
          margin-top: 2px;
        }
      `}</style>

      <Select.Root
        value={value}
        onValueChange={handeChange}
        collection={collection}
        size="lg"
        className="sm-root"
      >
        <Select.HiddenSelect />
        <Select.Label className="sm-label">{label}</Select.Label>
        <Select.Control>
          <Select.Trigger className="sm-trigger">
            <Select.ValueText placeholder={placeholder} />
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Trigger>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content className="sm-content">
              {collection.items.map((item) => (
                <Select.Item className="sm-item" item={item} key={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </>
  )
}

export default SelectMenu