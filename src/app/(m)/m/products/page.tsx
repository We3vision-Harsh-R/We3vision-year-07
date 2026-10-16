import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { StoreList } from "@/components/site/mobile/pages/custom/products/store";
import { ProductsToday } from "@/components/site/mobile/pages/custom/products/today";
import "./page.css";

// /products as an App Store-like app screen: a "Today" story card and the products as store rows. Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("products");

export default function Page() {
  return renderMobilePage("products", { overrides: { pageHero: ProductsToday, services: StoreList } });
}
