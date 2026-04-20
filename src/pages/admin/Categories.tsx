import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Layers, Video, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { SupabaseCategory } from '@/types/supabase';
import MediaUploader from '@/components/admin/MediaUploader';

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  cover_image: '',
  cover_video: '',
  status: 'active' as 'active' | 'inactive',
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('created_at');
    setCategories((data as SupabaseCategory[]) || []);
    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(cat: SupabaseCategory) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      cover_image: cat.cover_image || '',
      cover_video: cat.cover_video || '',
      status: cat.status,
    });
    setDialogOpen(true);
  }

  async function save() {
    if (!form.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description || null,
        cover_image: form.cover_image || null,
        cover_video: form.cover_video || null,
        status: form.status,
      };

      if (editingId) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Category updated' });
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
        toast({ title: 'Category created' });
      }
      setDialogOpen(false);
      load();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(cat: SupabaseCategory) {
    const next = cat.status === 'active' ? 'inactive' : 'active';
    await supabase.from('categories').update({ status: next }).eq('id', cat.id);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this category? Products will be unlinked.')) return;
    await supabase.from('categories').delete().eq('id', id);
    toast({ title: 'Category deleted' });
    load();
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="p-8 text-center text-cream/60">
        <Layers className="w-12 h-12 mx-auto mb-4 text-gold/40" />
        <p className="text-lg mb-2">Supabase not configured</p>
        <p className="text-sm">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cream">Categories</h1>
          <p className="text-cream/60">Manage product categories — image & video supported</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={openAdd} className="bg-gold text-black hover:bg-gold/90">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-charcoal rounded-xl animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16">
          <Layers className="w-12 h-12 text-cream/20 mx-auto mb-3" />
          <p className="text-cream/50">No categories yet</p>
          <p className="text-cream/30 text-sm mt-1">Click "Add Category" to create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Card key={cat.id} className="bg-charcoal border-gold/20 overflow-hidden">
              {/* Media preview */}
              <div className="h-36 relative overflow-hidden bg-obsidian">
                {cat.cover_video ? (
                  <video src={cat.cover_video} className="w-full h-full object-cover"
                    autoPlay muted loop playsInline />
                ) : cat.cover_image ? (
                  <img src={cat.cover_image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-10 h-10 text-cream/10" />
                  </div>
                )}
                {/* Media type badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {cat.cover_video && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/80 text-white rounded text-xs font-medium">
                      <Video className="w-3 h-3" /> Video
                    </span>
                  )}
                  {cat.cover_image && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gold/80 text-black rounded text-xs font-medium">
                      <ImageIcon className="w-3 h-3" /> Image
                    </span>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-cream font-semibold">{cat.name}</h3>
                  <Badge className={cat.status === 'active'
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                    {cat.status}
                  </Badge>
                </div>
                <p className="text-cream/40 text-xs font-mono mb-1">/{cat.slug}</p>
                {cat.description && (
                  <p className="text-cream/60 text-sm line-clamp-2 mb-3">{cat.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(cat)}
                    className="border-gold/30 text-cream hover:bg-gold/10 flex-1">
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleStatus(cat)}
                    className="border-gold/30 text-cream hover:bg-gold/10">
                    {cat.status === 'active' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(cat.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-charcoal border-gold/30 text-cream max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cream">
              {editingId ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div>
              <Label className="text-cream/80">Name *</Label>
              <Input value={form.name} onChange={e => {
                const name = e.target.value;
                setForm(f => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }));
              }} className="bg-obsidian border-gold/30 text-cream mt-1" placeholder="Sauces & Condiments" />
            </div>

            {/* Slug */}
            <div>
              <Label className="text-cream/80">Slug</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                className="bg-obsidian border-gold/30 text-cream mt-1 font-mono text-sm"
                placeholder="sauces-condiments" />
            </div>

            {/* Description */}
            <div>
              <Label className="text-cream/80">Description / Tagline</Label>
              <Textarea value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="bg-obsidian border-gold/30 text-cream mt-1" rows={2}
                placeholder="Premium sauces crafted for exceptional taste" />
            </div>

            {/* Media uploader — image + video */}
            <MediaUploader
              label="Cover Media"
              imageValue={form.cover_image}
              videoValue={form.cover_video}
              onImageChange={url => setForm(f => ({ ...f, cover_image: url }))}
              onVideoChange={url => setForm(f => ({ ...f, cover_video: url }))}
              folder="categories"
            />

            {/* Status */}
            <div>
              <Label className="text-cream/80">Status</Label>
              <select value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full mt-1 bg-obsidian border border-gold/30 text-cream rounded-md px-3 py-2 text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}
              className="border-gold/30 text-cream hover:bg-gold/10">Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-gold text-black hover:bg-gold/90">
              {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
