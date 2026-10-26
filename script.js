(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');

  // Mobile menu
  var btn = d.querySelector('.menu-btn'), nav = d.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Scroll progress + active link
  var bar = d.querySelector('.progress');
  addEventListener('scroll', function () {
    var h = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  }, { passive: true });
  var links = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        Object.keys(links).forEach(function (k) { links[k].classList.remove('on'); });
        var id = e.target.id === 'showreel' ? 'work' : e.target.id;
        if (links[id]) links[id].classList.add('on');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  d.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

  // Gentle reveal on the content sections (not on the hero)
  var rv = d.querySelectorAll('.about .wrap,.showreel .wrap,.work .wrap,.services .wrap,.contact .wrap');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .08 });
    rv.forEach(function (el) { el.classList.add('rv'); io.observe(el); });
  }

  // Video dialog
  var dlg = d.getElementById('player'), stage = dlg.querySelector('.stage'), last;
  function open(el) {
    last = el;
    var src = el.getAttribute('data-video') || '';
    dlg.classList.toggle('vertical', el.hasAttribute('data-vertical'));
    stage.textContent = '';
    if (!src || src.indexOf('YOUR_VIDEO_ID') > -1) {
      var s = d.createElement('div'); s.className = 'soon';
      s.innerHTML = '<p>This video is coming soon.</p><a class="btn" target="_blank" rel="noopener" href="https://www.youtube.com/channel/UC3IIQY_KubDz4MqLX_5osbg">Watch on YouTube</a>';
      stage.appendChild(s);
    } else {
      var f = d.createElement('iframe');
      f.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&rel=0';
      f.title = el.getAttribute('data-title') || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      stage.appendChild(f);
    }
    dlg.showModal();
  }
  function close() { dlg.close(); }
  d.querySelectorAll('.play').forEach(function (el) { el.addEventListener('click', function () { open(el); }); });
  dlg.querySelector('.close').addEventListener('click', close);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  dlg.addEventListener('close', function () { stage.textContent = ''; if (last) last.focus(); });

  // Contact form: uses Formspree once configured, otherwise opens the visitor's email app
  var form = d.getElementById('form'), status = form.querySelector('.status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form), name = data.get('name'), email = data.get('email'), msg = data.get('message');
    if (form.action.indexOf('YOUR_FORM_ID') > -1) {
      location.href = 'mailto:bolajiolanrewaju450@gmail.com?subject=' + encodeURIComponent('Project enquiry from ' + name) +
        '&body=' + encodeURIComponent(msg + '\n\n' + name + '\n' + email);
      status.className = 'status ok';
      status.textContent = 'Your email app should open with the message ready to send.';
      return;
    }
    status.className = 'status'; status.textContent = 'Sending...';
    fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw 0;
        form.reset(); status.className = 'status ok'; status.textContent = 'Message sent. I will reply by email.';
      })
      .catch(function () {
        status.className = 'status err';
        status.textContent = 'The message did not send. Email bolajiolanrewaju450@gmail.com directly.';
      });
  });
})();