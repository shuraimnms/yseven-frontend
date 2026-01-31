import { Shield, Leaf, Award, CheckCircle } from "lucide-react";

const Quality = () => {
  const certifications = [
    "HACCP Certified",
    "ISO 22000:2018",
    "FDA Registered",
    "Halal Certified",
    "Kosher Certified",
    "USDA Organic Options",
  ];

  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Our Standards</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Quality & <span className="text-gradient-gold">Safety</span>
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Uncompromising quality standards from sourcing to delivery.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Shield, title: "Food Safety", desc: "Rigorous safety protocols at every stage" },
              { icon: Leaf, title: "Natural Ingredients", desc: "Sourced from trusted suppliers worldwide" },
              { icon: Award, title: "Quality Control", desc: "Multi-point inspection process" },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 bg-charcoal/50 border border-gold/10 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-cream mb-2">{item.title}</h3>
                <p className="text-cream/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-cream mb-8 text-center">
              Certifications & <span className="text-gradient-gold">Compliance</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-3 p-4 bg-charcoal/30 border border-gold/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-cream">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Quality;
