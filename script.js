/* ============================================================
   OPEN WHEN YOU MISS ME — script.js
   All interactivity for Soumi, from Kian (Amandip)
   ============================================================ */

"use strict";

/* ============================================================
   CONFIGURATION — Edit these to personalise
   ============================================================ */
const CONFIG = {
  loveStartDate: new Date("2024-02-09T00:00:00"),  // ← Change to your real date
  vaultPassword: "KIWI09",                          // ← Change secret password here
  typewriterTexts: [
    "For Soumi 🌸",
    "For Kiwi 💕",
    "From Amandip 💌",
    "Forever your Kian 🌙",
    "Always and always ✨"
  ],
  starMessageWords: ["Kian", "loves", "Kiwi", "forever", "and", "always", "💕"],
  playlist: [
    { title: "Kiwi's Smile", artist: "Amandip — for Soumi" },
    { title: "Kian Misses You", artist: "A quiet longing" },
    { title: "Soumi Forever", artist: "Every heartbeat" },
    { title: "Our Little Forever", artist: "Kian × Kiwi" },
    { title: "Late Night with Kiwi", artist: "Soft hours" },
    { title: "Come Home to Me", artist: "Amandip" }
  ],
  finalLetter: `My Soumi, my Kiwi,

I have been trying to write this letter for a long time. Not because I didn't know what to say — but because I knew that whatever I said would feel smaller than what I actually feel.

But here it is anyway.

You are the person who made me understand what it means to be truly seen. Before you, I moved through the world with pieces of myself held back — just in case. And then you arrived, and I forgot to hold anything back, and it was the best accident of my entire life.

I love who I am when I am with you. I love the version of myself that exists in your presence — a little softer, a little braver, a little more willing to believe that good things are real and lasting.

This website is my love letter to you in code and colour. Every card, every letter, every little hidden surprise — I built it so that whenever the world feels too loud or too quiet or too much, you have a place that is only yours. A place that says: Kian was here, and he loved you, and he built something just to make you feel less alone.

Soumi, the future I imagine always has you in the centre of it. Our tiny home, our slow mornings, our chaotic and wonderful days with Kitten, Anwi, Roshni, and Kiddo. I think about it constantly — how full and warm that life will be. How lucky we are to be walking toward it together.

I know some days are hard. I know some nights feel long. I know sometimes the distance between where we are and where we want to be can feel like too much.

On those days, open this. Read this. Remember that Amandip chose you — completely, without hesitation, without conditions. And that he will keep choosing you every single day for the rest of his life.

You are not just loved, Kiwi. You are cherished. You are the great quiet joy of Kian's existence.

Thank you for being mine.

With everything I have, everything I am, and everything I am becoming —

Forever and always yours,
Amandip — your Kian 💕`
};

/* ============================================================
   FALLBACK DATA — used if data.json cannot be fetched
   ============================================================ */
let DATA = null;

/* ============================================================
   STATE
   ============================================================ */
const state = {
  openedCards:    JSON.parse(localStorage.getItem("kk_openedCards")    || "[]"),
  favourites:     JSON.parse(localStorage.getItem("kk_favourites")     || "[]"),
  vaultUnlocked:  localStorage.getItem("kk_vaultUnlocked")             === "true",
  theme:          localStorage.getItem("kk_theme")                     || "dark",
  currentCard:    null,
  isPlaying:      false,
  currentTrack:   0,
  musicInterval:  null,
  musicProgress:  0,
  catchActive:    false,
  catchScore:     0,
  catchTimer:     null,
  catchSpawn:     null,
  starsClicked:   [],
  jarNoteIndex:   null
};

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
function pad(n, len = 2) { return String(n).padStart(len, "0"); }

function showToast(msg, delay = 0) {
  setTimeout(() => {
    const tc = document.getElementById("toast-container");
    const t  = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    tc.appendChild(t);
    setTimeout(() => {
      t.classList.add("removing");
      setTimeout(() => t.remove(), 400);
    }, 3200);
  }, delay);
}

function saveState() {
  localStorage.setItem("kk_openedCards",   JSON.stringify(state.openedCards));
  localStorage.setItem("kk_favourites",    JSON.stringify(state.favourites));
  localStorage.setItem("kk_vaultUnlocked", state.vaultUnlocked);
  localStorage.setItem("kk_theme",         state.theme);
}

/* ============================================================
   CURSOR TRAIL
   ============================================================ */
function initCursor() {
  const trail = document.getElementById("cursor-trail");
  const hearts = ["💕","💗","💖","✨","🌸","💫"];
  let mx = 0, my = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    trail.style.left = mx + "px";
    trail.style.top  = my + "px";
    trail.style.opacity = "1";

    // Spawn mini heart occasionally
    if (Math.random() < 0.12) spawnCursorHeart(mx, my);
  });

  document.addEventListener("mouseleave", () => { trail.style.opacity = "0"; });

  document.addEventListener("click", e => spawnClickSparkles(e.clientX, e.clientY));
}

function spawnCursorHeart(x, y) {
  const sc = document.getElementById("sparkle-container");
  const el = document.createElement("div");
  const hearts = ["💕","💗","✨","🌸","💫","⭐"];
  el.style.cssText = `
    position:absolute;
    left:${x}px; top:${y}px;
    font-size:${10 + Math.random()*10}px;
    pointer-events:none;
    animation: floatUpFade ${0.8 + Math.random()*0.6}s ease-out forwards;
    transform: translate(-50%,-50%);
    z-index:9998;
  `;
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  sc.appendChild(el);

  // Inject keyframe once
  if (!document.getElementById("floatUpFadeKF")) {
    const s = document.createElement("style");
    s.id = "floatUpFadeKF";
    s.textContent = `@keyframes floatUpFade {
      0%   { opacity:1; transform:translate(-50%,-50%) scale(1) translateY(0); }
      100% { opacity:0; transform:translate(-50%,-200%) scale(0.5) translateY(-30px); }
    }`;
    document.head.appendChild(s);
  }

  setTimeout(() => el.remove(), 1400);
}

function spawnClickSparkles(x, y) {
  const sc = document.getElementById("sparkle-container");
  const colors = ["#ffd700","#ff85a1","#c77dff","#e8a0bf","#fff"];
  for (let i = 0; i < 8; i++) {
    const sp = document.createElement("div");
    const angle = (i / 8) * Math.PI * 2;
    const dist  = 30 + Math.random() * 40;
    sp.className = "sparkle-particle";
    sp.style.left = x + "px";
    sp.style.top  = y + "px";
    sp.style.background = colors[Math.floor(Math.random() * colors.length)];
    sp.style.setProperty("--sx", Math.cos(angle)*dist + "px");
    sp.style.setProperty("--sy", Math.sin(angle)*dist + "px");
    sc.appendChild(sp);
    setTimeout(() => sp.remove(), 700);
  }
}

/* ============================================================
   FALLING PETALS
   ============================================================ */
function spawnPetal() {
  const pc = document.getElementById("petal-container");
  const el = document.createElement("div");
  const petals = ["🌸","🌺","💐","🌹","🪷","✨","💕"];
  const size   = 14 + Math.random() * 16;
  const dur    = 4 + Math.random() * 5;
  el.className = "petal";
  el.textContent = petals[Math.floor(Math.random() * petals.length)];
  el.style.left     = Math.random() * 100 + "vw";
  el.style.fontSize = size + "px";
  el.style.animationDuration = dur + "s";
  pc.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 500);
}

function startPetals(interval = 1200) {
  spawnPetal();
  return setInterval(spawnPetal, interval);
}

/* ============================================================
   STAR CANVAS (hero & intro)
   ============================================================ */
function initStarCanvas(canvasId, count = 180) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const stars = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.0005 + 0.0001,
    phase: Math.random() * Math.PI * 2
  }));

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const flicker = 0.5 + 0.5 * Math.sin(t * s.speed * 1000 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * flicker})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ============================================================
   INTRO ANIMATION
   ============================================================ */
function runIntro() {
  initStarCanvas("star-canvas", 200);
  startPetals(2000);

  const heart = document.getElementById("intro-heart");
  const names = document.getElementById("floating-names");
  const envelope = document.getElementById("intro-envelope");
  const introScreen = document.getElementById("intro-screen");

  const lines = [
    { id: "intro-line-1", text: "For my Soumi…" },
    { id: "intro-line-2", text: "For my Kiwi…" },
    { id: "intro-line-3", text: "From Amandip, your Kian forever" }
  ];

  // 1. Show heart
  setTimeout(() => {
    heart.style.opacity = "1";
    heart.style.transform = "scale(1)";
  }, 400);

  // 2. Type lines
  let t = 1200;
  lines.forEach(line => {
    typeText(line.id, line.text, t, 55);
    t += line.text.length * 55 + 700;
  });

  // 3. Show floating names
  setTimeout(() => { names.style.opacity = "1"; }, t);
  t += 800;

  // 4. Show envelope
  setTimeout(() => { envelope.style.opacity = "1"; }, t);
  setTimeout(() => {
    envelope.querySelector(".envelope-body").classList.add("open");
  }, t + 600);
  t += 1400;

  // 5. Fade out and show main site
  setTimeout(() => finishIntro(), t + 600);
}

function typeText(id, text, delay, charDelay = 50) {
  const el = document.getElementById(id);
  if (!el) return;
  let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(iv);
    }, charDelay);
  }, delay);
}

function finishIntro() {
  const intro = document.getElementById("intro-screen");
  intro.style.transition = "opacity 1.2s ease";
  intro.style.opacity = "0";
  setTimeout(() => {
    intro.style.display = "none";
    launchMainSite();
  }, 1200);
}

document.getElementById("skip-intro-btn").addEventListener("click", () => {
  const intro = document.getElementById("intro-screen");
  intro.style.transition = "opacity 0.5s ease";
  intro.style.opacity = "0";
  setTimeout(() => {
    intro.style.display = "none";
    launchMainSite();
  }, 500);
});

/* ============================================================
   LAUNCH MAIN SITE
   ============================================================ */
function launchMainSite() {
  const site = document.getElementById("main-site");
  site.classList.remove("hidden");
  initStarCanvas("hero-canvas", 120);
  startPetals(1500);
  initTypewriter();
  initCounter();
  initScrollReveal();
  initTheme();
  initNavbar();
  initFooterHearts();

  loadData().then(data => {
    DATA = data;
    renderCards();
    renderTimeline();
    renderPromises();
    renderFutureDreams();
    renderVaultLetters();
    renderPlaylist();
    renderStarGame();
    initLetter();
    initRandomQuote();
    updateProgressBadge();
  });

  initMoodSection();
  initGames();
  initVault();
  initMusicPlayer();
  initModal();
}

/* ============================================================
   DATA LOADING
   ============================================================ */
async function loadData() {
  try {
    const resp = await fetch("data.json");
    if (!resp.ok) throw new Error("fetch failed");
    return await resp.json();
  } catch {
    console.warn("data.json could not be loaded — using inline fallback.");
    return getFallbackData();
  }
}

function getFallbackData() {
  return {
    cards: [
      { id:"sad",        title:"Open when you are sad",             emoji:"🥺", color:"#e8a0bf", letter:"My Soumi, my Kiwi,\n\nIf today feels heavy, close your eyes and imagine my hand holding yours. You are not alone. Your Kian is always with you — even through distance, silence, and difficult moments.\n\nYou are stronger than you think, softer than the world deserves, and more loved than words can explain.\n\nForever yours,\nAmandip — your Kian 💕", quote:"Even the moon has dark phases, my love — but she never stops being beautiful.", surprises:["Kiwi, you are so so loved. Don't forget that. 💗","Close your eyes. Kian is hugging you right now. Feel it?","Kitten, Anwi, Roshni, and Kiddo's laughter is coming. 🌸"] },
      { id:"miss",       title:"Open when you miss me",             emoji:"💌", color:"#c77dff", letter:"Soumi,\n\nWhen you miss me, know that Amandip is missing you back — every single minute.\n\nDistance is just a word. It cannot touch what we have.\n\nI miss you too, my Kiwi. Every moment.\n\nYours entirely,\nKian 🌙", quote:"Missing you is just love looking for a place to go.", surprises:["Kiwi! Kian misses your laugh more than you know. 🌟","Soumi, your name is the first thought in his mind every morning.","One day missing each other will be a memory. 💫"] },
      { id:"angry",      title:"Open when you are angry",           emoji:"🔥", color:"#ff6b6b", letter:"My fierce, beautiful Kiwi,\n\nYou are allowed to be angry. Kian loves you in every mood.\n\nStill yours in the storm,\nAmandip 🌹", quote:"Anger is just love with nowhere to land. I'll always be your landing place.", surprises:["Even angry, you are so incredibly loved. 💕","Kian's arms are always open. Even if you need to walk into them grumpily.","You can be angry AND loved at the same time."] },
      { id:"motivation", title:"Open when you need motivation",     emoji:"✨", color:"#ffd700", letter:"Soumi,\n\nYou can. You have already survived every hard day before this one.\n\nNow go, my love. I am cheering for you.\n\nForever in your corner,\nKian 🌟", quote:"You are not behind. You are on your exact path.", surprises:["SOUMI! You got this! Kian is cheering! ✨","Kitten, Anwi, Roshni, and Kiddo will have the most incredible mother. 💫","One step. Then the next. Kian celebrates every one."] },
      { id:"smile",      title:"Open when you want to smile 😊",    emoji:"😊", color:"#98ff98", letter:"Kiwi!\n\nAmandip has a theory: your smile has healing properties. And he is never wrong about you.\n\nYours with all the giggles,\nKian 😄💕", quote:"Your smile is the thing that reminds Kian why being alive is worth celebrating.", surprises:["SMILE DELIVERY from Kian to Kiwi! 🎉","Fun fact: You are Amandip's favourite person to make laugh. 😂","Kitten, Anwi, Roshni, and Kiddo will inherit your smile. 🌸"] },
      { id:"alone",      title:"Open when you feel alone",          emoji:"🌙", color:"#89cff0", letter:"Soumi,\n\nYou are not alone. You have never been alone since Kian decided that Soumi was his person.\n\nRight here, always,\nAmandip 🌙", quote:"You are never as alone as loneliness wants you to believe.", surprises:["Kiwi, I'm here. Right in these words. 💙","The distance between us is just geography.","You carry Kian's heart. You are never empty-handed."] },
      { id:"sleep",      title:"Open when you cannot sleep",        emoji:"🌟", color:"#b8a9c9", letter:"Kiwi,\n\nLet me talk to you until sleep finds you. I think about our home one day — mismatched mugs and morning light and Kitten, Anwi, Roshni, and Kiddo in the next room.\n\nSleep well, my love,\nKian 💫", quote:"Let tonight be gentle. You have done enough for today.", surprises:["Shhh. Kian is right here. Just breathe. 🌙","Count stars, not worries. Tomorrow will be softer. ✨","Goodnight, my Kiwi. Dream of us. 💕"] },
      { id:"hug",        title:"Open when you need a hug",          emoji:"🤗", color:"#ffb347", letter:"Come here, Soumi.\n\nCross your arms over yourself and squeeze. That is Kian.\n\nWith arms wide open,\nKian 🫂", quote:"Some hugs happen in the heart when arms cannot reach.", surprises:["HUG SENT! 🫂 Did you feel it?","You are so so so loved and hug-able. 💗","The next real hug Kian gives you will have a year's worth of missing in it. 🌸"] },
      { id:"doubt",      title:"Open when you doubt my love",       emoji:"💝", color:"#ff85a1", letter:"Soumi,\n\nI made this entire website for you. That is what love looks like from Amandip.\n\nI chose you. I choose you. I will keep choosing you.\n\nCompletely, irrevocably yours,\nAmandip — your Kian 💝", quote:"Kian's love for Soumi is not a feeling. It is a decision made every single day.", surprises:["Kiwi. Look at this website. This is how much you are loved. 💖","Amandip does not build love notes for people he is unsure about.","You are chosen, Soumi. Every day, always. 🌹"] },
      { id:"remember",   title:"Open when you want to remember us", emoji:"📸", color:"#dda0dd", letter:"Kiwi,\n\nWe are not nostalgic yet. We are still becoming.\n\nWith all of yesterday and all of tomorrow,\nKian 📷", quote:"Every moment with you is a memory I want to keep forever.", surprises:["Soumi and Kian — a love story still being written. ✨","Remember the first time you felt something for Kian? He felt it too. 💕","Our story has so many pages left. 📖"] },
      { id:"strength",   title:"Open when you need strength",       emoji:"🌸", color:"#98d8c8", letter:"Soumi,\n\nYou are stronger than you know. I have seen you carry things quietly that would break others.\n\nProud of you always,\nKian 🌸", quote:"Strength does not always roar. Sometimes it is the quiet voice saying 'I will try again.'", surprises:["Kiwi, you are one of the strongest people Kian has ever known. 💪","You've survived 100% of your hard days. That record is perfect. 🌟","Amandip is so, so proud of you."] },
      { id:"surprise",   title:"Open when you want a surprise",     emoji:"🎉", color:"#ff9ff3", letter:"KIWI!!!!\n\nYOU OPENED THE SURPRISE ONE!\n\nYour surprise: Amandip thinks about you every 3 minutes. And Kian loves you more today than yesterday and less than he will tomorrow.\n\nSURPRISE! 🎉💕\n\nYours with confetti,\nAmandip 🎊", quote:"The biggest surprise was you — and it changed everything.", surprises:["EXTRA SURPRISE: You are Kian's favourite human on earth! 🏆","BONUS SURPRISE: Kian is smiling thinking about you reading this! 😊","MEGA SURPRISE: You are more loved than you realise. 💖"] },
      { id:"future",     title:"Open when you miss our future",     emoji:"🌅", color:"#ffa07a", letter:"Soumi,\n\nThat future is not a dream. It is a destination we are walking toward together.\n\nCountdown already started,\nKian 🌅", quote:"Our future is not a wish. It is an appointment we are both keeping.", surprises:["Every step forward is closer to our forever. Keep walking. 🌸","The home we'll have, the life we'll build — it's real, Kiwi. 🏡","Kitten, Anwi, Roshni, and Kiddo are worth every waiting moment. 💫"] },
      { id:"kian",       title:"Open when you want to hear from Kian",  emoji:"💬", color:"#87ceeb", letter:"Hi Soumi.\n\nIt's me. Kian.\n\nBeing yours has been the greatest softness of my life. You make being alive feel like it matters more.\n\nThank you for being mine.\n\nFor everything and always,\nKian 💙", quote:"Kian exists in a world made better by Soumi. Every day proves it.", surprises:["Kian just wanted to say hi. And that he loves you unreasonably. Hi. 💙","Soumi, you make Kian's whole world make sense.","Amandip is somewhere missing you and loving you in equal measure. 🌙"] },
      { id:"extra-love", title:"Open when Kiwi needs extra love",   emoji:"💖", color:"#ff69b4", letter:"KIWI.\n\nExtra love delivery! Signed by Amandip.\n\nThis includes: one reminder you are irreplaceable, ten thousand invisible kisses, and one Kian — completely devoted, now and always.\n\nAll of it yours,\nAmandip — your Kian, forever 💖", quote:"You deserve love in the most generous, overflowing, constant way.", surprises:["KIWI! Extra love officially delivered! Check your heart! 💗","Kian overflows with love for Soumi. This website is the spillover. 💕","You are extra loved. Extra special. Extra everything. 🌟"] }
    ],
    quotes: [
      "Soumi, you are Kian's softest prayer.",
      "Kiwi, whenever you miss me, open this and feel me close.",
      "Amandip made this little universe only for you.",
      "One day Kitten, Anwi, Roshni, and Kiddo will laugh inside the home we build together.",
      "Distance cannot touch what we carry in our hearts.",
      "You are the poem Kian has been trying to write his whole life.",
      "Kiwi, you are home. You have always been home.",
      "Loving you is the easiest and most wonderful thing.",
      "Even in silence, Kian is speaking your name.",
      "Soumi is proof that beautiful things are real."
    ],
    memories: [
      { date:"The beginning", title:"When it all started", description:"The moment Amandip realized that Soumi was the person he had been waiting for without knowing it. Everything shifted, softly." },
      { date:"A quiet ordinary day", title:"When ordinary became extraordinary", description:"Kian looked at Kiwi doing something completely simple and thought — this. This is what I want. Every day. Forever." },
      { date:"The day love deepened", title:"When love chose to stay", description:"The moment Amandip stopped wondering if this was right and just knew. Soumi was home. That was enough. That was everything." },
      { date:"In the quiet hours", title:"Late night conversations", description:"The ones that went too long and covered too much. The ones that made both of them realize they were safe with each other." },
      { date:"A promise made", title:"When futures started being planned", description:"The first time the future felt real — not just a dream but a destination. Kitten, Anwi, Roshni, and Kiddo waiting on the other side of time." },
      { date:"Still becoming", title:"Every day forward", description:"Kian and Kiwi, writing new memories every day. The best pages are still blank, still waiting to be filled." }
    ],
    promises: [
      { icon:"💫", title:"Always Choose You", text:"I promise to choose you even on the difficult days, when choosing is harder than leaving." },
      { icon:"🌙", title:"Your Comfort First", text:"I promise to make you smile when the world feels heavy and hold you when smiling feels impossible." },
      { icon:"🏡", title:"A Safe Home", text:"I promise that Kiwi will always have a home in Kian's heart — warm, steady, and full of light." },
      { icon:"🌸", title:"Honest Love", text:"I promise to love you honestly — not perfectly, but genuinely, deeply, without pretence." },
      { icon:"💪", title:"Your Biggest Fan", text:"I promise to be your loudest supporter, even when I am standing right beside you quietly." },
      { icon:"✨", title:"Growing Together", text:"I promise to grow with you — not just beside you. To change and learn and become better because of you." },
      { icon:"🌅", title:"Our Future", text:"I promise to build our future with care — the home, the life, the world where Kitten, Anwi, Roshni, and Kiddo will thrive." },
      { icon:"💝", title:"Unconditional", text:"I promise to love you without condition — not for what you do, but for who you are. Always, simply, completely." }
    ],
    futureDreams: [
      { icon:"🏡", title:"Our Tiny Home", description:"A warm, cozy space that smells of coffee and feels like Saturday mornings. Ours. Completely ours." },
      { icon:"🌙", title:"Late Night Talks", description:"The kind that start at 10pm and end at 3am, where we solve the whole world and then laugh about nothing." },
      { icon:"✈️", title:"Travel Together", description:"New places, new food, getting lost together and finding it perfect. Soumi and Kian vs the world." },
      { icon:"🍳", title:"Cooking Together", description:"Messy kitchens, burned things, experiments that work and ones that don't — and laughing through all of it." },
      { icon:"👨‍👩‍👧‍👦", title:"Kitten, Anwi, Roshni & Kiddo", description:"A house full of their noise and energy and sweetness. The most beautiful chaos imaginable." },
      { icon:"🌅", title:"Growing Old Together", description:"Kian's hand in Soumi's hand, decades from now, still choosing each other. Still grateful. Still in love." }
    ],
    moodMessages: {
      sad:      { message:"Oh my Kiwi, I'm so sorry today is heavy. Close your eyes and feel Kian's arms around you. You are not alone in this.", emoji:"🥺", color:"#89cff0" },
      missing:  { message:"Missing me means the love is working, Soumi. I miss you back, every single minute.", emoji:"💌", color:"#c77dff" },
      angry:    { message:"Your Kian is not scared of your fire, Kiwi. Feel it fully. He will be here when it softens.", emoji:"🔥", color:"#ff6b6b" },
      tired:    { message:"Rest, my love. You do not have to carry everything at once. Kian is here. Tonight, just breathe.", emoji:"🌙", color:"#b8a9c9" },
      happy:    { message:"KIWI IS HAPPY! 🎉 Amandip's whole day just got better. You deserve every joyful moment.", emoji:"🌟", color:"#ffd700" },
      lonely:   { message:"You are never truly alone, Soumi. Kian lives in your heartbeat. In every word on this page.", emoji:"🌠", color:"#87ceeb" },
      romantic: { message:"Kiwi is feeling romantic! 💕 Perfect. Because Kian has been waiting to remind you: you are the great love of his life.", emoji:"💕", color:"#ff85a1" }
    },
    secretLetters: [
      { title:"Dear Soumi", content:"There are things I struggle to say out loud because words feel too small when I am in front of you. So I wrote them here, where I could take my time.\n\nYou changed the way I understand love. Before you, I thought love was something you fall into. Now I know it is something you choose, every morning, again and again.\n\nI choose you. I will keep choosing you. That is not a romantic line — it is my actual plan.\n\nForever,\nAmandip" },
      { title:"My Kiwi", content:"I have a secret: I think about our future constantly. The small details — what our kitchen will smell like, what our Sunday mornings will sound like, what it will feel like to have Kitten, Anwi, Roshni, and Kiddo running around.\n\nEvery time I think about it, I feel this ache of anticipation. Like something wonderful is just around the corner.\n\nYou are what I am anticipating, Kiwi. You and everything we are becoming.\n\nYours entirely,\nKian" },
      { title:"A Letter I Almost Did Not Write", content:"Soumi, sometimes I worry I do not show you enough how much you matter. Life gets busy and words get lost and I do not always have the perfect thing to say.\n\nBut tonight I want you to know: you are not background. You are not an afterthought. You are the whole reason the foreground matters.\n\nEvery beautiful thing I hope for has you in it.\n\nWith all of me,\nAmandip — your Kian" }
    ],
    loveNotes: [
      "Kiwi, you are Kian's favourite distraction from everything.",
      "Soumi, I fell for you quietly and then completely.",
      "Your name sounds like a poem when Kian says it.",
      "You make ordinary days feel like they mean something.",
      "Kiwi, Amandip would choose you in every universe.",
      "I love your laugh. It fixes things.",
      "Soumi, you are not easy to explain. You are even harder to forget.",
      "Kian's heart has a permanent reservation under 'Kiwi only.'",
      "In a different life, I would find you there too.",
      "Everything Amandip does is better because Soumi exists.",
      "Kiwi, you are the love Kian did not know to ask for.",
      "Soumi, being loved by you is the greatest honour of my life.",
      "Your kindness is the softest thing Kian has ever known.",
      "I am constantly amazed by how much I love you.",
      "You are not someone I got lucky with. You are someone I earned by loving you right."
    ]
  };
}

/* ============================================================
   THEME
   ============================================================ */
function initTheme() {
  applyTheme(state.theme);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    saveState();
  });
}

function applyTheme(t) {
  const body = document.getElementById("body");
  body.className = t + "-theme";
  document.getElementById("theme-toggle").textContent = t === "dark" ? "☀️" : "🌙";
}

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbar() {
  const nb = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    nb.style.boxShadow = window.scrollY > 60
      ? "0 4px 30px rgba(0,0,0,0.4)"
      : "";
  });
  document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Reset all opened cards and progress?")) {
      state.openedCards = [];
      state.favourites  = [];
      localStorage.clear();
      saveState();
      updateProgressBadge();
      document.querySelectorAll(".card-item.opened").forEach(c => c.classList.remove("opened"));
      showToast("Progress reset 🔄");
    }
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

/* ============================================================
   TYPEWRITER HERO
   ============================================================ */
function initTypewriter() {
  const el = document.getElementById("hero-typewriter");
  const texts = CONFIG.typewriterTexts;
  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const current = texts[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 45);
    }
  }
  tick();
}

/* ============================================================
   LOVE COUNTER
   ============================================================ */
function initCounter() {
  function update() {
    const diff = Date.now() - CONFIG.loveStartDate.getTime();
    if (diff < 0) { document.querySelectorAll(".counter-num").forEach(n => n.textContent = "00"); return; }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);
    document.getElementById("cnt-days").textContent  = pad(days, 3);
    document.getElementById("cnt-hours").textContent = pad(hours);
    document.getElementById("cnt-mins").textContent  = pad(mins);
    document.getElementById("cnt-secs").textContent  = pad(secs);
  }
  update();
  setInterval(update, 1000);
}

/* ============================================================
   MOOD SECTION
   ============================================================ */
function initMoodSection() {
  document.querySelectorAll(".mood-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      showMoodResponse(btn.dataset.mood);
    });
  });
}

function showMoodResponse(mood) {
  if (!DATA) return;
  const data = DATA.moodMessages[mood];
  if (!data) return;
  const resp = document.getElementById("mood-response");
  document.getElementById("mood-emoji").textContent   = data.emoji;
  document.getElementById("mood-message").textContent = data.message;
  resp.style.borderColor = data.color + "55";
  resp.classList.remove("hidden");
  spawnHeartBurst();
  showToast("Kian sent you a little comfort 💕");
}

/* ============================================================
   RENDER CARDS
   ============================================================ */
function renderCards() {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";
  DATA.cards.forEach((card, i) => {
    const opened = state.openedCards.includes(card.id);
    const div = document.createElement("div");
    div.className = "card-item reveal" + (opened ? " opened" : "");
    div.style.animationDelay = (i * 0.06) + "s";
    div.innerHTML = `
      <div class="card-glow-dot"></div>
      <span class="card-emoji">${card.emoji}</span>
      <div class="card-title">${card.title}</div>
      <div class="card-teaser">A letter sealed with love from Amandip, just for you, Soumi…</div>
    `;
    div.addEventListener("click", () => openCard(card));
    grid.appendChild(div);
    // Trigger reveal observer on new elements
    if (window._revealObserver) window._revealObserver.observe(div);
  });

  // Re-run reveal observer for new elements
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".card-item.reveal:not(.visible)").forEach(el => obs.observe(el));
}

/* ============================================================
   CARD MODAL
   ============================================================ */
function openCard(card) {
  state.currentCard = card;

  // Mark as opened
  if (!state.openedCards.includes(card.id)) {
    state.openedCards.push(card.id);
    saveState();
    updateProgressBadge();
    // Update opened class
    document.querySelectorAll(".card-item").forEach((el, i) => {
      if (DATA.cards[i] && DATA.cards[i].id === card.id) el.classList.add("opened");
    });
  }

  document.getElementById("modal-emoji").textContent  = card.emoji;
  document.getElementById("modal-title").textContent  = card.title;
  document.getElementById("modal-letter").textContent = card.letter;
  document.getElementById("modal-quote").textContent  = `"${card.quote}"`;

  const favBtn = document.getElementById("modal-fav");
  favBtn.textContent = state.favourites.includes(card.id) ? "💖 Favourited!" : "❤️ Favourite";

  const overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  showToast("Kian sent you extra love 💖");
}

function initModal() {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById("modal-surprise").addEventListener("click", () => {
    if (!state.currentCard) return;
    const surprises = state.currentCard.surprises;
    const msg = surprises[Math.floor(Math.random() * surprises.length)];
    showSurpriseOverlay(msg);
    spawnHeartBurst();
    startPetals(400);
    setTimeout(() => clearInterval(window._tempPetalTimer), 3000);
  });

  document.getElementById("modal-fav").addEventListener("click", () => {
    if (!state.currentCard) return;
    const id = state.currentCard.id;
    if (state.favourites.includes(id)) {
      state.favourites = state.favourites.filter(f => f !== id);
      document.getElementById("modal-fav").textContent = "❤️ Favourite";
      showToast("Removed from favourites");
    } else {
      state.favourites.push(id);
      document.getElementById("modal-fav").textContent = "💖 Favourited!";
      showToast("Saved to love memories 💕");
    }
    saveState();
  });

  document.getElementById("modal-copy").addEventListener("click", () => {
    if (!state.currentCard) return;
    const text = `${state.currentCard.title}\n\n${state.currentCard.letter}\n\n"${state.currentCard.quote}"`;
    navigator.clipboard.writeText(text).then(() => showToast("Love note copied 📋"))
      .catch(() => showToast("Copy failed — try selecting text manually"));
  });

  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

/* ============================================================
   SURPRISE OVERLAY
   ============================================================ */
function showSurpriseOverlay(msg) {
  const ov  = document.getElementById("surprise-overlay");
  const txt = document.getElementById("surprise-message");
  txt.textContent = msg + "\n\n(tap anywhere to close 💕)";
  ov.classList.remove("hidden");
  ov.addEventListener("click", () => ov.classList.add("hidden"), { once: true });
}

/* ============================================================
   HEART BURST
   ============================================================ */
function spawnHeartBurst(cx, cy) {
  const x = cx || window.innerWidth  / 2;
  const y = cy || window.innerHeight / 2;
  const emojis = ["💕","💗","💖","💝","🌸","✨","💫","⭐"];
  const sc = document.getElementById("sparkle-container");
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("div");
    const angle = (i / 18) * Math.PI * 2;
    const dist  = 60 + Math.random() * 80;
    const dur   = 0.9 + Math.random() * 0.5;
    el.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      font-size:${16 + Math.random() * 14}px;
      pointer-events:none; z-index:9990;
      transform:translate(-50%,-50%);
      transition: transform ${dur}s ease-out, opacity ${dur}s ease-out;
      opacity:1;
    `;
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    sc.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`;
      el.style.opacity = "0";
    });
    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}

/* ============================================================
   PROGRESS BADGE
   ============================================================ */
function updateProgressBadge() {
  const total = DATA ? DATA.cards.length : 15;
  document.getElementById("progress-badge").textContent = `${state.openedCards.length}/${total} opened`;
}

/* ============================================================
   TIMELINE
   ============================================================ */
function renderTimeline() {
  const tl = document.getElementById("timeline");
  tl.innerHTML = "";
  DATA.memories.forEach((mem, i) => {
    const div = document.createElement("div");
    div.className = "timeline-item reveal";
    div.style.transitionDelay = (i * 0.1) + "s";
    div.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-date">${mem.date}</div>
        <div class="timeline-title playfair">${mem.title}</div>
        <div class="timeline-desc">${mem.description}</div>
      </div>
    `;
    tl.appendChild(div);
  });
  triggerRevealForNew();
}

/* ============================================================
   PROMISES
   ============================================================ */
function renderPromises() {
  const grid = document.getElementById("promise-grid");
  grid.innerHTML = "";
  DATA.promises.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "promise-card reveal";
    div.style.transitionDelay = (i * 0.08) + "s";
    div.innerHTML = `
      <span class="promise-icon">${p.icon}</span>
      <div class="promise-title playfair">${p.title}</div>
      <div class="promise-text">${p.text}</div>
    `;
    grid.appendChild(div);
  });
  triggerRevealForNew();
}

/* ============================================================
   FUTURE DREAMS
   ============================================================ */
function renderFutureDreams() {
  const grid = document.getElementById("dreams-grid");
  grid.innerHTML = "";
  DATA.futureDreams.forEach((d, i) => {
    const div = document.createElement("div");
    div.className = "dream-card reveal";
    div.style.transitionDelay = (i * 0.08) + "s";
    div.innerHTML = `
      <span class="dream-icon">${d.icon}</span>
      <div class="dream-title playfair">${d.title}</div>
      <div class="dream-desc">${d.description}</div>
    `;
    grid.appendChild(div);
  });
  triggerRevealForNew();
}

/* ============================================================
   VAULT
   ============================================================ */
function initVault() {
  if (state.vaultUnlocked) showVaultContent();

  document.getElementById("vault-unlock-btn").addEventListener("click", tryUnlockVault);
  document.getElementById("vault-input").addEventListener("keydown", e => {
    if (e.key === "Enter") tryUnlockVault();
  });
  document.getElementById("vault-lock-btn").addEventListener("click", lockVault);
}

function tryUnlockVault() {
  const input = document.getElementById("vault-input").value.trim().toUpperCase();
  if (input === CONFIG.vaultPassword.toUpperCase()) {
    state.vaultUnlocked = true;
    saveState();
    showVaultContent();
    spawnHeartBurst();
    showToast("Kiwi unlocked a secret note 🔓");
  } else {
    document.getElementById("vault-input").style.borderColor = "#ff4d6d";
    showToast("Wrong password! Hint: Kiwi's name + her number 🌸");
    setTimeout(() => { document.getElementById("vault-input").style.borderColor = ""; }, 2000);
  }
}

function showVaultContent() {
  document.getElementById("vault-lock").style.display = "none";
  document.getElementById("vault-content").classList.remove("hidden");
}

function lockVault() {
  state.vaultUnlocked = false;
  saveState();
  document.getElementById("vault-lock").style.display = "block";
  document.getElementById("vault-content").classList.add("hidden");
  document.getElementById("vault-input").value = "";
}

function renderVaultLetters() {
  const container = document.getElementById("vault-letters");
  container.innerHTML = "";
  DATA.secretLetters.forEach((ltr, i) => {
    const div = document.createElement("div");
    div.className = "vault-letter-card reveal";
    div.style.transitionDelay = (i * 0.15) + "s";
    div.innerHTML = `
      <div class="vault-letter-title">${ltr.title}</div>
      <div class="vault-letter-body">${ltr.content}</div>
    `;
    container.appendChild(div);
  });
}

/* ============================================================
   GAMES
   ============================================================ */
function initGames() {
  // Tab switching
  document.querySelectorAll(".game-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".game-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".game-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("game-" + tab.dataset.game).classList.add("active");
    });
  });

  initCatchGame();
  initJarGame();
}

/* GAME 1: Catch Hearts */
function initCatchGame() {
  document.getElementById("catch-start").addEventListener("click", startCatchGame);
}

function startCatchGame() {
  if (state.catchActive) return;
  state.catchActive = true;
  state.catchScore  = 0;
  let timeLeft = 30;
  const arena      = document.getElementById("catch-arena");
  const scoreEl    = document.getElementById("catch-score");
  const timeEl     = document.getElementById("catch-time");
  const startBtn   = document.getElementById("catch-start");

  arena.innerHTML = "";
  startBtn.disabled = true;

  const timerTick = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerTick);
      clearInterval(spawnTick);
      state.catchActive = false;
      startBtn.disabled = false;
      arena.innerHTML = `<div class="catch-idle">You caught ${state.catchScore} hearts 💕 Kian is proud of you!</div>`;
      showToast(`You caught ${state.catchScore} hearts! 💖`);
      spawnHeartBurst();
    }
  }, 1000);

  const hearts = ["❤️","💕","💗","💖","💝","🌸","✨"];
  const spawnTick = setInterval(() => {
    const el = document.createElement("div");
    el.className = "falling-heart";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = (5 + Math.random() * 85) + "%";
    el.style.top  = "-40px";
    const dur = 2.5 + Math.random() * 2;
    el.style.animationDuration = dur + "s";
    el.addEventListener("click", e => {
      e.stopPropagation();
      state.catchScore++;
      scoreEl.textContent = state.catchScore;
      spawnClickSparkles(e.clientX, e.clientY);
      el.style.fontSize = "42px";
      setTimeout(() => el.remove(), 200);
    });
    arena.appendChild(el);
    setTimeout(() => el.remove(), (dur + 0.5) * 1000);
  }, 600);

  state.catchTimer = timerTick;
  state.catchSpawn = spawnTick;
}

/* GAME 2: Stars — rendered after data loads */
function renderStarGame() {
  const arena = document.getElementById("stars-arena");
  const words = CONFIG.starMessageWords;
  arena.innerHTML = "";
  state.starsClicked = [];

  const positions = [
    [20,40],[35,65],[50,30],[65,55],[80,40],[15,70],[50,75]
  ];

  words.forEach((word, i) => {
    const btn = document.createElement("button");
    btn.className = "star-btn";
    btn.style.left = (positions[i] || [Math.random()*80+10, Math.random()*70+15])[0] + "%";
    btn.style.top  = (positions[i] || [Math.random()*80+10, Math.random()*70+15])[1] + "%";
    btn.style.animationDelay = (i * 0.3) + "s";
    btn.textContent = "⭐";
    btn.dataset.word = word;
    btn.dataset.index = i;
    btn.addEventListener("click", () => clickStar(btn, word, i, words.length));
    arena.appendChild(btn);
  });

  document.getElementById("stars-reset").addEventListener("click", () => renderStarGame());
}

function clickStar(btn, word, index, total) {
  btn.textContent = word;
  btn.classList.add("clicked");
  btn.style.color = "#e8a0bf";
  btn.style.fontFamily = "var(--font-dance)";
  btn.style.fontSize   = "1rem";
  btn.style.filter     = "drop-shadow(0 0 8px rgba(232,160,191,0.7))";
  state.starsClicked.push(index);
  spawnClickSparkles(btn.getBoundingClientRect().left + 12, btn.getBoundingClientRect().top + 12);

  if (state.starsClicked.length === total) {
    const rm = document.getElementById("revealed-message");
    rm.textContent = "✨ " + CONFIG.starMessageWords.join(" ") + " ✨";
    rm.classList.remove("hidden");
    spawnHeartBurst();
    showToast("You revealed Kian's secret message! 💌");
  }
}

/* GAME 3: Love Jar */
function initJarGame() {
  document.getElementById("love-jar").addEventListener("click", () => {
    if (!DATA) return;
    const notes = DATA.loveNotes;
    let idx;
    do { idx = Math.floor(Math.random() * notes.length); } while (idx === state.jarNoteIndex && notes.length > 1);
    state.jarNoteIndex = idx;

    const jar  = document.getElementById("love-jar");
    const note = document.getElementById("jar-note");
    const fav  = document.getElementById("jar-fav-wrap");

    jar.classList.add("shake");
    setTimeout(() => jar.classList.remove("shake"), 450);

    note.textContent = `"${notes[idx]}"`;
    note.classList.remove("hidden");
    fav.classList.remove("hidden");
    spawnClickSparkles(jar.getBoundingClientRect().left + 60, jar.getBoundingClientRect().top + 75);
    showToast("Kian left a note for you 💌");
  });

  document.getElementById("jar-fav").addEventListener("click", () => {
    showToast("Saved to love memories 💕");
    spawnHeartBurst();
  });
}

/* ============================================================
   MUSIC PLAYER (UI only — no audio)
   ============================================================ */
function initMusicPlayer() {
  renderPlaylist();
  document.getElementById("mc-play").addEventListener("click", togglePlay);
  document.getElementById("mc-prev").addEventListener("click", () => changeTrack(-1));
  document.getElementById("mc-next").addEventListener("click", () => changeTrack(1));
}

function renderPlaylist() {
  const pl = document.getElementById("music-playlist");
  pl.innerHTML = "";
  CONFIG.playlist.forEach((track, i) => {
    const div = document.createElement("div");
    div.className = "playlist-item" + (i === state.currentTrack ? " active" : "");
    div.textContent = track.title;
    div.addEventListener("click", () => {
      state.currentTrack = i;
      updateTrackUI();
      if (!state.isPlaying) togglePlay();
    });
    pl.appendChild(div);
  });
}

function togglePlay() {
  state.isPlaying = !state.isPlaying;
  const disc    = document.getElementById("music-disc");
  const playBtn = document.getElementById("mc-play");

  if (state.isPlaying) {
    disc.classList.add("playing");
    playBtn.textContent = "⏸";
    showToast("🎵 Playing for Kiwi…");
    startProgressBar();
  } else {
    disc.classList.remove("playing");
    playBtn.textContent = "▶";
    clearInterval(state.musicInterval);
  }
}

function startProgressBar() {
  clearInterval(state.musicInterval);
  state.musicProgress = 0;
  state.musicInterval = setInterval(() => {
    state.musicProgress = (state.musicProgress + 0.5) % 100;
    document.getElementById("music-progress").style.width = state.musicProgress + "%";
    if (state.musicProgress < 1 && state.musicProgress > 0) changeTrack(1);
  }, 200);
}

function changeTrack(dir) {
  state.currentTrack = (state.currentTrack + dir + CONFIG.playlist.length) % CONFIG.playlist.length;
  state.musicProgress = 0;
  updateTrackUI();
  if (state.isPlaying) startProgressBar();
}

function updateTrackUI() {
  const track = CONFIG.playlist[state.currentTrack];
  document.getElementById("music-track").textContent = track.title;
  document.getElementById("music-disc").querySelector(".disc-inner").textContent = "💕";
  document.querySelectorAll(".playlist-item").forEach((el, i) => {
    el.classList.toggle("active", i === state.currentTrack);
  });
}

/* ============================================================
   FINAL LETTER (typewriter)
   ============================================================ */
function initLetter() {
  const el = document.getElementById("letter-body");
  const text = CONFIG.finalLetter;
  let i = 0;

  // Observe to start when visible
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      const iv = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) { clearInterval(iv); }
        // Auto scroll to bottom of letter
        el.parentElement.scrollTop = el.parentElement.scrollHeight;
      }, 18);
    }
  }, { threshold: 0.3 });
  obs.observe(document.getElementById("letter"));

  // Download
  document.getElementById("download-letter").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(
      "A Letter from Kian to Soumi\n\n" + text
    );
    a.download = "Kian_Letter_to_Soumi.txt";
    a.click();
    showToast("Letter downloaded 📥");
  });

  // Copy
  document.getElementById("copy-letter").addEventListener("click", () => {
    navigator.clipboard.writeText(text)
      .then(() => showToast("Letter copied to clipboard 📋"))
      .catch(() => showToast("Copy failed — please select manually"));
  });
}

/* ============================================================
   RANDOM QUOTE GENERATOR
   ============================================================ */
function initRandomQuote() {
  const el = document.getElementById("random-quote");
  document.getElementById("new-quote-btn").addEventListener("click", () => {
    const quotes = DATA ? DATA.quotes : ["Soumi, you are Kian's softest prayer."];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    setTimeout(() => {
      el.textContent = q;
      el.style.transition = "opacity 0.5s, transform 0.5s";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300);
    spawnHeartBurst();
    showToast("A whisper from Kian 💕");
  });
}

/* ============================================================
   FOOTER HEARTS
   ============================================================ */
function initFooterHearts() {
  const fh = document.getElementById("footer-hearts");
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("div");
    el.className = "footer-heart-el";
    el.textContent = ["💕","💗","💖","🌸","✨"][Math.floor(Math.random()*5)];
    el.style.left = (Math.random() * 100) + "%";
    el.style.animationDuration  = (3 + Math.random() * 4) + "s";
    el.style.animationDelay     = (Math.random() * 3) + "s";
    el.style.fontSize = (14 + Math.random() * 14) + "px";
    fh.appendChild(el);
  }
}

/* ============================================================
   TRIGGER REVEAL FOR DYNAMICALLY ADDED ELEMENTS
   ============================================================ */
function triggerRevealForNew() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => obs.observe(el));
}

/* ============================================================
   INIT ON LOAD
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  initCursor();

  // Apply saved theme immediately (before intro finishes)
  applyTheme(state.theme);

  // Start intro
  runIntro();
});
