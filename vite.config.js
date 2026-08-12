import {defineConfig,loadEnv} from "vite"; import react from "@vitejs/plugin-react"; import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({mode})=>{
  const env=loadEnv(mode,process.cwd(),"");
  const url=env.VITE_SUPABASE_URL||env.NEXT_PUBLIC_SUPABASE_URL||env.SUPABASE_URL;
  const key=env.VITE_SUPABASE_PUBLISHABLE_KEY||env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||env.SUPABASE_PUBLISHABLE_KEY||env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return {plugins:[react(),tailwindcss()],define:{"import.meta.env.VITE_SUPABASE_URL":JSON.stringify(url||""),"import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY":JSON.stringify(key||"")},server:{host:true,port:5173},build:{target:"es2022",sourcemap:false}};
});
