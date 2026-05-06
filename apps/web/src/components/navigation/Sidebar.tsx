import Link from "next/link";
import { canManageGames } from "@/lib/permissions";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/games", label: "Games" },
  { href: "/games/new", label: "New Game", requiresGameManager: true },
  { href: "/team/settings", label: "Team" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar({ role }: { role?: string | null }) {
  const visibleNavItems = navItems.filter((item) => !item.requiresGameManager || canManageGames(role));

  return (
    <aside className="sf-sidebar">
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
      <nav aria-label="Primary navigation" style={{ display: "grid", gap: "8px" }}>
        {visibleNavItems.map((item) => (
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
