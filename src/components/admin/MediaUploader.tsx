/**
 * MediaUploader — upload or link an image OR video.
 * Used for category cover media (hero background).
 *
 * Supports:
 *  - Drag & drop file upload (image or video)
 *  - Click to browse
 *  - Paste any URL (image or video)
 *  - Auto-compresses images to WebP
 *  - Videos uploaded as-is (no compression)
 *  - Live preview for both image and video
 */
import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Video, Link2, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { compressAndUpload, compressImage, formatBytes } from '@/lib/imageUpload';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type MediaType = 'image' | 'video';
type Tab = 'upload' | 'url';

interface Props {
  imageValue: string;
  videoValue: string;
  onImageChange: (url: string) => void;
  onVideoChange: (url: string) => void;
  folder?: string;
  label?: string;
}

function isVideoFile(file: File) {
  return file.type.startsWith('video/');
}
function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

async function uploadVideo(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'mp4';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

export default function MediaUploader({
  imageValue,
  videoValue,
  onImageChange,
  onVideoChange,
  folder = 'categories',
  label = 'Cover Media',
}: Props) {
  const [tab, setTab] = useState<Tab>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<MediaType>('image');
  const [localPreview, setLocalPreview] = useState<{ url: string; type: MediaType } | null>(null);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);
  const [bucketMissing, setBucketMissing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File) => {
    const isVid = isVideoFile(file);
    const local = URL.createObjectURL(file);
    setLocalPreview({ url: local, type: isVid ? 'video' : 'image' });
    setUploading(true);
    setStats(null);
    setBucketMissing(false);

    try {
      if (isVid) {
        const url = await uploadVideo(file, folder);
        onVideoChange(url);
        setLocalPreview(null);
        toast({ title: '✓ Video uploaded', description: formatBytes(file.size) });
      } else {
        const compressed = await compressImage(file, { maxWidth: 1280, maxHeight: 720, quality: 0.85 });
        setStats({ original: file.size, compressed: compressed.size });
        const url = await compressAndUpload(file, folder as any, { maxWidth: 1280, maxHeight: 720, quality: 0.85 });
        onImageChange(url);
        setLocalPreview(null);
        toast({
          title: '✓ Image uploaded',
          description: `${formatBytes(file.size)} → ${formatBytes(compressed.size)} (${Math.round((1 - compressed.size / file.size) * 100)}% smaller)`,
        });
      }
    } catch (e: any) {
      const msg: string = e.message || '';
      if (msg.toLowerCase().includes('bucket')) {
        setBucketMissing(true);
        isVid ? onVideoChange(local) : onImageChange(local);
        toast({ title: 'Storage bucket missing', description: 'Create "product-images" bucket in Supabase Storage.', variant: 'destructive' });
      } else {
        setLocalPreview(null);
        toast({ title: 'Upload failed', description: msg, variant: 'destructive' });
      }
    } finally {
      setUploading(false);
    }
  }, [folder, onImageChange, onVideoChange, toast]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const applyUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (isVideoUrl(url)) {
      onVideoChange(url);
      toast({ title: '✓ Video URL set' });
    } else {
      onImageChange(url);
      toast({ title: '✓ Image URL set' });
    }
    setUrlInput('');
  };

  const clearImage = (e: React.MouseEvent) => { e.stopPropagation(); onImageChange(''); setLocalPreview(null); setStats(null); };
  const clearVideo = (e: React.MouseEvent) => { e.stopPropagation(); onVideoChange(''); setLocalPreview(null); };

  // What to show in the drop zone preview
  const preview = localPreview || (videoValue ? { url: videoValue, type: 'video' as MediaType } : imageValue ? { url: imageValue, type: 'image' as MediaType } : null);
  const saved = stats ? Math.round((1 - stats.compressed / stats.original) * 100) : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-cream/80 text-sm font-medium">{label}</label>
        <span className="text-cream/30 text-xs">Image or Video — both supported</span>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-lg overflow-hidden border border-gold/20 w-fit">
        {(['upload', 'url'] as Tab[]).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors
              ${tab === t ? 'bg-gold text-black' : 'bg-obsidian text-cream/60 hover:text-cream'}`}>
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
            className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all select-none
              ${dragging ? 'border-gold bg-gold/10 scale-[1.01]' : 'border-gold/30 hover:border-gold/60 bg-obsidian/40'}
              ${uploading ? 'pointer-events-none' : ''}`}
          >
            {preview ? (
              <div className="relative group">
                {preview.type === 'video' ? (
                  <video src={preview.url} className="w-full h-44 object-cover rounded-xl"
                    autoPlay muted loop playsInline />
                ) : (
                  <img src={preview.url} alt="preview"
                    className="w-full h-44 object-cover rounded-xl"
                    onError={() => { setLocalPreview(null); onImageChange(''); }} />
                )}
                {/* Overlay */}
                {!uploading && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-white" />
                    <span className="text-white text-sm font-medium">Replace media</span>
                  </div>
                )}
                {/* Type badge */}
                <div className="absolute top-2 left-2">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
                    ${preview.type === 'video' ? 'bg-purple-500/80 text-white' : 'bg-gold/80 text-black'}`}>
                    {preview.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {preview.type}
                  </span>
                </div>
                {/* Remove buttons */}
                {!uploading && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    {imageValue && (
                      <button type="button" onClick={clearImage}
                        className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                        title="Remove image">
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}
                    {videoValue && (
                      <button type="button" onClick={clearVideo}
                        className="w-7 h-7 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        title="Remove video">
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors
                  ${dragging ? 'bg-gold/20' : 'bg-gold/10'}`}>
                  <div className="flex gap-1">
                    <ImageIcon className={`w-6 h-6 ${dragging ? 'text-gold' : 'text-gold/50'}`} />
                    <Video className={`w-6 h-6 ${dragging ? 'text-gold' : 'text-gold/50'}`} />
                  </div>
                </div>
                <p className="text-cream/70 text-sm font-medium mb-1">
                  {dragging ? 'Drop to upload' : 'Drop image or video here, or click to browse'}
                </p>
                <p className="text-cream/30 text-xs">
                  Images: PNG, JPG, WebP (auto-compressed) · Videos: MP4, WebM, MOV
                </p>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-9 h-9 text-gold animate-spin" />
                <p className="text-cream text-sm font-medium">
                  {localPreview?.type === 'video' ? 'Uploading video…' : 'Compressing & uploading…'}
                </p>
              </div>
            )}
          </div>

          {/* Compression stats */}
          {stats && !uploading && (
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span className="text-cream/50">{formatBytes(stats.original)} → {formatBytes(stats.compressed)}</span>
              <span className="text-green-400 font-semibold">{saved}% smaller</span>
            </div>
          )}

          {bucketMissing && (
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="text-yellow-400 font-medium">Storage bucket not found</p>
                <p className="text-cream/50 mt-0.5">
                  Go to <strong className="text-cream/70">Supabase → Storage → New Bucket</strong>, name it{' '}
                  <code className="bg-black/40 px-1 rounded text-gold">product-images</code> and set it to Public.
                  Or run <code className="bg-black/40 px-1 rounded text-gold">supabase/create-storage-bucket.sql</code>.
                </p>
              </div>
            </div>
          )}

          <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden"
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
              placeholder="https://... (image or video URL)"
              className="flex-1 bg-obsidian border border-gold/30 text-cream rounded-lg px-3 py-2 text-sm
                         placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors"
            />
            <button type="button" onClick={applyUrl} disabled={!urlInput.trim()}
              className="px-4 py-2 bg-gold text-black text-sm font-semibold rounded-lg
                         hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Set
            </button>
          </div>

          <p className="text-cream/30 text-xs">
            Paste an image URL (jpg, png, webp) or video URL (mp4, webm). Auto-detected by extension.
          </p>

          {/* Current media previews */}
          <div className="grid grid-cols-2 gap-3">
            {imageValue && (
              <div className="relative group">
                <div className="absolute top-1 left-1 z-10">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gold/80 text-black rounded text-xs font-medium">
                    <ImageIcon className="w-3 h-3" /> Image
                  </span>
                </div>
                <img src={imageValue} alt="cover" className="w-full h-28 object-cover rounded-lg border border-gold/20" />
                <button type="button" onClick={clearImage}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full
                             flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            {videoValue && (
              <div className="relative group">
                <div className="absolute top-1 left-1 z-10">
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-500/80 text-white rounded text-xs font-medium">
                    <Video className="w-3 h-3" /> Video
                  </span>
                </div>
                <video src={videoValue} className="w-full h-28 object-cover rounded-lg border border-purple-500/30"
                  autoPlay muted loop playsInline />
                <button type="button" onClick={clearVideo}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full
                             flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
          </div>

          {(imageValue || videoValue) && (
            <p className="text-cream/30 text-xs">
              {imageValue && videoValue
                ? 'Both image and video set. Video plays as hero background; image used as fallback/thumbnail.'
                : imageValue
                ? 'Image set as cover. Add a video for a cinematic hero background.'
                : 'Video set as hero background. Add an image as fallback for slow connections.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
