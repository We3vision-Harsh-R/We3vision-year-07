"use client";

import { useId, useState } from "react";

/**
 * "Type a name, watch it get built": the laptop guide builds a website live while you type. Here: a field and a small page
 * (a bar, a headline, lines, blocks) that takes the typed name. Only the name you type is shown; all words come from the CMS (label).
 */
export function SiteBuilder({ label }: { label: string }) {
  const [name, setName] = useState("");
  const uid = useId();
  return (
    <div className="mp-wd-build">
      <label className="mp-wd-addr" htmlFor={uid}>
        <span className="mp-wd-lock" aria-hidden="true" />
        <span className="ma-sr">{label}</span>
        <input id={uid} className="mp-wd-input" value={name} maxLength={28} autoComplete="off" onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="mp-wd-page" aria-live="polite">
        <div className="mp-wd-nav">
          <b className={name ? "is-on" : ""}>{name}</b>
          <i />
          <i />
          <i />
        </div>
        <div className="mp-wd-heroline">
          <span className={name ? "is-on" : ""} />
          <span className={name ? "is-on" : ""} />
        </div>
        <div className="mp-wd-blocks">
          <em className={name ? "is-on" : ""} />
          <em className={name ? "is-on" : ""} />
          <em className={name ? "is-on" : ""} />
        </div>
      </div>
    </div>
  );
}
