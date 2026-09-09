import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Plus, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "../components/DestinationCard";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { DESTINATIONS, findDestination } from "../lib/data";
import { formatEtb, formatUsd, useTrip } from "../lib/trip-store";
import { cn } from "../lib/utils";

export function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const d = findDestination(id);

  const { isFavorite, toggleFavorite, addStop } = useTrip();

  if (!d) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">Destination Not Found</h1>
          <p className="mt-2 text-muted-foreground">The destination you are looking for does not exist.</p>
          <Link
            to="/destinations"
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to all destinations
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const fav = isFavorite(d.id);
  const related = DESTINATIONS.filter((x) => x.region === d.region && x.id !== d.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="surface-brand relative flex h-72 items-end overflow-hidden md:h-96">
        <div className="absolute inset-0 bg-ink/25" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-8 md:px-8">
          <Link
            to="/destinations"
            className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-foreground/90 transition hover:text-ink-foreground"
          >
            <ArrowLeft className="size-4" /> All destinations
          </Link>
          <span className="block text-xs font-bold tracking-widest text-ink-foreground/80 uppercase">
            {d.tag}
          </span>
          <h1 className="font-display text-3xl font-extrabold text-ink-foreground md:text-5xl">
            {d.name}
          </h1>
          <p className="mt-2 flex items-center gap-1 text-sm text-ink-foreground/85">
            <MapPin className="size-4" /> {d.region} · {d.category}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl flex-1 gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <RatingStars rating={d.rating} />
              <span className="text-sm font-semibold text-ink">{d.rating}</span>
              <span className="text-sm text-muted-foreground">· Difficulty: {d.level}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{d.desc}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Best season", "Oct – Mar"],
              ["Suggested stay", "2 – 3 days"],
              ["Coordinates", `${d.lat.toFixed(2)}, ${d.lng.toFixed(2)}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="font-display font-bold text-ink mt-1">{v}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
              <TriangleAlert className="size-4 text-gold" /> Travel tips
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span> Carry cash in birr — card acceptance outside Addis Ababa is limited.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span> Local guides are mandatory in several parks and greatly improve the visit.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span> Altitude and heat vary hugely by region; pack layers for the highlands.
              </li>
            </ul>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-lg font-bold text-ink">
                More in {d.region}
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/destinations/${r.id}`}
                    className="card-lift rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="font-display font-bold text-ink">{r.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="font-display text-2xl font-extrabold text-primary">
              {formatUsd(d.price)}
              <span className="text-sm font-normal text-muted-foreground"> / person</span>
            </p>
            <p className="text-xs text-muted-foreground">{formatEtb(d.price)}</p>
            <button
              type="button"
              onClick={() => {
                addStop(d.id);
                toast.success(`${d.name} added to your itinerary`);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.99]"
            >
              <Plus className="size-4" /> Add to trip planner
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(d.id)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              <Heart
                className={cn("size-4", fav ? "fill-destructive text-destructive" : "text-muted-foreground")}
              />
              {fav ? "Saved to favorites" : "Save to favorites"}
            </button>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

export default DestinationDetailPage;
