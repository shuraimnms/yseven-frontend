import { ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Where can I buy Y7 sauces?",
    answer: "Our premium sauces are currently available for pre-order. Sign up on our Shop page to be notified when we launch. We'll be available online and through select retail partners worldwide.",
  },
  {
    question: "Are Y7 sauces vegan-friendly?",
    answer: "Many of our sauces are vegan-friendly. Each product page will clearly indicate dietary information including vegan, vegetarian, gluten-free, and allergen details.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. Check our Shipping Policy for detailed information.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, contact us for a full refund. See our Refund Policy for complete details.",
  },
  {
    question: "Do you offer bulk/wholesale pricing?",
    answer: "Yes, we offer competitive B2B pricing for restaurants, hotels, caterers, and retailers. Visit our Bulk Orders page to submit an inquiry.",
  },
  {
    question: "How should I store Y7 sauces?",
    answer: "Store unopened bottles in a cool, dry place. Once opened, refrigerate and consume within 3 months for best quality. Always check the label for specific storage instructions.",
  },
];

const FAQ = () => {
  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Support</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Find answers to common questions about Y7 products and services.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-charcoal border border-gold/10 rounded-lg px-6 data-[state=open]:border-gold/30"
                >
                  <AccordionTrigger className="text-cream hover:text-gold font-display text-lg py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-cream/60 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
