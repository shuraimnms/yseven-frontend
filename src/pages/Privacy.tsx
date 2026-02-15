const Privacy = () => {
  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Privacy <span className="text-gradient-gold">Policy</span>
          </h1>
          <p className="text-cream/70 text-lg">Last updated: January 2026</p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto prose prose-invert prose-gold">
            <div className="space-y-8 text-cream/70">
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Information We Collect</h2>
                <p>We collect information you provide directly, including name, email address, shipping address, and payment information when you make a purchase or create an account.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">How We Use Your Information</h2>
                <p>We use the information to process orders, send communications, improve our services, and provide customer support. We never sell your personal data to third parties.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal information. Contact us at ysevenfoods@gmail.com for any privacy-related requests.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
