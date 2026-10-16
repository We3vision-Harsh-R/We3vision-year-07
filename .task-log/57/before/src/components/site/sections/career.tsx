import { getCareerSetup } from "@/lib/careers";
import { CareerDestination } from "../career/destination";
import { CareerJourney } from "../career/journey";
import type { SectionComponent } from "./shared";

/** The ticket office of the Careers page (see career/journey.tsx). The positions and the questions come from the admin panel (Careers). */
export const CareerJourneySection: SectionComponent<"careerJourney"> = async ({ data }) => {
  const { roles, questions } = await getCareerSetup();
  return <CareerJourney chip={data.chip} heading={data.heading} text={data.text} locationLabel={data.locationLabel || "Your location"} roles={roles} questions={questions} />;
};

/** Surat Junction: the last section, where the train of the visitor arrives (see career/destination.tsx). */
export const CareerDestinationSection: SectionComponent<"careerDestination"> = ({ data }) => (
  <CareerDestination chip={data.chip} heading={data.heading} text={data.text} station={data.station || "Surat Junction"} address={data.address} buttonLabel={data.buttonLabel} buttonHref={data.buttonHref} />
);
