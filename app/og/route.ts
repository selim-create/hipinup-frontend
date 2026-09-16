import React from "react";
import { ImageResponse } from "next/og";

export async function GET() {
  const el = React.createElement;

  return new ImageResponse(
    el(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff100",
          color: "#090909",
          padding: "64px 72px",
          fontFamily: "Arial, Helvetica, sans-serif",
        },
      },
      el(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          },
        },
        el("span", null, "Culture · Style · Life"),
        el("span", { style: { color: "#20b1ea" } }, "HIP!"),
      ),
      el(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 28 } },
        el(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 138,
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: "-0.07em",
            },
          },
          "hipinup",
          el("span", { style: { color: "#20b1ea" } }, "."),
        ),
        el(
          "div",
          {
            style: {
              display: "flex",
              maxWidth: 800,
              fontSize: 42,
              lineHeight: 1.08,
              fontWeight: 700,
            },
          },
          "Hayatın içinden, kültürün peşinden.",
        ),
      ),
    ),
    { width: 1200, height: 630 },
  );
}
