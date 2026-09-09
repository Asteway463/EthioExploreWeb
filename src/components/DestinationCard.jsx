import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Star } from "lucide-react";
import { formatEtb, formatUsd, useTrip } from "../lib/trip-store";
import { cn } from "../lib/utils";

export function RatingStars({ rating, className }) {
  const full = Math.floor(rating || 0);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < full ? "fill-gold text-gold" : "text-border")}
        />
      ))}
    </span>
  );
}

export function DestinationCard({ d }) {
  const { isFavorite, toggleFavorite } = useTrip();
  const fav = isFavorite(d.id);

  return (
    <article className="card-lift group overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative">
        <Link to={`/destinations/${d.id}`} className="block">
          <div className="surface-brand relative flex h-44 items-center justify-center overflow-hidden px-4 text-center">
            <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-ink">
              {d.tag}
            </span>
            <span className="font-display text-2xl font-extrabold text-primary-foreground/90">
              {d.name}
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(d.id)}
          aria-label={fav ? `Remove ${d.name} from favorites` : `Save ${d.name} to favorites`}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/90 transition-transform hover:scale-110 shadow-sm"
        >
          <Heart
            className={cn("size-4", fav ? "fill-destructive text-destructive" : "text-muted-foreground")}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="font-display font-bold text-ink">{d.name}</h3>
          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <RatingStars rating={d.rating} /> {d.rating}
          </span>
        </div>
        <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {d.region} · {d.category}
        </p>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{d.desc}</p>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-bold text-primary">
            {formatUsd(d.price)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ person</span>
            <span className="block text-[11px] font-normal text-muted-foreground">
              {formatEtb(d.price)}
            </span>
          </span>
          <Link
            to={`/destinations/${d.id}`}
            className="text-xs font-semibold text-sky hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
