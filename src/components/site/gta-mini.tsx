// GTA theme (task 156): the minimap of the industries city. A round radar in the lower left corner: the road, the route (the glowing line that
// leads on from the car) and a marker for every district, with a fixed arrow in the middle. The map is not turned by React: industries-road.tsx
// moves the group .gt-c-mapg (translate + scale to the car) and turns .gt-c-arrow on every frame, the same way it moves the car itself, and it
// cuts the route behind the car (stroke-dasharray on .gt-c-ahead). Colours and sizes: styles/gta-city.css (prefix gt-c-).
export type GtStop = { x: number; y: number };

export function GtMini({ road, route, stops, active }: { road: string; route: string; stops: GtStop[]; active: number }) {
  return (
    <div className="gt-c-mini" aria-hidden>
      <div className="gt-c-mini-disc">
        <svg viewBox="-62 -62 124 124">
          <g className="gt-c-mapg">
            <path d={road} className="gt-c-m-road" />
            <path d={route} className="gt-c-m-glow gt-c-ahead" />
            <path d={route} className="gt-c-m-line gt-c-ahead" />
            {stops.map((s, i) => (
              <rect key={i} className="gt-c-m-stop" data-s={i < active ? "done" : i === active ? "now" : i === active + 1 ? "next" : "far"} x={s.x - 56} y={s.y - 56} width="112" height="112" rx="20" />
            ))}
          </g>
          <g className="gt-c-arrow">
            <path d="M0 -8.5 L6.2 7 L0 3.6 L-6.2 7Z" />
          </g>
        </svg>
      </div>
      <span className="gt-c-mini-n">N</span>
    </div>
  );
}
