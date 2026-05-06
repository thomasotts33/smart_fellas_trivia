export default function SignInPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "min(420px, 100%)",
          background: "var(--sf-surface-raised)",
          border: "1px solid var(--sf-border)",
          borderRadius: "6px",
          padding: "24px",
        }}
      >
        <p style={{ margin: "0 0 8px", color: "var(--sf-primary)", fontWeight: 700 }}>
          SmartFellas
        </p>
        <h1 style={{ margin: "0 0 12px" }}>Sign in</h1>
        <p style={{ margin: 0, color: "var(--sf-muted)", lineHeight: 1.5 }}>
          Auth.js is wired in. Add a provider when you are ready to enable teammate access.
        </p>
      </section>
    </main>
  );
}
