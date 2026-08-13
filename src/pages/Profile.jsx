import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Check, UserRound } from "lucide-react";
import Page from "../components/Page";
import Button from "../components/Button";
import { Field, Textarea } from "../components/Field";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ display_name: "", website: "", location: "", seller_description: "" });
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (profile) setForm({ display_name: profile.display_name || "", website: profile.website || "", location: profile.location || "", seller_description: profile.seller_description || "" }); }, [profile]);
  async function save(e) {
    e.preventDefault(); setSaving(true); setMessage("");
    try {
      let avatar_url = profile?.avatar_url || null;
      if (avatar) { const path = `${user.id}/avatar-${crypto.randomUUID()}`; const upload = await supabase.storage.from("avatars").upload(path, avatar, { upsert: true, contentType: avatar.type }); if (upload.error) throw upload.error; avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl; }
      const { error } = await supabase.from("profiles").update({ ...form, avatar_url }).eq("id", user.id);
      if (error) throw error; await refreshProfile(); setMessage("Profile saved successfully.");
    } catch (error) { setMessage(error.message || "Could not save your profile."); } finally { setSaving(false); }
  }
  return <Page className="mx-auto w-[min(900px,calc(100%-28px))] py-10"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-widest text-violet-300">Your profile</p><h1 className="mt-3 text-4xl font-black tracking-tight">Make your presence count.</h1><p className="mt-3 max-w-xl text-zinc-400">Keep your public identity and creator information current.</p></div><button type="button" onClick={() => nav(profile?.role === "seller" ? "/dashboard/products" : "/dashboard/purchases")} className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 sm:block">Back to dashboard</button></div><form onSubmit={save} className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]"><div className="glass flex flex-col items-center gap-4 rounded-3xl p-6"><div className="grid size-32 place-items-center overflow-hidden rounded-full border border-violet-400/30 bg-violet-500/15">{profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile avatar" className="size-full object-cover" /> : <UserRound className="text-violet-300" size={42} />}</div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold"><Camera size={15}/> Change photo<input className="sr-only" type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] || null)} /></label><p className="text-center text-xs text-zinc-500">{profile?.role === "seller" ? "Seller profile" : "Buyer profile"}</p></div><div className="glass grid gap-4 rounded-3xl p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Display name" value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} required /><Field label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Kathmandu, Nepal" /></div><Field label="Website" type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://your-site.com" />{profile?.role === "seller" && <Textarea label="About your digital products" value={form.seller_description} onChange={e => setForm({ ...form, seller_description: e.target.value })} placeholder="Tell buyers what you create and who it is for." />}<div className="flex items-center justify-between gap-4 pt-2">{message ? <p className="flex items-center gap-2 text-sm text-zinc-300"><Check size={16} className="text-emerald-400" />{message}</p> : <span /> }<Button type="submit" loading={saving}>Save profile</Button></div></div></form></Page>;
}

export function AuthHandle() { const nav = useNavigate(); const [message, setMessage] = useState("Completing secure sign-in..."); useEffect(() => { (async () => { const code = new URLSearchParams(window.location.search).get("code"); if (code) { const { error } = await supabase.auth.exchangeCodeForSession(code); if (error) { setMessage("This sign-in link has expired. Please try again."); return; } } nav("/dashboard", { replace: true }); })(); }, [nav]); return <main className="grid min-h-screen place-items-center p-6"><div className="glass rounded-3xl p-8 text-center"><p className="text-lg font-bold">{message}</p></div></main>; }
