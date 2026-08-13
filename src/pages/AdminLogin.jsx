import { useState } from "react";
import { Navigate } from "react-router-dom";
import Page from "../components/Page";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { user, profile, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  if (!loading && user && profile?.role === "admin") return <Navigate to="/admin" replace />;
  async function submit(event) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setMessage("Unable to sign in with those credentials.");
    else setMessage("Checking admin permissions…");
    setBusy(false);
  }
  return <Page className="mx-auto flex min-h-[calc(100vh-160px)] w-[min(520px,calc(100%-28px))] items-center py-12">
    <section className="glass w-full rounded-3xl p-7 sm:p-10">
      <p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">SoloMarket control center</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight">Admin sign in.</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-400">Use the authorized Supabase account. Admin access is checked by the database role, not by this form.</p>
      <form onSubmit={submit} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm font-bold">Email<input className="rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 font-normal outline-none focus:border-violet-400" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label className="grid gap-2 text-sm font-bold">Password<input className="rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 font-normal outline-none focus:border-violet-400" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        <button disabled={busy} className="rounded-xl bg-violet-500 px-4 py-3 font-black text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in to admin"}</button>
      </form>
      {message && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{message}</p>}
    </section>
  </Page>;
} 
