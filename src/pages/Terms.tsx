const Terms = () => {
  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Terms & <span className="text-gradient-gold">Conditions</span>
          </h1>
          <p className="text-cream/70 text-lg">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 text-cream/70">
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Acceptance of Terms</h2>
                <p>By accessing and using the Y7 website and services, you accept and agree to be bound by these Terms and Conditions.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Use of Service</h2>
                <p>You agree to use our services only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Intellectual Property</h2>
                <p>All content, trademarks, and intellectual property on this website are owned by Y7. Unauthorized use is prohibited.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Limitation of Liability</h2>
                <p>Y7 shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services or products.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
