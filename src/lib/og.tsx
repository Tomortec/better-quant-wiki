import { ImageResponse } from "next/og";
import { truncate } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function createOgImage({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#171717",
          color: "#fafafa",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: "3px solid #fafafa",
              borderRadius: 999,
              display: "flex",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>
              Better Quant Wiki
            </span>
            <span style={{ fontSize: 16, color: "#a3a3a3" }}>
              Quantitative finance primer
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {kicker ? (
            <span style={{ fontSize: 22, color: "#a3a3a3", letterSpacing: 0.4 }}>
              {kicker}
            </span>
          ) : null}
          <span
            style={{
              fontSize: title.length > 28 ? 52 : 64,
              fontWeight: 700,
              letterSpacing: -1.6,
              lineHeight: 1.15,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span
              style={{
                fontSize: 26,
                color: "#d4d4d4",
                lineHeight: 1.4,
                maxWidth: 980,
              }}
            >
              {truncate(subtitle, 140)}
            </span>
          ) : null}
        </div>

        <span style={{ fontSize: 20, color: "#737373" }}>wiki.zibenxiuxing.com</span>
      </div>
    ),
    { ...ogSize },
  );
}
