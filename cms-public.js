(function(){
  const cfg=window.MASRAWEYA_SUPABASE||{};
  const defaults=window.MASRAWEYA_DEFAULT_CONTENT||{};
  const lang=localStorage.getItem('masraweya-lang')||'en';
  window.MASRAWEYA_CMS={content:defaults,lang};
  function merge(a,b){if(!b||typeof b!=='object')return a;for(const k of Object.keys(b)){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k]))a[k]=merge(a[k]||{},b[k]);else a[k]=b[k];}return a;}
  function get(obj,path){return path.split('.').reduce((o,k)=>o==null?undefined:o[k],obj)}
  function apply(c){
    window.MASRAWEYA_CMS.content=c;
    document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-cms]').forEach(el=>{const v=get(c,el.dataset.cms);if(v!=null)el.textContent=typeof v==='object'?(v[lang]??v.en??''):v;});
    document.querySelectorAll('[data-cms-image]').forEach(el=>{const v=get(c,el.dataset.cmsImage);if(v)el.src=v;});
    document.querySelectorAll('[data-results-link]').forEach(el=>{el.href=c.site?.resultsUrl||'#';el.target='_blank';el.rel='noopener';});
    if(c.site?.name?.[lang])document.querySelectorAll('[data-school-name]').forEach(e=>e.textContent=c.site.name[lang]);
    if(c.site?.sub?.[lang])document.querySelectorAll('[data-school-sub]').forEach(e=>e.textContent=c.site.sub[lang]);
  }
  async function load(){
    if(!cfg.url||!cfg.anonKey){apply(defaults);return;}
    try{const r=await fetch(cfg.url+'/rest/v1/site_content?id=eq.1&select=content',{headers:{apikey:cfg.anonKey,Authorization:'Bearer '+cfg.anonKey}});if(r.ok){const rows=await r.json();if(rows[0]?.content)apply(merge(structuredClone(defaults),rows[0].content));else apply(defaults);}else apply(defaults);}catch(e){apply(defaults);}
  }
  window.MASRAWEYA_CMS_READY=load();
})();
