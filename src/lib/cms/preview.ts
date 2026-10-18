// The pages whose draft can also be previewed as the phone app (Admin > Pages > Live preview > Phone): see src/app/(m)/m/preview/[slug]/page.tsx.
// Every page can be previewed as a laptop. To add a page here, give the mobile preview route the same options as the page's own mobile route.
export const MOBILE_PREVIEW_SLUGS = ["blog"] as const;
export type MobilePreviewSlug = (typeof MOBILE_PREVIEW_SLUGS)[number];
