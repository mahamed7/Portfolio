(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = 'mahamedmahamud019@gmail.com';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ---------- Theme ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
  }
  $('#themeBtn').addEventListener('click', () => toast(toggleTheme() === 'light' ? '☀️ Light mode' : '🌙 Dark mode'));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- Scroll progress + nav state ---------- */
  const nav = $('#nav'), bar = $('#progress');
  const sections = $$('main section[id]');
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 10);
    let current = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top < 120) current = s.id; });
    $$('#navLinks a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal + count-up ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
    const start = performance.now(), dur = 1200;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
    $$('[data-count]').forEach(countUp);
  }

  /* ---------- Typed roles ---------- */
  const roles = [
    'Aspiring Data Engineer',
    'Cybersecurity Graduate · 4.0 GPA',
    'Software Engineering Student',
    'Ex-CTO @ SomeEats',
    'SQL whisperer',
    'Mobile app builder',
  ];
  const typed = $('#typed');
  if (!reduceMotion) {
    let r = 0, i = roles[0].length, deleting = true;
    function tick() {
      const word = roles[r];
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
      else if (!deleting && i === roles[r].length) { deleting = true; delay = 1800; }
      i += deleting ? -1 : 1;
      if (!deleting && i > roles[r].length) i = roles[r].length;
      setTimeout(tick, delay);
    }
    setTimeout(tick, 1800);
  }

  /* ---------- Project filter ---------- */
  const chips = $$('.chip'), cards = $$('#projectsGrid .project');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach(c => c.classList.toggle('active', c === chip));
    $('#whereVal').textContent = `'${f}'`;
    let shown = 0;
    cards.forEach(card => {
      const match = f === 'all' || card.dataset.type.split(' ').includes(f);
      card.classList.toggle('hide', !match);
      card.classList.remove('pop');
      if (match) { void card.offsetWidth; card.classList.add('pop'); shown++; }
    });
    $('#emptyMsg').hidden = shown > 0;
  }));

  /* Card spotlight follows the mouse */
  cards.forEach(card => card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- Copy email ---------- */
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); toast('📋 Email copied!'); }
    catch (e) { toast(EMAIL); }
  }
  $('#copyEmail').addEventListener('click', copyEmail);

  /* ---------- Confetti ---------- */
  const canvas = $('#confetti'), ctx = canvas.getContext('2d');
  function confetti() {
    if (reduceMotion) { toast('🎉'); return; }
    canvas.width = innerWidth; canvas.height = innerHeight;
    const colors = ['#2dd4bf', '#818cf8', '#f472b6', '#fbbf24', '#22c55e'];
    const parts = Array.from({ length: 160 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: Math.random() * -14 - 4,
      s: Math.random() * 6 + 4, c: colors[Math.floor(Math.random() * colors.length)],
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
    }));
    let frames = 0;
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(p => {
        p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vx *= 0.99;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      });
      if (++frames < 200) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })();
  }

  /* Konami code */
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kpos = 0;
  document.addEventListener('keydown', e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kpos = k === konami[kpos] ? kpos + 1 : (k === konami[0] ? 1 : 0);
    if (kpos === konami.length) { kpos = 0; confetti(); toast('🎮 Cheat code accepted: +100 hireability'); }
  });

  /* ---------- Terminal ---------- */
  const term = $('#term'), body = $('#termBody'), input = $('#termIn'), form = $('#termForm');
  const history = []; let hIdx = 0;
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function print(html, cls) {
    const div = document.createElement('div');
    if (cls) div.className = cls;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  const commands = {
    help: () => `Available commands:
  <span class="ok">whoami</span>       who is this guy?
  <span class="ok">about</span>        the short story
  <span class="ok">experience</span>   where I've worked
  <span class="ok">education</span>    degrees
  <span class="ok">projects</span>     things I've built
  <span class="ok">skills</span>       my toolkit
  <span class="ok">roadmap</span>      what I'm learning next
  <span class="ok">contact</span>      say salaam
  <span class="ok">cv</span>           open my CV
  <span class="ok">theme</span>        toggle light/dark
  <span class="ok">clear</span>        clear the screen
  <span class="ok">exit</span>         close the terminal
<span class="hl">Hidden ones exist too. Try thinking like a recruiter, or like SQL.</span>`,
    whoami: () => `<span class="hl">Saabir Dahir Mahamud</span>
Aspiring Data Engineer · Cybersecurity graduate (4.0 GPA, Honors)
Software Engineering student · Ex-CTO @ SomeEats · Borama, Somaliland`,
    about: () => `I turn raw data into something people can trust: reliable pipelines,
well-designed databases and clean, analysis-ready data. I bring a security-first
mindset and real startup leadership experience.`,
    experience: () => `<span class="ok">▸ Chief Technology Officer</span> · SomeEats · 2 yrs
  Set the tech direction, turned business needs into technical work, fixed problems across teams.
<span class="ok">▸ Intern</span> · Borama University · 2 months
  Hands-on experience in a professional university environment.`,
    education: () => `<span class="ok">✔ BSc Cybersecurity</span> · Borama University · 2022–2026 · <span class="hl">4.0 GPA, Academic Honors</span>
<span class="ok">● BSc Software Engineering</span> · Amoud University · 2023–2027 (expected)`,
    projects: () => `<span class="kw">HersiHealth</span>          React · TS · FHIR/Medplum health records
<span class="kw">Smart Shop Manager</span>   React Native retail management (in dev)
<span class="kw">Bookstore App</span>        React Native · SQLite CRUD
<span class="kw">School Mgmt System</span>   JS role-based portal (live demo)
<span class="kw">FlowTime</span>             Flutter · Riverpod · Hive focus timer
<span class="kw">Notes REST API</span>       Node · Express 5 · MongoDB
<span class="kw">Grading System</span>       C# · .NET 8 desktop
→ all repos: <a href="https://github.com/mahamed7?tab=repositories" target="_blank" rel="noopener">github.com/mahamed7</a>`,
    skills: () => `data       SQL · Python · ETL/ELT · data modelling · warehousing
databases  PostgreSQL · Oracle · MongoDB · SQLite · Firebase
languages  JavaScript · TypeScript · PHP · C# · Dart
apps       React · React Native · Expo · Flutter · Node/Express · .NET
tools      Git · GitHub · GitHub Actions`,
    roadmap: () => `<span class="ok">[now]</span>  Python for DE · advanced SQL · dimensional modelling
<span class="hl">[next]</span> Airflow · dbt · Spark · Kafka · cloud data platforms
<span class="kw">[plan]</span> retail warehouse · reconciliation pipeline · streaming · lakehouse`,
    contact: () => `email   <a href="mailto:${EMAIL}">${EMAIL}</a>
github  <a href="https://github.com/mahamed7" target="_blank" rel="noopener">github.com/mahamed7</a>
where   Borama, Somaliland`,
    cv: () => { setTimeout(() => (location.href = 'resume.html'), 400); return 'Opening CV…'; },
    resume: () => commands.cv(),
    theme: () => `Theme set to <span class="ok">${toggleTheme()}</span>.`,
    clear: () => { body.innerHTML = ''; return null; },
    exit: () => { closeTerm(); return null; },
    ls: () => 'about.txt  experience.log  projects/  skills.json  cv.pdf  secrets.env',
    'cat secrets.env': () => '<span class="err">Nice try 😄 A cybersecurity grad never leaves secrets in plain text.</span>',
    'sudo hire saabir': () => { confetti(); return '<span class="ok">[sudo] permission granted ✔</span>\nExcellent decision. Run <span class="hl">contact</span> to finish the transaction.'; },
    'hire saabir': () => '<span class="err">Permission denied.</span> Try with <span class="hl">sudo</span> 😉',
    'select * from saabir': () => `+-----------------+--------------------------+
| field           | value                    |
+-----------------+--------------------------+
| role            | Data Engineer (loading…) |
| gpa             | 4.0                      |
| ex_cto          | TRUE                     |
| fuel            | shaah (with cardamom)    |
| open_to_work    | TRUE                     |
+-----------------+--------------------------+
5 rows in set (0.00 sec)`,
    coffee: () => 'Brewing… ☕ Somali shaah is better. Fact.',
    shaah: () => '☕ With cardamom and ginger. Productivity +200%.',
    'rm -rf /': () => '<span class="err">Whoa.</span> That is exactly what the security degree was for. Blocked 🛡️',
    hello: () => 'Salaam! 👋 Type <span class="ok">help</span> to look around.',
    salaam: () => 'Wa alaykum salaam! 👋',
    date: () => new Date().toString(),
    konami: () => '↑ ↑ ↓ ↓ ← → ← → B A, but on the page, not in here 😉',
  };
  function run(raw) {
    const cmd = raw.trim();
    print(`<span class="ok">saabir@portfolio:~$</span> ${esc(cmd)}`);
    if (!cmd) return;
    const key = cmd.toLowerCase().replace(/;+$/, '').replace(/\s+/g, ' ');
    const fn = commands[key];
    if (fn) { const out = fn(); if (out) print(out); }
    else if (key.startsWith('select')) print('<span class="hl">Query OK.</span> Try <span class="ok">SELECT * FROM saabir;</span>');
    else if (key.startsWith('sudo')) print('<span class="err">saabir is not in the sudoers file.</span> This incident will be reported. 🚨 (Try: sudo hire saabir)');
    else print(`<span class="err">command not found:</span> ${esc(cmd)}. Type <span class="ok">help</span>.`);
  }
  let greeted = false;
  function openTerm() {
    term.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!greeted) {
      greeted = true;
      print(`<span class="hl">Welcome to saabir.sh v1.0</span>
Type <span class="ok">help</span> to see what you can do. ESC to close.
`);
    }
    input.focus();
  }
  function closeTerm() {
    term.hidden = true;
    document.body.style.overflow = '';
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = input.value;
    if (v.trim()) { history.push(v); }
    hIdx = history.length;
    input.value = '';
    run(v);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && history.length) { hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; e.preventDefault(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const m = Object.keys(commands).filter(c => c.startsWith(input.value.toLowerCase()) && !c.includes(' '));
      if (m.length === 1) input.value = m[0];
      else if (m.length > 1) print(m.join('  '));
    }
  });
  $('#termBtn').addEventListener('click', openTerm);
  $('#heroTerm').addEventListener('click', openTerm);
  $('#termClose').addEventListener('click', closeTerm);
  term.addEventListener('click', e => { if (e.target === term) closeTerm(); });
  $('.term').addEventListener('click', e => { if (e.target.tagName !== 'A') input.focus(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !term.hidden) closeTerm();
    const typing = /input|textarea/i.test(document.activeElement.tagName);
    if ((e.key === '`' || e.key === '~') && !typing) { e.preventDefault(); term.hidden ? openTerm() : closeTerm(); }
  });

  /* Console greeting for the curious */
  console.log('%c👋 Hey, developer!', 'font-size:18px;font-weight:bold;color:#2dd4bf');
  console.log('%cLike poking around? Saabir would love to hear from you: ' + EMAIL, 'color:#818cf8');
})();
