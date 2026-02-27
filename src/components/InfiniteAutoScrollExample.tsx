import { InfiniteAutoScroll } from './InfiniteAutoScroll';

// Example usage
interface Product {
  id: string;
  name: string;
  description: string;
}

const sampleProducts: Product[] = [
  { id: '1', name: 'Schezwan Sauce', description: 'Bold Indo-Chinese Flavor' },
  { id: '2', name: 'Peri Peri Sauce', description: 'Fiery African Heat' },
  { id: '3', name: 'BBQ Mayonnaise', description: 'Smoky & Creamy' },
  { id: '4', name: 'Garlic Sauce', description: 'Rich Garlic Punch' },
  { id: '5', name: 'Tomato Ketchup', description: 'Classic Tomato Taste' },
];

export function InfiniteAutoScrollExample() {
  return (
    <div className="h-96 bg-obsidian rounded-lg border border-gold/20">
      <InfiniteAutoScroll
        items={sampleProducts}
        speed={300} // 300 pixels per second - fast & smooth
        className="p-4"
        renderItem={(product) => (
          <div className="bg-charcoal/50 rounded-lg p-4 mb-3 border border-gold/10 hover:border-gold/30 transition-colors">
            <h3 className="text-cream font-semibold text-lg">{product.name}</h3>
            <p className="text-cream/70 text-sm mt-1">{product.description}</p>
          </div>
        )}
      />
    </div>
  );
}

// Example with custom styling
export function InfiniteAutoScrollMinimal() {
  return (
    <div className="h-64 bg-black">
      <InfiniteAutoScroll
        items={sampleProducts}
        speed={300}
        renderItem={(product) => (
          <div className="py-3 px-4 border-b border-white/10">
            <span className="text-white">{product.name}</span>
          </div>
        )}
      />
    </div>
  );
}
