import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { DESTINATIONS, ETB_RATE } from "./data";

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("ethioexplore_favorites");
      return saved ? JSON.parse(saved) : ["lalibela", "danakil"];
    } catch {
      return ["lalibela", "danakil"];
    }
  });

  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = localStorage.getItem("ethioexplore_itinerary");
      return saved ? JSON.parse(saved) : ["lalibela", "simien"];
    } catch {
      return ["lalibela", "simien"];
    }
  });

  const [travellers, setTravellers] = useState(() => {
    try {
      const saved = localStorage.getItem("ethioexplore_travellers");
      return saved ? Number(saved) : 2;
    } catch {
      return 2;
    }
  });

  const [days, setDays] = useState(() => {
    try {
      const saved = localStorage.getItem("ethioexplore_days");
      return saved ? Number(saved) : 7;
    } catch {
      return 7;
    }
  });

  // Sync to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem("ethioexplore_favorites", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("ethioexplore_itinerary", JSON.stringify(itinerary));
    } catch {}
  }, [itinerary]);

  useEffect(() => {
    try {
      localStorage.setItem("ethioexplore_travellers", travellers.toString());
    } catch {}
  }, [travellers]);

  useEffect(() => {
    try {
      localStorage.setItem("ethioexplore_days", days.toString());
    } catch {}
  }, [days]);

  const value = useMemo(() => {
    const items = itinerary
      .map((id) => DESTINATIONS.find((d) => d.id === id))
      .filter(Boolean);

    return {
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite: (id) =>
        setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      itinerary,
      addStop: (id) => setItinerary((s) => (s.includes(id) ? s : [...s, id])),
      removeStop: (id) => setItinerary((s) => s.filter((x) => x !== id)),
      reorder: (from, to) =>
        setItinerary((s) => {
          const next = [...s];
          const moved = next.splice(from, 1)[0];
          if (moved === undefined) return s;
          next.splice(to, 0, moved);
          return next;
        }),
      items,
      travellers,
      setTravellers,
      days,
      setDays,
      rate: ETB_RATE,
    };
  }, [favorites, itinerary, travellers, days]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside TripProvider");
  return ctx;
}

export function formatUsd(usd) {
  return `$${(usd || 0).toLocaleString()}`;
}

export function formatEtb(usd, rate = ETB_RATE) {
  return `≈ ${Math.round((usd || 0) * rate).toLocaleString()} ETB`;
}

export default TripContext;
