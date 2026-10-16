// The pictures inside the app icons: one line style (24 x 24, round ends), drawn for this website.

const P: Record<string, string> = {
  ai: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
  vr: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3.5l-1.5-3h-4l-1.5 3H5a2 2 0 0 1-2-2z",
  code: "M3 5h18v14H3z M7 10l3 2-3 2 M12 15h5",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18",
  phone: "M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3z M11 18h2",
  chart: "M4 20V11 M10 20V5 M16 20v-8 M21 20H3 M19.5 6l-3 3.5",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5 M3 17.5l9 5 9-5",
  pen: "M12 19l7-7 3 3-7 7z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.6 7.6 M11 13a2 2 0 1 0 0-.01",
  layout: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M3 9h18 M9 9v11",
  image: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M8.5 10a1.5 1.5 0 1 0 0-.01 M3 17l5-5 4 4 3-3 6 6",
  cube: "M12 2.5l8.5 4.7v9.6L12 21.5l-8.5-4.7V7.2z M12 12l8.5-4.8 M12 12v9.5 M12 12L3.5 7.2",
  play: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M10 9l5 3-5 3z",
  bag: "M5.5 7.5h13l1 13h-15z M9 7.5a3 3 0 0 1 6 0",
  puzzle: "M10 4a2 2 0 1 1 4 0v2h4v4h-2a2 2 0 1 0 0 4h2v4h-4v-2a2 2 0 1 0-4 0v2H6v-4h2a2 2 0 1 0 0-4H6V6h4z",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  wp: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M7 8.5l3 8 2-5.5 2 5.5 3-8",
  cart: "M3 4h2.5l2 11h10.5l2-8H7 M10 20a.8.8 0 1 0 0-.01 M17 20a.8.8 0 1 0 0-.01",
  plug: "M9 3v5 M15 3v5 M6 8h12v3a6 6 0 0 1-12 0z M12 17v4",
  flag: "M5 21V4 M5 4h13l-3 4 3 4H5",
  toolbox: "M3 8h18v12H3z M8 8V5h8v3 M3 13h18 M11 13v2h2v-2",
  video: "M3 7h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z M16 10.5l6-3v9l-6-3",
  route: "M5 18a2 2 0 1 0 0-.01 M19 6a2 2 0 1 0 0-.01 M7 18h6a3.5 3.5 0 0 0 0-7h-2a3.5 3.5 0 0 1 0-7h6",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M16.5 16.5L21 21 M8 13l2.2-2.2 1.8 1.4 3-3.2",
  mega: "M3 10v4l11 5V5z M14 8.5h3a3.5 3.5 0 0 1 0 7h-3 M7 14.5V20",
  sign: "M4 4h16v9H4z M12 13v8 M8 21h8 M8 8.5h8",
  bug: "M9 8.5a3 3 0 0 1 6 0V15a3 3 0 0 1-6 0z M12 5.5V3 M4 10l5 1.5 M20 10l-5 1.5 M4 18l5-2 M20 18l-5-2 M9 11.5h6",
  badge: "M5 4h14v17H5z M9.5 4V2.5h5V4 M12 12a2.5 2.5 0 1 0 0-.01 M8 18c.5-2 2-3 4-3s3.5 1 4 3",
  bulb: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.8 10.6c.9.8 1.3 1.6 1.3 2.4h5c0-.8.4-1.6 1.3-2.4A6 6 0 0 0 12 3z",
  slides: "M3 4h18v12H3z M12 16v4 M8 20h8 M7 12.5l3-3.2 2.2 2.2 3.8-4.2",
  home: "M4 11l8-7 8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5z",
  about: "M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z M5 20c.3-3.5 3.2-5.5 7-5.5s6.700 2 7 5.500",
  folder: "M3 6.5A2 2 0 0 1 5 4.500h4l2 2.500h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  box: "M12 3l8 4.500v9L12 21l-8-4.500v-9z M12 12l8-4.500 M12 12v9 M12 12L4 7.500",
  doc: "M6 3h8l5 5v13H6z M14 3v5h5 M9 13h7 M9 17h5",
  team: "M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M17 7a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5z M3 19c.3-3 2.700-4.500 6-4.500s5.700 1.500 6 4.500 M16 14.500c2.800-.2 4.700 1 5 3.500",
  mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M3 7l9 6.500L21 7",
  briefcase: "M3 8h18v12H3z M8.500 8V5h7v3 M3 13.500h18 M11 13.500v2h2v-2",
  sitemap: "M9 3h6v5H9z M2.500 16h6v5h-6z M15.500 16h6v5h-6z M12 8v4 M5.500 16v-4h13v4",
  services: "M4 4h6.500v6.500H4z M13.500 4H20v6.500h-6.500z M4 13.500h6.500V20H4z M17 13.500v6.500 M13.500 16.750H20",
};

export function Glyph({ name }: { name: string }) {
  const d = P[name] ?? P.grid;
  return (
    <svg className="lnc-glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path className="g-back" d={d} />
      <path className="g-body" d={d} />
      <path className="g-edge" d={d} />
    </svg>
  );
}
