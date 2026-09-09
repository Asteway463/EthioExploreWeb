import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, MountainSnow, X, ArrowLeftRight, User, LogOut } from "lucide-react";
import { ETB_RATE } from "../lib/data";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Home", to: "/" },
  { label: "Destinations", to: "/destinations" },
  { label: "Trip Planner", to: "/planner" },
  { label: "Favorites", to: "/favorites" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
          <span className="surface-brand flex size-8 items-center justify-center rounded-lg text-primary-foreground shadow-sm">
            <MountainSnow className="size-4" />
          </span>
          EthioExplore
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${
                  isActive ? "font-semibold text-primary" : "text-foreground/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-card">
            <ArrowLeftRight className="size-3.5 text-primary" /> 1$ ≈ {ETB_RATE} ETB
          </span>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border bg-mist px-3 py-1.5 text-xs font-semibold text-ink">
                <span className="surface-brand flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-primary-foreground">
                  {user?.name ? user.name[0].toUpperCase() : <User className="size-3" />}
                </span>
                <span className="max-w-[120px] truncate">{user?.name || "Explorer"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-3.5" /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-mist"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
          className="rounded-lg p-2 hover:bg-mist lg:hidden text-ink"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {open && (
        <div className="fade-in flex flex-col gap-3 border-t border-border bg-background px-5 py-4 lg:hidden shadow-lg">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-1.5 text-sm font-medium ${
                  isActive ? "font-bold text-primary" : "text-foreground/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ArrowLeftRight className="size-3.5 text-primary" /> 1$ ≈ {ETB_RATE} ETB
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            {isAuthenticated ? (
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <span className="surface-brand flex size-7 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                    {user?.name ? user.name[0].toUpperCase() : <User className="size-3" />}
                  </span>
                  <span>{user?.name || "Explorer"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="size-3.5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-semibold hover:bg-mist"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
