import { TrainingPage, trainingMetadata } from "@/components/site/training/training-page";
import { getCourses } from "@/lib/training-server";

// 6 Month Industrial Training. The words and the fees are in lib/industrial-training.ts.
export const revalidate = 3600;

export const metadata = trainingMetadata(6);

export default async function Page() {
  return <TrainingPage months={6} courses={await getCourses()} />;
}
