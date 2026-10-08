import { VrDevices } from "../metaverse/vr-devices";
import type { SectionComponent } from "./shared";

/** The wall of devices and platforms (see metaverse/vr-devices.tsx). */
export const VrDevicesSection: SectionComponent<"vrDevices"> = ({ data, sectionId }) => (
  <VrDevices id={sectionId} chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} toolsLabel={data.toolsLabel} tools={data.tools} />
);
