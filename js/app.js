window.Solo={
 esc(v=""){const d=document.createElement("div");d.textContent=v??"";return d.innerHTML},
 money(v,c="NPR"){return c+" "+Number(v||0).toLocaleString()},
 slug(v){return String(v||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")},
 async user(){return(await soloSupabase.auth.getUser()).data.user},
 async requireAuth(){const u=await this.user();if(!u){location.href=location.pathname.includes("/dashboard/")?"../login.html":"login.html";return null}return u}
};