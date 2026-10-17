// Shown at once while the next screen of the app loads (the page is fetched on the server): the colour of the app screens and a small spinner,
// so opening a page never shows a blank or white flash. Styles: mobile.css, block "LAUNCHER v10".
export default function Loading() {
  return (
    <div className="m-loading" role="status" aria-label="Opening">
      <span className="m-loading-ring" aria-hidden="true" />
    </div>
  );
}
