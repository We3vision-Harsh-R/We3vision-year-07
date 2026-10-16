import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobPage } from "@/components/site/career/job-page";
import { getCareerSetup, getOpenJob, getOpenJobs } from "@/lib/careers";

// The page of one job. The jobs are written in the admin panel (Careers > Jobs). Served from cache; saving a job refreshes it.
export const revalidate = 600;

export const generateStaticParams = async () => {
  try {
    return (await getOpenJobs()).map((j) => ({ slug: j.slug }));
  } catch {
    return [];
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const job = await getOpenJob((await params).slug);
  if (!job) return { title: "Position not found | We3vision", robots: { index: false } };
  const path = `/careers/${job.slug}`;
  const description = job.summary || `${job.title} at We3vision in ${job.location}. Read about the role and apply.`;
  return {
    title: `${job.title}: Job in ${job.location} | We3vision`,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: "We3vision Private Limited", title: `${job.title} at We3vision`, description },
    twitter: { card: "summary", title: `${job.title} at We3vision`, description },
  };
}

const EMPLOYMENT: Record<string, string> = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Internship: "INTERN", Contract: "CONTRACTOR" };

export default async function CareerJob({ params }: { params: Promise<{ slug: string }> }) {
  const job = await getOpenJob((await params).slug);
  if (!job) notFound();
  const { questions } = await getCareerSetup();
  // what search engines read about the job (Google for Jobs)
  const ld = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.description, ...job.responsibilities, ...job.requirements].filter(Boolean).join("\n\n"),
    datePosted: job.postedAt.slice(0, 10),
    ...(job.closesAt ? { validThrough: job.closesAt } : {}),
    employmentType: EMPLOYMENT[job.workType] ?? "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "We3vision Private Limited" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <JobPage job={job} questions={questions} />
    </>
  );
}
