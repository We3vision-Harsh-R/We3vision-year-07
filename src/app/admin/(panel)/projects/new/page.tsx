import { EMPTY_PROJECT, ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Add project" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add project</h1>
        <p className="mt-1 text-sm text-zinc-500">Write the name, a few words and add the pictures. It is on the website as soon as you save.</p>
      </div>
      <ProjectForm initial={EMPTY_PROJECT} />
    </div>
  );
}
