import { Download, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from '@/hooks/useSettings';
import { apiFetch } from '@/utils/apiUtils';

const Press = () => {
  const { settings } = useSettings();
  
  const pressReleases = [
    { title: "Y7 Announces Global Expansion Plans", date: "January 2026" },
    { title: "New Premium Sauce Line Coming Soon", date: "December 2025" },
    { title: "Y7 Partners with Top Restaurant Chains", date: "November 2025" },
  ];

  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Newsroom</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Press & <span className="text-gradient-gold">Media</span>
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and media resources from Y7.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-2xl font-bold text-cream mb-8">
                Latest <span className="text-gradient-gold">News</span>
              </h2>
              <div className="space-y-4">
                {pressReleases.map((release) => (
                  <div
                    key={release.title}
                    className="group p-6 bg-charcoal border border-gold/10 rounded-lg hover:border-gold/30 transition-all cursor-pointer"
                  >
                    <p className="text-gold text-xs tracking-wide mb-2">{release.date}</p>
                    <h3 className="font-display text-lg font-semibold text-cream group-hover:text-gold transition-colors flex items-center gap-2">
                      {release.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-cream mb-8">
                Media <span className="text-gradient-gold">Kit</span>
              </h2>
              <div className="p-8 bg-charcoal border border-gold/10 rounded-lg">
                <p className="text-cream/60 mb-6">
                  Download our brand assets, logos, and product images for media use.
                </p>
                {settings.downloadLinks.brochureUrl && (
                  <Button 
                    variant="gold" 
                    size="lg"
                    onClick={() => window.open(settings.downloadLinks.brochureUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Media Kit
                  </Button>
                )}
              </div>

              <div className="mt-8 p-8 bg-charcoal/50 border border-gold/10 rounded-lg">
                <h3 className="font-display text-lg font-semibold text-cream mb-4">
                  Media Inquiries
                </h3>
                <p className="text-cream/60 mb-4">
                  For press inquiries, interviews, or media requests:
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:press@y7sauces.com"
                    className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    press@y7sauces.com
                  </a>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                    onClick={() => {
                      // Create a press inquiry
                      const pressInquiry = {
                        fullName: 'Press Inquiry',
                        email: 'press@inquiry.com',
                        subject: 'Press/Media Inquiry',
                        message: 'I am interested in press information about Y7. Please contact me.',
                        type: 'press'
                      };
                      
                      apiFetch('/contact', {
                        method: 'POST',
                        body: JSON.stringify(pressInquiry)
                      }).then(() => {
                        alert('Press inquiry submitted! Please use our contact form for detailed media requests.');
                        window.location.href = '/contact';
                      });
                    }}
                  >
                    Submit Press Inquiry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Press;
