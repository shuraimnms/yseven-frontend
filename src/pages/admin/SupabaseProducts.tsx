import { useEffect, useState } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Package,
  Star, StarOff, Search, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { SupabaseProduct, SupabaseCategory, PackSize } from '@/types/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import AIProductFill from '@/components/admin/AIProductFill';
import type { AIProductData } from '@/lib/aiProductFill';

// Static fallback categories — always available even before seed SQL is run
const STATIC_CATEGORIES: SupabaseCategory[] = [
  { id: '11111111-0000-0000-0000-000000000001', name: 'Sauces & Condiments',           slug: 'sauces-condiments',       cover_image: null, cover_video: null, description: 'Premium sauces crafted for exceptional taste', status: 'active', created_at: '' },
  { id: '11111111-0000-0000-0000-000000000002', name: 'Flakes & Powders (Agro Products)', slug: 'flakes-powders',         cover_image: null, cover_video: null, description: 'Premium dried flakes and powders',           status: 'active', created_at: '' },
  { id: '11111111-0000-0000-0000-000000000003', name: 'Raw Banana Powders',             slug: 'banana-powders',          cover_image: null, cover_video: null, description: 'Nutritious banana powders',                  status: 'active', created_at: '' },
  { id: '11111111-0000-0000-0000-000000000004', name: 'Fruit & Vegetable Powders',      slug: 'fruit-vegetable-powders', cover_image: null, cover_video: null, description: 'Natural nutrition in every spoonful',        status: 'active', created_at: '' },
];

const EMPTY_FORM = {
  name: '',
  slug: '',
  category_id: '',
  tagline: '',
  description: '',
  ingredients: '',
  features: [] as string[],
  benefits: [] as string[],
  perfect_for: [] as string[],
  pack_sizes: [] as PackSize[],
  selected_size: '',
  main_image: '',
  gallery_images: [] as string[],
  status: 'active' as 'active' | 'inactive',
  is_best_seller: false,
  is_new: false,
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Editable list component
function EditableList({ label, items, onChange }: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [input, setInput] = useState('');
  return (
    <div>
      <Label className="text-cream/80">{label}</Label>
      <div className="flex gap-2 mt-1">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              onChange([...items, input.trim()]);
              setInput('');
              e.preventDefault();
            }
          }}
          className="bg-obsidian border-gold/30 text-cream" placeholder="Type and press Enter" />
        <Button type="button" size="sm" onClick={() => {
          if (input.trim()) { onChange([...items, input.trim()]); setInput(''); }
        }} className="bg-gold text-black hover:bg-gold/90">Add</Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1 bg-gold/10 text-gold border border-gold/30 rounded px-2 py-0.5 text-xs">
            {item}
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="hover:text-red-400">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SupabaseProductsAdmin() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, categories(*)').order('created_at'),
      supabase.from('categories').select('*').eq('status', 'active').order('name'),
    ]);
    setProducts((prods as SupabaseProduct[]) || []);
    // Use static fallback if Supabase categories table is empty or not seeded yet
    const fetchedCats = (cats as SupabaseCategory[]) || [];
    setCategories(fetchedCats.length > 0 ? fetchedCats : STATIC_CATEGORIES);
    setLoading(false);
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(p: SupabaseProduct) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      category_id: p.category_id || '',
      tagline: p.tagline || '',
      description: p.description || '',
      ingredients: p.ingredients || '',
      features: p.features || [],
      benefits: p.benefits || [],
      perfect_for: p.perfect_for || [],
      pack_sizes: p.pack_sizes || [],
      selected_size: p.selected_size || '',
      main_image: p.main_image || '',
      gallery_images: p.gallery_images || [],
      status: p.status,
      is_best_seller: p.is_best_seller,
      is_new: p.is_new,
    });
    setDialogOpen(true);
  }

  async function uploadImage(file: File, folder = 'products'): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!form.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const main_image = form.main_image;

      const payload = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        category_id: form.category_id || null,
        tagline: form.tagline || null,
        description: form.description || null,
        ingredients: form.ingredients || null,
        features: form.features,
        benefits: form.benefits,
        perfect_for: form.perfect_for,
        pack_sizes: form.pack_sizes,
        selected_size: form.selected_size || null,
        main_image: main_image || null,
        gallery_images: form.gallery_images,
        status: form.status,
        is_best_seller: form.is_best_seller,
        is_new: form.is_new,
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Product updated' });
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        toast({ title: 'Product created' });
      }
      setDialogOpen(false);
      load();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function toggleBestSeller(p: SupabaseProduct) {
    await supabase.from('products').update({ is_best_seller: !p.is_best_seller }).eq('id', p.id);
    load();
  }

  async function toggleStatus(p: SupabaseProduct) {
    const next = p.status === 'active' ? 'inactive' : 'active';
    await supabase.from('products').update({ status: next }).eq('id', p.id);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    toast({ title: 'Product deleted' });
    load();
  }

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category_id === catFilter;
    return matchSearch && matchCat;
  });

  if (!isSupabaseConfigured()) {
    return (
      <div className="p-8 text-center text-cream/60">
        <Package className="w-12 h-12 mx-auto mb-4 text-gold/40" />
        <p className="text-lg mb-2">Supabase not configured</p>
        <p className="text-sm">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cream">Products (Supabase)</h1>
          <p className="text-cream/60">Manage all products — changes reflect on site immediately</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline" size="sm" className="border-gold/30 text-cream hover:bg-gold/10">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={openAdd} className="bg-gold text-black hover:bg-gold/90">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: products.length, color: 'text-cream' },
          { label: 'Active', value: products.filter(p => p.status === 'active').length, color: 'text-green-400' },
          { label: 'Inactive', value: products.filter(p => p.status === 'inactive').length, color: 'text-red-400' },
          { label: 'Best Sellers', value: products.filter(p => p.is_best_seller).length, color: 'text-gold' },
        ].map(s => (
          <Card key={s.label} className="bg-charcoal border-gold/20">
            <CardContent className="p-4">
              <p className="text-cream/60 text-sm">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-charcoal border-gold/20">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..." className="pl-10 bg-obsidian border-gold/30 text-cream" />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-52 bg-obsidian border-gold/30 text-cream">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/30 z-50">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id} className="text-cream hover:bg-gold/10 focus:bg-gold/10">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-charcoal border-gold/20">
        <CardHeader>
          <CardTitle className="text-cream">Products ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-obsidian rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/20">
                    <TableHead className="text-cream/80">Product</TableHead>
                    <TableHead className="text-cream/80">Category</TableHead>
                    <TableHead className="text-cream/80">Status</TableHead>
                    <TableHead className="text-cream/80">Best Seller</TableHead>
                    <TableHead className="text-cream/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(p => (
                    <TableRow key={p.id} className="border-gold/10 hover:bg-gold/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {p.main_image ? (
                            <img src={p.main_image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-gold/10 rounded flex items-center justify-center">
                              <Package className="w-5 h-5 text-gold" />
                            </div>
                          )}
                          <div>
                            <p className="text-cream font-medium">{p.name}</p>
                            <p className="text-cream/40 text-xs font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          {(p.categories as any)?.name || '—'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={p.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleBestSeller(p)}
                          className={p.is_best_seller ? 'text-gold' : 'text-cream/30 hover:text-gold'}>
                          {p.is_best_seller ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => openEdit(p)}
                            className="border-gold/30 text-cream hover:bg-gold/10">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggleStatus(p)}
                            className="border-gold/30 text-cream hover:bg-gold/10">
                            {p.status === 'active' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => remove(p.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-charcoal border-gold/30 text-cream max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cream">
              {editingId ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* AI Auto-Fill */}
            <AIProductFill
              productName={form.name}
              category={categories.find(c => c.id === form.category_id)?.name || ''}
              onFill={(data: AIProductData) => setForm(f => ({
                ...f,
                tagline:     data.tagline     || f.tagline,
                description: data.description || f.description,
                ingredients: data.ingredients || f.ingredients,
                benefits:    data.benefits.length    ? data.benefits    : f.benefits,
                features:    data.features.length    ? data.features    : f.features,
                perfect_for: data.perfect_for.length ? data.perfect_for : f.perfect_for,
              }))}
            />

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-cream/80">Name *</Label>
                <Input value={form.name} onChange={e => {
                  const name = e.target.value;
                  setForm(f => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }));
                }} className="bg-obsidian border-gold/30 text-cream mt-1" />
              </div>
              <div>
                <Label className="text-cream/80">Slug</Label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="bg-obsidian border-gold/30 text-cream mt-1 font-mono" />
              </div>
            </div>

            <div>
              <Label className="text-cream/80">Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                <SelectTrigger className="bg-obsidian border-gold/30 text-cream mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="bg-charcoal border-gold/30 z-[200]"
                  sideOffset={4}
                >
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-cream hover:bg-gold/10 focus:bg-gold/10">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-cream/80">Tagline</Label>
              <Input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                className="bg-obsidian border-gold/30 text-cream mt-1" placeholder="Short catchy line" />
            </div>

            <div>
              <Label className="text-cream/80">Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="bg-obsidian border-gold/30 text-cream mt-1" rows={3} />
            </div>

            <div>
              <Label className="text-cream/80">Ingredients</Label>
              <Textarea value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                className="bg-obsidian border-gold/30 text-cream mt-1" rows={2} />
            </div>

            <EditableList label="Benefits" items={form.benefits}
              onChange={v => setForm(f => ({ ...f, benefits: v }))} />

            <EditableList label="Features" items={form.features}
              onChange={v => setForm(f => ({ ...f, features: v }))} />

            <EditableList label="Perfect For" items={form.perfect_for}
              onChange={v => setForm(f => ({ ...f, perfect_for: v }))} />

            {/* Main Image */}
            <ImageUploader
              label="Main Image"
              value={form.main_image}
              onChange={url => setForm(f => ({ ...f, main_image: url }))}
              folder="products"
              maxWidth={800}
              maxHeight={800}
              quality={0.82}
            />

            {/* Status & Flags */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-cream/80">Status</Label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full mt-1 bg-obsidian border border-gold/30 text-cream rounded-md px-3 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_best_seller}
                    onChange={e => setForm(f => ({ ...f, is_best_seller: e.target.checked }))}
                    className="accent-gold w-4 h-4" />
                  <span className="text-cream/80 text-sm">Best Seller</span>
                </label>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_new}
                    onChange={e => setForm(f => ({ ...f, is_new: e.target.checked }))}
                    className="accent-gold w-4 h-4" />
                  <span className="text-cream/80 text-sm">New</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}
              className="border-gold/30 text-cream hover:bg-gold/10">Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-gold text-black hover:bg-gold/90">
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
