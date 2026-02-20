import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  productCount: number;
  index?: number;
}

const CategoryCard = ({ 
  slug, 
  title, 
  description, 
  image, 
  productCount,
  index = 0 
}: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/category/${slug}`}>
        <div className="group relative overflow-hidden rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-500 bg-charcoal">
          {/* Image Container */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-all duration-500" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold text-cream group-hover:text-gold transition-colors duration-300">
                {title}
              </h3>
              <ArrowRight className="w-6 h-6 text-gold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
            </div>
            
            <p className="text-cream/70 text-sm mb-3 line-clamp-2">
              {description}
            </p>

            <Badge 
              variant="outline" 
              className="border-gold/30 text-gold bg-gold/10 text-xs"
            >
              {productCount} Product{productCount !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Corner Accent */}
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold/20 transition-all duration-300">
              <ArrowRight className="w-5 h-5 text-gold" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
