import { ImageResponse } from "next/og";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#faf6ee",
          color: "#241a35",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#7c3aed",
            borderRadius: "9999px",
            height: "420px",
            opacity: 0.14,
            position: "absolute",
            right: "-100px",
            top: "-100px",
            width: "420px",
          }}
        />
        <div
          style={{
            alignItems: "center",
            background: "#241a35",
            color: "#faf6ee",
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            height: "112px",
            justifyContent: "center",
            marginRight: "36px",
            width: "112px",
          }}
        >
          S
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "780px" }}>
          <div
            style={{
              color: "#6d28d9",
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Study group finder
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: "22px" }}>
            Find your people. Study better together.
          </div>
          <div style={{ color: "#625b70", display: "flex", fontSize: 30, marginTop: "26px" }}>
            Synesis connects students around the subjects and schedules they share.
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
