import { SignInButton } from "@/components/auth/SignInButton";

export default function SignInPage() {
  const hasGoogleProvider = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

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
        <p style={{ margin: "0 0 18px", color: "var(--sf-muted)", lineHeight: 1.5 }}>
          Sign in to view your team's trivia history, dashboard, and settings.
        </p>
        <SignInButton hasGoogleProvider={hasGoogleProvider} />
        {!hasGoogleProvider ? (
          <p style={{ color: "var(--sf-error)", fontWeight: 700, lineHeight: 1.5, margin: "14px 0 0" }}>
            Google sign-in needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
          </p>
        ) : null}
      </section>
    </main>
  );
}
