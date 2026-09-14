export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function OgTemplate({
  title,
  subtitle,
  emoji,
}: {
  title: string;
  subtitle: string;
  emoji: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF9F1",
        backgroundImage:
          "radial-gradient(circle at 15% 20%, #F6B6C8 0%, transparent 35%), radial-gradient(circle at 85% 15%, #BFE4D0 0%, transparent 35%), radial-gradient(circle at 80% 85%, #F7DD7A 0%, transparent 35%)",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 120,
          marginBottom: 24,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#292522",
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: 900,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 32,
          color: "#6b6259",
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          marginTop: 48,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 28,
          fontWeight: 700,
          color: "#F28F79",
        }}
      >
        Rosa &amp; Charlotte Kinderfeestjes
      </div>
    </div>
  );
}
