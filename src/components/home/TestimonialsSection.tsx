import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Chef Marcus Reynolds",
    role: "Michelin Star Chef",
    content: "Y7 sauces have become an essential part of my kitchen. The depth of flavor and quality is unmatched in the industry.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Sarah Chen",
    role: "Food Blogger",
    content: "From the first taste, I knew Y7 was different. These aren't just sauces – they're culinary experiences in a bottle.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "David Okonkwo",
    role: "Restaurant Owner",
    content: "Our customers specifically ask for Y7. It's elevated our dishes and set us apart from the competition.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-charcoal relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Testimonials</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream">
            Loved by <span className="text-gradient-gold">Chefs Worldwide</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative bg-obsidian/50 border border-gold/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Content */}
              <p className="text-cream/70 text-lg leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                />
                <div>
                  <p className="font-display text-cream font-semibold">{testimonial.name}</p>
                  <p className="text-gold text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
