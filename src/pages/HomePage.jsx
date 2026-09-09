import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Church, Landmark, Leaf, Mountain, Route as RouteIcon, Users } from "lucide-react";
import heroImage from "../assets/hero-ethiopia.jpg";
import { DestinationCard, RatingStars } from "../components/DestinationCard";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { RouteMotif } from "../components/RouteMotif";
import { DESTINATIONS, STATS, TESTIMONIALS } from "../lib/data";

const categories = [
  { icon: Landmark, label: "Historical" },
  { icon: Leaf, label: "Nature & Wildlife" },
  { icon: Mountain, label: "Adventure" },
  { icon: Users, label: "Cultural" },
  { icon: Church, label: "Religious" },
];

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Sunrise over the Simien Mountains escarpments in Ethiopia"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/65" />
        <RouteMotif />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
          <p className="fade-in mb-3 text-xs font-bold tracking-widest text-gold uppercase">
            13 months of sunshine
          </p>
          <h1 className="fade-in max-w-3xl font-display text-4xl leading-tight font-extrabold text-ink-foreground md:text-6xl">
            Discover the beauty of Ethiopia, one route at a time.
          </h1>
          <p className="fade-in mt-4 max-w-xl text-ink-foreground/80">
            Rock-hewn churches, lava lakes and afro-alpine highlands — build a day-by-day itinerary
            with real budget estimates.
          </p>
          <div className="fade-in mt-6 flex flex-wrap gap-3">
            <Link
              to="/planner"
              className="flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground transition hover:brightness-95 shadow-md"
            >
              <RouteIcon className="size-4" /> Plan Your Trip
            </Link>
            <Link
              to="/destinations"
              className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-ink-foreground transition hover:bg-white/10"
            >
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 mx-auto -mt-10 grid max-w-7xl grid-cols-2 gap-4 px-5 md:-mt-14 md:grid-cols-4 md:px-8">
        {STATS.map((s) => (
          <div key={s.l} className="card-lift rounded-2xl bg-card p-5 text-center shadow-lift border border-border">
            <div className="font-display text-2xl font-extrabold text-ink md:text-3xl">{s.n}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Popular Destinations */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-bold tracking-widest text-primary uppercase">
              Popular Destinations
            </p>
            <h2 className="font-display text-2xl font-extrabold text-ink md:text-3xl">
              Where travellers go first
            </h2>
          </div>
          <Link
            to="/destinations"
            className="hidden items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2 sm:flex"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.slice(0, 4).map((d) => (
            <DestinationCard key={d.id} d={d} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="mb-2 text-center text-xs font-bold tracking-widest text-sky uppercase">
            Categories
          </p>
          <h2 className="mb-10 text-center font-display text-2xl font-extrabold text-ink md:text-3xl">
            Travel your way
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map(({ icon: Icon, label }) => (
              <Link
                key={label}
                to={`/destinations?category=${encodeURIComponent(label)}`}
                className="card-lift rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
              >
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-6 text-primary" />
                </div>
                <div className="text-sm font-semibold text-ink">{label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="mb-2 text-center text-xs font-bold tracking-widest text-gold uppercase">
          Featured Experiences
        </p>
        <h2 className="mb-10 text-center font-display text-2xl font-extrabold text-ink md:text-3xl">
          Trending this season
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {DESTINATIONS.slice(4, 7).map((d) => (
            <DestinationCard key={d.id} d={d} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="lattice bg-ink py-20 text-ink-foreground">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="mb-2 text-center text-xs font-bold tracking-widest text-gold uppercase">
            Testimonials
          </p>
          <h2 className="mb-10 text-center font-display text-2xl font-extrabold md:text-3xl">
            Stories from the road
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="card-lift rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <RatingStars rating={t.rating} />
                <p className="mt-4 text-sm leading-relaxed text-ink-foreground/80">“{t.text}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="surface-brand flex size-9 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-foreground">{t.name}</div>
                    <div className="text-xs text-ink-foreground/60">{t.origin}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center md:px-8">
        <div className="surface-cta relative overflow-hidden rounded-3xl p-10 text-primary-foreground md:p-14 shadow-lg">
          <RouteMotif />
          <div className="relative">
            <h2 className="mb-3 font-display text-2xl font-extrabold md:text-3xl">
              Ready to plan your Ethiopia route?
            </h2>
            <p className="mx-auto mb-6 max-w-lg text-primary-foreground/85">
              Build a day-by-day itinerary with budget estimates in USD or ETB.
            </p>
            <Link
              to="/planner"
              className="inline-block rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary transition hover:bg-mist shadow-md"
            >
              Start Planning
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
