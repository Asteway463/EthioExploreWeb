import React from "react";
import { Link } from "react-router-dom";
import { MountainSnow } from "lucide-react";

export function Footer() {
  return (
    <footer className="lattice mt-20 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="surface-brand flex size-8 items-center justify-center rounded-lg">
              <MountainSnow className="size-4" />
            </span>
            EthioExplore
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-foreground/70">
            Curated routes, itineraries and budgets for travelling Ethiopia — from rock-hewn
            churches to the Danakil.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold">Explore</h3>
          <ul className="space-y-2 text-sm text-ink-foreground/70">
            <li>
              <Link to="/destinations" className="transition-colors hover:text-gold">
                Destinations
              </Link>
            </li>
            <li>
              <Link to="/planner" className="transition-colors hover:text-gold">
                Trip Planner
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="transition-colors hover:text-gold">
                Favorites
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold">Company</h3>
          <ul className="space-y-2 text-sm text-ink-foreground/70">
            <li>
              <Link to="/about" className="transition-colors hover:text-gold">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold">Travel notes</h3>
          <p className="text-sm text-ink-foreground/70">
            Prices shown in USD with an approximate ETB conversion. Estimates only — always confirm
            with local operators.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-ink-foreground/50 md:px-8">
        © 2026 EthioExplore. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
