/**
 * Section 1 — short intro band above the hero. Sets the register: quiet,
 * confident, architectural.
 */

export function IntroSection() {
  return (
    <section className="intro" id="top">
      <p className="intro-eyebrow">Precast Concrete · Design + Manufacture + Erection</p>
      <h2 className="intro-line">
        A building is not poured.
        <br />
        It is <em>placed</em>.
      </h2>
      <p className="intro-hint" aria-hidden>
        Scroll
      </p>
    </section>
  );
}
