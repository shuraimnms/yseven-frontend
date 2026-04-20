/**
 * Best-in-class image uploader:
 * - Drag & drop OR click to browse
 * - Paste URL directly
 * - Auto-compresses to WebP before upload (70-90% smaller)
 * - Shows compression savings
 * - Graceful fallback: if bucket missing, keeps local preview + shows setup hint
 * - Works for products, categories, any image field
 */
import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2, CheckCircle, Link2, AlertTriangle } from 'lucide-react';
import { compressAndUpload, compressImage, formatBytes } from '@/lib/imageUpload';
import { useToast } from '@/hooks/use-toast';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'categories';
  label?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  hint?: string;
}

type Tab = 'upload' | 'url';

export default function ImageUploader({
  value,
  onChange,
  folder = 'products',
  label = 'Image',
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.82,
  hint,
}: Props) {
  const [tab, setTab] = useState<Tab>('upload');
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [bucketMissing, setBucketMissing] = useState(false);
  const [urlInput, setUrlInput] = useState(value.startsWith('http') ? value : '');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    // Immediate local preview
    const local = URL.createObjectURL(file);
    setLocalPreview(local);
    setUploading(true);
    setStats(null);
    setBucketMissing(false);

    try {
      const compressed = await compressImage(file, { maxWidth, maxHeight, quality });
      setStats({ original: file.size, compressed: compressed.size });

      const url = await compressAndUpload(file, folder, { maxWidth, maxHeight, quality });
      onChange(url);
      setLocalPreview(null); // use the real URL now
      toast({
        title: '✓ Image uploaded',
        description: `${formatBytes(file.size)} → ${formatBytes(compressed.size)} (${Math.round((1 - compressed.size / file.size) * 100)}% smaller)`,
      });
    } catch (e: any) {
      const msg: string = e.message || '';
      if (msg.toLowerCase().includes('bucket')) {
        // Bucket not created yet — keep local preview, show setup hint
        setBucketMissing(true);
        // Still call onChange with the local blob URL so the form can save
        // (it won't persist after reload, but lets admin continue)
        onChange(local);
        toast({
          title: 'Storage bucket missing',
          description: 'Create the "product-images" bucket in Supabase Storage first. See setup guide.',
          variant: 'destructive',
        });
      } else {
        setLocalPreview(null);
        toast({ title: 'Upload failed', description: msg, variant: 'destructive' });
      }
    } finally {
      setUploading(false);
    }
  }, [folder, maxWidth, maxHeight, quality, onChange, toast]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setLocalPreview(null);
    setStats(null);
    setBucketMissing(false);
    toast({ title: '✓ Image URL set' });
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setLocalPreview(null);
    setStats(null);
    setBucketMissing(false);
    setUrlInput('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayUrl = localPreview || value;
  const saved = stats ? Math.round((1 - stats.compressed / stats.original) * 100) : null;

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-cream/80 text-sm font-medium">{label}</label>
        {hint && <span className="text-cream/30 text-xs">{hint}</span>}
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-lg overflow-hidden border border-gold/20 w-fit">
        {(['upload', 'url'] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors
              ${tab === t ? 'bg-gold text-black' : 'bg-obsidian text-cream/60 hover:text-cream'}`}
          >
            {t === 'upload' ? <Upload className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            {t === 'upload' ? 'Upload File' : 'Paste URL'}
          </button>
        ))}
      </div>

      {/* ── UPLOAD TAB ── */}
      {tab === 'upload' && (
        <>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl cursor-pointer transition-all select-none
              ${dragging ? 'border-gold bg-gold/10 scale-[1.01]' : 'border-gold/30 hover:border-gold/60 bg-obsidian/40'}
              ${uploading ? 'pointer-events-none' : ''}
            `}
          >
            {displayUrl ? (
              <div className="relative group">
                <img
                  src={displayUrl}
                  alt="preview"
                  className="w-full h-44 object-contain rounded-xl p-2"
                  onError={() => { setLocalPreview(null); onChange(''); }}
                />
                {/* Hover overlay */}
                {!uploading && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-white" />
                    <span className="text-white text-sm font-medium">Replace image</span>
                  </div>
                )}
                {/* Remove */}
                {!uploading && (
                  <button
                    type="button"
                    onClick={clear}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors
                  ${dragging ? 'bg-gold/20' : 'bg-gold/10'}`}>
                  <ImageIcon className={`w-7 h-7 transition-colors ${dragging ? 'text-gold' : 'text-gold/50'}`} />
                </div>
                <p className="text-cream/70 text-sm font-medium mb-1">
                  {dragging ? 'Drop to upload' : 'Drop image here or click to browse'}
                </p>
                <p className="text-cream/30 text-xs">PNG, JPG, WebP · Auto-compressed to WebP</p>
              </div>
            )}

            {/* Upload overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-9 h-9 text-gold animate-spin" />
                <p className="text-cream text-sm font-medium">Compressing & uploading…</p>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && !uploading && (
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span className="text-cream/50">{formatBytes(stats.original)} → {formatBytes(stats.compressed)}</span>
              <span className="text-green-400 font-semibold">{saved}% smaller</span>
            </div>
          )}

          {/* Bucket missing warning */}
          {bucketMissing && (
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="text-yellow-400 font-medium">Storage bucket not found</p>
                <p className="text-cream/50 mt-0.5">
                  Go to <strong className="text-cream/70">Supabase → Storage → New Bucket</strong>, name it{' '}
                  <code className="bg-black/40 px-1 rounded text-gold">product-images</code> and set it to Public.
                </p>
                <p className="text-cream/40 mt-1">The image preview is saved locally for now.</p>
              </div>
            </div>
          )}

          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </>
      )}

      {/* ── URL TAB ── */}
      {tab === 'url' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyUrl()}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-obsidian border border-gold/30 text-cream rounded-lg px-3 py-2 text-sm
                         placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="button"
              onClick={applyUrl}
              disabled={!urlInput.trim()}
              className="px-4 py-2 bg-gold text-black text-sm font-semibold rounded-lg
                         hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Set
            </button>
          </div>

          {/* Preview */}
          {value && (
            <div className="relative group">
              <img
                src={value}
                alt="preview"
                className="w-full h-44 object-contain rounded-xl border border-gold/20 bg-obsidian/40 p-2"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={clear}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full
                           flex items-center justify-center transition-colors shadow-lg opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          )}

          <p className="text-cream/30 text-xs">
            Paste any public image URL. Cloudinary, Unsplash, or your own CDN all work.
          </p>
        </div>
      )}
    </div>
  );
}
