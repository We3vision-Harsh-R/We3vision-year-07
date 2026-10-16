import { BrandTile } from "./brand-mark";
import { SmartLink } from "./smart-link";

/** Logo tile at the top centre of every page (links home). */
export function LogoMark({ name }: { name: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-7 z-30 flex justify-center">
      <SmartLink href="/" aria-label={`${name} home`} className="pointer-events-auto transition hover:brightness-125">
        <BrandTile className="size-11" />
      </SmartLink>
    </div>
  );
}
