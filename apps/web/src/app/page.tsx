import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
      }}
    >
      <section
        style={{
          width: "min(720px, 100%)",
          border: "1px solid var(--sf-border)",
          borderRadius: "6px",
          background: "var(--sf-surface-raised)",
          padding: "32px",
        }}
      >
        <p
          style={{
            color: "var(--sf-primary)",
            fontFamily: "Oswald, Inter, sans-serif",
            fontWeight: 700,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          SmartFellas
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: "40px", lineHeight: 1.1 }}>
          Know what you know. Track what you miss.
        </h1>
        <p style={{ color: "var(--sf-muted)", fontSize: "18px", lineHeight: 1.5 }}>
          Post-game trivia sheets become team stats, progress charts, and better Wednesday
          stories.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            marginTop: "16px",
            background: "var(--sf-primary)",
            color: "var(--sf-on-primary)",
            borderRadius: "6px",
            padding: "10px 16px",
            fontWeight: 700,
          }}
        >
          Open dashboard
        </Link>
      </section>
    </main>
  );
}
