(function(){
  const cfg=window.MASRAWEYA_SUPABASE||{};
  const defaults=window.MASRAWEYA_DEFAULT_CONTENT||{};
  let lang=localStorage.getItem('masraweya-lang')||'en';
  const clone=o=>JSON.parse(JSON.stringify(o));
  function merge(a,b){if(!b||typeof b!=='object')return a;Object.keys(b).forEach(k=>{if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k]))a[k]=merge(a[k]||{},b[k]);else a[k]=b[k]});return a}
  function get(o,path){return path.split('.').reduce((x,k)=>x==null?undefined:x[k],o)}
  function value(v){if(v&&typeof v==='object'&&!Array.isArray(v))return v[lang]??v.en??v.ar??'';return v??''}
  function apply(c){
    window.MASRAWEYA_CMS={content:c,lang,ready:true};
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.body.classList.toggle('rtl',lang==='ar');
    document.querySelectorAll('[data-cms]').forEach(el=>{const v=get(c,el.dataset.cms);if(v!==undefined)el.textContent=value(v)});
    document.querySelectorAll('[data-cms-image]').forEach(el=>{const v=get(c,el.dataset.cmsImage);if(v){el.removeAttribute('srcset');el.removeAttribute('sizes');el.src=value(v)}});
    document.querySelectorAll('[data-cms-bg]').forEach(el=>{const v=get(c,el.dataset.cmsBg);if(v)el.style.backgroundImage='url("'+String(value(v)).replace(/"/g,'\\"')+'")'});
    document.querySelectorAll('[data-results-link]').forEach(el=>{el.href=c.site?.resultsUrl||'#';el.target='_blank';el.rel='noopener noreferrer'});
    document.querySelectorAll('[data-school-name]').forEach(e=>e.textContent=value(c.site?.name));
    document.querySelectorAll('[data-school-sub]').forEach(e=>e.textContent=value(c.site?.sub));
    document.querySelectorAll('[data-contact-phone]').forEach(e=>e.href=c.site?.phone?'tel:'+String(c.site.phone).replace(/\s+/g,''):'#');
    document.querySelectorAll('[data-contact-whatsapp]').forEach(e=>e.href=c.site?.whatsapp?'https://wa.me/'+String(c.site.whatsapp).replace(/\D/g,''):'#');
    document.querySelectorAll('[data-contact-email]').forEach(e=>e.href=c.site?.email?'mailto:'+c.site.email:'#');
    window.dispatchEvent(new CustomEvent('masraweya-cms-ready'));
  }
  async function load(){
    let c=clone(defaults);
    if(cfg.url&&cfg.anonKey){try{const r=await fetch(cfg.url+'/rest/v1/site_content?id=eq.1&select=content',{cache:'no-store',headers:{apikey:cfg.anonKey}});if(r.ok){const rows=await r.json();if(rows[0]?.content)c=merge(c,rows[0].content)}}catch(e){console.warn('CMS fallback to defaults',e)}}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply(c),{once:true});else apply(c);
    window.MASRAWEYA_CMS_READY=Promise.resolve(c);return c;
  }
  document.addEventListener('masraweya-language-changed',function(e){lang=e.detail?.lang||localStorage.getItem('masraweya-lang')||'en'; if(window.MASRAWEYA_CMS?.content) apply(window.MASRAWEYA_CMS.content)}); window.MASRAWEYA_CMS_LOAD=load;
  window.MASRAWEYA_CMS_READY=load();
})();
