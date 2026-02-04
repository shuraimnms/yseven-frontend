import { Truck, Globe, Clock, Package } from "lucide-react";

const shippingInfo = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50 (domestic)" },
  { icon: Globe, title: "Global Delivery", desc: "We ship to 50+ countries" },
  { icon: Clock, title: "Fast Processing", desc: "Orders ship within 24-48 hours" },
  { icon: Package, title: "Secure Packaging", desc: "Temperature-controlled shipping" },
];

const Shipping = () => {
  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Policies</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Shipping <span className="text-gradient-gold">Policy</span>
          </h1>
          <p className="text-cream/70 text-lg">Premium products deserve premium delivery</p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {shippingInfo.map((info) => (
              <div key={info.title} className="text-center p-6 bg-charcoal/50 border border-gold/10 rounded-lg">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                  <info.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-cream mb-1">{info.title}</h3>
                <p className="text-cream/50 text-sm">{info.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-cream/70">
            <div>
              <h2 className="font-display text-2xl font-bold text-cream mb-4">Domestic Shipping (USA)</h2>
              <div className="bg-charcoal/30 border border-gold/10 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Standard (5-7 days)</div><div className="text-cream">$5.99</div>
                  <div>Express (2-3 days)</div><div className="text-cream">$12.99</div>
                  <div>Next Day</div><div className="text-cream">$24.99</div>
                  <div className="col-span-2 pt-2 border-t border-gold/10 text-gold">Free shipping on orders over $50</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-cream mb-4">International Shipping</h2>
              <p>International shipping rates vary by destination. Delivery times typically range from 7-14 business days. Import duties and taxes may apply and are the responsibility of the customer.</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-cream mb-4">Order Tracking</h2>
              <p>Once your order ships, you'll receive an email with tracking information. You can also track your order through your account dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shipping;
