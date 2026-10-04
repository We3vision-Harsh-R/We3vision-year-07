import { SevenBackdrop } from "../seven-backdrop";
import type { SectionComponent } from "./shared";

// Page background only: two huge interlocking "7"s. Put it first on a page; it stays fixed behind the content.
export const Backdrop: SectionComponent<"backdrop7"> = () => <SevenBackdrop />;
