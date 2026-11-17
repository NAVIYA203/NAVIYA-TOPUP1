import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 font-black tracking-wide">
      <span className="mark">N</span>
      <span className="text-lg">
        NAVIYA <span className="text-brand">TOPUP</span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Products" },
  { to: "/freefire", label: "Free Fire Top-up" },
  { to: "/freefire-info", label: "FF Info Bot" },
] as const;

export function SiteHeader({ action }: { action?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 h-[66px] border-b border-border bg-background/90 backdrop-blur-md md:h-[76px]">
      <div className="wrap flex h-full items-center justify-between gap-5">
        <Logo />
        <nav
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-[66px] flex-col gap-4 bg-background p-5 text-base font-bold text-muted-foreground shadow-lg md:static md:flex md:flex-row md:gap-7 md:bg-transparent md:p-0 md:text-[15px] md:shadow-none`}
        >
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="transition-colors hover:text-brand"
              activeProps={{ className: "text-brand" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
          <a href="/#contact" onClick={() => setOpen(false)} className="transition-colors hover:text-brand">
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {action ?? (
            <Link to="/catalog" className="btn btn-primary hidden sm:inline-flex">
              Browse Products ↗
            </Link>
          )}
          <button
            className="p-1 md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
