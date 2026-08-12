export function slugify(v){return String(v||"").normalize("NFKD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
export function uniqueSlug(v){return `${slugify(v)||"product"}-${crypto.randomUUID().slice(0,8)}`}
export function money(v,c="NPR"){return new Intl.NumberFormat("en-NP",{style:"currency",currency:c,maximumFractionDigits:2}).format(Number(v||0))}
export function date(v){return v?new Intl.DateTimeFormat("en",{dateStyle:"medium"}).format(new Date(v)):"—"}
export function err(e){return e?.message||"Something went wrong."}
