// Uploading a picture from the admin panel. The picture is made lighter in the browser first (at most 1800 px wide, .webp), so a photo of
// several MB from a phone becomes about 200-400 KB: the website stays fast. A GIF is sent as it is (to keep its movement).

const MAX_SIDE = 1800;

async function shrink(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const k = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * k));
    const h = Math.max(1, Math.round(bitmap.height * k));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
    // keep the original when the browser cannot make a .webp or when it would not be lighter
    return blob && blob.type === "image/webp" && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Uploads one picture and returns its address (/media/<id>), or an error text. */
export async function uploadPicture(file: File): Promise<{ url: string } | { error: string }> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return { error: "Please choose a JPG, PNG, WEBP or GIF picture." };
  const blob = await shrink(file);
  const form = new FormData();
  form.append("file", blob, file.name.replace(/\.[^.]+$/, "") + (blob.type === "image/webp" ? ".webp" : ""));
  try {
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (res.ok && json.url) return { url: json.url };
    return { error: json.error ?? "Could not upload the picture." };
  } catch {
    return { error: "No connection. Please try again." };
  }
}
