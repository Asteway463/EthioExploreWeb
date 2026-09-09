import React from "react";
import { Link } from "react-router-dom";
import { DestinationCard } from "../components/DestinationCard";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { DESTINATIONS } from "../lib/data";
import { useTrip } from "../lib/trip-store";

export function FavoritesPage() {
  const { favorites } = useTrip();
  const favs = DESTINATIONS.filter((d) => favorites.includes(d.id));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl flex-1 px-5 py-10 md:px-8">
        <h1 className="mb-1 font-display text-2xl font-extrabold text-ink md:text-3xl">
          Favorites
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          {favs.length} saved place{favs.length !== 1 && "s"} in your travel wishlist
        </p>

        {favs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favs.map((d) => (
              <DestinationCard key={d.id} d={d} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display font-bold text-ink text-lg">No favorites yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the heart icon on any destination card to save it here for quick access.
            </p>
            <Link
              to="/destinations"
              className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
            >
              Browse destinations
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FavoritesPage;
