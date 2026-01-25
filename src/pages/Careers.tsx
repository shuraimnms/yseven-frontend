import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const openPositions = [
  { title: "Senior Food Scientist", location: "New York, NY", type: "Full-time" },
  { title: "Brand Marketing Manager", location: "Remote", type: "Full-time" },
  { title: "Supply Chain Specialist", location: "Chicago, IL", type: "Full-time" },
  { title: "Quality Assurance Lead", location: "New York, NY", type: "Full-time" },
];

const Careers = () => {
  return (
    <>
      <section className="relative py-32 lg:py-40 overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Join Our Team</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            <span className="text-gradient-gold">Careers</span> at Y7
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Be part of a team that's redefining flavor. We're always looking for 
            passionate individuals to join our mission.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-cream mb-8">
              Open <span className="text-gradient-gold">Positions</span>
            </h2>
            <div className="space-y-4">
              {openPositions.map((job) => (
                <div
                  key={job.title}
                  className="group flex items-center justify-between p-6 bg-charcoal border border-gold/10 rounded-lg hover:border-gold/30 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-cream group-hover:text-gold transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-cream/50 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-charcoal/50 border border-gold/10 rounded-lg text-center">
              <h3 className="font-display text-xl font-semibold text-cream mb-4">
                Don't See Your Role?
              </h3>
              <p className="text-cream/60 mb-6">
                We're always interested in meeting talented people. Send us your resume.
              </p>
              <Button variant="gold-outline" size="lg">
                Send Resume
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Careers;
