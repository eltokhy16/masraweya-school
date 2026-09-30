const nav=document.getElementById('nav');const menuBtn=document.getElementById('menuBtn');const navLinks=document.getElementById('navLinks');
window.addEventListener('scroll',()=>{if(nav)nav.classList.toggle('scrolled',window.scrollY>30)});
if(menuBtn){menuBtn.addEventListener('click',()=>nav.classList.toggle('mobile-open'))}
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('mobile-open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ===== CMS content loader ===== */
(async function(){
  try{
    const r = await fetch('content.json?ts=' + Date.now(), {cache:'no-store'});
    if(!r.ok) return;
    const c = await r.json();
    const set=(sel,val)=>{const el=document.querySelector(sel);if(el && val!==undefined) el.innerHTML=val};
    set('[data-cms="hero.eyebrow"]',c.hero?.eyebrow);
    set('[data-cms="hero.title1"]',c.hero?.title1);
    set('[data-cms="hero.title2"]',c.hero?.title2);
    set('[data-cms="hero.description"]',c.hero?.description);
    set('[data-cms="about.kicker"]',c.about?.kicker);
    set('[data-cms="about.title"]',c.about?.title);
    set('[data-cms="about.description"]',c.about?.description);
    set('[data-cms="about.paragraph1"]',c.about?.paragraph1);
    set('[data-cms="about.paragraph2"]',c.about?.paragraph2);
    set('[data-cms="language.kicker"]',c.language?.kicker);
    set('[data-cms="language.title"]',c.language?.title);
    set('[data-cms="language.description"]',c.language?.description);
    set('[data-cms="journey.kicker"]',c.journey?.kicker);
    set('[data-cms="journey.title"]',c.journey?.title);
    set('[data-cms="journey.description"]',c.journey?.description);
    set('[data-cms="activities.kicker"]',c.activities?.kicker);
    set('[data-cms="activities.title"]',c.activities?.title);
    set('[data-cms="activities.description"]',c.activities?.description);
    set('[data-cms="results.kicker"]',c.results?.kicker);
    set('[data-cms="results.title"]',c.results?.title);
    set('[data-cms="results.description"]',c.results?.description);
    set('[data-cms="news.kicker"]',c.news?.kicker);
    set('[data-cms="news.title"]',c.news?.title);
    set('[data-cms="news.description"]',c.news?.description);
    set('[data-cms="gallery.kicker"]',c.gallery?.kicker);
    set('[data-cms="gallery.title"]',c.gallery?.title);
    set('[data-cms="gallery.description"]',c.gallery?.description);
  }catch(e){}
})();
