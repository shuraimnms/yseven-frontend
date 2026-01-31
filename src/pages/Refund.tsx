import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Refund = () => {
  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Policies</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Refund & <span className="text-gradient-gold">Return Policy</span>
          </h1>
          <p className="text-cream/70 text-lg">Your satisfaction is our priority</p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 text-cream/70">
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">30-Day Satisfaction Guarantee</h2>
                <p>We stand behind the quality of our products. If you're not completely satisfied with your Y7 purchase, you may return it within 30 days of delivery for a full refund.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Return Conditions</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Products must be unopened and in original packaging</li>
                  <li>Returns must be initiated within 30 days of delivery</li>
                  <li>Damaged or defective products will be replaced at no cost</li>
                </ul>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">How to Return</h2>
                <p>To initiate a return, contact our customer service team at returns@y7sauces.com with your order number. We'll provide return instructions and a prepaid shipping label.</p>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-cream mb-4">Refund Processing</h2>
                <p>Refunds are processed within 5-7 business days after we receive your return. Funds will be credited to your original payment method.</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/contact">
                <Button variant="gold" size="lg">Contact Customer Service</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Refund;
