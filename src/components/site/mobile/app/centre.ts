/** Centre a chip in its sideways row and move nothing else. scrollIntoView also scrolls every clipped parent sideways, which pushed a whole section
 *  to the left (the text lost its first letters) when the last chip of the Industries picker was opened. */
export function centreChip(row: HTMLElement | null | undefined, chip: HTMLElement | null | undefined, behavior: ScrollBehavior = "auto") {
  if (!row || !chip) return;
  row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior });
}
