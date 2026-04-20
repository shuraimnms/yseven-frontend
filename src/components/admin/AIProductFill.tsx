/**
 * AI Product Auto-Fill — calls backend proxy → NVIDIA NIM (Llama 3.1 70B)
 * No CORS issues. Key lives on the server.
 */
import { useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { aiGenerateProduct, type AIProductData } from '@/lib/aiProductFill';
import { useToast } from '@/hooks/use-toast';

interface Props {
  productName: string;
  category: string;
  onFill: (data: AIProductData) => void;
}

const CHIPS = [
  'premium export quality',
  'no preservatives, natural',
  'restaurant grade',
  'spicy and bold',
  'healthy and nutritious',
  'kids friendly',
];

export default function AIProductFill({ productName, category, onFill }: Props) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function generate() {
    if (!productName.trim()) {
      toast({ title: 'Enter a product name first', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const data = await aiGenerateProduct(productName, prompt, category || 'Food Product');
      onFill(data);
      toast({
        title: '✨ AI filled all fields',
        description: 'Review and adjust as needed before saving.',
      });
      setOpen(false);
    } catch (e: any) {
      toast({ title: 'AI Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-r from-gold/5 to-purple-500/5 overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-purple-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </div>
          <div className="text-left">
            <p className="text-cream text-sm font-semibold">AI Auto-Fill</p>
            <p className="text-cream/40 text-xs">NVIDIA Llama 3.1 70B · via Supabase Edge Function</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gold" />
          : <ChevronDown className="w-4 h-4 text-gold" />}
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-gold/20 pt-3">
          {/* Prompt input */}
          <div>
            <label className="text-cream/70 text-xs font-medium block mb-1">
              Describe the product{' '}
              <span className="text-cream/30">(optional — more detail = better results)</span>
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) generate(); }}
              rows={2}
              placeholder='e.g. "spicy Indo-Chinese sauce with garlic, restaurant grade, no preservatives"'
              className="w-full bg-obsidian border border-gold/20 text-cream rounded-lg px-3 py-2 text-sm
                         placeholder:text-cream/25 focus:outline-none focus:border-gold/50 resize-none"
            />
            <p className="text-cream/25 text-xs mt-1">Ctrl+Enter to generate</p>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5">
            {CHIPS.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => setPrompt(p => p ? `${p}, ${chip}` : chip)}
                className="px-2 py-0.5 bg-gold/10 border border-gold/20 text-gold/80 rounded-full text-xs
                           hover:bg-gold/20 hover:text-gold transition-colors"
              >
                + {chip}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <button
            type="button"
            onClick={generate}
            disabled={loading || !productName.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm
                       bg-gradient-to-r from-gold to-yellow-500 text-black
                       hover:from-yellow-400 hover:to-gold transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating with AI…</>
            ) : (
              <><Wand2 className="w-4 h-4" /> Fill All Fields with AI</>
            )}
          </button>

          <p className="text-cream/25 text-xs text-center">
            Fills: tagline · description · ingredients · benefits · features · perfect for
          </p>
          <p className="text-cream/20 text-xs text-center">
            Needs: <code className="text-gold/50">VITE_OPENROUTER_API_KEY</code> in .env · Free at openrouter.ai
          </p>
        </div>
      )}
    </div>
  );
}
