import { Box, HStack } from "@chakra-ui/react";

const items = [
  { value: "1", title: "Marks Card", emoji: "📄", sub: "Single semester result" },
  { value: "2", title: "Transcript", emoji: "📋", sub: "Full academic record"  },
];

const RadioButton = ({ mode, setMode }) => {
  return (
    <>
      <style>{`
        .rb-card {
          flex: 1;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          user-select: none;
          position: relative;
          overflow: hidden;
        }
        .rb-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .rb-card:hover::before { opacity: 1; }
        .rb-card:hover {
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(99,102,241,0.12);
        }
        .rb-card.active {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.1);
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.2);
        }
        .rb-card.active::before { opacity: 1; }
        .rb-emoji {
          font-size: 1.4rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .rb-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          line-height: 1.2;
        }
        .rb-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }
        .rb-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          margin-left: auto;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .rb-card.active .rb-dot {
          border-color: #6366f1;
          background: #6366f1;
          box-shadow: 0 0 8px rgba(99,102,241,0.6);
        }
      `}</style>

      <HStack gap={3} align="stretch">
        {items.map((item) => (
          <div
            key={item.value}
            className={`rb-card ${mode === item.value ? "active" : ""}`}
            onClick={() => setMode(item.value)}
          >
            <span className="rb-emoji">{item.emoji}</span>
            <div>
              <div className="rb-title">{item.title}</div>
              <div className="rb-sub">{item.sub}</div>
            </div>
            <div className="rb-dot" />
          </div>
        ))}
      </HStack>
    </>
  );
};

export default RadioButton;