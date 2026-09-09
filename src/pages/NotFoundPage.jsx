import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="size-8 animate-pulse" />
        </div>
        <h1 className="font-display text-6xl font-extrabold text-ink">404</h1>
        <h2 className="mt-2 text-xl font-bold text-ink">Page Not Found</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          The page or route you are looking for has taken a detour or does not exist.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Back to Home
          </Link>
          <Link
            to="/destinations"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-mist"
          >
            Browse Destinations
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
