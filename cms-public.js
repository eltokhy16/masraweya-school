(function(){
  const cfg=window.MASRAWEYA_SUPABASE||{};
  const defaults=window.MASRAWEYA_DEFAULT_CONTENT||{};
  const lang=localStorage.getItem('masraweya-lang')||'en';
  window.MASRAWEYA_CMS={content:defaults,lang,ready:false};

  function merge(a,b){
    if(!b||typeof b!=='object')return a;
    for(const k of Object.keys(b)){
      if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])) a[k]=merge(a[k]||{},b[k]);
      else a[k]=b[k];
    }
    return a;
  }
  function get(obj,path){return path.split('.').reduce((o,k)=>o==null?undefined:o[k],obj)}

  function apply(c){
    window.MASRAWEYA_CMS.content=c;
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';

    document.querySelectorAll('[data-cms]').forEach(el=>{
      const v=get(c,el.dataset.cms);
      if(v!=null) el.textContent=typeof v==='object'?(v[lang]??v.en??''):v;
    });

    document.querySelectorAll('[data-cms-image]').forEach(el=>{
      const v=get(c,el.dataset.cmsImage);
      if(v){
        el.src=v;
        el.removeAttribute('srcset');
        el.dataset.cmsLoaded='true';
      }
    });

    document.querySelectorAll('[data-results-link]').forEach(el=>{
      el.href=c.site?.resultsUrl||'#';
      el.target='_blank';
      el.rel='noopener';
    });

    if(c.site?.name?.[lang]) document.querySelectorAll('[data-school-name]').forEach(e=>e.textContent=c.site.name[lang]);
    if(c.site?.sub?.[lang]) document.querySelectorAll('[data-school-sub]').forEach(e=>e.textContent=c.site.sub[lang]);

    window.MASRAWEYA_CMS.ready=true;
    window.dispatchEvent(new CustomEvent('masraweya-cms-ready'));
  }

  function applyWhenReady(c){
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded',()=>apply(c),{once:true});
    }else apply(c);
  }

  async function load(){
    if(!cfg.url||!cfg.anonKey){
      applyWhenReady(defaults);
      return;
    }
    try{
      const endpoint=cfg.url+'/rest/v1/site_content?id=eq.1&select=content&_cms='+Date.now();
      const r=await fetch(endpoint,{
        method:'GET',
        cache:'no-store',
        headers:{
          apikey:cfg.anonKey,
          Authorization:'Bearer '+cfg.anonKey,
          'Cache-Control':'no-cache'
        }
      });
      if(!r.ok) throw new Error('Supabase HTTP '+r.status);
      const rows=await r.json();
      const content=rows[0]?.content ? merge(structuredClone(defaults),rows[0].content) : defaults;
      applyWhenReady(content);
    }catch(e){
      console.warn('Masraweya CMS public load failed; using defaults.',e);
      applyWhenReady(defaults);
    }
  }

  window.MASRAWEYA_CMS_READY=load();
})();
