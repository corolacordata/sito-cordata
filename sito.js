


(function(){
'use strict';
var D = window.CORDATA || {};
var $ = function(s, c){ return (c || document).querySelector(s); };
var $$ = function(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
var CALMO = matchMedia('(prefers-reduced-motion: reduce)').matches;
var ANTEPRIMA = !!window.CORDATA_ANTEPRIMA;    
var PAG = window.CORDATA_PAGINA || document.body.getAttribute('data-pagina') || 'index';
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); };

 
var CFG = D.config || {};
var LOGO = D.logo || 'img/logo.png';
var AUDIO = function(id){ if (!id) return ''; return /[/.:]/.test(id) ? id : (D.audioBase || 'audio/{id}.mp3').replace('{id}', id); };
var AID = function(id){ return id && !/[/.:]/.test(id) ? ' data-aid="' + id + '"' : ''; };
 
var ATTESA_AUDIO = {};
function suona(au){
  var id = au.getAttribute('data-aid');
  if (D.audioChiedi && window.parent !== window && id && !au.getAttribute('data-pronto')) {
    var q = 'a' + Math.random().toString(36).slice(2); ATTESA_AUDIO[q] = au; au.setAttribute('data-pronto', 'attesa');
    try { parent.postMessage({ sitoCordata:'audio', id:id, q:q }, '*'); } catch(e) { au.dispatchEvent(new Event('ended')); }
    return;
  }
  var p = au.play(); if (p && p.catch) p.catch(function(){ au.dispatchEvent(new Event('ended')); });
}
window.addEventListener('message', function(e){ var d = e.data || {}; if (d.sitoCordata !== 'audio' || !ATTESA_AUDIO[d.q]) return;
  var au = ATTESA_AUDIO[d.q]; delete ATTESA_AUDIO[d.q];
  if (!d.blob) { au.removeAttribute('data-pronto'); au.dispatchEvent(new Event('ended')); return; }
  au.src = URL.createObjectURL(d.blob); au.setAttribute('data-pronto', '1'); suona(au); });
var FOTO = function(id){ if (!id) return ''; return /[\/.:]/.test(id) ? id : (D.fotoBase || 'foto/{id}.jpg').replace('{id}', id); };
(function(){
  if (CFG.pagine) (D.pagine || []).forEach(function(p){ if (p.id in CFG.pagine) p.on = !!CFG.pagine[p.id]; });
  if (CFG.situazioni) D.situazioni = Object.assign({}, D.situazioni || {}, CFG.situazioni);
  D.testi = D.testi || {};
  ['hero','motto','vieni','maestro'].forEach(function(k){ if (CFG[k]) D.testi[k] = CFG[k]; });
  if (CFG.prove) D.prove = Object.assign({}, D.prove || {}, CFG.prove);
  if (CFG.festival) D.festival = Object.assign({}, D.festival || {}, CFG.festival);
  if (CFG.tappe && CFG.tappe.length) D.tappe = CFG.tappe;
  if (CFG.sale && CFG.sale.length) D.sale = CFG.sale;
  if (CFG.concertiPrima) D.coro.concertiPrima = +CFG.concertiPrima || D.coro.concertiPrima;
  if (CFG.social) D.coro.social = Object.assign({}, D.coro.social || {}, CFG.social);
  if (CFG.portale) D.coro.portale = CFG.portale;
  if (CFG.ascolta) D.ascolta = CFG.ascolta;
  if (CFG.contributi) D.contributi = CFG.contributi;
  if (CFG.contributiNota != null) D.contributiNota = CFG.contributiNota;
  if (CFG.libro && CFG.libro.titolo) D.libro = CFG.libro;
  if (CFG.fotoMaestro) D.fotoMaestro = CFG.fotoMaestro;
  if (CFG.apertura || CFG.muro || CFG.fotoPagine || CFG.galleria) {
    D.foto = D.foto || {};
    if (CFG.apertura) D.foto.apertura = { src:FOTO(CFG.apertura), dida:CFG.dida || '' };
    if (CFG.muro && CFG.muro.length) D.foto.muro = CFG.muro.map(FOTO);
    if (CFG.fotoPagine) { D.foto.pagine = {}; Object.keys(CFG.fotoPagine).forEach(function(k){ if (CFG.fotoPagine[k]) D.foto.pagine[k] = FOTO(CFG.fotoPagine[k]); }); }
    if (CFG.galleria && CFG.galleria.length) D.foto.tutte = CFG.galleria.map(FOTO);
  }
})();
D.situazioni = D.situazioni || {}; D.prove = D.prove || { giorno:'', ora:'', luogo:'' }; D.coro.social = D.coro.social || {};

 
var PROVA = {};
try { PROVA = JSON.parse(sessionStorage.getItem('cordata-prova') || '{}') || {}; } catch(e) { PROVA = {}; }
var salvaProva = function(){ try { sessionStorage.setItem('cordata-prova', JSON.stringify(PROVA)); } catch(e) {} };
if (PROVA.tema) document.documentElement.setAttribute('data-theme', PROVA.tema);
(D.pagine || []).forEach(function(p){ if (PROVA.pagine && p.id in PROVA.pagine) p.on = PROVA.pagine[p.id]; });
D.situazioni = Object.assign({}, D.situazioni || {}, PROVA.situazioni || {});
if (PROVA.hero) D.testi.hero = PROVA.hero;
if (D.foto && PROVA.apertura) D.foto.apertura = { src:PROVA.apertura, dida:PROVA.apertura === 'foto/f077.jpg' ? 'Loreto, piazza della Basilica' : '' };
if (D.foto && PROVA.muro && PROVA.muro.length) D.foto.muro = PROVA.muro;
var NEL_CONFIGURATORE = window.parent !== window;
var attiva = function(k){ return D.situazioni[k] !== false; };

 
var VERO = new Date();
try { var qo = new URLSearchParams(location.search).get('ora'); if (qo && D.esempio) PROVA.ora = qo; } catch(e) {}
if (ANTEPRIMA) { PROVA = { ora:window.CORDATA_ORA || null, tema:window.CORDATA_TEMA || '' }; if (PROVA.tema) document.documentElement.setAttribute('data-theme', PROVA.tema); else document.documentElement.removeAttribute('data-theme'); }
var ADESSO = PROVA.ora ? new Date(PROVA.ora) : VERO, scarto = ADESSO - VERO;
var ora = function(){ return new Date(Date.now() + scarto); };
var MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
var GIORNI = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
var quando = function(e){ var d = e.data.split('-'), h = (e.ora || '21:00').split(':'); return new Date(+d[0], d[1] - 1, +d[2], +h[0], +h[1]); };
var giornoD = function(s){ var d = s.split('-'); return new Date(+d[0], d[1] - 1, +d[2]); };
var stessoGiorno = function(a, b){ return a.toDateString() === b.toDateString(); };
var fra = function(a, b){ return Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate()) - new Date(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5); };
var dataLunga = function(d){ return GIORNI[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()]; };
var mm = function(d){ return MESI[d.getMonth()].slice(0, 3); };
var hhmm = function(d){ return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); };
var FOND = giornoD(D.coro.fondazione);
var anni = function(){ var n = ora(), a = n.getFullYear() - FOND.getFullYear(); if (n.getMonth() < FOND.getMonth() || (n.getMonth() === FOND.getMonth() && n.getDate() < FOND.getDate())) a--; return a; };
var eventi = (D.eventi || []).slice().sort(function(a, b){ return quando(a) - quando(b); });
var futuri = function(){ var n = ora(); return eventi.filter(function(e){ return quando(e).getTime() + 3 * 36e5 > n.getTime(); }); };
var passati = function(){ var n = ora(); return eventi.filter(function(e){ return quando(e).getTime() + 3 * 36e5 <= n.getTime(); }).reverse(); };
var pagina = function(id){ return (D.pagine || []).filter(function(p){ return p.id === id; })[0]; };
var on = function(id){ var p = pagina(id); return !!(p && p.on); };
var href = function(id){ var p = pagina(id); return p && p.futura ? 'pagina.html#' + id : (id === 'index' ? 'index.html' : id + '.html'); };
 
(function(){
  var L = D.pagine || (D.pagine = []);
  (CFG.libere || []).forEach(function(x){ if (x && x.id && !pagina(x.id)) L.push({ id:x.id, titolo:x.titolo, on:x.on !== false, menu:!!x.menu, libera:x }); });
  Object.keys(CFG.nomi || {}).forEach(function(k){ var p = pagina(k); if (p && CFG.nomi[k]) p.titolo = CFG.nomi[k]; });
  if (Array.isArray(CFG.ordine) && CFG.ordine.length) { var pos = {}; CFG.ordine.forEach(function(k, i){ pos[k] = i; });
    var idx = L.map(function(p, i){ return [p, p.id in pos ? pos[p.id] : 900 + i]; }); idx.sort(function(a, b){ return a[1] - b[1]; }); D.pagine = idx.map(function(x){ return x[0]; }); }
})();
 
function ricco(t){ return esc(t).replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>').replace(/\*([^*\n]+)\*/g, '<span class="lir">$1</span>').replace(/\n/g, '<br>'); }
function paragrafi(t){ return String(t || '').trim() ? String(t).split(/\n\s*\n/).map(function(x){ return '<p>' + ricco(x.trim()) + '</p>'; }).join('') : ''; }
function blocchi(lista){
  return (lista || []).map(function(b){
    var tit = b.titolo ? '<h2 class="h3">' + ricco(b.titolo) + '</h2>' : '';
    if (b.tipo === 'testo') return '<div class="bl">' + tit + paragrafi(b.testo) + '</div>';
    if (b.tipo === 'foto') return '<div class="bl bl-foto' + (b.lato === 'dx' ? ' dx' : '') + '">' + (b.foto ? '<figure><img src="' + FOTO(b.foto) + '" alt="' + esc(b.dida || b.titolo || '') + '" loading="lazy">' + (b.dida ? '<figcaption>' + esc(b.dida) + '</figcaption>' : '') + '</figure>' : '') + '<div>' + tit + paragrafi(b.testo) + '</div></div>';
    if (b.tipo === 'galleria') return '<div class="bl">' + tit + '<div class="bl-gal">' + (b.foto || []).map(function(id){ return '<a href="' + FOTO(id) + '" target="_blank" rel="noopener"><img src="' + FOTO(id) + '" alt="" loading="lazy"></a>'; }).join('') + '</div></div>';
    if (b.tipo === 'pdf') return '<div class="bl">' + tit + paragrafi(b.testo) + (b.file ? '<a class="btn btn-r" href="' + (ANTEPRIMA ? 'https://drive.google.com/file/d/' + b.file + '/view' : 'doc/' + b.file + '.pdf') + '" target="_blank" rel="noopener">Apri il PDF</a>' : '') + '</div>';
    if (b.tipo === 'video' && b.yt) return '<div class="bl">' + tit + '<div class="bl-video" data-yt="' + esc(b.yt) + '"><img src="' + (ANTEPRIMA ? 'https://i.ytimg.com/vi/' + esc(b.yt) + '/hqdefault.jpg' : 'img/yt-' + esc(b.yt) + '.jpg') + '" alt="" loading="lazy"><button type="button">▶ Guarda il video<small>si apre YouTube, senza cookie</small></button></div>' + paragrafi(b.testo) + '</div>';
    if (b.tipo === 'mappa' && b.lat != null) { var d = 0.012;
      return '<div class="bl">' + tit + '<div class="bl-video" data-mappa="https://www.openstreetmap.org/export/embed.html?bbox=' + [b.lon - d, b.lat - d * 0.7, b.lon + d, b.lat + d * 0.7].join(',') + '&amp;layer=mapnik&amp;marker=' + b.lat + ',' + b.lon + '"><button type="button">Mostra la mappa<small>' + esc(b.luogo || '') + '</small></button></div>'
        + paragrafi(b.testo) + '<a class="pill" href="https://www.openstreetmap.org/?mlat=' + b.lat + '&amp;mlon=' + b.lon + '#map=16/' + b.lat + '/' + b.lon + '" target="_blank" rel="noopener">Apri nel navigatore</a></div>'; }
    if (b.tipo === 'contatti') return '<div class="bl">' + tit + paragrafi(b.testo) + '<p>' + (b.email ? '<a href="mailto:' + esc(b.email) + '">' + esc(b.email) + '</a>' : '') + (b.email && b.tel ? ' · ' : '') + (b.tel ? '<a href="tel:' + esc(String(b.tel).replace(/[ .]/g, '')) + '">' + esc(b.tel) + '</a>' : '') + '</p></div>';
    return '';
  }).join('');
}
var CSS_BLOCCHI = '.bl{margin:0 0 56px;max-width:860px}.bl p{margin:0 0 14px}.bl-foto{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center}.bl-foto.dx figure{order:2}.bl-foto img,.bl-gal img{width:100%;border-radius:10px;object-fit:cover}.bl-foto figcaption{font-size:13px;color:var(--mute);margin-top:8px}'
  + '.bl-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}.bl-gal img{aspect-ratio:4/3}.bl-video{position:relative;aspect-ratio:16/9;border-radius:10px;overflow:hidden;background:#111;margin:0 0 14px}.bl-video img{width:100%;height:100%;object-fit:cover;opacity:.75}'
  + '.bl-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.bl-video button{position:absolute;inset:0;margin:auto;width:max-content;height:max-content;padding:14px 22px;border:0;border-radius:999px;background:#fff;color:#111;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}.bl-video button small{font-weight:400;font-size:12px;color:#555}'
  + '@media(max-width:760px){.bl-foto{grid-template-columns:1fr}.bl-foto.dx figure{order:0}}';
function servizi(){ var v = false, m = false; (D.pagine || []).forEach(function(p){ if (p.on && p.libera) (p.libera.blocchi || []).forEach(function(b){ if (b.tipo === 'video' && b.yt) v = true; if (b.tipo === 'mappa' && b.lat != null) m = true; }); }); return { video:v, mappa:m }; }
var voci = function(){ return (D.sezioni || []).reduce(function(a, x){ return a + x.n; }, 0); };
var concerti = function(){ return D.coro.concertiPrima + passati().length; };

 
function pasqua(y){ var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), x = h + l - 7 * m + 114; return new Date(y, Math.floor(x / 31) - 1, (x % 31) + 1); }
 
function traguardo(){ var n = ora(), a = anni() + 1; if (a % 5) return null; var t = new Date(FOND.getFullYear() + a, FOND.getMonth(), FOND.getDate()), g = fra(n, t); return g > 0 && g <= 365 ? { anni:a, giorni:g } : null; }
 
function unAnnoFa(){ var n = ora(), x = new Date(n.getFullYear() - 1, n.getMonth(), n.getDate()); return passati().filter(function(e){ return Math.abs(fra(x, quando(e))) <= 3; })[0] || null; }
function situazione(){
  var n = ora(), f = futuri(), p = passati(), pr = f[0], s = { tipo:'normale', prossimo:pr };
  s.natale = attiva('natale') && ((n.getMonth() === 11 && n.getDate() >= 8) || (n.getMonth() === 0 && n.getDate() <= 6));
  var dpq = fra(n, pasqua(n.getFullYear()));
  var compleanno = n.getMonth() === FOND.getMonth() && n.getDate() === FOND.getDate();
  var fe = D.festival, feDal = fe && giornoD(fe.dal), feAl = fe && giornoD(fe.al);
   
  var fz = window.CORDATA_ANTEPRIMA && window.CORDATA_SCENARIO;
  if (fz === 'live' || fz === 'stasera' || fz === 'presto') { if (pr) return Object.assign(s, { tipo:fz, ev:pr, a:quando(pr), giorni:Math.max(1, fra(n, quando(pr))) }); }
  else if (fz === 'grazie') { if (p[0]) return Object.assign(s, { tipo:'grazie', ev:p[0] }); }
  else if (fz) return Object.assign(s, { tipo:fz, natale:fz === 'natale' });
  if (pr) { var t = quando(pr), d = t - n;
    if (attiva('live') && d <= 0 && d > -3 * 36e5) return Object.assign(s, { tipo:'live', ev:pr });
    if (attiva('stasera') && stessoGiorno(t, n)) return Object.assign(s, { tipo:'stasera', ev:pr, a:t }); }
  if (attiva('festival') && feDal && n >= feDal && n < new Date(feAl.getTime() + 864e5)) return Object.assign(s, { tipo:'festival' });
  if (attiva('grazie') && p[0] && fra(quando(p[0]), n) <= 2) return Object.assign(s, { tipo:'grazie', ev:p[0] });
  if (attiva('compleanno') && compleanno) return Object.assign(s, { tipo:'compleanno' });
  if (attiva('pasqua') && dpq >= -1 && dpq <= 7) return Object.assign(s, { tipo:'pasqua' });
  if (attiva('presto') && pr && fra(n, quando(pr)) <= 14) return Object.assign(s, { tipo:s.natale ? 'natale' : 'presto', ev:pr, giorni:fra(n, quando(pr)) });
  if (s.natale) return Object.assign(s, { tipo:'natale' });
  if (attiva('stagione') && (n.getMonth() === 8 || n.getMonth() === 9)) return Object.assign(s, { tipo:'stagione' });
  if (attiva('prova') && GIORNI[n.getDay()] === D.prove.giorno && n.getHours() >= 12 && n.getHours() < 23) return Object.assign(s, { tipo:'prova' });
  if (attiva('vuoto') && !pr) return Object.assign(s, { tipo:'vuoto' });
  return s;
}
var SIT = situazione();



var NOTE = { 'Bassi':87.31, 'Baritoni':130.81, 'Tenori secondi':220, 'Tenori primi':349.23 };
var AC = null, USCITA = null, ANALISI = null, SPETTRO = null;
function audio(){
  if (AC) return AC;
  AC = new (window.AudioContext || window.webkitAudioContext)();
  USCITA = AC.createGain(); USCITA.gain.value = .9;
  ANALISI = AC.createAnalyser(); ANALISI.fftSize = 512; ANALISI.smoothingTimeConstant = .82;
  SPETTRO = new Uint8Array(ANALISI.frequencyBinCount);
  USCITA.connect(ANALISI); ANALISI.connect(AC.destination);
  return AC;
}
function timbro(freq, t0, durata, vol){
  var ac = audio(), g = ac.createGain(), f = ac.createBiquadFilter(), f2 = ac.createBiquadFilter(), v = ac.createOscillator(), vg = ac.createGain(), oo = [];
  f.type = 'lowpass'; f.frequency.value = 1000; f.Q.value = 5;
  f2.type = 'peaking'; f2.frequency.value = 650; f2.gain.value = 7; f2.Q.value = 2;    
  v.frequency.value = 5 + Math.random(); vg.gain.value = freq * .011; v.connect(vg);
  [-7, 0, 6].forEach(function(det){ var o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq; o.detune.value = det; vg.connect(o.frequency); o.connect(f); oo.push(o); });
  f.connect(f2); f2.connect(g); g.connect(USCITA);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + .35);
  if (durata) { g.gain.setValueAtTime(vol, t0 + durata - .7); g.gain.linearRampToValueAtTime(0, t0 + durata); }
  oo.concat([v]).forEach(function(o){ o.start(t0); if (durata) o.stop(t0 + durata + .05); });
  return { ferma:function(){ var t = ac.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + .5); oo.concat([v]).forEach(function(o){ try { o.stop(t + .55); } catch(e) {} }); },
    nota:function(fr){ oo.forEach(function(o){ o.frequency.setTargetAtTime(fr, ac.currentTime, .04); }); vg.gain.value = fr * .011; } };
}
function voce(freq, durata, vol){ var ac = audio(); return timbro(freq, ac.currentTime + .02, durata, vol || .07); }
var CANTA = false;
function accordo(durata){ var ac = audio(), t = ac.currentTime + .05; Object.keys(NOTE).forEach(function(k, i){ timbro(NOTE[k], t + i * .28, durata - i * .28, .05); }); CANTA = true; setTimeout(function(){ CANTA = false; }, durata * 1000); }



var PICCHI = [[.08,.07,.35],[.2,.09,.5],[.34,.08,.62],[.47,.06,.55],[.6,.075,1],[.7,.05,.78],[.8,.08,.66],[.92,.07,.46]];
function creste(cv, opz){
  opz = opz || {};
  var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), t = 0, mx = -1, my = -1, vivo = true, forza = 0;
  var RIGHE = opz.righe || 30, scuro = '#0A0A0B';
  var misura = function(){ var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  var monte = function(x, k){ var h = 0; for (var i = 0; i < PICCHI.length; i++) { var p = PICCHI[i], c = p[0] + Math.sin(k * 2.1 + i) * .025, d = (x - c) / p[1]; h = Math.max(h, p[2] * Math.exp(-d * d) * (1 - Math.abs(d) * .08)); } return h; };
  var disegna = function(){
    ctx.clearRect(0, 0, W, H);
    var top = H * (opz.alto || .3), basso = H * .98, passo = (basso - top) / RIGHE, n = Math.ceil(W / 7);
    if (ANALISI && CANTA) ANALISI.getByteFrequencyData(SPETTRO);
    forza += ((CANTA ? 1 : 0) - forza) * .05;
    for (var r = 0; r < RIGHE; r++) {
      var k = r / (RIGHE - 1), y0 = top + r * passo, amp = H * (.12 + k * .38) * (opz.amp || 1);
      ctx.beginPath(); ctx.moveTo(-2, H + 2);
      for (var j = 0; j <= n; j++) {
        var x = j / n, X = x * W, m = monte(x, r);
        var ruga = .03 * Math.sin(x * 40 + r * 1.7) * Math.sin(x * 9 + r) + .018 * Math.sin(x * 83 + r * 3.1 + t * .6);
        var vento = .025 * Math.sin(x * 6 + t * .8 + r * .5);
        var sp = 0; if (forza > .01 && SPETTRO) { var b = Math.floor(Math.pow(x, 1.6) * SPETTRO.length * .5); sp = SPETTRO[b] / 255 * forza * (.4 + .6 * Math.sin(Math.PI * x)) * .7; }
        var dito = 0; if (mx >= 0) { var dx = (X - mx) / (W * .09), dy = (y0 - my) / (H * .35); dito = Math.exp(-dx * dx - dy * dy) * .5; }
        ctx.lineTo(X, y0 - Math.max(0, m + ruga + vento + sp + dito) * amp);
      }
      ctx.lineTo(W + 2, H + 2); ctx.closePath();
      ctx.fillStyle = scuro; ctx.fill();
      var rosso = k > .55, a = .25 + k * .75;
      ctx.strokeStyle = rosso ? 'rgba(200,32,42,' + (a * (.55 + forza * .45)) + ')' : 'rgba(242,239,234,' + (.05 + k * .3) + ')';
      ctx.lineWidth = rosso ? 1.4 + forza : 1; ctx.stroke();
    }
  };
  var giro = function(){ if (!vivo) return; t += .016; disegna(); requestAnimationFrame(giro); };
  misura(); disegna();
  addEventListener('resize', function(){ misura(); disegna(); });
  if (!CALMO) {
    requestAnimationFrame(giro);
    if ('IntersectionObserver' in window) new IntersectionObserver(function(e){ var prima = vivo; vivo = e[0].isIntersecting; if (vivo && !prima) requestAnimationFrame(giro); }).observe(cv);
    var z = cv.parentNode;
    z.addEventListener('pointermove', function(e){ var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    z.addEventListener('pointerleave', function(){ mx = -1; });
  }
}

 
var IC = {
  ar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  sh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pausa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
  dado:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/><circle cx="15" cy="9" r="1.3" fill="currentColor"/><circle cx="9" cy="15" r="1.3" fill="currentColor"/></svg>',
  monte:'<svg viewBox="0 0 26 18" fill="currentColor"><path d="M0 18 L8 6 L12 11 L17 2 L26 18 Z"/></svg>',
  libro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14"/></svg>',
  cerca:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>'
};
var piccola = function(i){ return IC[i].replace('<svg', '<svg width="14" height="14"'); };

 
function testata(){
  var vv = (D.pagine || []).filter(function(p){ return p.on && p.menu; });
  var cta = on('vieni-a-cantare') && PAG !== 'vieni-a-cantare' ? '<a class="btn btn-r btn-s cta" href="vieni-a-cantare.html">Vieni a cantare</a>' : '';
  var h = document.createElement('header'); h.className = 'top';
  h.innerHTML = '<div class="wrap"><a class="marchio" href="index.html" aria-label="La Cordata, home"><img src="' + LOGO + '" alt=""><span>La Cordata<small>Coro · dal 1987</small></span></a>'
    + '<nav class="nav" aria-label="Menu">' + vv.map(function(p){ return '<a href="' + href(p.id) + '"' + (p.id === PAG ? ' aria-current="page"' : '') + '>' + esc(p.titolo) + '</a>'; }).join('') + '</nav>'
    + cta + '<button class="burger" aria-label="Apri il menu" aria-expanded="false"><i></i><i></i></button></div>';
  document.body.prepend(h);
  var m = document.createElement('div'); m.className = 'menu'; m.setAttribute('aria-hidden', 'true');
  var tutte = [{ id:'index', titolo:'Home' }].concat(vv); if (on('vieni-a-cantare')) tutte.push(pagina('vieni-a-cantare'));
  m.innerHTML = '<button class="menu-x" aria-label="Chiudi il menu">×</button>' + tutte.map(function(p, i){ return '<a href="' + href(p.id) + '">' + esc(p.titolo) + '<small>' + ('0' + (i + 1)).slice(-2) + '</small></a>'; }).join('')
    + (on('coristi') ? '<a href="' + href('coristi') + '" style="font-size:1.4rem;border:0;margin-top:14px;opacity:.85">Area coristi →</a>' : '') + '<div class="fondo">' + esc(D.coro.nome) + '<br>' + esc(D.coro.email) + '</div>';
  document.body.appendChild(m);
  var apri = function(si){ m.classList.toggle('aperto', si); m.setAttribute('aria-hidden', si ? 'false' : 'true'); $('.burger', h).setAttribute('aria-expanded', si); document.body.style.overflow = si ? 'hidden' : ''; };
  $('.burger', h).onclick = function(){ apri(true); }; $('.menu-x', m).onclick = function(){ apri(false); };
  addEventListener('keydown', function(e){ if (e.key === 'Escape') apri(false); });
  var ultimo = 0;
  addEventListener('scroll', function(){ var y = scrollY; h.classList.toggle('su', y > 40); if (y > 300 && y > ultimo + 4) h.classList.add('giu'); if (y < ultimo - 4 || y < 300) h.classList.remove('giu'); ultimo = y; }, { passive:true });
}

 
var LUOGHI = [[513,'Montalto delle Marche'],[900,'Verso i Sibillini'],[1536,'Forca di Presta'],[2238,'Rifugio Zilioli'],[2476,'Vetta del Monte Vettore']];
function altimetro(){
  var q = document.createElement('div'); q.className = 'quota'; q.setAttribute('aria-hidden', 'true');
  q.innerHTML = IC.monte + '<div><b>513 m</b><small>Montalto delle Marche</small></div><i></i>';
  document.body.appendChild(q);
  var b = $('b', q), s = $('small', q), prima = -1;
  var agg = function(){ var tot = document.documentElement.scrollHeight - innerHeight, p = tot > 0 ? Math.min(1, Math.max(0, scrollY / tot)) : 0, m = Math.round(513 + p * (2476 - 513));
    q.classList.toggle('via', scrollY < innerHeight * .5); if (m === prima) return; prima = m; b.textContent = m.toLocaleString('it-IT') + ' m'; q.style.setProperty('--p', p);
    var l = LUOGHI[0][1]; LUOGHI.forEach(function(x){ if (m >= x[0]) l = x[1]; }); s.textContent = p > .995 ? 'In vetta · Monte Vettore' : l; };
  addEventListener('scroll', agg, { passive:true }); addEventListener('resize', agg); agg();
}

function piede(){
  var c = D.coro, ag = D.aggiornato ? new Date(D.aggiornato) : null;
  var f = document.createElement('footer'); f.className = 'piede';
  f.innerHTML = '<div class="wrap"><div class="g">'
    + '<div><h4>Il coro</h4><p>' + esc(c.nome) + '<br>' + esc(c.indirizzo) + '</p><p>C.F. e P.IVA ' + esc(c.cf) + '<br>RUNTS ' + esc(c.runts) + '</p></div>'
    + '<div class="p-sito"><h4>Il sito</h4>' + (D.pagine || []).filter(function(p){ return p.on && p.id !== 'index' && p.id !== 'coristi'; }).map(function(p){ return '<a href="' + href(p.id) + '">' + esc(p.titolo) + '</a>'; }).join('') + '</div>'
    + '<div><h4>Seguici</h4>' + (c.social.instagram ? '<a href="' + esc(c.social.instagram) + '" target="_blank" rel="noopener">Instagram</a>' : '') + (c.social.facebook ? '<a href="' + esc(c.social.facebook) + '" target="_blank" rel="noopener">Facebook</a>' : '') + (c.social.youtube ? '<a href="' + esc(c.social.youtube) + '" target="_blank" rel="noopener">YouTube</a>' : '') + '<a href="#" data-cal-tutti>Concerti nel tuo calendario</a></div>'
    + '<div><h4>Scrivici</h4><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a><a href="mailto:' + esc(c.pec) + '">' + esc(c.pec) + '</a><a href="' + (on('coristi') ? href('coristi') : esc(c.portale)) + '">Area coristi →</a><a href="privacy.html">Privacy · nessun cookie</a></div>'
    + '</div><div class="firma"><img src="' + LOGO + '" alt="Logo del Coro La Cordata"><div><b>Coro La Cordata</b><span>' + T('piede.firma') + '</span></div></div>'
    + '<div class="fine"><span>© ' + ora().getFullYear() + ' ' + esc(c.nome) + '</span>'
    + (ag ? '<span class="vivo">Aggiornato dall’app il ' + ag.getDate() + ' ' + MESI[ag.getMonth()] + ' alle ' + hhmm(ag) + '</span>' : '') + '</div></div>';
  document.body.appendChild(f);
  $('[data-cal-tutti]', f).onclick = function(e){ e.preventDefault(); scaricaIcs(futuri(), 'concerti-la-cordata.ics'); };
}

 
function ics(lista){
  var z = function(n){ return ('0' + n).slice(-2); }, f = function(d){ return d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + 'T' + z(d.getHours()) + z(d.getMinutes()) + '00'; };
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Coro La Cordata//IT'].concat(lista.map(function(e){ var t = quando(e);
    return ['BEGIN:VEVENT','UID:' + e.id + '@corolacordata.org','DTSTAMP:' + f(new Date()),'DTSTART:' + f(t),'DTEND:' + f(new Date(t.getTime() + 2 * 36e5)),'SUMMARY:Coro La Cordata · ' + e.titolo,'LOCATION:' + e.luogo + ', ' + e.citta,'END:VEVENT'].join('\r\n'); })).concat(['END:VCALENDAR']).join('\r\n');
}
function scaricaIcs(lista, nome){ if (!lista.length) return avviso('Nessun concerto in programma'); var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics(lista)], { type:'text/calendar' })); a.download = nome; document.body.appendChild(a); a.click(); a.remove(); avviso('Apri il file per metterlo nel calendario'); }
 
var mappa = function(e){ return (e && e.mappa) || 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(e.luogo + ', ' + e.citta); };
function condividi(titolo, testo){ var u = location.href; if (navigator.share) navigator.share({ title:titolo, text:testo, url:u }).catch(function(){}); else if (navigator.clipboard) navigator.clipboard.writeText(testo + ' ' + u).then(function(){ avviso('Link copiato'); }, function(){ avviso(testo); }); }
var _av;
function avviso(t){ var a = $('.avviso') || document.body.appendChild(Object.assign(document.createElement('div'), { className:'avviso', role:'status' })); a.textContent = t; a.classList.add('si'); clearTimeout(_av); _av = setTimeout(function(){ a.classList.remove('si'); }, 2800); }
function finestra(html){ var f = $('.fin') || document.body.appendChild(Object.assign(document.createElement('div'), { className:'fin' })); f.innerHTML = '<div role="dialog" aria-modal="true">' + html + '</div>'; f.classList.add('aperta');
  var chiudi = function(){ f.classList.remove('aperta'); }; f.onclick = function(e){ if (e.target === f || e.target.closest('[data-chiudi]')) chiudi(); }; addEventListener('keydown', function k(e){ if (e.key === 'Escape') { chiudi(); removeEventListener('keydown', k); } }); }
document.addEventListener('click', function(e){
  if (ANTEPRIMA) { var ln = e.target.closest('a[href]'); var hr = ln && ln.getAttribute('href');
    if (hr && !/^(https?:|mailto:|tel:|#)/i.test(hr)) { e.preventDefault(); var pz = hr.split('#'); try { parent.postMessage({ sitoCordata:'pagina', pagina:pz[0].replace(/\.html$/, ''), hash:pz[1] || '' }, '*'); } catch(eP) {} return; }
     
    var sg = e.target.closest('[data-scegli]'); if (sg) { e.preventDefault(); try { parent.postMessage({ sitoCordata:'scegliFoto', campo:sg.getAttribute('data-scegli') }, '*'); } catch(eG) {} return; } }
  var b = e.target.closest('[data-ics]'); if (b) { e.preventDefault(); scaricaIcs(eventi.filter(function(x){ return x.id === b.getAttribute('data-ics'); }), 'concerto.ics'); }
  var s = e.target.closest('[data-sh]'); if (s) { e.preventDefault(); var v = eventi.filter(function(x){ return x.id === s.getAttribute('data-sh'); })[0]; condividi('Coro La Cordata', v.titolo + ' · ' + dataLunga(quando(v)) + ' ore ' + v.ora + ', ' + v.citta); }
  var st = e.target.closest('[data-strappa]'); if (st) { var bg = st.closest('.biglietto'); bg.classList.add('strappato'); setTimeout(function(){ bg.classList.add('girato'); }, CALMO ? 0 : 450); }
  var rm = e.target.closest('[data-rimetti]'); if (rm) { rm.closest('.biglietto').classList.remove('girato', 'strappato'); }
  if (e.target.closest('[data-sfoglia]')) { e.preventDefault(); sfoglia(); return; }
  var tp = e.target.closest('[data-traccia]'); if (tp) { var au = tp.parentNode.querySelector('audio'); $$('.traccia audio').forEach(function(x){ if (x !== au) { x.pause(); x.parentNode.classList.remove('va'); } }); if (au.paused) { suona(au); tp.parentNode.classList.add('va'); } else { au.pause(); tp.parentNode.classList.remove('va'); }
    au.ontimeupdate = function(){ var b = tp.parentNode.querySelector('.tr-barra i'); if (b && au.duration) b.style.width = (au.currentTime / au.duration * 100) + '%'; }; au.onended = function(){ tp.parentNode.classList.remove('va'); }; return; }
  var mp = e.target.closest('[data-mappa]'); if (mp && !mp.querySelector('iframe')) { mp.innerHTML = '<iframe src="' + mp.getAttribute('data-mappa') + '" title="Mappa" loading="lazy"></iframe>'; return; }
  var yt = e.target.closest('[data-yt]'); if (yt && !yt.querySelector('iframe')) { yt.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + yt.getAttribute('data-yt') + '?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; return; }
  var spo = e.target.closest('[data-sp]'); if (spo && !spo.querySelector('iframe')) { spo.classList.add('aperto'); spo.innerHTML = '<iframe src="https://open.spotify.com/embed/' + spo.getAttribute('data-sp') + '" title="Spotify" allow="encrypted-media"></iframe>'; return; }
  var pr = e.target.closest('[data-prenota]'); if (pr) { var x = (D.contributi || [])[+pr.getAttribute('data-prenota')] || {};
    finestra('<span class="eti">Con il tuo contributo</span><h2 class="h3" style="margin:14px 0 6px">' + esc(x.nome) + '</h2><p style="color:var(--mute);margin:0 0 16px">' + (x.offerta ? 'Offerta libera, da ' + esc(x.offerta) + ' €. ' : '') + 'Ti scriviamo noi per la consegna.</p><form class="modulo" data-demo style="box-shadow:none;padding:0"><div class="r2"><label for="prNome">Nome<input id="prNome" required></label><label for="prCont">Email o telefono<input id="prCont" required></label></div>' + (x.taglie ? '<label for="prTaglia">Taglia<select id="prTaglia">' + String(x.taglie).split(/[,\s]+/).filter(String).map(function(t){ return '<option>' + esc(t) + '</option>'; }).join('') + '</select></label>' : '') + '<label class="ok" for="prPriv"><input id="prPriv" type="checkbox" required>Ho letto l’informativa privacy</label><button class="btn btn-r" style="justify-content:center">Prenota</button></form>');
    $$('.fin form[data-demo]').forEach(function(f){ f.onsubmit = function(ev2){ ev2.preventDefault(); avviso('Prenotazione ricevuta: ti scriviamo noi'); $('.fin').classList.remove('aperta'); }; }); return; }
  var gf = e.target.closest('[data-foto]'); if (gf) finestra('<img src="' + gf.getAttribute('data-foto') + '" alt="" style="width:100%;border-radius:14px"><div style="margin-top:14px"><button class="btn btn-o btn-s" data-chiudi>Chiudi</button></div>');
  var gr = e.target.closest('[data-grande]'); if (gr) { var ev3 = eventi.filter(function(x){ return x.id === gr.getAttribute('data-grande'); })[0]; finestra('<div class="poster grande">' + manifesto(ev3) + '</div><div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap"><button class="btn btn-r btn-s" data-ics="' + ev3.id + '">' + IC.cal + 'Mettilo in calendario</button><button class="btn btn-o btn-s" data-chiudi>Chiudi</button></div>'); }
  var c = e.target.closest('[data-canto]'); if (c) { var x = (D.brani || [])[+c.getAttribute('data-canto')];
    finestra('<span class="eti">Repertorio</span><h2 class="h3" style="margin:16px 0 10px;font-size:2.6rem">' + esc(x.titolo) + '</h2><p class="lir" style="font-size:1.3rem;color:var(--mute);margin:0 0 20px">' + esc(x.autore) + (x.arr ? ', armonizzazione di ' + esc(x.arr) : '') + '</p>'
      + (x.testo ? '<p style="white-space:pre-line">' + esc(x.testo) + '</p>' : '<p style="color:var(--mute)">Il testo compare qui quando nel Repertorio dell’app è segnato come pubblicabile.</p>') + '<button class="btn btn-o btn-s" data-chiudi>Chiudi</button>'); }
});



function biglietto(e, i){
  var t = quando(e), g = fra(ora(), t), tra = g === 0 ? 'Oggi' : g === 1 ? 'Domani' : g > 0 && g <= 30 ? 'Tra ' + g + ' giorni' : '';
  return '<article class="biglietto' + (i === 0 ? ' primo' : '') + '"><div class="corpo">' + (tra ? '<span class="tra">' + tra + '</span>' : '')
    + '<div class="data"><span class="gg">' + t.getDate() + '</span><span class="mm">' + mm(t) + ' ' + t.getFullYear() + '<br>' + GIORNI[t.getDay()] + '</span></div>'
    + '<h3>' + esc(e.titolo) + '</h3><div class="dove">' + esc(e.luogo) + '<br>' + esc(e.citta) + '</div>'
    + '<div class="az"><a class="pill" href="#" data-ics="' + e.id + '">' + piccola('cal') + 'Calendario</a><a class="pill" href="' + mappa(e) + '" target="_blank" rel="noopener">' + piccola('map') + 'Mappa</a><a class="pill" href="#" data-sh="' + e.id + '" aria-label="Condividi">' + piccola('sh') + '</a></div></div>'
    + '<button class="matrice" data-strappa aria-label="Stacca il biglietto e guarda il manifesto"><b>' + e.ora + '</b><span>' + esc(ingresso(e)) + '</span><span class="forbici">Stacca ✂</span></button>'
    + '<div class="retro"><div class="poster">' + manifesto(e) + '</div><div class="retro-az"><button class="pill" data-grande="' + e.id + '">Ingrandisci</button><button class="pill" data-rimetti>Rimetti il biglietto</button></div></div></article>';
}
 
function ingresso(e){ var p = String((e && e.prezzo) || '').trim(); return { offerta:'Ingresso a offerta', pagamento:p ? 'Ingresso ' + p : 'Ingresso a pagamento', invito:'Su invito' }[(e && e.ingresso) || ''] || 'Ingresso libero'; }
 
function manifesto(e){
  if (e.locandina) return '<img src="' + FOTO(e.locandina) + '" alt="Manifesto: ' + esc(e.titolo) + '">';
  var t = quando(e);
  return '<div class="mf"><div class="mf-su"><img src="' + LOGO + '" alt=""><span>Coro<br>La Cordata</span></div><div class="mf-tit">' + esc(e.titolo) + '</div>'
    + '<div class="mf-data"><b>' + t.getDate() + '</b><span>' + MESI[t.getMonth()] + ' ' + t.getFullYear() + '<br>' + GIORNI[t.getDay()] + ', ore ' + esc(e.ora) + '</span></div>'
    + '<div class="mf-dove">' + esc(e.luogo) + '<br>' + esc(e.citta) + '</div><div class="mf-giu">' + esc(ingresso(e)) + (e.organizzatore ? ' · ' + esc(e.organizzatore) : '') + '</div>'
    + '<svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60 L0 40 L40 28 L70 36 L110 12 L140 30 L180 6 L215 30 L250 18 L300 34 L300 60Z"/></svg></div>';
}
function riga(e){ var t = quando(e);
  return '<div class="riga"><span class="d">' + t.getDate() + ' ' + mm(t) + '<br>' + t.getFullYear() + '</span><div><b>' + esc(e.titolo) + '</b><small>' + esc(e.luogo) + ' · ' + esc(e.citta) + '</small></div><a class="pill" href="' + mappa(e) + '" target="_blank" rel="noopener">' + piccola('map') + 'Dove</a></div>'; }
function testa(eti, titolo, lead){
  var f = ((D.foto || {}).pagine || {})[PAG];
  return '<section class="testa' + (f ? ' con-foto' : '') + '">' + (f ? '<img class="sfondo" src="' + f + '" alt="">' : '<canvas aria-hidden="true"></canvas>') + '<div class="wrap"><span class="eti">' + eti + '</span><h1 class="h1" style="margin-top:22px;max-width:14ch">' + titolo + '</h1>' + (lead ? '<p class="lead">' + lead + '</p>' : '') + '</div></section>';
}
function nastro(){
  var t = ['Canti di montagna','<i>e di popolo</i>','Montalto delle Marche','<i>dal 1987</i>','Monti Sibillini','<i>' + voci() + ' voci</i>','Festival degli Appennini','<i>una sola corda</i>'];
  var s = t.map(function(x){ return '<span>' + x + '</span><span>✦</span>'; }).join('');
  return '<div class="nastro" aria-hidden="true"><div>' + s + s + '</div></div>';
}
function cifre(){
  return '<div class="cifre sale"><div><b data-conta="' + anni() + '">' + anni() + '</b><span>anni di canto</span></div><div><b data-conta="' + concerti() + '">' + concerti() + '</b><span>concerti in Italia e all’estero</span></div>'
    + '<div><b data-conta="' + (D.brani || []).length + '">' + (D.brani || []).length + '</b><span>canti nel repertorio</span></div><div><b data-conta="' + voci() + '">' + voci() + '</b><span>voci maschili, quattro sezioni</span></div></div>';
}

 
var OMINO = '<circle cx="23" cy="9" r="7.5"/><rect x="3" y="19" width="12" height="27" rx="4"/><path d="M13 18c6-3 14-2 17 4l3 23c0 3-3 4-5 3l-2-8v14l6 21 4 21h-8l-5-19-4-8-4 27H7l4-24 2-20z"/><path d="M28 23l11 16-3 2-10-12z"/>';
function cordata(){
  var tot = voci(), W = 700, H = 470, sez = [], fig = [];
  for (var si = (D.sezioni || []).length - 1; si >= 0; si--) for (var j = 0; j < D.sezioni[si].n; j++) sez.push(si);    
   
  var V = [[70,446],[610,400],[450,305],[150,266],[330,172],[555,120],[592,48]], seg = [], LT = 0;
  for (var i = 1; i < V.length; i++) { var l = Math.hypot(V[i][0] - V[i - 1][0], V[i][1] - V[i - 1][1]); seg.push(l); LT += l; }
  var lungo = function(d){ for (var k = 0; k < seg.length; k++) { if (d <= seg[k] || k === seg.length - 1) { var u = Math.min(1, d / seg[k]), A = V[k], B = V[k + 1]; return { x:A[0] + (B[0] - A[0]) * u, y:A[1] + (B[1] - A[1]) * u, dir:B[0] >= A[0] ? 1 : -1 }; } d -= seg[k]; } };
  var scala = function(y){ return Math.max(.2, Math.min(1, .2 + .8 * (y - 48) / 398)); };
  var org = D.organico || [], perSez = {}, nomeDi = [], usati = {};
  org.forEach(function(o){ (perSez[o.sez] = perSez[o.sez] || []).push(o.nome); });
  sez.forEach(function(si){ var k = D.sezioni[si].nome, i = usati[k] || 0; nomeDi.push((perSez[k] || [])[i] || ''); usati[k] = i + 1; });
  var d = 0;
  for (var f = 0; f <= tot && d < LT; f++) { var p = lungo(d), s = scala(p.y); fig.push({ x:p.x, y:p.y, s:s, h:112 * s, dir:p.dir }); d += 44 * s + 6 * s; }
  var corda = '', g = '';
  fig.forEach(function(p, c){ var vy = p.y - p.h * .56;
    if (!c) corda = 'M' + p.x.toFixed(1) + ' ' + vy.toFixed(1); else { var q = fig[c - 1], qy = q.y - q.h * .56; corda += ' Q' + ((p.x + q.x) / 2).toFixed(1) + ' ' + ((vy + qy) / 2 + 10 * p.s).toFixed(1) + ' ' + p.x.toFixed(1) + ' ' + vy.toFixed(1); } });
  for (var c = fig.length - 1; c >= 0; c--) { var p2 = fig[c], sc = p2.h / 100, tx = p2.x - 20 * sc * p2.dir, ty = p2.y - p2.h;
    g += '<ellipse class="ombra" cx="' + p2.x.toFixed(1) + '" cy="' + (p2.y + 1).toFixed(1) + '" rx="' + (20 * sc).toFixed(1) + '" ry="' + (3.5 * sc).toFixed(1) + '"/>';
    var tr = 'translate(' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ') scale(' + (sc * p2.dir).toFixed(3) + ' ' + sc.toFixed(3) + ')';
    g += c === 0 ? '<g transform="' + tr + '"><g class="tu">' + OMINO + '</g></g>'
      : '<g transform="' + tr + '"><g class="p s' + sez[(c - 1) % sez.length] + (CALMO ? '' : ' cammina') + '" style="animation-delay:-' + ((c * .37) % 1.9).toFixed(2) + 's">' + (nomeDi[c - 1] ? '<title>' + esc(nomeDi[c - 1]) + ' · ' + esc(D.sezioni[sez[c - 1]].nome) + '</title>' : '') + OMINO + '</g></g>'; }
  var sentiero = 'M' + V.map(function(v){ return v[0] + ' ' + v[1]; }).join(' L'), p0 = fig[0];
  return '<div class="scena"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + tot + ' coristi legati in cordata su un sentiero di montagna, e un posto libero davanti">'
    + '<defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C1C1F"/><stop offset=".75" stop-color="#0A0A0B"/></linearGradient></defs><path class="monte" d="M0 470 L120 360 L210 385 L370 230 L440 260 L592 30 L640 110 L700 150 L700 470 Z"/><path class="neve-c" d="M592 30 L560 82 L578 74 L592 92 L606 70 L622 84 Z"/>'
    + '<path class="sentiero" d="' + sentiero + '"/><path class="corda-l" d="' + corda + '"/>' + g
    + '<g class="bandiera" transform="translate(592 48)"><path d="M0 0 V-30"/><path d="M0 -30 L16 -25 L0 -20 Z"/></g></svg>'
    + (on('vieni-a-cantare') ? '<a class="scena-tu" href="vieni-a-cantare.html" style="left:' + (p0.x / W * 100).toFixed(1) + '%;top:' + ((p0.y + 10) / H * 100).toFixed(1) + '%">↑ Il posto libero è tuo</a>' : '') + '</div>';
}
function nomiCoro(){
  var org = D.organico || []; if (!org.length) return '';
  var ini = function(n){ return n.split(' ').map(function(x){ return x.charAt(0); }).join('').slice(0, 2); };
  return '<div class="nomi">' + D.sezioni.map(function(s, i){ var l = org.filter(function(o){ return o.sez === s.nome; });
    return '<div class="nomi-sez" data-sezn="' + i + '"><h3>' + esc(s.nome) + ' <small>' + l.length + '</small></h3><ul>' + l.map(function(o){ return '<li>' + (o.foto ? '<img src="' + FOTO(o.foto) + '" alt="" loading="lazy">' : '<i>' + esc(ini(o.nome)) + '</i>') + '<span>' + esc(o.nome) + '</span></li>'; }).join('') + '</ul></div>'; }).join('')
    + '</div><p class="nota-nomi">' + (D.esempio ? 'Nomi di esempio. ' : '') + 'Nel sito vero i nomi arrivano dai soci attivi dell’app; la foto compare solo con il consenso, altrimenti le iniziali.</p>';
}
 
function chiLato(){
  var t = (D.foto || {}).tutte || [], f = t[1] || t[0];
  return (f ? '<img class="chi-foto" src="' + esc(f) + '" alt="Il coro La Cordata" loading="lazy">' : '')
    + '<div class="chi-cifre"><div><b>' + anni() + '</b><span>anni</span></div><div><b>' + concerti() + '</b><span>concerti</span></div><div><b>' + voci() + '</b><span>voci</span></div></div>';
}
function pentagramma(){
  var org = D.organico || [], ini = function(n){ return n.split(' ').map(function(x){ return x.charAt(0); }).join('').slice(0, 2); };
  return '<div class="penta">' + (D.sezioni || []).map(function(s){ var l = org.filter(function(o){ return o.sez === s.nome; }), n = l.length || s.n;
    return '<div class="penta-r"><div class="penta-n"><b>' + esc(s.nome) + '</b><small>' + n + (n === 1 ? ' voce' : ' voci') + '</small>' + (s.nota ? '<span>' + esc(s.nota) + '</span>' : '') + '</div>'
      + '<div class="penta-l">' + (l.length ? l.map(function(o, j){ return '<span class="nota" tabindex="0" style="--y:' + [2, 0, 3, 1, 4][j % 5] + '">' + (o.foto ? '<img src="' + FOTO(o.foto) + '" alt="" loading="lazy">' : '<i>' + esc(ini(o.nome)) + '</i>') + '<em>' + esc(o.nome) + '</em></span>'; }).join('')
        : Array.apply(null, Array(Math.min(n, 12))).map(function(x, j){ return '<span class="nota" style="--y:' + [2, 0, 3, 1, 4][j % 5] + '"><i>♪</i></span>'; }).join('')) + '</div></div>'; }).join('')
    + '</div>' + (org.length ? '<p class="nota-nomi">Tocca una nota per leggere il nome. La foto compare solo con il consenso, altrimenti le iniziali.</p>' : '');
}
function sezioniBtn(){ return '<div class="sezioni">' + (D.sezioni || []).map(function(s, i){ return '<button data-sez="' + i + '" aria-pressed="false"><b>' + s.n + '</b><span>' + esc(s.nome) + '</span></button>'; }).join('') + '</div>'; }

 
var NOMI = ['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];
var notaNome = function(m){ return NOMI[m % 12] + (Math.floor(m / 12) - 2); };    
var hz = function(m){ return 440 * Math.pow(2, (m - 69) / 12); };
var ESITI = { B:['Basso','La roccia sotto i piedi del coro.','Bassi'], Bar:['Baritono','Il colore caldo che rende pieno il suono.','Baritoni'], T2:['Tenore secondo','Tieni la melodia: il filo che tutti seguono.','Tenori secondi'], T1:['Tenore primo','La voce che svetta sopra tutte.','Tenori primi'] };
var DOMANDE = [
  { q:'Sotto la doccia ti viene più naturale…', r:[['le note alte, i ritornelli da brividi',{T1:2}],['la melodia, senza fatica',{T2:2}],['una voce calda e piena',{Bar:2}],['le note gravi che fanno vibrare il petto',{B:2}]] },
  { q:'Al karaoke scegli…', r:[['un pezzo con l’acuto finale',{T1:2}],['la ballata che tutti conoscono',{T2:2}],['un cantautore dalla voce scura',{Bar:2}],['il coro da stadio, più basso possibile',{B:2}]] },
  { q:'Quando parli, la tua voce è…', r:[['chiara, si sente da lontano',{T1:1,T2:1}],['media, né alta né bassa',{T2:1,Bar:1}],['profonda',{B:1,Bar:1}]] }
];
function provaVoce(box){
  var modo = 'orecchio', i = 0, pt;
  var esito = function(k){
    var e = ESITI[k], s = (D.sezioni || []).filter(function(x){ return x.nome === e[2]; })[0];
    $('.qui', box).innerHTML = '<div class="esito"><span class="eti">La tua voce</span><div class="chi">' + e[0] + '</div><p style="color:#fff;font-size:1.1rem">' + e[1] + '</p>'
      + (s ? '<p>Nel coro i ' + e[2].toLowerCase() + ' sono ' + s.n + '. Il posto accanto a loro è libero.</p>' : '') + '<p>È un gioco: la tua voce vera la scopre il Maestro alla prima prova.</p>'
      + '<div class="fila"><a class="btn btn-r" href="vieni-a-cantare.html#scrivici">Vieni a una prova ' + IC.ar + '</a><button class="btn btn-o" data-rifai>Rifai</button></div></div>';
    $('[data-rifai]', box).onclick = function(){ i = 0; disegna(); };
  };
  var disegna = function(){
    pt = { T1:0, T2:0, Bar:0, B:0 };
    box.innerHTML = '<div class="tab" role="group" aria-label="Come vuoi provare"><button data-m="orecchio" aria-pressed="' + (modo === 'orecchio') + '">Con l’orecchio</button><button data-m="domande" aria-pressed="' + (modo === 'domande') + '">Con 3 domande</button></div><div class="qui" style="display:grid;gap:20px"></div>';
    $$('[data-m]', box).forEach(function(b){ b.onclick = function(){ modo = b.getAttribute('data-m'); i = 0; disegna(); }; });
    var q = $('.qui', box);
    if (modo === 'orecchio') {
      q.innerHTML = '<h3>Trova le tue note</h3><p>Muovi i cursori: suona la nota. Fermati dove la canteresti ancora comodo, senza forzare.</p>'
        + '<div class="cursore"><label for="vBassa">La più bassa <output id="oBassa">Fa1</output></label><input id="vBassa" type="range" min="36" max="57" value="43"></div>'
        + '<div class="cursore"><label for="vAlta">La più alta <output id="oAlta">Mi3</output></label><input id="vAlta" type="range" min="57" max="74" value="64"></div>'
        + '<button class="btn btn-r" id="vEsito" style="justify-self:start">Scopri la tua voce ' + IC.ar + '</button>';
      var suono = null, ferma = function(){ if (suono) { suono.ferma(); suono = null; } };
      ['Bassa', 'Alta'].forEach(function(k){ var r = $('#v' + k, box), o = $('#o' + k, box);
        var agg = function(){ o.textContent = notaNome(+r.value); };
        r.addEventListener('input', function(){ agg(); if (!suono) suono = voce(hz(+r.value), 0, .08); else suono.nota(hz(+r.value)); });
        r.addEventListener('pointerup', ferma); r.addEventListener('change', ferma); r.addEventListener('blur', ferma); agg(); });
      $('#vEsito', box).onclick = function(){ ferma(); var c = (+$('#vBassa', box).value + +$('#vAlta', box).value) / 2; esito(c < 52.5 ? 'B' : c < 55.5 ? 'Bar' : c < 59 ? 'T2' : 'T1'); };
    } else {
      var dom = function(){
        if (i >= DOMANDE.length) return esito(Object.keys(pt).sort(function(a, b){ return pt[b] - pt[a]; })[0]);
        var d = DOMANDE[i];
        q.innerHTML = '<span class="eti">Domanda ' + (i + 1) + ' di ' + DOMANDE.length + '</span><h3>' + d.q + '</h3><div class="scelte">' + d.r.map(function(r, j){ return '<button data-j="' + j + '"><i>' + 'ABCD'[j] + '</i>' + r[0] + '</button>'; }).join('') + '</div>';
        $$('[data-j]', q).forEach(function(b){ b.onclick = function(){ var p = d.r[+b.getAttribute('data-j')][1]; Object.keys(p).forEach(function(k){ pt[k] += p[k]; }); i++; dom(); }; });
      };
      dom();
    }
  };
  disegna();
}


var TESTI_SCHEMA = [
  ['Home','home.sopra','Riga sopra il titolo','voci in cordata, dal 1987'],
  ['Home','home.titolo','Titolo grande','La Cordata'],
  ['Home','home.btn','Pulsante principale','Dove cantiamo'],
  ['Home','home.ascolta','Pulsante della musica','Ascolta il coro'],
  ['Home','home.conc.eti','Concerti: etichetta','In programma · aggiungili al calendario'],
  ['Home','home.conc.titolo','Concerti: titolo','Dove *cantiamo*'],
  ['Home','home.muro.eti','Foto: etichetta','Dal vivo'],
  ['Home','home.muro.titolo','Foto: titolo','Così *cantiamo*'],
  ['Home','home.coro.eti','Il coro: etichetta','Il coro oggi'],
  ['Home','home.coro.titolo','Il coro: titolo','{voci} voci, *una corda*'],
  ['Home','home.coro.testo','Il coro: testo','In montagna si sale legati: se uno rallenta, gli altri lo aspettano. Nel coro è uguale. Tocca una sezione: la senti cantare e vedi chi c’è.'],
  ['Home','home.voce.eti','Che voce sei: etichetta','Vieni a cantare · non serve saper leggere la musica'],
  ['Home','home.voce.titolo','Che voce sei: titolo','Che voce *sei?*'],
  ['Home','home.voce.testo','Che voce sei: testo','Muovi i cursori e ascolta: in trenta secondi scopri se sei basso, baritono o tenore. Poi vieni a scoprirlo davvero, a una prova con noi.'],
  ['Home','home.rep.titolo','Repertorio: titolo','Canti di montagna, *di popolo, di casa*'],
  ['Home','home.storia.eti','Storia: etichetta','La nostra storia · scorri per salire'],
  ['Home','home.fest.eti','Festival: etichetta','Dal 1988 · lo organizziamo noi'],
  ['Home','home.fest.titolo','Festival: titolo','Festival degli *Appennini*'],
  ['Home','home.fest.testo','Festival: testo','Ogni maggio i cori della montagna di tutta Italia salgono a Montalto: una sera nella Basilica di Santa Maria Assunta, sotto i Sibillini.'],
  ['Home','home.stampa.titolo','Stampa: titolo','Dalla *stampa*'],
  ['Home','home.sost.titolo','Sostenitori: titolo','Chi sale con noi'],
  ['Situazioni','sit.grazie','Il giorno dopo un concerto','Eravate tantissimi. Grazie per aver cantato con noi.'],
  ['Situazioni','sit.compleanno','Compleanno del coro (29 maggio)','Il 29 maggio 1987 nasceva il coro. Da allora saliamo sempre legati, con lo stesso Maestro.'],
  ['Situazioni','sit.festival','Nei giorni del Festival','Cori da tutta Italia a Montalto. Stasera si canta nella Basilica di Santa Maria Assunta.'],
  ['Situazioni','sit.stagione','Nuova stagione (settembre e ottobre)','Le prove sono ricominciate. Se hai sempre pensato di cantare in un coro, questo è il mese giusto.'],
  ['Situazioni','sit.prova','Sera di prova','{luogoProve}. Entra, siediti in fondo e ascolta: nessuno ti chiederà di cantare.'],
  ['Situazioni','sit.vuoto','Calendario vuoto','Il calendario si sta riempiendo: vuoi che cantiamo da voi?'],
  ['Situazioni','sit.natale.str','Natale: striscia in alto','Buone feste dal coro'],
  ['Situazioni','sit.pasqua.str','Pasqua: striscia in alto','Buona Pasqua dal coro'],
  ['Situazioni','sit.stagione.str','Nuova stagione: striscia in alto','Nuova stagione: è il momento giusto per entrare'],
  ['Situazioni','sit.prova.str','Sera di prova: striscia in alto','Le porte sono aperte: vieni ad ascoltare'],
  ['Home','vetta.eti','Fondo pagina: etichetta','Sei arrivato in vetta · 2476 m'],
  ['Home','vetta.titolo','Fondo pagina: titolo','Manca *la tua* voce'],
  ['Home','vetta.btn','Fondo pagina: pulsante','Vieni a una prova'],
  ['Chi siamo','chi.titolo','Titolo','Voci *in cordata* dal 1987'],
  ['Chi siamo','chi.citazione','Citazione','«Un coro che nasce dal respiro delle montagne: armonie semplici, autentiche.»'],
  ['Chi siamo','chi.voci.titolo','Le voci: titolo','Quattro *colori*'],
  ['Chi siamo','chi.voci.testo','Le voci: testo','Tenori primi, tenori secondi, baritoni e bassi. Tocca una sezione: la senti cantare e la vedi nella cordata.'],
  ['Chi siamo','chi.consiglio.titolo','Consiglio: titolo','Il consiglio *direttivo*'],
  ['Chi siamo','chi.consiglio.testo','Consiglio: testo','Chi tiene la corda: eletti dall’assemblea dei soci.'],
  ['Chi siamo','chi.libro.eti','Libro: etichetta','Il libro del Maestro'],
  ['Chi siamo','chi.sale.titolo','Dove abbiamo cantato','Sale, teatri, cattedrali'],
  ['Concerti','conc.lead','Testo in alto','Ingresso quasi sempre libero. Metti i concerti nel calendario del telefono: se qualcosa cambia, lo trovi qui.'],
  ['Concerti','conc.archivio','Archivio: titolo','Dove *siamo stati*'],
  ['Repertorio','rep.titolo','Titolo','{brani} canti, *una sola voce*'],
  ['Repertorio','rep.lead','Testo in alto','Canti della montagna e della tradizione popolare, con le armonizzazioni del nostro Maestro. Tocca un titolo per saperne di più.'],
  ['Repertorio','rep.caso','Pesca: titolo','Lascia fare *al caso*'],
  ['Ascolta','asc.titolo','Titolo','Ascolta *il coro*'],
  ['Ascolta','asc.lead','Testo in alto','Registrazioni dal vivo e video dei nostri concerti.'],
  ['Ascolta','asc.video','Video: titolo','I *video*'],
  ['Ascolta','asc.esterno','Avviso prima di YouTube/Spotify','Il video arriva da YouTube: toccandolo accetti i suoi cookie.'],
  ['Foto e stampa','media.titolo','Titolo','Quello che resta *dopo l’ultimo accordo*'],
  ['Foto e stampa','media.lead','Testo in alto','Le foto dei nostri concerti, solo di chi ha dato il consenso.'],
  ['Vieni a cantare','vieni.titolo','Titolo','Cerchiamo *la tua* voce'],
  ['Vieni a cantare','vieni.p1t','Passo 1: titolo','Scrivici'],
  ['Vieni a cantare','vieni.p1','Passo 1: testo','Lasci nome e numero qui sotto. Ti risponde una persona del coro.'],
  ['Vieni a cantare','vieni.p2t','Passo 2: titolo','Vieni a una prova'],
  ['Vieni a cantare','vieni.p2','Passo 2: testo','Ogni {giorno} alle {ora}. Ascolti, provi, senza impegno. Il Maestro ti trova la sezione giusta.'],
  ['Vieni a cantare','vieni.p3t','Passo 3: titolo','Sali con noi'],
  ['Vieni a cantare','vieni.p3','Passo 3: testo','Se ti piace, entri nel coro: l’iscrizione si fa dal telefono in tre minuti.'],
  ['Vieni a cantare','vieni.d1','Domanda 1','Devo saper leggere la musica?'],
  ['Vieni a cantare','vieni.r1','Risposta 1','No. Si impara a orecchio, con le tracce della tua voce che trovi nell’app del coro e ascolti quando vuoi.'],
  ['Vieni a cantare','vieni.d2','Domanda 2','Sono giovane: è un coro per me?'],
  ['Vieni a cantare','vieni.r2','Risposta 2','Sì. Il canto di montagna è nato da ragazzi che cantavano insieme. Viaggi, festival e concerti in posti che da solo non vedresti.'],
  ['Vieni a cantare','vieni.d3','Domanda 3','Quanto tempo serve?'],
  ['Vieni a cantare','vieni.r3','Risposta 3','Una sera a settimana, più i concerti. Date, orari e programma arrivano sull’app: sai sempre tutto prima.'],
  ['Vieni a cantare','vieni.d4','Domanda 4','È un coro solo maschile?'],
  ['Vieni a cantare','vieni.r4','Risposta 4','Sì: tenori primi, tenori secondi, baritoni e bassi.'],
  ['Vieni a cantare','vieni.d5','Domanda 5','Costa qualcosa?'],
  ['Vieni a cantare','vieni.r5','Risposta 5','C’è una piccola quota associativa annuale. Spartiti e divisa li mette il coro.'],
  ['Vieni a cantare','vieni.scrivi','Modulo: titolo','Ti aspettiamo *{giorno}*'],
  ['Sostienici','sost.titolo','Titolo','Ogni corda ha bisogno *di chi la tiene*'],
  ['Sostienici','sost.lead','Testo in alto','Siamo un’associazione di promozione sociale: ogni aiuto diventa concerti, viaggi, il Festival e voci nuove.'],
  ['Sostienici','sost.5x1000','5×1000: testo','Non costa nulla: nella dichiarazione dei redditi firma per le associazioni e scrivi il nostro codice fiscale.'],
  ['Sostienici','sost.sponsor','Sponsor: testo','Aziende e negozi: il vostro logo sul sito, nei programmi di sala e al Festival, con un resoconto delle uscite.'],
  ['Sostienici','sost.invito','Invito: testo','Rassegne, feste di paese, matrimoni, ricorrenze: il coro canta dove c’è chi ascolta.'],
  ['Sostienici','sost.contr.titolo','Contributi: titolo','Porta a casa *un pezzo di coro*'],
  ['Sostienici','sost.contr.testo','Contributi: testo','Con un’offerta libera ti diamo un ricordo del coro. Lo prenoti qui e lo ritiri a un concerto o in sede.'],
  ['Contatti','cont.titolo','Titolo','Scrivici, *o passa a trovarci*'],
  ['Area coristi','cor.titolo','Titolo','Area *coristi*'],
  ['Area coristi','cor.lead','Testo in alto','Per chi canta nella Cordata: prove, presenze, spartiti e tracce, tutto nell’app del coro.'],
  ['Area coristi','cor.btn','Pulsante','Entra nel portale'],
  ['Area coristi','cor.aiuto','Aiuto','Il codice del coro te lo dà il segretario. Sul telefono puoi aggiungere l’app alla schermata Home.'],
  ['Piè di pagina','piede.firma','Riga sotto il logo','voci in cordata dal 1987, Montalto delle Marche']
];
var TESTI = {}; TESTI_SCHEMA.forEach(function(r){ TESTI[r[1]] = r[3]; });
var VAR_TESTI = function(){ return { voci:voci(), brani:(D.brani || []).length, anni:anni(), giorno:D.prove.giorno || '', ora:D.prove.ora || '', luogoProve:D.prove.luogo || '' }; };
 
function Tgrezzo(k){ var v = (CFG.testi && CFG.testi[k] != null && CFG.testi[k] !== '') ? CFG.testi[k] : TESTI[k]; var x = VAR_TESTI(); return esc(String(v == null ? '' : v).replace(/\{(\w+)\}/g, function(m, n){ return n in x ? x[n] : m; })); }
function GR(s){ return s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>'); }
function TOC(k, h){ return ANTEPRIMA ? '<span data-t="' + k + '">' + h + '</span>' : h; }
 
function CT(k){ return TOC('@' + k, GR(esc(D.testi[k] || '')).replace(/\*/g, '')); }
function GT(k){ return TOC('!' + k, esc(D.testi[k] || '')); }
function T(k){ return TOC(k, GR(Tgrezzo(k)).replace(/\*/g, '')); }
function TI(k, colore){ return TOC(k, GR(Tgrezzo(k)).replace(/\*([^*]+)\*/g, '<span class="lir"' + (colore ? ' style="color:' + colore + '"' : '') + '>$1</span>')); }
function TP(k){ return TOC(k, GR(Tgrezzo(k)).replace(/\*/g, '')); }
function ETI(k, stile){ var t = Tgrezzo(k).replace(/\*/g, ''), i = t.indexOf(' · '); return TOC(k, '<span class="eti"' + (stile ? ' style="' + stile + '"' : '') + '>' + (i > 0 ? t.slice(0, i) + ' <b>· ' + t.slice(i + 3) + '</b>' : t) + '</span>'); }
if (ANTEPRIMA) {
  try { parent.postMessage({ sitoCordata:'testi', schema:TESTI_SCHEMA }, '*'); } catch(e) {}
   
  var stT = document.createElement('style'); stT.textContent = 'html.tocca [data-t]{cursor:text}html.tocca [data-t]:hover{outline:2px dashed #E0A100;outline-offset:3px}.t-sel{outline:3px solid #E0A100!important;outline-offset:3px}';
  document.head.appendChild(stT); if (window.CORDATA_TOCCA !== false) document.documentElement.classList.add('tocca');
  window.ED_VARS = VAR_TESTI(); window.ED_CLASSE = 'tocca'; window.ED_LIR = true;
   
  try { var evF = eventi.filter(function(e){ return quando(e) > VERO; }), e0 = evF[0], t0 = e0 ? quando(e0) : null, a0 = VERO.getFullYear();
    var gg = function(d, hh){ var x = new Date(t0); x.setDate(x.getDate() + d); x.setHours(hh, 0, 0, 0); return x.toISOString(); };
    var nat = new Date(a0, 11, 20, 19); if (nat < VERO && VERO.getMonth() !== 11) nat = new Date(a0 + 1, 11, 20, 19);
    var pq = pasqua(a0); if (pq < VERO) pq = pasqua(a0 + 1);
    var cmp = new Date(a0, 4, 29, 12); if (cmp < VERO) cmp = new Date(a0 + 1, 4, 29, 12);
    var stg = new Date(a0, 8, 10, 11); if (stg < VERO) stg = new Date(a0 + 1, 8, 10, 11);
    var fdal = D.festival && D.festival.dal ? giornoD(D.festival.dal) : null;
    var gp = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'].indexOf(String(D.prove.giorno || '').toLowerCase().trim()), prv = null;
    if (gp >= 0) { prv = new Date(VERO); prv.setDate(prv.getDate() + ((gp - prv.getDay() + 7) % 7 || 7)); prv.setHours(19, 0, 0, 0); }
    var ult = eventi.map(quando).sort(function(a, b){ return b - a; })[0], vz = new Date(Math.max(VERO.getTime(), ult ? ult.getTime() : 0) + 40 * 864e5); vz.setHours(11, 0, 0, 0);
    var SC = [['', 'Adesso']];
    if (t0) SC.push(['presto', 'Concerto fra 5 giorni', gg(-5, 11)], ['stasera', 'Il giorno del concerto', gg(0, 15)], ['live', 'Durante il concerto', new Date(t0.getTime() + 25 * 6e4).toISOString()], ['grazie', 'Il giorno dopo', gg(1, 10)]);
    SC.push(['natale', 'Natale', nat.toISOString()], ['pasqua', 'Pasqua', pq.toISOString()], ['compleanno', 'Compleanno del coro', cmp.toISOString()]);
    if (fdal) SC.push(['festival', 'Durante il Festival', new Date(fdal.getTime() + 21 * 36e5).toISOString()]);
    SC.push(['stagione', 'Nuova stagione (settembre)', stg.toISOString()]);
    if (prv) SC.push(['prova', 'Sera di prova', prv.toISOString()]);
    SC.push(['vuoto', 'Nessun concerto in calendario', vz.toISOString()]);
    parent.postMessage({ sitoCordata:'scenari', lista:SC, senzaConcerti:!t0 }, '*'); } catch(eS) {}
  window.addEventListener('message', function(e){ var d = e.data || {};
    if (d.sitoTocca != null) document.documentElement.classList.toggle('tocca', !!d.sitoTocca);
    if (d.sitoImposta) document.querySelectorAll('[data-t="' + d.sitoImposta + '"]').forEach(function(x){ x.innerHTML = d.html; });
    if (d.sitoEvidenzia) { document.querySelectorAll('.t-sel').forEach(function(x){ x.classList.remove('t-sel'); }); var x = document.querySelector('[data-t="' + d.sitoEvidenzia + '"]'); if (x) x.classList.add('t-sel'); } });
}

function giacca(conTitolo){
  return '<section class="giacca sez" id="voce"><div class="wrap"><div class="sale">' + (conTitolo || ETI('home.voce.eti') + '<h2 class="h2" style="margin-top:20px">' + TI('home.voce.titolo') + '</h2>')
    + '<p class="lead">' + TP('home.voce.testo') + '</p></div>'
    + '<div class="prova-voce sale" id="provaVoce"></div></div></section>';
}

 
function canti(lista){ return '<div class="canti">' + lista.map(function(b){ var i = (D.brani || []).indexOf(b); return '<button class="canto" data-canto="' + i + '"><span class="n">' + ('0' + (i + 1)).slice(-2) + '</span><b>' + esc(b.titolo) + '</b><small>' + esc(b.autore) + (b.arr ? ' · arr. ' + esc(b.arr) : '') + '</small></button>'; }).join('') + '</div>'; }
function conAudio(){ return (D.brani || []).filter(function(b){ return b.audio; }); }
function pesca(){ var bb = conAudio(); if (!bb.length) return ''; var i = attiva('branoGiorno') ? Math.floor(ora() / 864e5) % bb.length : 0, b = bb[i];
  return '<div class="pesca sale" data-pesca="' + i + '"><div class="righe"></div><div><span class="eti" style="color:#fff">' + (attiva('branoGiorno') ? 'Il canto di oggi' : 'Pesca un canto') + '</span><div class="tit" data-ptit style="margin-top:18px">' + esc(b.titolo) + '</div><div class="aut" data-paut>' + esc(b.autore) + (b.arr ? ' · arr. ' + esc(b.arr) : '') + '</div></div>'
    + '<div class="pesca-az"><button class="btn btn-w" data-pplay>' + IC.play + '<span>Ascolta</span></button>' + (bb.length > 1 ? '<button class="btn btn-o-w" data-pvai>' + IC.dado + 'Un altro</button>' : '') + '</div><div class="pesca-barra"><i></i></div><audio preload="none" src="' + esc(AUDIO(b.audio)) + '"' + AID(b.audio) + '></audio></div>'; }

 
function tappe(){ return (D.tappe || []).concat([{ anno:ora().getFullYear(), testo:anni() + ' anni e ' + concerti() + ' concerti. La corda continua, e c’è posto.' }]); }
function salita(){
  var t = tappe();
  return '<section class="salita" id="salita" style="--n:' + (t.length + 1) + '"><div class="fermo"><div class="wrap">' + ETI('home.storia.eti') + '</div>'
    + '<div class="disegno wrap" style="position:relative"><svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="prof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8202A" stop-opacity=".25"/><stop offset="1" stop-color="#C8202A" stop-opacity="0"/></linearGradient></defs>'
    + '<path class="profilo" id="sProf"/><path class="linea" id="sLin"/><path class="fatta" id="sFat"/></svg><div id="sPunti"></div></div>'
    + '<div class="wrap"><div class="testo"><div class="anno" id="sAnno">' + esc(t[0].anno || '…') + '</div><div class="racconto" id="sTesto">' + esc(t[0].testo) + '</div></div>'
    + '<div class="tacche" style="margin-top:18px"><span>513 m · Montalto</span><span><b>' + t.length + ' tappe</b></span><span>2476 m · Vettore</span></div></div></div></section>';
}
function attivaSalita(){
  var S = $('#salita'); if (!S) return;
  var t = tappe(), n = t.length, pts = [];
  for (var i = 0; i <= 40; i++) { var u = i / 40, y = 268 - u * 225 + 16 * Math.sin(u * 29) * (1 - u * .4) + 8 * Math.sin(u * 71 + 1) - (u > .9 ? (u - .9) * 180 : 0); pts.push([u * 1000, Math.max(16, y)]); }
  var d = 'M' + pts.map(function(p){ return p[0].toFixed(0) + ' ' + p[1].toFixed(0); }).join(' L');
  $('#sLin').setAttribute('d', d); $('#sFat').setAttribute('d', d); $('#sProf').setAttribute('d', d + ' L1000 300 L0 300 Z');
  var fat = $('#sFat'), L = fat.getTotalLength(); fat.style.strokeDasharray = L; fat.style.strokeDashoffset = L;
  var quota = function(fr){ var x = fr * 1000, j = Math.min(39, Math.floor(fr * 40)), a = pts[j], b = pts[j + 1]; return a[1] + (b[1] - a[1]) * ((x - a[0]) / (b[0] - a[0])); };
  var box = $('#sPunti'); box.style.cssText = 'position:absolute;top:0;bottom:0;left:var(--pad);right:var(--pad)';
  box.innerHTML = t.map(function(tp, i){ var fr = (i + .5) / n; return '<span data-i="' + i + '" style="position:absolute;left:' + (fr * 100) + '%;top:' + (quota(fr) / 300 * 100) + '%;width:14px;height:14px;border-radius:50%;transform:translate(-50%,-50%);background:#0A0A0B;box-shadow:inset 0 0 0 2px #5A5A5E;transition:all .3s"></span>'; }).join('')
    + '<span id="sIo" style="position:absolute;width:20px;height:20px;border-radius:50%;transform:translate(-50%,-50%);background:#fff;box-shadow:0 0 0 7px rgba(229,56,59,.35)"></span>';
  var anno = $('#sAnno'), testo = $('#sTesto'), io = $('#sIo'), punti = $$('[data-i]', box), att = 0;
  var agg = function(){
    var r = S.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / Math.max(1, S.offsetHeight - innerHeight)));
    fat.style.strokeDashoffset = L * (1 - p);
    io.style.left = (p * 100) + '%'; io.style.top = (quota(Math.min(.999, p)) / 300 * 100) + '%';
    var k = Math.min(n - 1, Math.floor(p * n));
    punti.forEach(function(s, i){ var ok = i <= k; s.style.background = ok ? '#E5383B' : '#0A0A0B'; s.style.boxShadow = 'inset 0 0 0 2px ' + (ok ? '#E5383B' : '#5A5A5E'); });
    if (k !== att) { att = k; anno.textContent = t[k].anno || '…'; testo.textContent = t[k].testo; }
  };
  addEventListener('scroll', agg, { passive:true }); addEventListener('resize', agg); agg();
}

function muro(){
  var m = (D.foto || {}).muro || []; if (m.length < 5) return '';
  return '<section class="sez muro-sez"><div class="wrap"><div class="sez-h"><div>' + ETI('home.muro.eti') + '<h2 class="h2">' + TI('home.muro.titolo') + '</h2></div>' + (on('media') ? '<a class="btn btn-o btn-s" href="media.html">Tutte le foto ' + IC.ar + '</a>' : '') + '</div>'
    + '<div class="muro">' + m.slice(0, 7).map(function(f, i){ return '<figure class="m' + i + '"><img src="' + f + '" alt="Il coro in concerto" loading="lazy"></figure>'; }).join('') + '</div></div></section>';
}
function festival(){
  if (!D.festival) return '';
  return '<section class="sez" style="padding-top:0"><div class="wrap"><div class="festival sale"><div>' + ETI('home.fest.eti') + '<h2 class="h2" style="margin-top:18px">' + TI('home.fest.titolo') + '</h2><p class="lead">' + TP('home.fest.testo') + '</p><a class="btn" style="background:#EEF0EA;color:#0F1B15;margin-top:26px" href="' + esc(D.festival.url) + '">' + esc(String(D.festival.url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')) + ' ' + IC.ar + '</a></div><div class="cnt" data-fest></div></div></div></section>';
}
 
var STAMPA_PASSO = 12;
function stampaPerAnno(lista){
  var anni = []; lista.forEach(function(a){ var y = String(a.data || '').slice(0, 4); if (y && anni.indexOf(y) < 0) anni.push(y); }); anni.sort().reverse();
  var primo = anni[0] || '', del = lista.filter(function(a){ return !primo || String(a.data || '').indexOf(primo) === 0; });
  return (anni.length > 1 ? '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px" id="filtroStampa">' + anni.map(function(y, i){ return '<button class="pill" aria-pressed="' + (i === 0) + '" data-a="' + y + '">' + y + ' <small>' + lista.filter(function(a){ return String(a.data || '').indexOf(y) === 0; }).length + '</small></button>'; }).join('') + '<button class="pill" aria-pressed="false" data-a="">Tutti</button></div>' : '')
    + '<div id="stampa">' + citazioni(del.slice(0, STAMPA_PASSO)) + '</div>'
    + '<div style="text-align:center;margin-top:18px"><button class="btn btn-o btn-s" id="stampaAltri"' + (del.length > STAMPA_PASSO ? '' : ' hidden') + '>Mostra altri</button></div>';
}
function citazioni(lista){ return '<div class="citazioni">' + lista.map(function(a){ var d = giornoD(a.data); return '<a class="cit sale" href="' + esc(a.link) + '"><span class="t">' + esc(a.testata) + '</span><q>' + esc(a.titolo) + '</q><p>' + esc(a.estratto) + '</p><small>' + d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear() + '</small></a>'; }).join('') + '</div>'; }
 
function spoRiga(s){
  var det = (s.logo ? '<img src="' + FOTO(s.logo) + '" alt="" loading="lazy">' : '') + '<div>' + (s.attivita ? '<p>' + esc(s.attivita) + '</p>' : '') + (s.luogo ? '<p class="d">' + esc(s.luogo) + '</p>' : '')
    + (s.sito ? '<a class="btn btn-o btn-s" href="' + esc(s.sito) + '" target="_blank" rel="noopener">Visita il sito ' + IC.ar + '</a>' : '') + (!s.attivita && !s.luogo && !s.sito ? '<p class="d">Grazie per il sostegno.</p>' : '') + '</div>';
  return '<details class="spo"><summary class="riga" style="grid-template-columns:minmax(0,1fr) auto"><b>' + esc(s.nome) + (s.attivita ? '<small>' + esc(s.attivita) + '</small>' : '') + '</b><span class="d">' + esc(s.categoria) + ' <i class="spo-piu">+</i></span></summary><div class="spo-c">' + det + '</div></details>';
}
function sostenitori(){
  var s = D.sponsor || []; if (!s.length) return '';
  var g = s.map(function(x){ var d = (x.logo ? '<img src="' + FOTO(x.logo) + '" alt="' + esc(x.nome) + '" loading="lazy">' : '<b>' + esc(x.nome) + '</b>') + '<small>' + esc(x.attivita || x.categoria) + '</small>';
    return x.sito ? '<a class="logo" href="' + esc(x.sito) + '" target="_blank" rel="noopener" title="' + esc(x.nome + (x.attivita ? ' · ' + x.attivita : '')) + '">' + d + '</a>' : '<div class="logo">' + d + '</div>'; }).join('');
  return '<section class="sez" style="padding-top:0"><div class="wrap"><div class="sez-h"><div><span class="eti">Con il sostegno di</span><h2 class="h3">' + TI('home.sost.titolo') + '</h2></div>' + (on('sostienici') ? '<a class="btn btn-o btn-s" href="sostienici.html">Sostienici ' + IC.ar + '</a>' : '') + '</div></div><div class="loghi"><div>' + g + g + '</div></div></section>';
}
function vetta(){
  if (!on('vieni-a-cantare')) return '';
  return '<section class="vetta"><svg viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true"><path fill="#000" d="M0 300 L0 210 L180 150 L320 190 L470 90 L600 160 L760 40 L900 150 L1060 100 L1220 170 L1440 120 L1440 300Z"/></svg><div class="wrap">' + ETI('vetta.eti', 'color:#fff') + '<h2 class="mega">' + TI('vetta.titolo', 'var(--nero)') + '</h2><p class="lead">' + CT('vieni') + '</p><div class="hero-az"><a class="btn btn-n" href="vieni-a-cantare.html">' + T('vetta.btn') + ' ' + IC.ar + '</a><a class="btn btn-o" href="vieni-a-cantare.html#voce">Che voce sei?</a></div></div></section>';
}

 
var ORDINE_CARICHE = ['Presidente','Vice Presidente','Segretario','Tesoriere','Consigliere'];
function consiglio(){
  var c = (D.organico || []).filter(function(o){ return o.carica && ORDINE_CARICHE.indexOf(o.carica) >= 0; })
    .sort(function(a, b){ return ORDINE_CARICHE.indexOf(a.carica) - ORDINE_CARICHE.indexOf(b.carica) || a.nome.localeCompare(b.nome); });
  if (!c.length) return '';
  var ini = function(n){ return n.split(' ').map(function(x){ return x.charAt(0); }).join('').slice(0, 2); };
  return '<section class="sez" style="padding-top:0"><div class="wrap"><div class="sez-h"><div><span class="eti">Il direttivo</span><h2 class="h2">' + TI('chi.consiglio.titolo') + '</h2></div><p class="lead">' + TP('chi.consiglio.testo') + '</p></div>'
    + '<div class="consiglio">' + c.map(function(o){ return '<div class="membro sale">' + (o.foto ? '<img src="' + FOTO(o.foto) + '" alt="" loading="lazy">' : '<i>' + esc(ini(o.nome)) + '</i>') + '<b>' + esc(o.nome) + '</b><span>' + esc(o.carica) + (String(D.coro.maestro || '').indexOf(o.nome) >= 0 ? ' · Maestro' : '') + '</span></div>'; }).join('') + '</div></div></section>';
}

 
function libro(){
  var l = D.libro; if (!l || !l.titolo) return '';
  return '<section class="sez libro-sez"><div class="wrap due" style="align-items:center"><div class="sale"><span class="eti">' + TP('chi.libro.eti') + '</span><h2 class="h2" style="margin:20px 0 16px">' + esc(l.titolo) + (l.sottotitolo ? ' <span class="lir">' + esc(l.sottotitolo) + '</span>' : '') + '</h2>'
    + (l.testo ? '<p class="lead">' + esc(l.testo) + '</p>' : '')
    + '<div class="hero-az" style="margin-top:26px">' + (l.pdf || (l.pagine || []).length ? '<button class="btn btn-r" data-sfoglia>' + IC.libro + 'Sfoglia il volume</button>' : '')
    + (l.sitoMaestro ? '<a class="btn btn-o" href="' + esc(l.sitoMaestro) + '" target="_blank" rel="noopener">Il sito del Maestro ' + IC.ar + '</a>' : '')
    + (l.acquista ? '<a class="btn btn-o" href="' + esc(l.acquista) + '" target="_blank" rel="noopener">Dove trovarlo</a>' : '') + '</div></div>'
    + '<button class="copertina sale" data-sfoglia aria-label="Sfoglia il volume">' + (l.copertina ? '<img src="' + FOTO(l.copertina) + '" alt="Copertina: ' + esc(l.titolo) + '">' : '<span class="cop-gen"><small>' + esc(D.coro.maestro) + '</small><b>' + esc(l.titolo) + '</b><em>' + esc(l.sottotitolo || '') + '</em></span>') + '</button></div></section>';
}
 
function sfoglia(){
  var l = D.libro || {}, box = document.createElement('div'); box.className = 'lettore'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Sfoglia: ' + (l.titolo || ''));
  box.innerHTML = '<div class="lt-top"><b>' + esc(l.titolo || '') + '</b><span id="ltNum"></span><button class="lt-x" aria-label="Chiudi">×</button></div><div class="lt-libro" id="ltLibro"><div class="lt-pag" id="ltS"></div><div class="lt-pag" id="ltD"></div></div>'
    + '<button class="lt-fr sx" aria-label="Pagina precedente">‹</button><button class="lt-fr dx" aria-label="Pagina successiva">›</button>';
  document.body.appendChild(box); document.body.style.overflow = 'hidden';
  var due = function(){ return innerWidth > 900; }, i = 0, tot = 0, pdf = null, cache = {};
  var chiudi = function(){ box.remove(); document.body.style.overflow = ''; removeEventListener('keydown', tasti); };
  var disegna = function(n, el){
    el.innerHTML = ''; if (n < 0 || n >= tot) { el.classList.add('vuota'); return; } el.classList.remove('vuota');
    if (!pdf) { var im = new Image(); im.src = FOTO(l.pagine[n]); im.alt = 'Pagina ' + (n + 1); el.appendChild(im); return; }
    if (cache[n]) { el.appendChild(cache[n]); return; }
    el.innerHTML = '<span class="lt-car">Pagina ' + (n + 1) + '…</span>';
    pdf.getPage(n + 1).then(function(pg){ var v = pg.getViewport({ scale:1 }), k = Math.min(2, (el.clientHeight * (window.devicePixelRatio || 1)) / v.height), vp = pg.getViewport({ scale:k }), cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height;
      return pg.render({ canvasContext:cv.getContext('2d'), viewport:vp }).promise.then(function(){ cache[n] = cv; if (el.isConnected) { el.innerHTML = ''; el.appendChild(cv); } }); });
  };
  var mostra = function(dir){
    var lb = $('#ltLibro', box); lb.classList.remove('va-dx', 'va-sx'); void lb.offsetWidth; if (dir) lb.classList.add(dir > 0 ? 'va-dx' : 'va-sx');
    if (due()) { disegna(i, $('#ltS', box)); disegna(i + 1, $('#ltD', box)); $('#ltD', box).style.display = ''; $('#ltNum', box).textContent = (i + 1) + (i + 1 < tot ? '–' + (i + 2) : '') + ' di ' + tot; }
    else { disegna(i, $('#ltS', box)); $('#ltD', box).style.display = 'none'; $('#ltNum', box).textContent = (i + 1) + ' di ' + tot; }
  };
  var passo = function(d){ var p = due() ? 2 : 1, n = i + d * p; if (n < 0 || n >= tot) return; i = n; mostra(d); };
  var tasti = function(e){ if (e.key === 'Escape') chiudi(); if (e.key === 'ArrowRight') passo(1); if (e.key === 'ArrowLeft') passo(-1); };
  addEventListener('keydown', tasti); $('.lt-x', box).onclick = chiudi; $('.lt-fr.sx', box).onclick = function(){ passo(-1); }; $('.lt-fr.dx', box).onclick = function(){ passo(1); };
  var x0 = null; box.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, { passive:true }); box.addEventListener('touchend', function(e){ if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) passo(dx < 0 ? 1 : -1); x0 = null; });
  if (l.pdf) {
    var base = D.pdfjs || 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
    var parti = function(){ window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + 'pdf.worker.min.js';
      window.pdfjsLib.getDocument(D.pdfBase ? D.pdfBase.replace('{id}', l.pdf) : l.pdf).promise.then(function(d){ pdf = d; tot = d.numPages; mostra(0); }, function(){ $('#ltLibro', box).innerHTML = '<p class="lt-car">Il volume non si apre in anteprima: si vedrà sul sito pubblicato.</p>'; }); };
    if (window.pdfjsLib) parti(); else { var sc = document.createElement('script'); sc.src = base + 'pdf.min.js'; sc.onload = parti; document.head.appendChild(sc); }
  } else { tot = (l.pagine || []).length; mostra(0); }
}

 
function ytId(u){ var m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(String(u)) ? String(u) : ''); }
function spId(u){ var m = String(u || '').match(/open\.spotify\.com\/(playlist|album|artist|track)\/([A-Za-z0-9]+)/); return m ? m[1] + '/' + m[2] : ''; }



var P = {};

P.index = function(){
  var s = SIT, ev = s.ev, f = futuri(), n = ora();
  var normale = [TP('home.sopra'), TP('home.titolo')];
  var tit = { normale:normale, presto:normale, natale:['dal coro, a tutti voi','Buon Natale'],
    stasera:['stasera alle ' + (ev && ev.ora), 'Si canta'], live:['in diretta da ' + (ev && esc(ev.citta)), 'Stiamo cantando'], grazie:['a chi c’era a ' + (ev && esc(ev.citta)), 'Grazie'],
    compleanno:['29 maggio ' + FOND.getFullYear() + ', oggi', anni() + ' anni'], festival:['è tempo di', 'Festival'],
    pasqua:['dal coro, a tutti voi','Buona Pasqua'], stagione:['si riparte, dal 1987', normale[1]], prova:['stasera alle ' + D.prove.ora, 'Si prova'], vuoto:normale }[s.tipo];
  var str = '';
  if (s.tipo === 'live') str = '<a class="stato live" href="concerti.html"><span class="pt"></span><span>In diretta ora · ' + esc(ev.titolo) + '</span><span class="vai">' + IC.ar + '</span></a>';
  else if (s.tipo === 'stasera') str = '<a class="stato" href="concerti.html"><span class="pt"></span><span>' + esc(ev.titolo) + ' · ' + esc(ev.citta) + '</span><span class="cd" data-cd="' + s.a.getTime() + '"></span></a>';
  else if (s.tipo === 'presto') str = '<a class="stato" href="concerti.html"><span class="pt"></span><span>' + (s.giorni === 1 ? 'Domani' : 'Tra ' + s.giorni + ' giorni') + ' · ' + esc(ev.titolo) + ', ' + esc(ev.citta) + '</span><span class="vai">' + IC.ar + '</span></a>';
  else if (s.tipo === 'grazie') str = '<a class="stato" href="media.html"><span class="pt"></span><span>Le foto di ieri sera arrivano qui</span><span class="vai">' + IC.ar + '</span></a>';
  else if (s.tipo === 'festival') str = '<a class="stato live" href="' + esc(D.festival.url) + '"><span class="pt"></span><span>Festival degli Appennini in corso · il programma</span><span class="vai">' + IC.ar + '</span></a>';
  else if (s.tipo === 'compleanno') str = '<span class="stato"><span class="pt"></span><span>Buon compleanno, Cordata</span></span>';
  else if (s.tipo === 'natale') str = f[0] ? '<a class="stato" href="concerti.html"><span class="pt"></span><span>Buone feste · ' + (fra(n, quando(f[0])) === 1 ? 'domani' : 'il ' + quando(f[0]).getDate() + ' ' + MESI[quando(f[0]).getMonth()]) + ': ' + esc(f[0].titolo) + '</span><span class="vai">' + IC.ar + '</span></a>' : '<span class="stato"><span class="pt"></span><span>' + T('sit.natale.str') + '</span></span>';
  else if (s.tipo === 'pasqua') str = '<span class="stato"><span class="pt"></span><span>' + T('sit.pasqua.str') + '</span></span>';
  else if (s.tipo === 'stagione') str = '<a class="stato" href="vieni-a-cantare.html"><span class="pt"></span><span>' + T('sit.stagione.str') + '</span><span class="vai">' + IC.ar + '</span></a>';
  else if (s.tipo === 'prova') str = '<a class="stato" href="vieni-a-cantare.html"><span class="pt"></span><span>' + T('sit.prova.str') + '</span><span class="vai">' + IC.ar + '</span></a>';
  else if (f[0]) str = '<a class="stato" href="concerti.html"><span class="pt"></span><span>Prossimo concerto · ' + quando(f[0]).getDate() + ' ' + MESI[quando(f[0]).getMonth()] + ', ' + esc(f[0].citta) + '</span><span class="vai">' + IC.ar + '</span></a>';
  var lead = { live:ev && ('Adesso, ' + esc(ev.luogo) + '. Se sei qui vicino, fai ancora in tempo.'), stasera:ev && (esc(ev.titolo) + ' — ' + esc(ev.luogo) + ', ' + esc(ev.citta) + '. ' + esc(ingresso(ev)) + '.'), grazie:T('sit.grazie'), compleanno:T('sit.compleanno'), festival:T('sit.festival'), stagione:T('sit.stagione'), prova:T('sit.prova'), vuoto:CT('hero') + ' ' + T('sit.vuoto') }[s.tipo] || CT('hero');
  var cta = (s.tipo === 'live' || s.tipo === 'stasera') ? '<a class="btn btn-r" href="' + mappa(ev) + '" target="_blank" rel="noopener">Portami lì ' + IC.map + '</a>' : s.tipo === 'stagione' || s.tipo === 'prova' ? '<a class="btn btn-r" href="vieni-a-cantare.html">Vieni a cantare ' + IC.ar + '</a>'
    : s.tipo === 'vuoto' ? '<a class="btn btn-r" href="' + (on('prenota') ? href('prenota') : 'contatti.html') + '">Invitaci a cantare ' + IC.ar + '</a>' : '<a class="btn btn-r" href="concerti.html">' + T('home.btn') + ' ' + IC.ar + '</a>';
  var tg = attiva('traguardo') ? traguardo() : null;
  var secondo = tg ? '<span><b>Verso i ' + tg.anni + ' anni</b>mancano ' + tg.giorni + ' giorni</span>' : '<span><b>' + voci() + ' voci maschili</b>tenori, baritoni, bassi</span>';

  var fa = (D.foto || {}).apertura;
  if (fa && attiva('fotoGiorno') && !PROVA.apertura && (D.foto.tutte || []).length) fa = { src:D.foto.tutte[Math.floor(ora() / 864e5) % D.foto.tutte.length], dida:'' };
  return '<section class="hero' + (fa ? ' con-foto' : '') + '">' + (fa ? '<img class="sfondo" src="' + fa.src + '" alt="Il coro La Cordata in divisa" fetchpriority="high">' : '<canvas aria-hidden="true"></canvas>') + '<div class="wrap">' + str
    + '<h1 class="mega"><span class="lir">' + tit[0] + '</span>' + tit[1] + '</h1>'
    + '<div class="hero-riga"><p class="lead">' + lead + '</p><div class="hero-az">' + cta + '<button class="ascolta" aria-pressed="false" id="accordo"><i>' + IC.play + '<span class="eq"><b></b><b></b><b></b><b></b></span></i>' + T('home.ascolta') + '</button></div></div>'
    + '<div class="hero-pie"><span><b>Montalto delle Marche</b>513 m · Monti Sibillini</span>' + secondo + '<span><b>' + esc(D.coro.maestro) + '</b>dirige dal 1987</span>' + (fa && fa.dida ? '<span><b>Nella foto</b>' + esc(fa.dida) + '</span>' : '<span><b>Festival degli Appennini</b>dal 1988, a Montalto</span>') + '</div></div></section>'
    + '<section class="sez"><div class="wrap">' + cifre() + '</div></section>'
    + '<section class="sez" style="padding-top:0"><div class="wrap"><div class="sez-h"><div>' + ETI('home.conc.eti') + '<h2 class="h2">' + TI('home.conc.titolo') + '</h2></div><a class="btn btn-o btn-s" href="concerti.html">Tutti i concerti ' + IC.ar + '</a></div>'
    + (f.length ? '<div class="binario">' + f.slice(0, 6).map(biglietto).join('') + '</div>' : '<p class="lead">Il calendario è in preparazione.</p>')
    + (function(){ var u = attiva('unannofa') ? unAnnoFa() : null; return u ? '<p class="annofa"><span class="eti">Un anno fa</span><span>eravamo a ' + esc(u.citta) + ', ' + esc(u.luogo) + ': «' + esc(u.titolo) + '».</span></p>' : ''; })() + '</div></section>'
    + muro()
    + '<section class="cordata sez" id="coro"><div class="wrap"><div class="sale">' + ETI('home.coro.eti') + '<h2 class="h2" style="margin-top:20px">' + TI('home.coro.titolo') + '</h2><p class="lead">' + TP('home.coro.testo') + '</p>' + sezioniBtn() + '</div>' + cordata() + '</div><div class="wrap nomi-wrap">' + nomiCoro() + '</div></section>'
    + (on('vieni-a-cantare') ? giacca() : '')
    + '<section class="sez"><div class="wrap"><div class="sez-h"><div><span class="eti">Repertorio <b>· ' + (D.brani || []).length + ' canti</b></span><h2 class="h2">' + TI('home.rep.titolo') + '</h2></div><a class="btn btn-o btn-s" href="repertorio.html">Tutto il repertorio ' + IC.ar + '</a></div>'
    + (conAudio().length ? '<div class="due" style="align-items:stretch"><div>' + canti((D.brani || []).slice(0, 6)) + '</div>' + pesca() + '</div>' : canti((D.brani || []).slice(0, 6))) + '</div></section>'
    + salita()
    + '<div style="height:clamp(80px,10vw,140px)"></div>' + festival()
    + ((D.articoli || []).length ? '<section class="sez" style="padding-top:0"><div class="wrap"><div class="sez-h"><div><span class="eti">Hanno scritto di noi</span><h2 class="h2">' + TI('home.stampa.titolo') + '</h2></div><a class="btn btn-o btn-s" href="media.html">Foto e stampa ' + IC.ar + '</a></div>' + citazioni(D.articoli.slice(0, 3)) + '</div></section>' : '')
    + sostenitori() + vetta();
};

P['chi-siamo'] = function(){
  return testa('Chi siamo', TI('chi.titolo'), CT('motto'))
    + '<section class="sez"><div class="wrap due"><div class="sale chi-lato"><span class="eti">La storia</span><p class="lir" style="font-size:clamp(1.5rem,2.6vw,2.2rem);line-height:1.2;margin:22px 0 0">' + TP('chi.citazione') + '</p>' + chiLato() + '</div><div class="sale"><p style="font-size:1.12rem;line-height:1.75;margin:0">' + GT('storia') + '</p><p style="color:var(--mute);font:500 12px var(--mono);letter-spacing:.06em;margin-top:18px">Logo: bozzetto di Renato Cacciamani</p></div></div></section>'
    + salita()
     
    + '<section class="sez"><div class="wrap"><div class="sez-h"><div><span class="eti">Le voci</span><h2 class="h2" style="margin-top:20px">' + TI('chi.voci.titolo') + '</h2></div><p class="lead">' + TP('chi.voci.testo') + '</p></div>' + pentagramma() + '</div></section>'
    + '<div style="height:clamp(80px,12vw,170px)"></div>' + consiglio()
    + '<section class="sez"><div class="wrap due" style="align-items:center"><div class="sale"><span class="eti">Il Maestro</span><h2 class="h2" style="margin:20px 0 22px">' + esc(D.coro.maestro) + '</h2><p class="lead">' + CT('maestro') + '</p>'
    + (D.libro && D.libro.sitoMaestro ? '<a class="btn btn-o" style="margin-top:24px" href="' + esc(D.libro.sitoMaestro) + '" target="_blank" rel="noopener">Il sito del Maestro ' + IC.ar + '</a>' : '') + '</div>'
    + (D.fotoMaestro ? '<img class="sale ritratto' + (window.CORDATA_ANTEPRIMA ? ' sceglibile" data-scegli="fotoMaestro" title="Tocca per cambiare la foto' : '') + '" src="' + FOTO(D.fotoMaestro) + '" alt="' + esc(D.coro.maestro) + '">'
      : window.CORDATA_ANTEPRIMA ? '<button class="sale ritratto vuoto sceglibile" data-scegli="fotoMaestro">Tocca qui per scegliere la foto del Maestro</button>' : '') + '</div></section>'
    + libro()
    + '<section class="sez" style="padding-top:0"><div class="wrap"><div class="sez-h"><div><span class="eti">Dove abbiamo cantato</span><h2 class="h3">' + TI('chi.sale.titolo') + '</h2></div></div></div><div class="loghi"><div>' + (D.sale || []).concat(D.sale || []).map(function(x){ var p = x.split(', '); return '<div class="logo"><b>' + esc(p[0]) + '</b><small>' + esc(p[1] || '') + '</small></div>'; }).join('') + '</div></div></section>'
    + vetta();
};

P.concerti = function(){
  var f = futuri(), p = passati(), an = p.map(function(e){ return e.data.slice(0, 4); }).filter(function(a, i, x){ return x.indexOf(a) === i; });
  var g = f[0] ? fra(ora(), quando(f[0])) : -1;
  return testa('Concerti', f[0] ? 'Ci vediamo <span class="lir">' + (g === 0 ? 'oggi' : g === 1 ? 'domani' : 'il ' + quando(f[0]).getDate() + ' ' + MESI[quando(f[0]).getMonth()]) + '</span>' : 'Calendario <span class="lir">in arrivo</span>', TP('conc.lead'))
    + '<section class="sez"><div class="wrap"><div class="sez-h"><div><span class="eti">In programma <b>· ' + f.length + '</b></span><h2 class="h2">Prossimi</h2></div><button class="btn btn-r btn-s" data-cal-tutti2>' + IC.cal + 'Tutti nel calendario</button></div>'
    + (f.length ? '<div class="binario">' + f.map(biglietto).join('') + '</div>' : '<p class="lead">Nessun concerto in programma.</p>') + '</div></section>'
    + '<section class="sez" style="padding-top:0"><div class="wrap"><div class="sez-h"><div><span class="eti">Diario di salita</span><h2 class="h2">' + TI('conc.archivio') + '</h2></div><div style="display:flex;gap:8px;flex-wrap:wrap" id="filtroAnni">' + an.map(function(a, i){ return '<button class="pill" aria-pressed="' + (i === 0) + '" data-a="' + a + '">' + a + ' <small>' + p.filter(function(e){ return e.data.indexOf(a) === 0; }).length + '</small></button>'; }).join('') + (an.length > 1 ? '<button class="pill" aria-pressed="false" data-a="">Tutti</button>' : '') + '</div></div>'
     
    + '<div class="diario" id="archivio">' + p.filter(function(e){ return !an[0] || e.data.indexOf(an[0]) === 0; }).map(riga).join('') + '</div></div></section>' + vetta();
};

P.repertorio = function(){
  var b = (D.brani || []).slice().sort(function(a, c){ return a.titolo.localeCompare(c.titolo); });
  return testa('Repertorio', TI('rep.titolo'), TP('rep.lead'))
    + '<section class="sez"><div class="wrap"><div class="sez-h" style="align-items:center"><label class="cerca"><span class="sr">Cerca un canto</span>' + IC.cerca + '<input id="cerca" placeholder="Cerca un canto"></label>'
    + '</div>'
    + '<div id="brani"></div><p id="nessuno" class="lead" hidden style="margin-top:20px">Nessun canto trovato.</p></div></section>'
    + (conAudio().length ? '<section class="sez" style="padding-top:0"><div class="wrap due" style="align-items:center"><div class="sale"><span class="eti">Non sai da dove cominciare?</span><h2 class="h2" style="margin-top:20px">' + TI('rep.caso') + '</h2></div>' + pesca() + '</div></section>' : '');
};

P.ascolta = function(){
  var a = D.ascolta || {}, tr = a.tracce || [], vi = (a.video || []).map(function(v){ return { id:ytId(v.id || v), titolo:v.titolo || '' }; }).filter(function(v){ return v.id; }), sp = spId(a.spotify);
  return testa('Ascolta', TI('asc.titolo'), TP('asc.lead'))
    + (tr.length ? '<section class="sez"><div class="wrap"><div class="sez-h"><div><span class="eti">Registrazioni nostre <b>· nessun cookie</b></span><h2 class="h2">Dal <span class="lir">vivo</span></h2></div></div><div class="tracce">'
      + tr.map(function(t, i){ return '<div class="traccia"><button class="tr-play" data-traccia="' + i + '" aria-label="Ascolta ' + esc(t.titolo) + '">' + IC.play + '</button><div><b>' + esc(t.titolo) + '</b><small>' + esc(t.autore || '') + (t.luogo ? ' · ' + esc(t.luogo) : '') + '</small><div class="tr-barra"><i></i></div></div><span class="d">' + esc(t.durata || '') + '</span><audio preload="none" src="' + esc(AUDIO(t.src)) + '"' + AID(t.src) + '></audio></div>'; }).join('') + '</div></div></section>' : '')
    + (vi.length || sp ? '<section class="sez"' + (tr.length ? ' style="padding-top:0"' : '') + '><div class="wrap"><div class="sez-h"><div><span class="eti">Da YouTube e Spotify</span><h2 class="h2">' + TI('asc.video') + '</h2></div>' + (D.coro.social.youtube ? '<a class="btn btn-o btn-s" href="' + esc(D.coro.social.youtube) + '" target="_blank" rel="noopener">Il nostro canale ' + IC.ar + '</a>' : '') + '</div>'
      + '<div class="video">' + vi.map(function(v){ return '<div class="esterno" data-yt="' + v.id + '"><img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="" loading="lazy" referrerpolicy="no-referrer"><button class="es-play" aria-label="Guarda ' + esc(v.titolo) + '">' + IC.play + '</button><div class="es-info"><b>' + esc(v.titolo) + '</b><small>' + TP('asc.esterno') + '</small></div></div>'; }).join('')
      + (sp ? '<div class="esterno sp" data-sp="' + esc(sp) + '"><div class="es-sp">Spotify</div><button class="es-play" aria-label="Apri su Spotify">' + IC.play + '</button><div class="es-info"><b>La nostra musica su Spotify</b><small>Toccandolo si carica il lettore di Spotify, che usa i suoi cookie.</small></div></div>' : '') + '</div></div></section>' : '')
    + (!tr.length && !vi.length && !sp ? '<section class="sez"><div class="wrap"><p class="lead">Le registrazioni arrivano presto.' + (D.coro.social.youtube ? ' Intanto c’è il <a href="' + esc(D.coro.social.youtube) + '" target="_blank" rel="noopener">nostro canale YouTube</a>.' : '') + '</p></div></section>' : '');
};

P.media = function(){
  var g = ['linear-gradient(160deg,#5A0B10,#0A0A0B)','linear-gradient(160deg,#2B2B2E,#0A0A0B)','linear-gradient(160deg,#C8202A,#3a0b10)'];
  return testa('Foto e stampa', TI('media.titolo'), TP('media.lead'))
    + (!(D.album || []).length && ((D.foto || {}).tutte || []).length ? '<section class="sez"><div class="wrap"><div class="sez-h"><div><span class="eti">Galleria</span><h2 class="h2">Foto</h2></div></div><div class="galleria">' + D.foto.tutte.map(function(f){ return '<button class="gal" data-foto="' + esc(f) + '"><img src="' + esc(f) + '" alt="Il coro La Cordata" loading="lazy"></button>'; }).join('') + '</div></div></section>' : '')
    + (!(D.album || []).length ? '' : '<section class="sez"><div class="wrap"><div class="sez-h"><div><span class="eti">Album</span><h2 class="h2">Foto</h2></div></div><div class="album">' + (D.album || []).map(function(a, i){ var d = giornoD(a.data); return '<a class="alb sale" href="#"><div class="foto" style="--g:' + g[i % 3] + '">' + (a.copertina ? '<img src="' + a.copertina + '" alt="" loading="lazy">' : '') + '<span>' + a.n + ' foto</span></div><b>' + esc(a.titolo) + '</b><small>' + d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear() + '</small></a>'; }).join('') + '</div></div></section>')
    + ((D.articoli || []).length ? '<section class="sez" style="padding-top:0"><div class="wrap"><div class="sez-h"><div><span class="eti">Rassegna stampa</span><h2 class="h2">Hanno scritto <span class="lir">di noi</span></h2></div></div>' + stampaPerAnno(D.articoli || []) + '</div></section>' : '');
};

P['vieni-a-cantare'] = function(){
  return giacca(ETI('home.voce.eti') + '<h1 class="mega" style="margin-top:20px;font-size:clamp(3.6rem,11vw,9rem)">' + TI('vieni.titolo', 'var(--nero)') + '</h1>').replace('class="giacca sez"', 'class="giacca sez" style="padding-top:calc(150px + env(safe-area-inset-top,0px))"')
    + (((D.foto || {}).pagine || {})['vieni-a-cantare'] ? '<figure class="striscia-foto"><img src="' + D.foto.pagine['vieni-a-cantare'] + '" alt="Coristi della Cordata mentre cantano" loading="lazy"></figure>' : '')
    + '<section class="sez"><div class="wrap"><div class="sez-h"><div><span class="eti">Come funziona</span><h2 class="h2">Tre passi, <span class="lir">zero esami</span></h2></div></div><div class="modi">'
    + passo('1', TP('vieni.p1t'), TP('vieni.p1')) + passo('2', TP('vieni.p2t'), TP('vieni.p2')) + passo('3', TP('vieni.p3t'), TP('vieni.p3')) + '</div></div></section>'
    + '<section class="sez" style="padding-top:0"><div class="wrap due"><div class="sale"><span class="eti">Domande</span><h2 class="h2" style="margin-top:20px">Quello che <span class="lir">ci chiedono</span></h2></div><div class="domande sale">'
    + [1,2,3,4,5].map(function(i){ return TP('vieni.d' + i) ? dom(TP('vieni.d' + i), TP('vieni.r' + i)) : ''; }).join('') + '</div></div></section>'
    + '<section class="sez cordata" id="scrivici"><div class="wrap"><div class="sale"><span class="eti">Scrivici</span><h2 class="h2" style="margin-top:20px">' + TI('vieni.scrivi') + '</h2><p class="lead">La richiesta arriva nell’app del coro. Ti rispondiamo in pochi giorni.</p></div>'
    + '<form class="modulo sale" data-demo><div class="r2"><label for="fNome">Nome<input id="fNome" required autocomplete="given-name"></label><label for="fEta">Età<input id="fEta" type="number" min="14" max="99" inputmode="numeric"></label></div><label for="fCont">Telefono o email<input id="fCont" required></label><label for="fVoce">Che voce pensi di essere?<select id="fVoce"><option>Non lo so ancora</option><option>Tenore primo</option><option>Tenore secondo</option><option>Baritono</option><option>Basso</option></select></label><label class="ok" for="fPriv"><input id="fPriv" type="checkbox" required>Ho letto l’informativa privacy</label><button class="btn btn-r" style="justify-content:center">Voglio provare ' + IC.ar + '</button></form></div></section>';
};
function passo(n, t, p){ return '<div class="modo sale"><span class="n">' + n + '</span><h3>' + t + '</h3><p>' + p + '</p></div>'; }
function dom(q, r){ return '<details><summary>' + q + '</summary><p>' + r + '</p></details>'; }

P.sostienici = function(){
  var cat = {}; (D.sponsor || []).forEach(function(s){ (cat[s.categoria] = cat[s.categoria] || []).push(s); });
  var co = (D.contributi || []).filter(function(x){ return x.nome && x.attivo !== false; });
  return testa('Sostienici', TI('sost.titolo'), TP('sost.lead'))
    + '<section class="sez"><div class="wrap"><div class="modi">'
    + '<div class="modo sale"><span class="n">5×1000</span><h3>Una firma</h3><p>' + TP('sost.5x1000') + '</p><div class="cf"><span>' + esc(D.coro.cf) + '</span><button class="pill" data-copia="' + esc(D.coro.cf) + '">Copia</button></div></div>'
    + '<div class="modo sale"><span class="n">Logo</span><h3>Diventa sostenitore</h3><p>' + TP('sost.sponsor') + '</p><a class="btn btn-r btn-s" href="contatti.html">Parliamone ' + IC.ar + '</a></div>'
    + '<div class="modo sale"><span class="n">Da voi</span><h3>Invitaci a cantare</h3><p>' + TP('sost.invito') + '</p><a class="btn btn-o btn-s" href="' + (on('prenota') ? href('prenota') : 'contatti.html') + '">Chiedi una data ' + IC.ar + '</a></div></div></div></section>'
    + (co.length ? '<section class="sez cordata" id="contributi"><div class="wrap" style="display:block"><div class="sez-h"><div><span class="eti">Con il tuo contributo</span><h2 class="h2">' + TI('sost.contr.titolo') + '</h2></div><p class="lead">' + TP('sost.contr.testo') + '</p></div>'
      + '<div class="premi">' + co.map(function(x, i){ return '<div class="premio sale">' + (x.foto ? '<img src="' + FOTO(x.foto) + '" alt="" loading="lazy">' : '<div class="premio-seg">' + esc(x.nome.charAt(0)) + '</div>') + '<div class="premio-t"><b>' + esc(x.nome) + '</b>' + (x.testo ? '<p>' + esc(x.testo) + '</p>' : '') + (x.offerta ? '<span class="offerta">offerta da ' + esc(x.offerta) + ' €</span>' : '') + '<button class="btn btn-r btn-s" data-prenota="' + i + '">Lo voglio</button></div></div>'; }).join('') + '</div>'
      + (D.contributiNota ? '<p class="nota-nomi">' + esc(D.contributiNota) + '</p>' : '') + '</div></section>' : '')
    + (Object.keys(cat).length ? '<section class="sez"' + (co.length ? '' : ' style="padding-top:0"') + '><div class="wrap"><div class="sez-h"><div><span class="eti">Grazie a</span><h2 class="h2">Chi sale <span class="lir">con noi</span></h2></div><p class="lead">L’elenco si aggiorna da solo quando un accordo viene firmato o scade.</p></div>'
      + Object.keys(cat).map(function(k){ return '<div class="sale" style="margin-top:34px"><span class="eti">' + esc(k) + '</span><div class="diario" style="margin-top:14px">' + cat[k].map(spoRiga).join('') + '</div></div>'; }).join('') + '</div></section>' : '');
};

P.contatti = function(){
  var c = D.coro;
  return testa('Contatti', TI('cont.titolo'), esc(c.indirizzo))
    + '<section class="sez"><div class="wrap due"><div class="sale" style="display:grid;gap:30px;align-content:start">'
    + '<div><span class="eti">Email</span><p style="font:800 clamp(1.6rem,3vw,2.6rem)/1 var(--display);text-transform:uppercase;margin:12px 0 0;overflow-wrap:anywhere"><a href="mailto:' + esc(c.email) + '" style="text-decoration:none">' + esc(c.email) + '</a></p></div>'
    + '<div><span class="eti">Sede</span><p style="margin:12px 0 0;font-size:1.15rem">' + esc(c.indirizzo) + '</p><a class="pill" style="margin-top:12px" href="https://www.openstreetmap.org/search?query=' + encodeURIComponent(c.indirizzo) + '" target="_blank" rel="noopener">' + piccola('map') + 'Apri la mappa</a></div>'
    + '<div><span class="eti">Associazione</span><p style="margin:12px 0 0;color:var(--mute);font:500 13.5px/1.8 var(--mono)">' + esc(c.nome) + '<br>C.F. e P.IVA ' + esc(c.cf) + '<br>RUNTS ' + esc(c.runts) + '<br>PEC ' + esc(c.pec) + '</p></div></div>'
    + '<form class="modulo sale" data-demo><h3 class="h3">Mandaci un messaggio</h3><div class="r2"><label for="cNome">Nome<input id="cNome" required></label><label for="cCont">Email o telefono<input id="cCont" required></label></div><label for="cTipo">Di cosa si tratta?<select id="cTipo"><option>Informazioni</option><option>Invitare il coro</option><option>Entrare nel coro</option><option>Sostenere il coro</option><option>Stampa</option></select></label><label for="cMsg">Messaggio<textarea id="cMsg" rows="5"></textarea></label><label class="ok" for="cPriv"><input id="cPriv" type="checkbox" required>Ho letto l’informativa privacy</label><button class="btn btn-r" style="justify-content:center">Invia ' + IC.ar + '</button></form></div></section>';
};

P.coristi = function(){
  var u = D.coro.portale;
  return testa('Area coristi', TI('cor.titolo'), TP('cor.lead'))
    + '<section class="sez"><div class="wrap due" style="align-items:center"><div class="sale"><span class="eti">Il portale del coro</span><h2 class="h2" style="margin:20px 0 18px">Prove, presenze, <span class="lir">tracce</span></h2>'
    + '<p class="lead">' + TP('cor.aiuto') + '</p><div class="hero-az" style="margin-top:28px">' + (u ? '<a class="btn btn-r" href="' + esc(u) + '" target="_blank" rel="noopener">' + T('cor.btn') + ' ' + IC.ar + '</a>' : '<span class="lead">Il link del portale si imposta nel configuratore.</span>') + '</div></div>'
    + '<div class="modi sale" style="grid-template-columns:1fr">' + [['Presenze','Rispondi alle prove e ai concerti con un tocco.'],['Studio','Le tracce della tua voce e gli spartiti, sempre con te.'],['Agenda','Date, orari, programma e divisa di ogni uscita.']].map(function(x){ return '<div class="modo"><h3>' + x[0] + '</h3><p>' + x[1] + '</p></div>'; }).join('') + '</div></div></section>';
};

P.privacy = function(){
  return testa('Privacy', 'Nessun cookie. <span class="lir">Davvero.</span>', 'Questo sito non usa cookie, non traccia chi lo visita e non carica servizi di Google, Facebook o altri, se non li apri tu.')
    + '<section class="sez"><div class="wrap testo-lungo">' + ((D.privacy || []).length ? D.privacy.map(function(p){ return '<h2 class="h3">' + esc(p.titolo) + '</h2><p>' + esc(p.testo).replace(/\n/g, '<br>') + '</p>'; }).join('') : '<p class="lead" style="max-width:none">Il testo completo dell’informativa arriva dall’app (Siti web → Privacy), lo stesso che il coro approva e aggiorna.</p>')
    + (function(){ var sv = servizi(); return (sv.video ? '<h2 class="h3">Video di YouTube</h2><p>Alcune pagine hanno un video di YouTube (Google Ireland Ltd). Si collega solo quando premi play, in modalità «senza cookie»: prima vedi solo un’immagine salvata sul nostro sito.</p>' : '')
      + (sv.mappa ? '<h2 class="h3">Mappa</h2><p>La mappa (OpenStreetMap) si carica solo quando premi «Mostra la mappa»; non usa cookie di profilazione.</p>' : ''); })() + '</div></section>';
};

 
(D.pagine || []).forEach(function(p){ if (!p.libera) return;
  P[p.id] = function(){ var x = p.libera; return '<style>' + CSS_BLOCCHI + '</style>' + testa(esc(p.titolo), ricco(x.titolo || p.titolo), x.sotto ? ricco(x.sotto) : '') + '<section class="sez"><div class="wrap">' + (blocchi(x.blocchi) || '<p class="lead">Pagina in preparazione.</p>') + '</div></section>'; }; });

P.futura = function(){
  var id = window.CORDATA_HASH || location.hash.slice(1) || new URLSearchParams(location.search).get('p') || '', p = pagina(id) || { titolo:'Pagina', futura:'' };
  var corpo = {
    notizie:citazioni([{ data:'2026-10-12', testata:'Dalla Bacheca', titolo:'Aperte le iscrizioni per la nuova stagione', estratto:'Gli avvisi che in app segni «pubblico» arrivano qui da soli.', link:'#' },{ data:'2026-10-09', testata:'Dalla Bacheca', titolo:'Il programma del Concerto di Santo Stefano', estratto:'Brani, ospiti e orari.', link:'#' },{ data:'2026-10-06', testata:'Dalla Bacheca', titolo:'Le foto del concerto in piazza', estratto:'Ventiquattro scatti.', link:'#' }]),
    prenota:'<form class="modulo" data-demo style="max-width:680px"><div class="r2"><label for="pNome">Nome e ente<input id="pNome" required></label><label for="pCont">Email o telefono<input id="pCont" required></label></div><div class="r2"><label for="pData">Data<input id="pData" type="date"></label><label for="pLuogo">Luogo<input id="pLuogo"></label></div><label for="pOcc">Occasione<select id="pOcc"><option>Rassegna o concerto</option><option>Matrimonio</option><option>Festa di paese</option><option>Funzione religiosa</option><option>Altro</option></select></label><button class="btn btn-r" style="justify-content:center">Chiedi la data</button><p style="color:var(--mute);font-size:14px;margin:0">La richiesta arriva nell’app (Richieste) e il direttivo vede subito se la data è libera.</p></form>',
    trasparenza:'<div class="diario">' + [['Rendiconto 2025','Approvato dall’assemblea'],['Contributi pubblici ricevuti nel 2025','Obbligo di legge per le associazioni'],['Statuto','Versione registrata al RUNTS'],['Verbale di assemblea','Estratto pubblico']].map(function(r){ return '<div class="riga"><span class="d">PDF</span><div><b>' + r[0] + '</b><small>' + r[1] + '</small></div><a class="pill" href="#">Apri</a></div>'; }).join('') + '</div>'
  }[id] || '';
  return testa(p.on ? esc(p.titolo) : 'Pagina predisposta', esc(p.titolo), esc(p.futura) + (p.on ? '' : '. Si accende dall’app quando vuoi.')) + '<section class="sez"><div class="wrap">' + corpo + '</div></section>';
};



var main = $('#app'), pg = pagina(PAG);
if (PAG !== 'pagina' && PAG !== 'privacy' && pg && !pg.on) main.innerHTML = testa('Pagina spenta', 'Per ora è <span class="lir">spenta</span>', 'Si riaccende dall’app, in Siti web.');
else main.innerHTML = (P[PAG === 'pagina' ? 'futura' : PAG] || P.index)();
testata(); piede(); altimetro();

 
(function(){
  var h = ora().getHours(), l = 'rgba(200,32,42,.18)';
  if (SIT.tipo === 'live' || SIT.tipo === 'festival') l = 'rgba(229,56,59,.42)';
  else if (h >= 5 && h < 9) l = 'rgba(255,140,110,.22)';
  else if (h >= 9 && h < 17) l = 'rgba(242,239,234,.10)';
  else if (h >= 17 && h < 21) l = 'rgba(229,56,59,.32)';
  $$('.hero,.testa').forEach(function(x){ x.style.setProperty('--luce', l); });
})();
$$('.hero canvas').forEach(function(c){ creste(c, { righe:30, alto:.3 }); });
$$('.testa canvas').forEach(function(c){ creste(c, { righe:16, alto:.45, amp:.75 }); });
if (SIT.natale && $('.hero')) { var nv = document.createElement('div'); nv.setAttribute('aria-hidden', 'true'); nv.style.cssText = 'position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden';
  if (!CALMO) for (var k = 0; k < 50; k++) { var fi = document.createElement('i'), sz = 2 + Math.random() * 4; fi.style.cssText = 'position:absolute;top:-10px;left:' + (Math.random() * 100) + '%;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:#fff;opacity:.75;animation:neve ' + (8 + Math.random() * 10) + 's linear -' + (Math.random() * 18) + 's infinite'; nv.appendChild(fi); }
  $('.hero').appendChild(nv); var st = document.createElement('style'); st.textContent = '@keyframes neve{to{transform:translate3d(40px,105svh,0)}}'; document.head.appendChild(st); }

var acc = $('#accordo');
 
var accAu = null;
if (acc) acc.onclick = function(){
  var bb = conAudio();
  if (!bb.length) { if (acc.getAttribute('aria-pressed') === 'true') return; accordo(5); acc.setAttribute('aria-pressed', 'true'); setTimeout(function(){ acc.setAttribute('aria-pressed', 'false'); }, 5000); return; }
  if (accAu && !accAu.paused) { accAu.pause(); acc.setAttribute('aria-pressed', 'false'); return; }
  $$('audio').forEach(function(x){ if (!x.paused) x.pause(); });
  if (!accAu) { accAu = document.createElement('audio'); accAu.hidden = true; acc.appendChild(accAu); accAu.onended = function(){ acc.setAttribute('aria-pressed', 'false'); }; accAu.onpause = accAu.onended; }
  var b = bb[Math.floor(Math.random() * bb.length)];
  accAu.src = AUDIO(b.audio); accAu.removeAttribute('data-pronto'); if (AID(b.audio)) accAu.setAttribute('data-aid', b.audio); else accAu.removeAttribute('data-aid');
  acc.setAttribute('aria-pressed', 'true'); acc.title = b.titolo; avviso('Ascolti: ' + b.titolo); suona(accAu);
};
$$('[data-acc]').forEach(function(b){ b.onclick = function(){ accordo(3.5); }; });
$$('.sezioni button').forEach(function(b){ b.onclick = function(){ var i = b.getAttribute('data-sez'), sc = b.closest('.wrap').querySelector('.scena'), gia = b.getAttribute('aria-pressed') === 'true';
  $$('.sezioni button').forEach(function(x){ x.setAttribute('aria-pressed', 'false'); });
  if (gia) { if (sc) sc.removeAttribute('data-sez'); $$('[data-sezn]').forEach(function(x){ x.classList.remove('acceso'); }); return; }
  b.setAttribute('aria-pressed', 'true'); if (sc) sc.setAttribute('data-sez', i); $$('[data-sezn]').forEach(function(x){ x.classList.toggle('acceso', x.getAttribute('data-sezn') === i); }); voce(NOTE[D.sezioni[i].nome], 2.4, .08); }; });
$$('[data-copia]').forEach(function(b){ b.onclick = function(){ var v = b.getAttribute('data-copia'); if (navigator.clipboard) navigator.clipboard.writeText(v).then(function(){ avviso('Codice fiscale copiato'); }, function(){ avviso('Codice fiscale: ' + v); }); else avviso('Codice fiscale: ' + v); }; });
var cal2 = $('[data-cal-tutti2]'); if (cal2) cal2.onclick = function(){ scaricaIcs(futuri(), 'concerti-la-cordata.ics'); };
$$('form[data-demo]').forEach(function(f){ f.onsubmit = function(e){ e.preventDefault(); avviso('Bozza: nel sito vero arriva nell’app del coro'); f.reset(); }; });
var pv = $('#provaVoce'); if (pv) provaVoce(pv);
attivaSalita();

 
$$('[data-pesca]').forEach(function(P){ var au = P.querySelector('audio'), pl = P.querySelector('[data-pplay]'), bar = P.querySelector('.pesca-barra i');
  var stato = function(va){ P.classList.toggle('va', va); pl.innerHTML = (va ? IC.pausa : IC.play) + '<span>' + (va ? 'Pausa' : 'Ascolta') + '</span>'; };
  au.ontimeupdate = function(){ if (au.duration) bar.style.width = (au.currentTime / au.duration * 100) + '%'; }; au.onended = function(){ stato(false); bar.style.width = '0'; };
  pl.onclick = function(){ $$('audio').forEach(function(x){ if (x !== au && !x.paused) x.pause(); }); if (au.paused) { suona(au); stato(true); } else { au.pause(); stato(false); } };
  var vai = P.querySelector('[data-pvai]'); if (vai) vai.onclick = function(){ var b = conAudio(), n = 0, giri = CALMO ? 1 : 11, att = +P.getAttribute('data-pesca'), tt = P.querySelector('[data-ptit]'), aa = P.querySelector('[data-paut]');
    au.pause(); stato(false); bar.style.width = '0';
    (function gira(){ var j = Math.floor(Math.random() * b.length); if (b.length > 1 && j === att) j = (j + 1) % b.length; var x = b[j]; tt.textContent = x.titolo; aa.textContent = x.autore + (x.arr ? ' · arr. ' + x.arr : '');
      if (++n < giri) { setTimeout(gira, 35 + n * 13); return; } P.setAttribute('data-pesca', j); au.src = AUDIO(x.audio); au.removeAttribute('data-pronto'); if (AID(x.audio)) au.setAttribute('data-aid', x.audio); else au.removeAttribute('data-aid'); })(); };
});

 
var cds = $$('[data-cd]'), fest = $('[data-fest]');
var tic = function(){ var n = ora();
  cds.forEach(function(c){ var d = Math.max(0, +c.getAttribute('data-cd') - n), h = Math.floor(d / 36e5), m = Math.floor(d % 36e5 / 6e4), s = Math.floor(d % 6e4 / 1e3); c.textContent = (h ? h + 'h ' : '') + ('0' + m).slice(-2) + 'm ' + ('0' + s).slice(-2) + 's'; });
  if (fest) { var dal = giornoD(D.festival.dal), al = giornoD(D.festival.al), g = fra(n, dal);
    fest.innerHTML = g > 0 ? g + '<small>giorni al prossimo Festival</small>' : n <= new Date(al.getTime() + 864e5) ? 'Ora<small>il Festival è in corso</small>' : 'Grazie<small>alla prossima estate</small>'; } };
tic(); if (cds.length || fest) setInterval(tic, 1000);

 
if (!CALMO && 'IntersectionObserver' in window) { var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (!e.isIntersecting) return; io.unobserve(e.target); var nn = e.target, fine = +nn.getAttribute('data-conta'), t0 = null;
  var p = function(t){ if (!t0) t0 = t; var x = Math.min(1, (t - t0) / 1500); nn.textContent = Math.round(fine * (1 - Math.pow(1 - x, 4))); if (x < 1) requestAnimationFrame(p); }; requestAnimationFrame(p); }); }, { threshold:.6 });
  $$('[data-conta]').forEach(function(nn){ io.observe(nn); }); }

 
var lb = $('#brani');
if (lb) { var tutti = (D.brani || []).slice().sort(function(a, c){ return a.titolo.localeCompare(c.titolo); }), filtro = '';
  var dis = function(){ var q = ($('#cerca').value || '').toLowerCase().trim();
    var v = tutti.filter(function(b){ var t = (b.titolo + ' ' + b.autore + ' ' + b.arr).toLowerCase(); if (q && t.indexOf(q) < 0) return false; if (filtro === 'arr') return !!b.arr; if (filtro === 'Popolari') return /popolare/i.test(b.autore); return !filtro || b.autore === filtro; });
    lb.innerHTML = canti(v); $('#nessuno').hidden = v.length > 0; };
  $('#cerca').oninput = dis;
  $$('#filtroAut .pill').forEach(function(c){ c.onclick = function(){ filtro = c.getAttribute('data-f'); $$('#filtroAut .pill').forEach(function(x){ x.setAttribute('aria-pressed', x === c); }); dis(); }; });
  dis(); }
 
var st = $('#stampa');
if (st) { var stP = $('#filtroStampa .pill[aria-pressed="true"]'), stA = stP ? stP.getAttribute('data-a') : '', stN = STAMPA_PASSO;
  var stLista = function(){ return (D.articoli || []).filter(function(a){ return !stA || String(a.data || '').indexOf(stA) === 0; }); };
  var stDis = function(){ var L = stLista(); st.innerHTML = citazioni(L.slice(0, stN)); var b = $('#stampaAltri'); if (b) b.hidden = L.length <= stN; };
  $$('#filtroStampa .pill').forEach(function(c){ c.onclick = function(){ stA = c.getAttribute('data-a'); stN = STAMPA_PASSO; $$('#filtroStampa .pill').forEach(function(x){ x.setAttribute('aria-pressed', x === c); }); stDis(); }; });
  var sb = $('#stampaAltri'); if (sb) sb.onclick = function(){ stN += STAMPA_PASSO; stDis(); }; }
var ar = $('#archivio');
if (ar) $$('#filtroAnni .pill').forEach(function(c){ c.onclick = function(){ var a = c.getAttribute('data-a'); $$('#filtroAnni .pill').forEach(function(x){ x.setAttribute('aria-pressed', x === c); }); ar.innerHTML = passati().filter(function(e){ return !a || e.data.indexOf(a) === 0; }).map(riga).join(''); }; });
if (location.hash && PAG !== 'pagina') { try { var dest = document.getElementById(location.hash.slice(1)); if (dest) setTimeout(function(){ dest.scrollIntoView(); }, 80); } catch(e) {} }
document.title = PAG === 'index' ? 'Coro La Cordata · Montalto delle Marche' : ((pagina(PAG) || {}).titolo || 'La Cordata') + ' · Coro La Cordata';



if (D.esempio && !NEL_CONFIGURATORE) {
  var ev0 = eventi.filter(function(e){ return quando(e) > VERO; })[0] || eventi[0], t0 = quando(ev0);
  var giorno = function(d, hh){ var x = new Date(t0); x.setDate(x.getDate() + d); x.setHours(hh, 0, 0, 0); return x.toISOString(); };
  var SITU = [['vero','Adesso',null],['presto','Concerto fra 5 giorni',giorno(-5, 11)],['stasera','Il giorno del concerto',giorno(0, 15)],['live','Durante il concerto',new Date(t0.getTime() + 25 * 6e4).toISOString()],['grazie','Il giorno dopo',giorno(1, 10)],
    ['natale','Natale',new Date(t0.getFullYear(), 11, 20, 19).toISOString()],['compleanno','Compleanno del coro',new Date(t0.getFullYear() + 1, 4, 29, 12).toISOString()],['festival','Durante il Festival',new Date(giornoD(D.festival.dal).getTime() + 864e5 + 21 * 36e5).toISOString()],
    ['pasqua','Pasqua',pasqua(t0.getFullYear() + 1).toISOString()],['stagione','Nuova stagione (settembre)',new Date(t0.getFullYear() + 1, 8, 10, 11).toISOString()],['vuoto','Nessun concerto in calendario',new Date(t0.getFullYear() + 2, 2, 3, 11).toISOString()]];
  var box = document.createElement('details'); box.className = 'banco'; if (PROVA.aperto) box.open = true;
  box.innerHTML = '<summary>Banco di prova</summary><div class="c"><h5>Situazione</h5><div class="bb">' + SITU.map(function(s){ return '<button data-s="' + s[0] + '" aria-pressed="' + ((PROVA.sit || 'vero') === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div>'
    + '<p>Il sito sceglie da solo titolo, striscia e luce. Ora simulata: ' + dataLunga(ADESSO) + ', ' + hhmm(ADESSO) + '.</p>'
    + '<h5>Pagine accese</h5><div class="pp">' + D.pagine.filter(function(p){ return p.id !== 'index'; }).map(function(p){ return '<label><input type="checkbox" data-p="' + p.id + '"' + (p.on ? ' checked' : '') + '>' + esc(p.titolo) + (p.futura ? ' ✦' : '') + '</label>'; }).join('') + '</div><p>✦ predisposta per il futuro</p>'
    + '<h5>Tema</h5><div class="bb">' + [['','Automatico'],['dark','Nero'],['light','Chiaro']].map(function(t){ return '<button data-t="' + t[0] + '" aria-pressed="' + ((PROVA.tema || '') === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>'
    + '<p><a href="configuratore.html">Apri il configuratore →</a><br><a href="gestione.html">Come si pubblica e si gestisce →</a></p></div>';
  document.body.appendChild(box);
  box.addEventListener('toggle', function(){ PROVA.aperto = box.open; salvaProva(); });
  $$('[data-s]', box).forEach(function(b){ b.onclick = function(){ var s = SITU.filter(function(x){ return x[0] === b.getAttribute('data-s'); })[0]; PROVA.sit = s[0]; PROVA.ora = s[2]; salvaProva(); location.reload(); }; });
  $$('[data-p]', box).forEach(function(b){ b.onchange = function(){ PROVA.pagine = PROVA.pagine || {}; PROVA.pagine[b.getAttribute('data-p')] = b.checked; salvaProva(); location.reload(); }; });
  $$('[data-t]', box).forEach(function(b){ b.onclick = function(){ PROVA.tema = b.getAttribute('data-t'); salvaProva(); location.reload(); }; });
}
})();
