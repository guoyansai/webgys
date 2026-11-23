/* 郭言赛 · 个人简历 — 渲染与交互 */
(function () {
  'use strict';

  const D = window.RESUME_DATA || {};
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  /* ---------------- 联系方式 ---------------- */
  const contacts = [
    ['Phone', '15895982020'],
    ['WeChat', 'asaicc'],
    ['Based', '江苏南京 · 江宁大学城'],
    ['Degree', '本科 · 江苏师范大学']
  ];
  $('#contact').innerHTML = contacts
    .map(([k, v]) => `<div class="contact-row"><dt>${k}</dt><dd>${esc(v)}</dd></div>`)
    .join('');

  /* ---------------- 关于我 ---------------- */
  const jj = D.jj || [];
  const metaList = [
    ['求职意向', '<b>WEB 架构师</b> / 前端专家 / 技术总监'],
    ['现居城市', '江苏南京 · 江宁大学城'],
    ['户籍', '江苏南京'],
    ['出生年月', '1984 年 7 月'],
    ['毕业院校', '江苏师范大学'],
    ['所学专业', '生物科学（应用生物技术）· 师范'],
    ['学历学位', '本科 · 2005 年 6 月毕业'],
    ['从业年限', '24 年（2002 年至今）']
  ];

  $('#aboutBody').innerHTML = `
    <p class="lead">${esc(jj[0] ? jj[0].tit : '')}</p>
    ${jj[1] ? `<div class="about-card">
      <h3>${esc(jj[1].tit)}</h3>
      <p>${esc(jj[1].des)}</p>
    </div>` : ''}
    <dl class="meta">
      ${metaList.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
    </dl>`;

  /* ---------------- 工作经历 ---------------- */
  const xm = D.xm || [];
  $('#timeline').innerHTML = xm.map((it) => {
    const now = /至今/.test(it.oth || '');
    const keys = (it.key || '').split(',').filter(Boolean);
    const shown = keys.slice(0, 12);
    const more = keys.length - shown.length;
    return `
      <article class="entry reveal${now ? ' now' : ''}">
        <div class="entry-top">
          <span class="period">${esc(it.oth)}</span>
          ${now ? '<span class="now-tag">NOW</span>' : ''}
        </div>
        <h3>${esc(it.tit)}</h3>
        <p class="company">${esc(it.com)}</p>
        <p class="desc">${esc(it.des)}</p>
        ${it.wok ? `<p class="duty"><b>职责 / 成果 · </b>${esc(it.wok)}</p>` : ''}
        ${shown.length ? `<div class="tags">${shown.map((k) => `<span>${esc(k.trim())}</span>`).join('')}${more > 0 ? `<span>+${more}</span>` : ''}</div>` : ''}
      </article>`;
  }).join('');

  /* ---------------- 专业技能 ---------------- */
  const jn = D.jn || [];
  $('#skillsGrid').innerHTML = jn.map((it, i) => `
    <div class="skill reveal">
      <i>#${String(i + 1).padStart(2, '0')}</i>
      <h3>${esc(it.tit)}</h3>
      <p>${esc(it.des)}</p>
    </div>`).join('');

  /* ---------------- 代表作品 ---------------- */
  const zp = D.zp || [];
  const PAGE = 12;
  let expanded = false;

  const worksGrid = $('#worksGrid');
  const worksMore = $('#worksMore');
  const worksTotal = $('#worksTotal');
  const searchInput = $('#worksSearch');
  worksTotal.textContent = zp.length;

  const featuredIndexes = new Set([0, 1, 2]);

  function cardHTML(it, i) {
    return `
      <article class="work reveal${featuredIndexes.has(i) ? ' featured' : ''}">
        <span class="work-num">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(it.tit)}</h3>
        <p>${esc(it.des)}</p>
      </article>`;
  }

  function renderWorks() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const matches = [];
    zp.forEach((it, i) => {
      if (!q || (it.tit + ' ' + (it.des || '')).toLowerCase().includes(q)) {
        matches.push({ it, i });
      }
    });
    const visible = q || expanded ? matches : matches.slice(0, PAGE);
    worksGrid.innerHTML = visible.length
      ? visible.map(({ it, i }) => cardHTML(it, i)).join('')
      : '<div class="empty">没有找到匹配的项目，换个关键词试试。</div>';

    if (!q && matches.length > PAGE) {
      worksMore.style.display = 'flex';
      worksMore.innerHTML = `<button class="btn-more" type="button" data-more>
        ${expanded ? '收起作品' : '展开全部作品'}
        <span>${expanded ? 'COLLAPSE' : matches.length + ' PROJECTS'}</span></button>`;
    } else {
      worksMore.style.display = 'none';
      worksMore.innerHTML = '';
    }
    observeReveals();
  }

  worksMore.addEventListener('click', (e) => {
    if (e.target.closest('[data-more]')) {
      expanded = !expanded;
      renderWorks();
      if (!expanded) {
        document.getElementById('works').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderWorks, 120);
  });
  renderWorks();

  /* ---------------- 证书荣誉 ---------------- */
  const zz = D.zz || [];
  $('#certsGrid').innerHTML = zz.map((it, i) => `
    <div class="cert reveal">
      <i>[${String(i + 1).padStart(2, '0')}]</i>
      <div class="cert-body">
        <h3>${esc(it.tit)}</h3>
        <p>${esc(it.des)}</p>
      </div>
    </div>`).join('');

  /* ---------------- 滚动进度 ---------------- */
  const progress = $('#progress');
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- 入场动画 ---------------- */
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -8% 0px' });
  }

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.in)').forEach((el, i) => {
      if (io) {
        el.style.transitionDelay = Math.min(i, 6) * 45 + 'ms';
        io.observe(el);
      } else {
        el.classList.add('in');
      }
    });
  }
  observeReveals();

  /* ---------------- 导航高亮 ---------------- */
  const navLinks = Array.from(document.querySelectorAll('#nav a'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          navLinks.forEach((a) =>
            a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------- 打印 ---------------- */
  const btnPrint = $('#btnPrint');
  btnPrint.addEventListener('click', () => {
    expanded = true;
    renderWorks();
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    setTimeout(() => window.print(), 120);
  });
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  });
})();
