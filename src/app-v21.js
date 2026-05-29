const STORAGE_KEY = "enough.app.state.v2";
const LEGACY_KEY = "enough.app.state.v1";
const root = document.getElementById("root");

const AUTH_CONFIG = {
  supabaseUrl: "https://usczkarpqyypmlgntebd.supabase.co",
  supabaseAnonKey: "",
  emailRedirectTo: "",
};

const seedPost = {
  id: "seed-1",
  author: "Enough",
  content: "Today I am grateful for breath, belonging, and the chance to begin again.",
  createdAt: new Date().toISOString(),
  hearts: 8,
};

const defaultState = {
  users: {},
  sessionEmail: "",
  gratitudeWall: [seedPost],
};

const pillars = [
  {
    id: "mind",
    title: "Mind",
    kicker: "Pillar One",
    line: "A private place to name, release, and return to peace.",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1400&q=85",
  },
  {
    id: "body",
    title: "Body",
    kicker: "Pillar Two",
    line: "Gentle rituals for energy, calm, and embodied joy.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=85",
  },
  {
    id: "community",
    title: "Together",
    kicker: "Pillar Three",
    line: "Connection, gratitude, celebration, and honest check-ins.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=85",
  },
  {
    id: "purpose",
    title: "Purpose",
    kicker: "Pillar Four",
    line: "The quiet fire that helps your days feel alive and meaningful.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=85",
  },
  {
    id: "faith",
    title: "Faith",
    kicker: "Pillar Five",
    line: "Wonder, surrender, peace, and whatever holds you steady.",
    image: "https://images.unsplash.com/photo-1476611338391-6f395a0dd82e?w=1400&q=85",
  },
];

const backgroundImages = {
  home: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=85",
  profile: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1800&q=85",
  worship: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1800&q=85",
};

const prompts = {
  mind: [
    "What is asking for your attention today?",
    "What felt peaceful, joyful, or lighter today?",
    "What can you soften around instead of solving right now?",
    "What thought would you like to set down for a while?",
  ],
  purpose: [
    "What kind of life are you quietly building?",
    "What made you feel happy, useful, or alive recently?",
    "What gift do people receive when they are close to you?",
    "What would make this week feel meaningful, not just productive?",
  ],
  faith: [
    "Where did you feel held today?",
    "What are you thankful for right now?",
    "What are you ready to trust without controlling?",
    "What truth, prayer, or question is alive in you?",
  ],
};

const moods = [
  ["peaceful", "Peaceful"],
  ["happy", "Happy"],
  ["grateful", "Grateful"],
  ["grounded", "Grounded"],
  ["hopeful", "Hopeful"],
  ["loved", "Loved"],
  ["tender", "Tender"],
  ["heavy", "Heavy"],
];

const practices = [
  {
    title: "Morning Breath",
    duration: "3 min",
    body: "Inhale for four, hold for four, exhale for six. Let calm and clear energy return.",
  },
  {
    title: "Grounding Walk",
    duration: "10 min",
    body: "Walk without proving anything. Notice color, sound, beauty, and the ground beneath you.",
  },
  {
    title: "Body Scan",
    duration: "6 min",
    body: "Move attention from crown to feet. Notice tension, ease, warmth, and aliveness.",
  },
  {
    title: "Gentle Reset",
    duration: "5 min",
    body: "Roll your shoulders, loosen your jaw, stretch slowly, drink water, and begin again with kindness.",
  },
];

const worshipLinks = [
  {
    title: "New Music Friday Christian",
    source: "Apple Music",
    note: "Weekly-updated Christian music for fresh worship and devotional listening.",
    url: "https://music.apple.com/us/playlist/new-music-friday-christian-2026/pl.2e2b0c594da646ff8e2485ca9000d605",
  },
  {
    title: "New Christian Music 2026",
    source: "Spotify",
    note: "A current mix of worship, gospel, Christian pop, rap, and new faith artists.",
    url: "https://open.spotify.com/embed/playlist/6bgT9UQFMOWmoaBizmnnoy",
  },
  {
    title: "Newest Worship Search",
    source: "YouTube",
    note: "A live search for recent worship videos, church songs, and praise playlists.",
    url: "https://www.youtube.com/results?search_query=newest+worship+music+2026",
  },
];

const worshipHighlights = [
  "Peaceful worship for prayer",
  "Joyful praise for movement",
  "New Christian and gospel releases",
  "Songs for church, devotion, and hope",
];

let state = loadState();
let view = "home";
let authNotice = "";

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    const parsed = stored ? JSON.parse(stored) : defaultState;
    const next = { ...defaultState, ...parsed };
    next.gratitudeWall = next.gratitudeWall?.length ? next.gratitudeWall : [seedPost];
    Object.keys(next.users || {}).forEach((email) => {
      next.users[email] = normalizeUser(next.users[email]);
    });
    return next;
  } catch {
    return structuredClone(defaultState);
  }
}

function normalizeUser(user) {
  return {
    name: user.name || "Friend",
    email: user.email || "",
    password: user.password || "",
    remoteUserId: user.remoteUserId || "",
    createdAt: user.createdAt || new Date().toISOString(),
    intention: user.intention || "Live grounded, loved, and whole.",
    focus: user.focus || "Peace",
    journalEntries: user.journalEntries || [],
    moodEntries: user.moodEntries || [],
    completedPractices: user.completedPractices || [],
    bodyNotes: user.bodyNotes || [],
    purposeSteps: user.purposeSteps || [],
    worshipFavorites: user.worshipFavorites || [],
    breathSessions: user.breathSessions || [],
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currentUser() {
  return state.sessionEmail ? state.users[state.sessionEmail] : null;
}

function saveUser(user) {
  state.users[user.email] = normalizeUser(user);
  persist();
  render();
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function html(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function date(value) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function todayKey(value = new Date()) {
  return new Date(value).toISOString().slice(0, 10);
}

function uniqueActivityDates(user) {
  if (!user) return [];
  const dates = [
    ...user.journalEntries,
    ...user.moodEntries,
    ...user.bodyNotes,
    ...user.purposeSteps,
    ...user.worshipFavorites,
    ...user.breathSessions,
  ].map((item) => todayKey(item.createdAt));
  return [...new Set(dates)].sort().reverse();
}

function streakCount(user) {
  const activeDays = new Set(uniqueActivityDates(user));
  let streak = 0;
  const cursor = new Date();
  while (activeDays.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function weeklyActivity(user) {
  const activeDays = new Set(uniqueActivityDates(user));
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const key = todayKey(day);
    return {
      key,
      label: day.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
      active: activeDays.has(key),
    };
  });
}

function remoteAuthEnabled() {
  return Boolean(AUTH_CONFIG.supabaseUrl && AUTH_CONFIG.supabaseAnonKey);
}

function authHeaders() {
  return {
    apikey: AUTH_CONFIG.supabaseAnonKey,
    Authorization: `Bearer ${AUTH_CONFIG.supabaseAnonKey}`,
    "Content-Type": "application/json",
  };
}

function authRedirectUrl() {
  if (AUTH_CONFIG.emailRedirectTo) return AUTH_CONFIG.emailRedirectTo;
  if (location.protocol.startsWith("http")) return `${location.origin}${location.pathname}`;
  return undefined;
}

async function remoteSignUp({ name, email, password }) {
  const redirect = authRedirectUrl();
  const endpoint = `${AUTH_CONFIG.supabaseUrl.replace(/\/$/, "")}/auth/v1/signup${redirect ? `?redirect_to=${encodeURIComponent(redirect)}` : ""}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      email,
      password,
      data: { full_name: name },
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.msg || result.message || "Sign-up failed.");
  return result;
}

async function remoteLogIn({ email, password }) {
  const endpoint = `${AUTH_CONFIG.supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.msg || result.message || "Log-in failed.");
  return result;
}

function render() {
  const user = currentUser();
  applyBackground();
  root.innerHTML = user ? authedTemplate(user) : publicTemplate();
  bindEvents();
}

function applyBackground() {
  const pillar = pillars.find((item) => item.id === view);
  const image = pillar?.image || backgroundImages[view] || backgroundImages.home;
  document.body.style.setProperty("--app-bg-image", `url("${image}")`);
}

function authedTemplate(user) {
  if (view === "home") return homeTemplate(user);
  if (view === "profile") return profileTemplate(user);
  if (view === "worship") return worshipTemplate(user);
  return pillarTemplate(user, view);
}

function publicTemplate() {
  if (view === "home" || view === "profile") return homeTemplate(null);
  if (view === "worship") return worshipTemplate(null);
  return pillarTemplate(null, view);
}

function authTemplate() {
  return `
    <main class="auth-page">
      <section class="auth-copy">
        <p class="eyebrow">Enough</p>
        <h1>Infrastructure for human flourishing.</h1>
        <p>A private wellness space for mind, body, community, purpose, and faith. Create a profile so every reflection, check-in, and practice belongs to you.</p>
      </section>
      <form class="auth-card glass" id="auth-form">
        <div class="brand-mark">Enough</div>
        <div class="segmented" aria-label="Account mode">
          <button type="button" class="active" data-auth-mode="signup">Sign up</button>
          <button type="button" data-auth-mode="login">Log in</button>
        </div>
        <label class="name-field">Full name<input required name="name" autocomplete="name" placeholder="Your name"></label>
        <label>Email<input required type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>
        <label>Password<input required minlength="4" type="password" name="password" autocomplete="current-password" placeholder="Create a password"></label>
        <p class="error" id="auth-error" hidden></p>
        <p class="auth-note" id="auth-note">${remoteAuthEnabled() ? "Sign-up will send a verification email." : "Email sending is ready to connect. Add Supabase keys in src/app.js to turn on verification emails."}</p>
        <button class="primary" type="submit"><span id="auth-submit-label">Create My Profile</span></button>
      </form>
    </main>`;
}

function accountPanel() {
  return `
    <section class="homepage-account glass" id="create-profile">
      <div>
        <p class="eyebrow">Free profile</p>
        <h2>Save the work that helps you become happy, grounded, and whole.</h2>
        <p>Create a profile from the homepage. Then every journal entry, mood check-in, body note, gratitude post, and purpose step saves for that individual user.</p>
      </div>
      <form class="auth-card compact-auth" id="auth-form">
        <div class="segmented" aria-label="Account mode">
          <button type="button" class="active" data-auth-mode="signup">Sign up</button>
          <button type="button" data-auth-mode="login">Log in</button>
        </div>
        <label class="name-field">Full name<input required name="name" autocomplete="name" placeholder="Your name"></label>
        <label>Email<input required type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>
        <label>Password<input required minlength="4" type="password" name="password" autocomplete="current-password" placeholder="Create a password"></label>
        <p class="error" id="auth-error" hidden></p>
        <p class="auth-note" id="auth-note">${authNotice || (remoteAuthEnabled() ? "Sign-up will send a verification email." : "Email sending is ready to connect. Add Supabase keys in src/app.js to turn on verification emails.")}</p>
        <button class="primary" type="submit"><span id="auth-submit-label">Create My Profile</span></button>
      </form>
    </section>`;
}

function homeTemplate(user) {
  const latestMood = user?.moodEntries.at(-1)?.mood || "Not checked in";
  const latestEntry = user?.journalEntries[0];
  return `
    <main class="shell">
      ${topBar(user)}
      <section class="home-hero">
        <div>
          <p class="eyebrow">${user ? "Welcome home" : "Wellness for real life"}</p>
          <h1>${user ? `Hi, ${html(user.name)}.` : "Your pursuit of happiness, made practical."}</h1>
          <p>${user ? `You are enough. ${html(user.intention)}` : "You are enough. Build peace, joy, faith, purpose, and healthy habits in one free space that saves your progress."}</p>
        </div>
        ${user ? `<button class="profile-button" data-view="profile">Profile</button>` : `<a class="profile-button" href="#create-profile">Create profile</a>`}
      </section>
      <section class="profile-strip">
        ${metric("Saved entries", user?.journalEntries.length || 0)}
        ${metric("Latest mood", latestMood)}
        ${metric("Practices", user?.completedPractices.length || 0)}
        ${metric("App", "Free")}
      </section>
      ${user ? eliteDashboard(user) : publicPremiumPreview()}
      ${user ? profileActivePanel(user) : accountPanel()}
      <section class="daily-panel glass">
        <div>
          <p class="eyebrow">Today</p>
          <h2>Your wellness board</h2>
          <p class="support-copy">${latestEntry ? `Last saved: ${html(latestEntry.title)}` : user ? "Choose a pillar below. Write, check in, complete practices, and everything saves to this profile." : "Explore the pillars below. When you write or check in, the app will ask you to create a free profile so it can save for you."}</p>
        </div>
        <button class="primary" data-view="mind">Start With Mind</button>
      </section>
      ${breathResetPanel(user)}
      ${worshipHomeSection(user)}
      <nav class="pillar-grid" aria-label="ENOUGH pillars">
        ${pillars.map(pillarCard).join("")}
      </nav>
    </main>`;
}

function eliteDashboard(user) {
  const streak = streakCount(user);
  const week = weeklyActivity(user);
  const completion = Math.min(100, Math.round((
    (user.journalEntries.length ? 1 : 0) +
    (user.moodEntries.length ? 1 : 0) +
    (user.completedPractices.length ? 1 : 0) +
    (user.purposeSteps.length ? 1 : 0) +
    (user.worshipFavorites.length ? 1 : 0)
  ) / 5 * 100));
  return `
    <section class="elite-dashboard glass">
      <div class="score-orb" style="--score:${completion}%">
        <strong>${completion}</strong>
        <span>whole-self score</span>
      </div>
      <div>
        <p class="eyebrow">Personal intelligence</p>
        <h2>Your pursuit map</h2>
        <p>Enough is tracking your rituals, reflections, mood check-ins, worship saves, and body notes so your growth is visible.</p>
        <div class="week-row">
          ${week.map((day) => `<span class="${day.active ? "active" : ""}">${day.label}</span>`).join("")}
        </div>
      </div>
      <div class="ritual-stack">
        <article><span>Current streak</span><strong>${streak} day${streak === 1 ? "" : "s"}</strong></article>
        <article><span>Breath resets</span><strong>${user.breathSessions.length}</strong></article>
        <article><span>Focus</span><strong>${html(user.focus)}</strong></article>
      </div>
    </section>
    <section class="ritual-path">
      <button data-view="mind"><span>1</span><strong>Write</strong><small>Clear the mind</small></button>
      <button data-view="community"><span>2</span><strong>Check in</strong><small>Name the heart</small></button>
      <button data-view="body"><span>3</span><strong>Practice</strong><small>Return to body</small></button>
      <button data-view="worship"><span>4</span><strong>Worship</strong><small>Anchor in hope</small></button>
    </section>`;
}

function publicPremiumPreview() {
  return `
    <section class="elite-dashboard glass">
      <div class="score-orb" style="--score:72%">
        <strong>Free</strong>
        <span>profile insights</span>
      </div>
      <div>
        <p class="eyebrow">Elite wellness flow</p>
        <h2>Your growth becomes visible.</h2>
        <p>Create a profile to unlock personal streaks, weekly ritual history, breath resets, saved worship, and private reflection intelligence.</p>
      </div>
      <div class="ritual-stack">
        <article><span>Mind</span><strong>Journal</strong></article>
        <article><span>Body</span><strong>Practice</strong></article>
        <article><span>Spirit</span><strong>Worship</strong></article>
      </div>
    </section>`;
}

function breathResetPanel(user) {
  return `
    <section class="breath-panel glass">
      <div>
        <p class="eyebrow">Guided reset</p>
        <h2>60-second calm reset</h2>
        <p>Use this before journaling, after stress, or anytime you want to return to peace.</p>
      </div>
      <div class="breath-orb" id="breath-orb">
        <strong id="breath-count">60</strong>
        <span id="breath-label">${user ? "Ready to save" : "Try it free"}</span>
      </div>
      <button class="primary" id="start-breath" type="button">Start Reset</button>
    </section>`;
}

function worshipHomeSection(user) {
  return `
    <section class="worship-preview glass">
      <div>
        <p class="eyebrow">Church songs</p>
        <h2>Newest worship music for peace, praise, and purpose.</h2>
        <p>Give users a place to listen, discover new worship, and save songs that support their pursuit of happiness.</p>
      </div>
      <button class="primary" data-view="worship">${user ? "Open Worship" : "Explore Worship"}</button>
    </section>`;
}

function profileActivePanel(user) {
  return `
    <section class="free-access glass">
      <p class="eyebrow">Profile active</p>
      <h2>${html(user.name)}, this app is saving for you.</h2>
      <p>No subscription is required. Use New profile or Log out at the top to return to sign up. Each person gets their own saved space on this device.</p>
    </section>`;
}

function topBar(user) {
  return `
    <header class="topbar">
      <button class="wordmark" data-home>Enough</button>
      <div class="top-actions">
        ${user ? `<span>${html(user.name)}</span>
          <button class="icon-button" data-new-profile aria-label="Create a new profile" title="Create a new profile">New profile</button>
          <button class="icon-button" data-logout aria-label="Log out" title="Log out">Log out</button>`
        : `<a class="icon-button" href="#create-profile">Sign up</a>`}
        <a class="legal-link" href="./privacy.html">Privacy</a>
        <a class="legal-link" href="./terms.html">Terms</a>
      </div>
    </header>`;
}

function metric(label, value) {
  return `<article><span>${label}</span><strong>${html(value)}</strong></article>`;
}

function pillarCard(pillar) {
  return `
    <button class="pillar-card" data-view="${pillar.id}">
      <img src="${pillar.image}" alt="">
      <span>${pillar.kicker}</span>
      <strong>${pillar.title}</strong>
      <small>${pillar.line}</small>
    </button>`;
}

function profileTemplate(user) {
  const joined = date(user.createdAt);
  const userPosts = state.gratitudeWall.filter((post) => post.email === user.email).length;
  return `
    <main class="shell">
      ${topBar(user)}
      <section class="section-heading">
        <button class="back-link" data-home>Back</button>
        <p class="eyebrow">Private profile</p>
        <h1>${html(user.name)}'s space</h1>
        <p>This is the individual profile layer. Each account keeps its own journal, moods, practices, purpose steps, and profile settings on this device.</p>
      </section>
      <section class="profile-layout">
        <form class="glass profile-form" id="profile-form">
          <label>Name<input name="name" required value="${html(user.name)}"></label>
          <label>Current focus<input name="focus" value="${html(user.focus)}" placeholder="Peace, confidence, healing..."></label>
          <label>Personal intention<textarea name="intention">${html(user.intention)}</textarea></label>
          <button class="primary" type="submit">Save Profile</button>
        </form>
        <aside class="glass profile-summary">
          ${metric("Member since", joined)}
          ${metric("Mood check-ins", user.moodEntries.length)}
          ${metric("Community posts", userPosts)}
          ${metric("Saved songs", user.worshipFavorites.length)}
          ${metric("App", "Free")}
        </aside>
      </section>
      <section class="free-access glass">
        <p class="eyebrow">Free app</p>
        <h2>Everything here is included</h2>
        <p>No one has to subscribe. Each user can create a profile and save their own journal entries, mood check-ins, body notes, gratitude posts, and purpose steps on this device.</p>
      </section>
    </main>`;
}

function worshipTemplate(user) {
  return `
    <main class="shell">
      ${topBar(user)}
      <section class="section-heading">
        <button class="back-link" data-home>Back</button>
        <p class="eyebrow">Church songs</p>
        <h1>Worship music</h1>
        <p>Fresh worship, gospel, and Christian music for prayer, joy, gratitude, healing, and the pursuit of happiness.</p>
      </section>
      <section class="worship-layout">
        <section class="glass panel">
          <p class="eyebrow">Listen now</p>
          <h2>Newest worship sources</h2>
          <div class="listen-grid">
            ${worshipLinks.map((link) => `
              <article class="listen-card">
                <span>${link.source}</span>
                <h3>${link.title}</h3>
                <p>${link.note}</p>
                <a class="secondary" href="${link.url}" target="_blank" rel="noopener noreferrer">Open</a>
              </article>
            `).join("")}
          </div>
        </section>
        ${user ? worshipSaveTemplate(user) : accountPanel()}
        <section class="glass panel wide">
          <p class="eyebrow">Use it for</p>
          <div class="highlight-row">
            ${worshipHighlights.map((item) => `<span>${item}</span>`).join("")}
          </div>
        </section>
      </section>
    </main>`;
}

function worshipSaveTemplate(user) {
  return `
    <form class="glass panel" id="worship-form">
      <p class="eyebrow">Save to profile</p>
      <h2>Your worship list</h2>
      <label>Song or playlist name<input name="title" required placeholder="Song, artist, or playlist"></label>
      <label>Link<input name="url" type="url" placeholder="Spotify, Apple Music, YouTube..."></label>
      <label>Why it helps<textarea name="note" placeholder="Peace, gratitude, joy, hope, prayer..."></textarea></label>
      <button class="primary" type="submit">Save Worship</button>
      <div class="entry-list">
        ${user.worshipFavorites.length ? user.worshipFavorites.map((item) => `
          <article class="entry">
            <span>${date(item.createdAt)}</span>
            <h3>${html(item.title)}</h3>
            <p>${html(item.note || "Saved for worship.")}</p>
            ${item.url ? `<footer><a href="${html(item.url)}" target="_blank" rel="noopener noreferrer">Open saved link</a></footer>` : ""}
          </article>
        `).join("") : emptyTemplate("Save songs and playlists that help you feel close to God, hopeful, peaceful, and alive.")}
      </div>
    </form>`;
}

function pillarTemplate(user, id) {
  const pillar = pillars.find((item) => item.id === id);
  return `
    <main>
      <header class="pillar-hero">
        <img src="${pillar.image}" alt="">
        <div class="hero-shade"></div>
        <button class="back-button" data-home aria-label="Back home">Back</button>
        <div class="hero-copy">
          <p class="eyebrow">${pillar.kicker}</p>
          <h1>${pillar.title}</h1>
          <p>${pillar.line}</p>
        </div>
      </header>
      <section class="content">${pillarTool(user, id)}</section>
    </main>`;
}

function pillarTool(user, id) {
  if (!user) return signedOutPillarTemplate(id);
  if (id === "body") return bodyTemplate(user);
  if (id === "community") return communityTemplate(user);
  if (id === "purpose") return `${journalTemplate(user, "purpose")}${purposeStepsTemplate(user)}`;
  return journalTemplate(user, id);
}

function signedOutPillarTemplate(id) {
  const pillar = pillars.find((item) => item.id === id);
  const message = id === "community"
    ? "Check in with peaceful, happy, grateful, grounded, hopeful, loved, tender, or heavy. Create a profile so the app can save your emotional history."
    : id === "body"
      ? "Complete calming and energizing practices, then save body notes to your profile."
      : "Write here for clarity, peace, joy, gratitude, purpose, and healing. Create a profile so your words can save privately.";
  return `
    <section class="tool-grid">
      <section class="glass panel">
        <p class="eyebrow">${pillar.kicker}</p>
        <h2>${pillar.title} tools save to your profile</h2>
        <p class="support-copy">${message}</p>
        <button class="primary" data-home>Go to homepage sign up</button>
      </section>
      ${accountPanel()}
    </section>`;
}

function journalTemplate(user, pillar) {
  const title = pillar === "mind" ? "Private journal" : pillar === "faith" ? "Reflection space" : "Purpose reflection";
  const intro = pillar === "mind"
    ? "This is not only for hard days. Save peaceful thoughts, happy moments, clear wins, and what helped your mind feel lighter."
    : pillar === "faith"
      ? "Write gratitude, hope, wonder, prayer, questions, and moments when you felt held."
      : "Capture what gives you joy, meaning, confidence, direction, and a reason to keep building.";
  const entries = user.journalEntries.filter((entry) => entry.pillar === pillar);
  return `
    <section class="tool-grid">
      <form class="glass panel" id="journal-form" data-pillar="${pillar}">
        <p class="eyebrow">Write and save</p>
        <h2>${title}</h2>
        <p class="support-copy">${intro}</p>
        <label>Prompt<select name="prompt">${prompts[pillar].map((prompt) => `<option>${html(prompt)}</option>`).join("")}</select></label>
        <label>Title<input name="title" placeholder="Optional title"></label>
        <label>Your words<textarea name="content" required placeholder="Type here. This saves to ${html(user.name)}'s profile."></textarea></label>
        <button class="primary" type="submit">Save Entry</button>
      </form>
      <section class="saved-column">
        <p class="eyebrow">Saved to profile</p>
        <div class="entry-list">${entries.length ? entries.map(entryTemplate).join("") : emptyTemplate("No saved entries here yet.")}</div>
      </section>
    </section>`;
}

function entryTemplate(entry) {
  return `
    <article class="entry">
      <span>${date(entry.createdAt)}</span>
      <h3>${html(entry.title)}</h3>
      <p>${html(entry.content)}</p>
    </article>`;
}

function emptyTemplate(text) {
  return `<div class="empty"><strong>Quiet for now</strong><p>${text}</p></div>`;
}

function bodyTemplate(user) {
  return `
    <section class="tool-grid">
      <div class="glass panel">
        <p class="eyebrow">Daily practices</p>
        <h2>Choose what supports you</h2>
        <p class="support-copy">Body work can be joyful too. Track calm, energy, confidence, rest, strength, and ease.</p>
        <div class="practice-list">
          ${practices.map((practice) => {
            const done = user.completedPractices.includes(practice.title);
            return `
              <button class="practice ${done ? "done" : ""}" data-practice="${html(practice.title)}">
                <span>${done ? "Done" : "Start"}</span>
                <strong>${practice.title}</strong>
                <small>${practice.duration}</small>
                <p>${practice.body}</p>
              </button>`;
          }).join("")}
        </div>
      </div>
      <form class="glass panel" id="body-note-form">
        <p class="eyebrow">Body note</p>
        <h2>Track how you feel</h2>
        <label>What shifted?<textarea name="content" required placeholder="After a walk, breath, stretch, meal, rest... what do you notice?"></textarea></label>
        <button class="primary" type="submit">Save Body Note</button>
      </form>
      <section class="saved-column wide">
        <p class="eyebrow">Body history</p>
        <div class="entry-list">${user.bodyNotes.length ? user.bodyNotes.map(entryTemplate).join("") : emptyTemplate("Your body notes and completed practices will collect here.")}</div>
      </section>
    </section>`;
}

function communityTemplate(user) {
  const myMoods = user.moodEntries.slice().reverse().slice(0, 6);
  return `
    <section class="tool-grid">
      <form class="glass panel" id="mood-form">
        <p class="eyebrow">Check in</p>
        <h2>How is your heart today?</h2>
        <p class="support-copy">Notice the good too. Peace, joy, gratitude, and love belong here.</p>
        <div class="mood-row">${moods.map(([value, label]) => `<button type="button" data-mood="${value}">${label}</button>`).join("")}</div>
        <label>Note, optional<textarea name="note" placeholder="What helped you feel this way?"></textarea></label>
        <button class="primary" type="submit">Save Mood</button>
      </form>
      <form class="glass panel" id="gratitude-form">
        <p class="eyebrow">Share gratitude</p>
        <h2>Gratitude wall</h2>
        <label>Your gratitude<textarea name="content" required placeholder="What are you grateful for today?"></textarea></label>
        <button class="primary" type="submit">Share Gratitude</button>
      </form>
      <section class="saved-column">
        <p class="eyebrow">Your recent moods</p>
        <div class="mood-history">${myMoods.length ? myMoods.map((mood) => `<article><strong>${html(mood.mood)}</strong><span>${date(mood.createdAt)}</span><p>${html(mood.note || "")}</p></article>`).join("") : emptyTemplate("Save your first heart check-in.")}</div>
      </section>
      <section class="saved-column wide">
        <p class="eyebrow">Community gratitude</p>
        <div class="entry-list">${state.gratitudeWall.map((post) => `
          <article class="entry">
            <p>${html(post.content)}</p>
            <footer><span>${html(post.author)} · ${date(post.createdAt)}</span><button data-heart="${post.id}">Love ${post.hearts}</button></footer>
          </article>`).join("")}</div>
      </section>
    </section>`;
}

function purposeStepsTemplate(user) {
  return `
    <section class="tool-grid purpose-block">
      <form class="glass panel" id="purpose-step-form">
        <p class="eyebrow">Purpose action</p>
        <h2>Turn meaning into one step</h2>
        <label>Next right step<input name="title" required placeholder="Call someone, apply, rest, create..."></label>
        <label>Why it matters<textarea name="content" placeholder="Connect the action to your deeper why."></textarea></label>
        <button class="primary" type="submit">Save Step</button>
      </form>
      <section class="saved-column">
        <p class="eyebrow">Purpose steps</p>
        <div class="entry-list">${user.purposeSteps.length ? user.purposeSteps.map(entryTemplate).join("") : emptyTemplate("Save one meaningful step and build from there.")}</div>
      </section>
    </section>`;
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    view = button.dataset.view;
    render();
  }));
  document.querySelectorAll("[data-home]").forEach((button) => button.addEventListener("click", () => {
    view = "home";
    render();
  }));
  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    state.sessionEmail = "";
    view = "home";
    persist();
    render();
  });
  document.querySelector("[data-new-profile]")?.addEventListener("click", () => {
    state.sessionEmail = "";
    view = "home";
    persist();
    render();
  });
  bindAuth();
  bindProfile();
  bindJournal();
  bindBody();
  bindCommunity();
  bindPurpose();
  bindWorship();
  bindBreathReset();
}

function bindAuth() {
  const form = document.getElementById("auth-form");
  if (!form) return;
  let mode = "signup";
  const nameField = document.querySelector(".name-field");
  const nameInput = form.elements.name;
  const label = document.getElementById("auth-submit-label");
  const error = document.getElementById("auth-error");

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.authMode;
      document.querySelectorAll("[data-auth-mode]").forEach((item) => item.classList.toggle("active", item === button));
      nameField.hidden = mode === "login";
      nameInput.required = mode === "signup";
      label.textContent = mode === "signup" ? "Create My Profile" : "Enter My Space";
      error.hidden = true;
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type='submit']");
    const note = document.getElementById("auth-note");
    const data = Object.fromEntries(new FormData(form));
    const email = data.email.trim().toLowerCase();
    const existing = state.users[email];
    error.hidden = true;
    if (submit) submit.disabled = true;
    if (note) note.textContent = mode === "signup" && remoteAuthEnabled() ? "Creating profile and sending verification email..." : "Checking profile...";

    try {
      if (mode === "signup") {
        if (existing) return showError(error, "That email already has an account.");
        let remoteUserId = "";
        if (remoteAuthEnabled()) {
          const remote = await remoteSignUp({ name: data.name.trim(), email, password: data.password });
          remoteUserId = remote.user?.id || "";
          authNotice = "Verification email sent. Check your inbox, then return here to continue.";
        } else {
          authNotice = "Profile created locally. Add Supabase keys in src/app.js when you are ready for real verification emails.";
        }
        state.users[email] = normalizeUser({
          name: data.name.trim(),
          email,
          password: data.password,
          remoteUserId,
          createdAt: new Date().toISOString(),
        });
        state.sessionEmail = email;
      } else {
        if (remoteAuthEnabled()) {
          const remote = await remoteLogIn({ email, password: data.password });
          if (!state.users[email]) {
            state.users[email] = normalizeUser({
              name: remote.user?.user_metadata?.full_name || email.split("@")[0],
              email,
              password: data.password,
              remoteUserId: remote.user?.id || "",
              createdAt: new Date().toISOString(),
            });
          }
        } else if (!existing || existing.password !== data.password) {
          return showError(error, "Email or password is not right.");
        }
        state.sessionEmail = email;
        authNotice = "";
      }
      persist();
      render();
    } catch (authError) {
      showError(error, authError.message || "Auth failed. Check your settings and try again.");
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}

function bindProfile() {
  document.getElementById("profile-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = currentUser();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    user.name = data.name.trim();
    user.focus = data.focus.trim() || "Peace";
    user.intention = data.intention.trim() || "Live grounded, loved, and whole.";
    saveUser(user);
  });
}

function bindJournal() {
  document.getElementById("journal-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = currentUser();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    user.journalEntries.unshift({
      id: uid(),
      pillar: event.currentTarget.dataset.pillar,
      prompt: data.prompt,
      title: data.title.trim() || data.prompt,
      content: data.content.trim(),
      createdAt: new Date().toISOString(),
    });
    saveUser(user);
  });
}

function bindBody() {
  document.querySelectorAll("[data-practice]").forEach((button) => button.addEventListener("click", () => {
    const user = currentUser();
    const practice = button.dataset.practice;
    user.completedPractices = user.completedPractices.includes(practice)
      ? user.completedPractices.filter((item) => item !== practice)
      : [...user.completedPractices, practice];
    saveUser(user);
  }));
  document.getElementById("body-note-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = currentUser();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    user.bodyNotes.unshift({
      id: uid(),
      title: "Body note",
      content: data.content.trim(),
      createdAt: new Date().toISOString(),
    });
    saveUser(user);
  });
}

function bindCommunity() {
  const moodForm = document.getElementById("mood-form");
  if (moodForm) {
    let selectedMood = "";
    document.querySelectorAll("[data-mood]").forEach((button) => button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      document.querySelectorAll("[data-mood]").forEach((item) => item.classList.toggle("active", item === button));
    }));
    moodForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!selectedMood) return;
      const user = currentUser();
      const data = Object.fromEntries(new FormData(moodForm));
      user.moodEntries.push({
        id: uid(),
        mood: selectedMood,
        note: data.note.trim(),
        createdAt: new Date().toISOString(),
      });
      saveUser(user);
    });
  }

  document.getElementById("gratitude-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const user = currentUser();
    state.gratitudeWall.unshift({
      id: uid(),
      email: user.email,
      author: user.name,
      content: data.content.trim(),
      createdAt: new Date().toISOString(),
      hearts: 0,
    });
    persist();
    render();
  });

  document.querySelectorAll("[data-heart]").forEach((button) => button.addEventListener("click", () => {
    state.gratitudeWall = state.gratitudeWall.map((post) => post.id === button.dataset.heart ? { ...post, hearts: post.hearts + 1 } : post);
    persist();
    render();
  }));
}

function bindPurpose() {
  document.getElementById("purpose-step-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = currentUser();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    user.purposeSteps.unshift({
      id: uid(),
      title: data.title.trim(),
      content: data.content.trim() || "A meaningful next step.",
      createdAt: new Date().toISOString(),
    });
    saveUser(user);
  });
}

function bindWorship() {
  document.getElementById("worship-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = currentUser();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    user.worshipFavorites.unshift({
      id: uid(),
      title: data.title.trim(),
      url: data.url.trim(),
      note: data.note.trim(),
      createdAt: new Date().toISOString(),
    });
    saveUser(user);
  });
}

function bindBreathReset() {
  const button = document.getElementById("start-breath");
  const count = document.getElementById("breath-count");
  const label = document.getElementById("breath-label");
  const orb = document.getElementById("breath-orb");
  if (!button || !count || !label || !orb) return;

  button.addEventListener("click", () => {
    let remaining = 60;
    button.disabled = true;
    button.textContent = "Reset in progress";
    orb.classList.add("active");
    count.textContent = String(remaining);
    label.textContent = "Inhale";

    const timer = setInterval(() => {
      remaining -= 1;
      count.textContent = String(Math.max(remaining, 0));
      const phase = remaining % 12;
      label.textContent = phase > 7 ? "Inhale" : phase > 4 ? "Hold" : "Exhale";

      if (remaining <= 0) {
        clearInterval(timer);
        orb.classList.remove("active");
        count.textContent = "Done";
        button.disabled = false;
        button.textContent = "Start Again";

        const user = currentUser();
        if (!user) {
          label.textContent = "Create a profile to save";
          return;
        }

        user.breathSessions.unshift({
          id: uid(),
          title: "60-second calm reset",
          createdAt: new Date().toISOString(),
        });
        saveUser(user);
      }
    }, 1000);
  });
}

function showError(node, message) {
  node.textContent = message;
  node.hidden = false;
}

render();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .then(() => caches?.keys?.())
    .then((keys) => Promise.all((keys || []).map((key) => caches.delete(key))))
    .catch(() => {});
}
