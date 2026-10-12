/* Isolated PC mockup: Apple MacBook Air continuity gallery's one exhibition
   with an underlined tab strip. Existing DAT controls own all image actions. */
(()=>{
  if(innerWidth<701)return;
  const dat=document.querySelector('.dat-clarity');if(!dat)return;
  document.body.classList.add('dat-tabs-mockup');
  const area=document.createElement('div');area.className='dat-exhibition';
  const generation=dat.querySelector('.dat-results'),organization=dat.querySelector('.stage');
  generation.id='dat-generation-panel';organization.id='dat-organization-panel';
  [generation,organization].forEach(e=>e.setAttribute('role','tabpanel'));
  area.append(generation,organization);dat.querySelector('.dat-overview').after(area);
  const nav=document.createElement('div');nav.className='dat-tabnav';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','DAT');
  nav.innerHTML='<button type="button" id="dat-generation-tab" role="tab" aria-controls="dat-generation-panel">Generation</button><button type="button" id="dat-organization-tab" role="tab" aria-controls="dat-organization-panel">Organization</button>';
  area.after(nav);const tabs=[...nav.children],panels=[generation,organization];
  panels.forEach((e,i)=>e.setAttribute('aria-labelledby',tabs[i].id));
  const select=i=>{dat.dataset.exhibition=String(i);tabs.forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1;panels[j].hidden=i!==j;});};
  tabs.forEach((b,i)=>{b.addEventListener('click',()=>select(i));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:1-i;select(next);tabs[next].focus();});});
  select(0);
  const orbit=generation.querySelector('.character-orbit');
  orbit.dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true}));
})();
