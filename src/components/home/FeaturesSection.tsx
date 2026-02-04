import { Leaf, Award, Globe, Flame } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "No artificial preservatives, colors, or flavors. Just pure, authentic taste.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized globally for exceptional quality and innovative flavors.",
  },
  {
    icon: Globe,
    title: "Global Sourcing",
    description: "Premium ingredients sourced from the finest farms around the world.",
  },
  {
    icon: Flame,
    title: "Artisan Crafted",
    description: "Small-batch production ensures consistency and perfection in every bottle.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 lg:py-16 bg-gradient-section">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-10">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Why Choose Y7</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">
            Crafted for <span className="text-gradient-gold">Excellence</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative text-center p-8 rounded-2xl bg-charcoal/30 border border-gold/10 hover:border-gold/30 hover:bg-charcoal/50 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon container */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-500">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>

              <h3 className="font-display text-xl font-semibold text-cream mb-3 group-hover:text-gold transition-colors">
                {feature.title}
              </h3>
              <p className="text-cream/60 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gold/5 blur-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
