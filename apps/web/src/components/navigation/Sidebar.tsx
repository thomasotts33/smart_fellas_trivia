import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/games", label: "Games" },
  { href: "/games/new", label: "New Game" },
  { href: "/team/settings", label: "Team" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside
      style={{
        borderRight: "1px solid var(--sf-border)",
        background: "var(--sf-surface-raised)",
        padding: "20px",
      }}
    >
      <p
        style={{
          color: "var(--sf-primary)",
          fontFamily: "Oswald, Inter, sans-serif",
          fontWeight: 700,
          margin: "0 0 20px",
          textTransform: "uppercase",
        }}
      >
        SmartFellas
      </p>
      <nav style={{ display: "grid", gap: "8px" }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              borderRadius: "6px",
              color: "var(--sf-on-surface)",
              padding: "10px 12px",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
