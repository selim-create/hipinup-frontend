import { ImageResponse } from "next/og";

export const alt = "Hipinup — Hayatın içinden, kültürün peşinden";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff100",
          color: "#090909",
          padding: "64px 72px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <span>Culture · Style · Life</span>
          <span style={{ color: "#20b1ea" }}>HIP!</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 138,
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: "-0.07em",
            }}
          >
            hipinup<span style={{ color: "#20b1ea" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 800,
              fontSize: 42,
              lineHeight: 1.08,
              fontWeight: 700,
            }}
          >
            Hayatın içinden, kültürün peşinden.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
