import React from "react";

export function RouteMotif() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="size-full" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
        <path className="route-path" d="M-20,320 C120,260 180,120 320,150 C460,180 520,60 700,110 C780,130 820,90 860,60" />
        <path className="route-path" d="M-20,180 C140,220 220,300 380,270 C540,240 620,330 820,290" />
        <circle className="pin" cx="320" cy="150" r="5" fill="white" />
        <circle className="pin" cx="700" cy="110" r="5" fill="white" />
        <circle className="pin" cx="380" cy="270" r="5" fill="white" />
      </svg>
    </div>
  );
}

export default RouteMotif;
