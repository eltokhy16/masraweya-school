(function () {
  const cfg = window.MASRAWEYA_SUPABASE || {};
  const defaults = window.MASRAWEYA_DEFAULT_CONTENT || {};
  const lang = localStorage.getItem('masraweya-lang') || 'en';
  window.MASRAWEYA_CMS = { content: defaults, lang: lang, ready: false };

  function merge(a,b){
    if(!b || typeof b !== 'object') return a;
    Object.keys(b).forEach(function(k){
      if(b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) a[k]=merge(a[k]||{},b[k]);
      else a[k]=b[k];
    });
    return a;
  }
  function get(obj,path){ return path.split('.').reduce(function(o,k){return o==null?undefined:o[k]},obj); }

  function apply(c){
    window.MASRAWEYA_CMS.content=c;
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';

    document.querySelectorAll('[data-cms]').forEach(function(el){
      const v=get(c,el.dataset.cms);
      if(v!=null) el.textContent=typeof v==='object'?(v[lang]??v.en??v.ar??''):v;
    });

    document.querySelectorAll('[data-cms-image]').forEach(function(el){
      const v=get(c,el.dataset.cmsImage);
      if(v){
        el.removeAttribute('srcset');
        el.removeAttribute('sizes');
        el.src=v;
        el.dataset.cmsLoaded='true';
      }
    });

    document.querySelectorAll('[data-cms-bg]').forEach(function(el){
      const v=get(c,el.dataset.cmsBg);
      if(v){
        el.style.backgroundImage='url("'+String(v).replace(/"/g,'\\"')+'")';
        el.dataset.cmsBgLoaded='true';
      }
    });

    document.querySelectorAll('[data-results-link]').forEach(function(el){
      el.href=c.site?.resultsUrl||'#';
      el.target='_blank';
      el.rel='noopener noreferrer';
    });

    if(c.site?.name?.[lang]) document.querySelectorAll('[data-school-name]').forEach(function(e){e.textContent=c.site.name[lang]});
    if(c.site?.sub?.[lang]) document.querySelectorAll('[data-school-sub]').forEach(function(e){e.textContent=c.site.sub[lang]});

    window.MASRAWEYA_CMS.ready=true;
    window.dispatchEvent(new CustomEvent('masraweya-cms-ready'));
  }
  function applyWhenReady(c){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){apply(c)},{once:true});
    else apply(c);
  }
  async function load(){
    if(!cfg.url || !cfg.anonKey){ applyWhenReady(defaults); return; }
    try{
      const endpoint=cfg.url+'/rest/v1/site_content?id=eq.1&select=content';
      const r=await fetch(endpoint,{method:'GET',cache:'no-store',headers:{apikey:cfg.anonKey}});
      if(!r.ok){ const t=await r.text(); console.error('Masraweya CMS Supabase error:',r.status,t); throw new Error('Supabase HTTP '+r.status); }
      const rows=await r.json();
      console.log('Masraweya CMS loaded:',rows);
      const content=rows[0]?.content ? merge(structuredClone(defaults),rows[0].content) : defaults;
      applyWhenReady(content);
    }catch(e){ console.error('Masraweya CMS public load failed:',e); applyWhenReady(defaults); }
  }
  window.MASRAWEYA_CMS_READY=load();
})();
