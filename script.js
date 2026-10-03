// Slike: zamenjaj datoteke v img/ (isto ime) ali dodaj nov vnos v ta seznam.
const PHOTOS = [
  { src: "img/balkon.png", cap: "Balkon z razgledom na Pohorje" },
  { src: "img/kuhna.png", cap: "Kuhinja z jedilnico in izhodom na balkon" },
  { src: "img/spalnica.png", cap: "Svetla spalnica z delovnim kotičkom" },
  { src: "img/hodnik.png", cap: "Prostoren hodnik, ki povezuje vse prostore" },
  { src: "img/kopalnica_v2.png", cap: "Moderna kopalnica s prho in oknom" },
];

const $ = (id) => document.getElementById(id);
let cur = 0;

/* ---------- gallery ---------- */
function show(i) {
  cur = (i + PHOTOS.length) % PHOTOS.length;
  const p = PHOTOS[cur];
  $("galImg").src = p.src;
  $("galImg").alt = p.cap;
  $("galCap").textContent = p.cap;
  $("galCount").textContent = `${cur + 1} / ${PHOTOS.length}`;
  [...$("galThumbs").children].forEach((b, n) => b.classList.toggle("on", n === cur));
  if (!$("lb").hidden) {
    $("lbImg").src = p.src;
    $("lbCap").textContent = p.cap;
  }
}
PHOTOS.forEach((p, i) => {
  const b = document.createElement("button");
  b.innerHTML = `<img src="${p.src}" alt="" loading="lazy">`;
  b.onclick = () => show(i);
  $("galThumbs").appendChild(b);
});
$("galPrev").onclick = () => show(cur - 1);
$("galNext").onclick = () => show(cur + 1);
$("galMain").onclick = () => { $("lb").hidden = false; show(cur); };
$("lbX").onclick = () => ($("lb").hidden = true);
$("lbP").onclick = () => show(cur - 1);
$("lbN").onclick = () => show(cur + 1);
$("lb").onclick = (e) => { if (e.target === $("lb")) $("lb").hidden = true; };
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { $("lb").hidden = true; closeModal(); }
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1);
});
show(0);

/* ---------- fake live stats ---------- */
$("views").textContent = (3000 + Math.floor(Math.random() * 1500)).toLocaleString("sl-SI");
const setLive = () => ($("live").textContent = 2 + Math.floor(Math.random() * 14));
setLive();
setInterval(setLive, 4000);

/* ---------- favourites ---------- */
let fav = false;
$("fav").onclick = () => {
  fav = !fav;
  $("fav").textContent = fav ? "♥ V priljubljenih" : "♡ Dodaj med priljubljene";
  $("fav").classList.toggle("is-fav", fav);
  $("favCount").textContent = fav ? 1 : 0;
};
$("favTop").onclick = () => {
  openModal(`<h2>Priljubljeni</h2><p>${fav ? "1 oglas: Prvo nadstropje, Gladomes." : "Še nič shranjenega."}</p>`);
};

/* ---------- loan calculator ---------- */
function calc() {
  const price = +$("cPrice").value, down = +$("cDown").value;
  const n = Math.max(1, +$("cYears").value) * 12;
  const r = +$("cRate").value / 100 / 12;
  const P = Math.max(0, price - down);
  const m = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));
  $("cMonthly").textContent = m.toLocaleString("sl-SI", { maximumFractionDigits: 0 }) + " €";
  $("cJoke").textContent = `Pri lastni udeležbi ${down} € bo banka verjetno presenečena.`;
}
document.querySelectorAll(".calc input").forEach((i) => i.addEventListener("input", calc));
calc();

/* ---------- modal ---------- */
function openModal(html) { $("modalBody").innerHTML = html; $("modal").hidden = false; }
function closeModal() { $("modal").hidden = true; }
$("modalX").onclick = closeModal;
$("modal").onclick = (e) => { if (e.target === $("modal")) closeModal(); };

$("showPhone").onclick = () => {
  openModal(`
    <h2>Telefon prodajalca</h2>
    <p class="big">📞</p>
    <p style="text-align:center"><b>Številka trenutno ni na voljo.</b><br>Prodajalec je zaseden z obnovo.</p>`);
};

$("inquiry").onclick = () => {
  openModal(`
    <h2>Pošlji povpraševanje</h2>
    <input placeholder="Ime in priimek" id="qName">
    <input placeholder="E-pošta" id="qMail">
    <textarea rows="4" id="qMsg" placeholder="Pozdravljeni, zanima me ogled stanovanja. Ali je razgled vključen v ceno?"></textarea>
    <button class="btn btn--primary btn--block" id="qSend">Pošlji</button>`);
  $("qSend").onclick = () => {
    const name = $("qName").value.trim() || "Neznani interesent";
    $("modalBody").innerHTML = `<h2>Hvala, ${name.replace(/</g, "&lt;")}!</h2>
      <p>Povpraševanje je poslano. Prodajalec se vam bo oglasil po koncu obnove.</p>`;
  };
};

/* ---------- the punchline ---------- */
$("buy").onclick = () => {
  openModal(`
    <p class="big">🎉🎂🎉</p>
    <h2 style="text-align:center">Čestitamo, Sandi! Kupil si ga.</h2>
    <p style="text-align:center">Vse najboljše za 36. rojstni dan!<br>Stanovanje je tvoje. Obnova tudi.</p>
    <div class="bon"><small>Lesnina bon</small><b>100 €</b>čaka te v živo.</div>
    <p class="foot" style="text-align:center">Vizualizacije po obnovi: kmalu.</p>`);
  confetti();
};

/* ---------- confetti ---------- */
function confetti() {
  const c = $("confetti"), ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const colors = ["#d71920", "#1a9b5b", "#f59e0b", "#2563eb", "#a855f7"];
  const bits = Array.from({ length: 180 }, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5,
    vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 5,
    s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
    col: colors[Math.floor(Math.random() * colors.length)],
  }));
  let t = 0;
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    bits.forEach((b) => {
      b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.col; ctx.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * .6);
      ctx.restore();
    });
    if (++t < 260) requestAnimationFrame(tick); else ctx.clearRect(0, 0, c.width, c.height);
  })();
}
