import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bed, Calculator, Car, GripVertical, Map, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { formatEtb, formatUsd, useTrip } from "../lib/trip-store";
import { useAuth } from "../context/AuthContext";

export function PlannerPage() {
  const { items, removeStop, reorder, travellers, setTravellers, days, setDays } = useTrip();
  const { user } = useAuth();
  const [dragIdx, setDragIdx] = useState(null);

  const experiences = items.reduce((sum, d) => sum + (d?.price || 0), 0) * travellers;
  const accommodation = days * 60 * travellers;
  const transport = days * 45;
  const grand = experiences + accommodation + transport;

  const handleSave = () => {
    toast.success("Itinerary saved successfully to your account!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl flex-1 px-5 py-10 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink md:text-3xl">
              Trip Planner
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.name ? `${user.name}'s custom itinerary` : "Plan and customize your Ethiopian travel itinerary"}
            </p>
          </div>
          <span className="self-start inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <CheckCircle2 className="size-3.5" /> Auto-saved locally
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Stops List */}
          <div className="space-y-3">
            {items.length ? (
              items.map((it, i) => (
                <div
                  key={it.id}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIdx !== null && dragIdx !== i) reorder(dragIdx, i);
                    setDragIdx(null);
                  }}
                  className="flex cursor-move items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:border-primary/40"
                >
                  <GripVertical className="size-5 text-muted-foreground/50 shrink-0" />
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="surface-brand size-14 shrink-0 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {it.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {it.region} · {it.level}
                    </p>
                  </div>
                  <p className="hidden text-sm font-bold text-primary sm:block">
                    {formatUsd(it.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeStop(it.id)}
                    aria-label={`Remove ${it.name}`}
                    className="p-1 text-muted-foreground/60 transition hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <p className="font-display font-bold text-ink">Your itinerary is empty</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse destinations and add stops to build your route.
                </p>
                <Link
                  to="/destinations"
                  className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Browse destinations
                </Link>
              </div>
            )}
            <Link
              to="/destinations"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/50 p-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary hover:bg-card"
            >
              <Plus className="size-4" /> Add another destination
            </Link>
          </div>

          {/* Sidebar Planner Tools */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h2 className="mb-4 flex items-center gap-2 font-display font-bold text-ink">
                <Calculator className="size-4 text-primary" /> Budget Calculator
              </h2>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Travellers
              </label>
              <input
                type="number"
                min={1}
                value={travellers}
                onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)))}
                className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Trip length (days)
              </label>
              <input
                type="number"
                min={1}
                value={days}
                onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                className="mb-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="space-y-2 border-t border-border pt-4 text-sm">
                {[
                  ["Experiences", experiences],
                  ["Accommodation (est.)", accommodation],
                  ["Transportation (est.)", transport],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-muted-foreground">
                    <span>{label}</span>
                    <span className="font-medium text-ink">{formatUsd(value)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-2 font-bold text-ink">
                  <span>Estimated total</span>
                  <span className="text-right text-primary">
                    {formatUsd(grand)}
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {formatEtb(grand)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
                <Map className="size-4 text-sky" /> Route Stops
              </h2>
              {items.length ? (
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {items.map((it, i) => (
                    <li key={it.id} className="flex items-center justify-between">
                      <span>{i + 1}. {it.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {it.lat.toFixed(2)}, {it.lng.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs text-muted-foreground">Add stops to see them plotted.</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
                <Car className="size-4 text-sky" /> Transportation Options
              </h2>
              <div className="flex flex-wrap gap-2">
                {["4WD Rental", "Domestic Flights", "Private Driver"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-sky/10 px-2.5 py-1.5 text-xs font-medium text-sky"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
                <Bed className="size-4 text-gold" /> Accommodation
              </h2>
              <div className="flex flex-wrap gap-2">
                {["Eco Lodges", "Heritage Hotels", "Guesthouses"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gold/15 px-2.5 py-1.5 text-xs font-medium text-gold-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.99]"
            >
              Save Itinerary
            </button>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PlannerPage;
