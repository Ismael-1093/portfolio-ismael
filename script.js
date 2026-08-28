const progressBar = document.getElementById('progressBar');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

function updateProgress(){
  const max = document.documentElement.scrollHeight - innerHeight;
  const value = max > 0 ? (scrollY / max) * 100 : 0;
  progressBar.style.width = `${value}%`;
}
addEventListener('scroll', updateProgress, {passive:true});
addEventListener('resize', updateProgress);
updateProgress();

menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded','false');
  mobileMenu.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const treeHint = document.getElementById('treeHint');
const treeButtons = document.querySelectorAll('#skillTree button, .tree-extra button');
treeButtons.forEach(btn => {
  const activate = () => {
    treeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    treeHint.textContent = `// ${btn.textContent.trim()}: ${btn.dataset.info}`;
  };
  btn.addEventListener('mouseenter', activate);
  btn.addEventListener('click', activate);
});

const filterButtons = document.querySelectorAll('#projectFilters button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  projectCards.forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
}));

const modal = document.getElementById('terminalModal');
const openTerminal = document.getElementById('terminalBtn');
const closeTerminal = document.getElementById('terminalClose');
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');
const terminalBody = document.getElementById('terminalBody');

function setTerminal(open){
  modal.classList.toggle('open',open);
  modal.setAttribute('aria-hidden',String(!open));
  if(open) setTimeout(()=>terminalInput.focus(),100);
}
openTerminal.addEventListener('click',()=>setTerminal(true));
closeTerminal.addEventListener('click',()=>setTerminal(false));
modal.addEventListener('click',e=>{if(e.target===modal)setTerminal(false)});
addEventListener('keydown',e=>{if(e.key==='Escape')setTerminal(false)});

const commands = {
  help:'Comandos: skills, projects, contact, clear',
  skills:'HTML5 · Sass · JavaScript · React · Node.js · Express · PHP · Python · C# · MySQL · Git · WordPress',
  projects:'Barbearia · SeuAgro · Digiverso',
  contact:'Abra a seção 10 — Contato para editar seus links de e-mail, GitHub e LinkedIn.'
};
terminalForm.addEventListener('submit',e=>{
  e.preventDefault();
  const cmd=terminalInput.value.trim().toLowerCase();
  if(!cmd)return;
  const line=document.createElement('p');
  line.innerHTML=`<span>visitor@portfolio</span>:~$ ${cmd}`;
  terminalBody.appendChild(line);
  if(cmd==='clear') terminalBody.innerHTML='';
  else {
    const out=document.createElement('p');
    out.textContent=commands[cmd] || `comando não encontrado: ${cmd}`;
    terminalBody.appendChild(out);
  }
  terminalInput.value='';
  terminalBody.scrollTop=terminalBody.scrollHeight;
});
