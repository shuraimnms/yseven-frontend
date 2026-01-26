import { Instagram } from "lucide-react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

const instagramPosts = [
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
];

const InstagramSection = () => {
  const { socialMedia, socialMediaHandles } = useGlobalSettings();

  // Provide fallback values to prevent undefined errors
  const instagramHandle = socialMediaHandles?.instagram || 'y7sauces';
  const instagramUrl = socialMedia?.instagram || 'https://instagram.com/y7sauces';

  return (
    <section className="py-16 bg-obsidian">
      <div className="container mx-auto px-6 lg:px-12 mb-10">
        <div className="flex items-center justify-center gap-4">
          <Instagram className="w-6 h-6 text-gold" />
          <p className="text-cream text-lg">
            Follow us <span className="text-gold font-semibold">@{instagramHandle}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
        {instagramPosts.map((post, index) => (
          <a
            key={index}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden"
          >
            <img
              src={post}
              alt={`Instagram post ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-deep-red/0 group-hover:bg-deep-red/60 transition-colors duration-300 flex items-center justify-center">
              <Instagram className="w-8 h-8 text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;
