import { useState } from "react";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormSubmission } from '@/hooks/useFormSubmission';

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { submitForm, isSubmitting } = useFormSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email) {
      const result = await submitForm({
        fullName: 'Newsletter Subscriber',
        email: email,
        subject: 'Newsletter Subscription',
        message: 'User subscribed to newsletter',
        type: 'general'
      });

      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
      }
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-deep-red relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>

      {/* Decorative sauce drops */}
      <div className="absolute top-10 right-20 w-4 h-6 rounded-full bg-gold/20 animate-float" />
      <div className="absolute bottom-20 left-32 w-3 h-5 rounded-full bg-gold/15 animate-float" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gold/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-gold" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-6">
            Join the <span className="text-gold">Flavor Revolution</span>
          </h2>
          <p className="text-cream/70 text-lg mb-10">
            Be the first to discover new flavors, exclusive recipes, and special offers. 
            Get 15% off your first order when you subscribe.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-gold animate-scale-in">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-medium">Welcome to the Y7 family!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-obsidian/50 border-gold/30 text-cream placeholder:text-cream/40 focus:border-gold"
                required
              />
              <Button type="submit" variant="gold" size="lg" className="h-14 px-8" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          <p className="text-cream/40 text-sm mt-6">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
