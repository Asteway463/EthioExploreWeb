import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { DestinationCard } from "../components/DestinationCard";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { CATEGORIES, DESTINATIONS, REGIONS } from "../lib/data";
import { cn } from "../lib/utils";

export function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialRegion = searchParams.get("region") || "All Regions";

  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(350);
  const [sort, setSort] = useState("rating");

  const results = useMemo(() => {
    const list = DESTINATIONS.filter(
      (d) =>
        (region === "All Regions" || d.region === region) &&
        (category === "All" || d.category === category) &&
        d.price <= maxPrice &&
        (d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.desc.toLowerCase().includes(query.toLowerCase()))
    );
    return [...list].sort((a, b) =>
      sort === "price" ? a.price - b.price : b.rating - a.rating
    );
  }, [query, region, category, maxPrice, sort]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="mx-auto max-w-7xl flex-1 px-5 py-10 md:px-8">
        <h1 className="mb-1 font-display text-2xl font-extrabold text-ink md:text-3xl">
          Destinations
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          {results.length} place{results.length !== 1 && "s"} to explore across Ethiopia
        </p>

        {/* Filter Controls */}
        <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft md:grid-cols-4">
          <label className="relative md:col-span-2">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations (e.g. Lalibela, Simien)..."
              className="w-full rounded-xl border border-input bg-background py-2.5 pr-3 pl-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="rating">Top rated</option>
            <option value="price">Lowest price</option>
          </select>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCategoryChange(c)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-mist"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="md:col-span-2 text-xs font-semibold text-muted-foreground flex flex-col justify-center">
            <span className="flex justify-between">
              <span>Max budget:</span>
              <span className="text-ink font-bold">${maxPrice} / person</span>
            </span>
            <input
              type="range"
              min={100}
              max={350}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </label>
        </div>

        {/* Results List */}
        {results.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((d) => (
              <DestinationCard key={d.id} d={d} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
            <p className="font-display text-lg font-bold text-ink">No matches found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try widening your search terms, changing the category, or raising the price slider.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setRegion("All Regions");
                setCategory("All");
                setMaxPrice(350);
              }}
              className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default DestinationsPage;
