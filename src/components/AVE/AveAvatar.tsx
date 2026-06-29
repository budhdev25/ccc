import { useState } from "react";

// AVE "visual" feed — renders the replica photo from /ave-avatar.jpg (served from
// the public/ folder). Drop the headshot there and it appears automatically.
// Falls back to a neutral teal placeholder if the file isn't present yet.
// Swap point for the real Tavus replica still/video later.
export function AveAvatar({ size = 180, speaking = false }: { size?: number; speaking?: boolean }) {
  const [errored, setErrored] = useState(false);
  const baseRing = speaking
    ? `0 0 0 3px #2dbdbd, 0 0 20px rgba(45,189,189,0.5)`
    : `0 0 0 2px rgba(45,189,189,0.45)`;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#10142a", boxShadow: baseRing }}>
        {!errored ? (
          <img
            src={`${import.meta.env.BASE_URL}ave-avatar.jpg`}
            alt="AVE"
            onError={() => setErrored(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #23a3a3 0%, #0d7377 100%)", color: "#fff", fontWeight: 700, fontSize: size * 0.26, letterSpacing: "0.06em" }}>AVE</div>
        )}
      </div>
      {speaking && (
        <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "3px solid #2dbdbd", animation: "pulse 1.1s ease-in-out infinite", pointerEvents: "none" }} />
      )}
    </div>
  );
}
