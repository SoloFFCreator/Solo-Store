import {createContext,useContext,useEffect,useState} from "react";import{supabase}from "../lib/supabase";
const C=createContext(null);
export function AuthProvider({children}){const[session,setSession]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(!!supabase);
async function profileFor(u){if(!u||!supabase)return;const{data}=await supabase.from("profiles").select("*").eq("id",u.id).maybeSingle();setProfile(data||null)}
useEffect(()=>{if(!supabase){setLoading(false);return}supabase.auth.getSession().then(async({data})=>{setSession(data.session);await profileFor(data.session?.user);setLoading(false)});const{data:l}=supabase.auth.onAuthStateChange(async(_,s)=>{setSession(s);await profileFor(s?.user);setLoading(false)});return()=>l.subscription.unsubscribe()},[]);
return <C.Provider value={{session,user:session?.user||null,profile,loading,refreshProfile:()=>profileFor(session?.user),signOut:()=>supabase?.auth.signOut()}}>{children}</C.Provider>}
export function useAuth(){return useContext(C)}
