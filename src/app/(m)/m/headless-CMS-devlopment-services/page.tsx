import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";

// /headless-CMS-devlopment-services as an app screen: the same CMS page as the laptop route, shown with the MobileApp kit. A page designer may replace this with a bespoke screen.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("headless-cms");

export default function Page() {
  return renderMobilePage("headless-cms");
}
