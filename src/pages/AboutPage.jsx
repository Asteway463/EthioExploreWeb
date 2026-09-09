import React from "react";
import { Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { RouteMotif } from "../components/RouteMotif";

const values = [
  {
    icon: Compass,
    title: "Locally guided",
    text: "Every route is shaped with guides who live in the regions they show you.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent pricing",
    text: "Prices in USD with a live-style ETB conversion, and no hidden extras.",
  },
  {
    icon: HeartHandshake,
    title: "Community first",
    text: "We work with family-run lodges and cooperatives across nine regions.",
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <section className="surface-cta relative overflow-hidden py-20 text-primary-foreground">
        <RouteMotif />
        <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            We make Ethiopia easy to travel — and hard to forget.
          </h1>
          <p className="mt-4 text-primary-foreground/85">
            EthioExplore started as a shared notebook of routes between friends. Today it's a
            planning toolkit for travellers who want depth, not just checklists.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl flex-1 gap-6 px-5 py-20 md:grid-cols-3 md:px-8">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card-lift rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>
            <h2 className="font-display font-bold text-ink text-lg">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      <section className="bg-mist py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center sm:text-left">
          <h2 className="mb-4 font-display text-2xl font-extrabold text-ink">How we plan</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ethiopia rewards slow travel. Our itineraries pair one anchor region — Lalibela, Simien,
            the Danakil or the Omo Valley — with realistic transfer times, altitude notes and
            seasonal advice, so your route holds up once you're on the ground.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AboutPage;
