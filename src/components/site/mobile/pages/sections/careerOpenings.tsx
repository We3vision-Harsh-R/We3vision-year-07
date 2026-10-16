import type { MobileSection } from "../types";
import { Section } from "../../app";
import { RowList } from "../blocks";

export const CareerOpeningsSection: MobileSection<"careerOpenings"> = ({ data, id, extra }) => {
  const jobs = extra.jobs ?? [];
  if (jobs.length === 0) return <Section id={id} chip={data.chip} title={data.heading} intro={data.text}><p className="ma-intro">{data.emptyText}</p></Section>;
  return (
    <RowList id={id} chip={data.chip} heading={data.heading} intro={data.text} items={jobs.map((j) => ({ title: j.title, text: [j.team, j.location, j.workMode].filter(Boolean).join(" · "), href: "/careers/" + j.slug }))} />
  );
};
