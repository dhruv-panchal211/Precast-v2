import { Nav } from "@/components/Nav";
import { IntroSection } from "@/components/IntroSection";
import { Hero3D } from "@/components/hero/Hero3D";
import { ContentSections } from "@/components/ContentSections";
import { Footer } from "@/components/Footer";
import { PHASES } from "@/lib/phases";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Section 1 — brief intro band above the experience. */}
        <IntroSection />

        {/* Section 2 — the scroll-driven 3D assembly + interior tour. */}
        <Hero3D />

        {/* Server-rendered caption copy for SEO / assistive tech — the live
            captions are client-driven, so the full narrative also exists as
            plain document text. */}
        <section className="sr-only" aria-hidden={false}>
          <h2>The precast system, element by element</h2>
          {PHASES.filter((p) => p.caption).map((p) => (
            <article key={p.id}>
              <h3>{p.caption!.title}</h3>
              <p>{p.caption!.spec}</p>
              <p>{p.caption!.body}</p>
            </article>
          ))}
        </section>

        {/* Section 3+ — standard content below the hero. */}
        <ContentSections />
      </main>
      <Footer />
    </>
  );
}
