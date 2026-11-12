import { TrainingManager } from "@/components/admin/training-manager";
import { requireAdmin } from "@/lib/auth";
import { getCourses } from "@/lib/training-server";

export const metadata = { title: "Industrial Training" };
export const dynamic = "force-dynamic";

export default async function TrainingAdminPage() {
  await requireAdmin();
  const courses = await getCourses();
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Industrial Training</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
          The courses (technology domains) of the 3, 6 and 9 month Industrial Training pages, and the fee of each course for each length. Add a course, change its
          words or fees, hide it or move it. A course without a fee shows &quot;Contact us for the fee&quot; on the website.
        </p>
      </div>
      <TrainingManager initial={courses} />
    </div>
  );
}
