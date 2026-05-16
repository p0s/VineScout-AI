import Link from "next/link";

const links = [
  ["Dashboard", "/app"],
  ["Intake", "/app/intake"],
  ["Search", "/app/search"],
  ["OrbitAI", "/app/orbitai"],
  ["Memos", "/app/memos"],
  ["API", "/app/api-playground"],
  ["Deck", "/presentation"],
  ["GitHub", "https://github.com/p0s/VineScout-AI"]
];

export function AppHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          V
        </span>
        <strong>VineScout AI</strong>
        <span>Find, verify, and win Western vineyard deals.</span>
      </Link>
      <nav className="nav" aria-label="Primary">
        {links.map(([label, href]) => (
          <Link key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
