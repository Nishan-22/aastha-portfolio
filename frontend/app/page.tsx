import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const name = content?.profile?.name;
  const role = content?.profile?.role;
  return {
    title: name ? `${name} | ${role}` : "Portfolio",
    description: content?.profile?.tagline ?? "",
  };
}

export default async function Home() {
  const content = await getContent();

  return (
    <div className="bg-ambient font-sans">
      <Navbar nav={content?.nav ?? []} profile={content?.profile ?? null} />
      <main>
        <Hero profile={content?.profile ?? null} hero={content?.hero ?? null} />
        <About about={content?.about ?? null} />
        <Services services={content?.services ?? null} />
        <Projects projects={content?.projects ?? null} />
        <Experience experience={content?.experience ?? null} />
        <CTA cta={content?.cta ?? null} />
        <Contact profile={content?.profile ?? null} contact={content?.contact ?? null} />
      </main>
      <Footer footer={content?.footer ?? null} nav={content?.nav ?? []} profile={content?.profile ?? null} />
    </div>
  );
}