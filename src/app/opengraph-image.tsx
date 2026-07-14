import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Synesis — Find your study group";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/images/3-colored.png"),
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#6d28d9",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          padding: "58px 64px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#8b5cf6",
            borderRadius: "9999px",
            display: "flex",
            height: "620px",
            opacity: 0.5,
            position: "absolute",
            right: "-190px",
            top: "-245px",
            width: "620px",
          }}
        />
        <div
          style={{
            background: "#a78bfa",
            borderRadius: "9999px",
            bottom: "-320px",
            display: "flex",
            height: "520px",
            left: "-150px",
            opacity: 0.28,
            position: "absolute",
            width: "520px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            position: "relative",
            width: "100%",
          }}
        >
          <img
            alt="Synesis"
            height="144"
            src={logoSrc}
            style={{ display: "flex", height: "144px", width: "360px" }}
            width="360"
          />
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "760px" }}>
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Find your study group
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "64px",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.04,
                marginTop: "16px",
              }}
            >
              Study better, together.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "27px",
                lineHeight: 1.35,
                marginTop: "24px",
                opacity: 0.9,
              }}
            >
              Find study partners who match your courses, schedule, and goals.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
