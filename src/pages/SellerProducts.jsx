import { FileArchive, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Page from "../components/Page";
import Button from "../components/Button";
import { Field, Textarea } from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { err, money, uniqueSlug } from "../lib/utils";

const initial = { title: "", short_description: "", description: "", price: "", category_id: "", cover: null, file: null };

export default function SellerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]), [categories, setCategories] = useState([]), [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState(""), [form, setForm] = useState(initial);
  async function load() {
    if (!supabase || !user) return;
    const [p, c] = await Promise.all([supabase.from("products").select("*,categories(name)").eq("seller_id", user.id).order("created_at", { ascending: false }), supabase.from("categories").select("*").order("name")]);
    setProducts(p.data || []); setCategories(c.data || []);
  }
  useEffect(() => { load(); }, [user]);
  async function upload(bucket, path, file) { const result = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" }); if (result.error) throw result.error; return path; }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (!form.title.trim() || !form.description.trim()) throw Error("Add a title and product details.");
      if (!form.file || !form.file.name.toLowerCase().endsWith(".zip")) throw Error("Upload the project as a ZIP file.");
      const productId = crypto.randomUUID(), slug = uniqueSlug(form.title);
      const filePath = `${user.id}/${productId}/${form.file.name}`;
      await upload("product-files", filePath, form.file);
      let coverPath = null;
      if (form.cover) { coverPath = `${user.id}/${productId}/cover-${form.cover.name}`; await upload("product-covers", coverPath, form.cover); }
      const product = await supabase.from("products").insert({ id: productId, seller_id: user.id, title: form.title.trim(), slug, short_description: form.short_description.trim(), description: form.description.trim(), price_cents: Math.round(Number(form.price || 0) * 100), category_id: form.category_id || null, cover_url: coverPath ? supabase.storage.from("product-covers").getPublicUrl(coverPath).data.publicUrl : null, status: "pending" }).select().single();
      if (product.error) throw product.error;
      const metadata = await supabase.from("product_files").insert({ product_id: productId, storage_path: filePath, file_name: form.file.name, file_size: form.file.size, mime_type: form.file.type || "application/zip" });
      if (metadata.error) throw metadata.error;
      setMessage("Product submitted for review. It will appear in the marketplace after approval."); setForm(initial); setOpen(false); await load();
    } catch (error) { setMessage(err(error)); } finally { setBusy(false); }
  }
  async function remove(id) { if (!confirm("Delete this product?")) return; const result = await supabase.from("products").delete().eq("id", id).eq("seller_id", user.id); if (result.error) setMessage(err(result.error)); await load(); }
  return <Page className="mx-auto w-[min(1180px,calc(100%-28px))] py-10"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-violet-300">Seller studio</p><h1 className="mt-3 text-4xl font-black tracking-tight">Your products</h1><p className="mt-2 text-zinc-500">Publish a complete digital product with its banner, details, and ZIP project file.</p></div><Button onClick={() => setOpen(!open)}><Plus size={17} /> Add product</Button></div>{message && <div className="mt-5 rounded-xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-100">{message}</div>}{open && <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-white/[.04] p-5 md:grid-cols-2"><Field label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /><Field label="Price (USD)" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /><Field label="Short description" value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} /><label className="grid gap-2 text-sm text-zinc-300">Category<select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2"><option value="">Choose category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><Textarea label="About this product" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /><div className="grid gap-4"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 p-4 text-sm text-zinc-400"><ImagePlus size={20} /><span>{form.cover?.name || "Upload banner image"}</span><input type="file" accept="image/*" className="sr-only" onChange={e => setForm({ ...form, cover: e.target.files?.[0] || null })} /></label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-violet-400/30 p-4 text-sm text-zinc-300"><FileArchive size={20} className="text-violet-300" /><span>{form.file?.name || "Upload project ZIP"}</span><input type="file" accept=".zip,application/zip" className="sr-only" onChange={e => setForm({ ...form, file: e.target.files?.[0] || null })} /></label></div><div className="flex gap-3 md:col-span-2"><Button type="submit" disabled={busy}>{busy ? "Uploading…" : "Submit for review"}</Button><Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button></div></motion.form>}<div className="mt-8 grid gap-4">{products.map(product => <motion.article layout key={product.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4"><div className="min-w-0"><p className="truncate font-bold">{product.title}</p><p className="mt-1 text-xs text-zinc-500">{product.categories?.name || "Uncategorized"} · {money((product.price_cents || 0) / 100, "USD")} · {product.status}</p></div><button type="button" onClick={() => remove(product.id)} aria-label={`Delete ${product.title}`} className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-400/10 hover:text-red-300"><Trash2 size={17} /></button></motion.article>)}{!products.length && <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-500">No products yet. Add your first digital project.</div>}</div></Page>;
}

// seller product workflow: uploads are private and product rows are created only after validated files
// Seller payment QR settings remain in SellerSettings and use the private seller-payment-qr bucket.
// Products enter pending state so admin approval controls storefront visibility.
