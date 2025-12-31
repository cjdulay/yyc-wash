// --- 1. UI NAVIGATION ---
function toggleLogicLayers() {
    const info = document.getElementById('logic-info');
    if (info.style.display === 'block') {
        info.style.display = 'none';
        switchLayer('layer-logic');
    } else {
        info.style.display = 'block';
    }
}

function switchLayer(targetId) {
    const layer1 = document.getElementById('layer-logic');
    const layer2 = document.getElementById('layer-physics');
    if (layer1 && layer2) {
        layer1.style.display = (targetId === 'layer-logic') ? 'block' : 'none';
        layer2.style.display = (targetId === 'layer-physics') ? 'block' : 'none';
    }
}

function toggleElement(id) {
    const target = document.getElementById(id);
    if (target) target.style.display = target.style.display === 'block' ? 'none' : 'block';
}

// --- 2. INSIGHTS ---
const yycInsights = [
  "<b>HYBRID TIP:</b> At -19°C, regen braking is limited until cells warm up.",
  "<b>WIPER TIP:</b> Wipe blades with winter fluid after a wash to prevent bonding.",
  "<b>FLUID TIP:</b> Only use -40°C rated fluid in Calgary snaps.",
  "<b>YYC FACT:</b> 'Pickle' is 97% gravel. Salt is inert below -15°C.",
  "<b>CHINOOK FACT:</b> A rapid thaw creates 'Active Slush'—the most corrosive state.",
  "<b>LOCK TIP:</b> Avoid high-pressure spray into door handles at -15°C.",
  "<b>GARAGE WARNING:</b> Heated garages 'wake up' frozen salt. Rusting is 10x faster.",
  "<b>MAG-CHLORIDE FACT:</b> Deerfoot brine is more corrosive than rock salt.",
  "<b>DOOR SEAL HACK:</b> Use silicone lubricant on weatherstripping after a wash.",
  "<b>CHINOOK CAUTION:</b> Rapid 20°C rises can 'pop' existing windshield chips."
];

// --- 3. WASH LOGGING (V2 PROTECTED) ---
const LOG_KEY = 'washLogV2';

function addNewWash() {
  let h = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  h.unshift(new Date().toISOString());
  if (h.length > 5) h.pop();
  localStorage.setItem(LOG_KEY, JSON.stringify(h));
  updateUI();
  if (navigator.vibrate) navigator.vibrate(25);
}

function undoWash() {
  let h = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  if (h.length > 0) { h.shift(); localStorage.setItem(LOG_KEY, JSON.stringify(h)); updateUI(); }
}

function updateUI() {
  // DATA RECOVERY MIGRATION
  if (!localStorage.getItem(LOG_KEY)) {
    const backupKeys = ['washLogV1', 'washLog', 'yycWashLog'];
    for (const bk of backupKeys) {
      const data = localStorage.getItem(bk);
      if (data) { localStorage.setItem(LOG_KEY, data); break; }
    }
  }

  const h = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  const list = document.getElementById('log-list'), lastDate = document.getElementById('last-date');
  const nag = document.getElementById('maintenance-nag'), fBox = document.getElementById('random-fact');
  const prompt = document.getElementById('log-reminder-prompt');

  if (prompt) prompt.style.display = (h.length === 0) ? 'flex' : 'none';
  if (fBox) fBox.innerHTML = yycInsights[Math.floor(Math.random() * yycInsights.length)];

  if (h.length > 0) {
    const dLast = new Date(h[0]);
    lastDate.innerText = dLast.toLocaleDateString('en-CA', {month:'short', day:'numeric'});
    list.innerHTML = h.map((item, idx) => `
      <div style="padding:6px 0; border-bottom:1px solid #334155; display:flex; justify-content:space-between;">
        <span>📅 ${new Date(item).toLocaleDateString('en-CA', {month:'short', day:'numeric'})}</span>
        ${idx === 0 ? '<span onclick="undoWash()" style="color:#f43f5e; cursor:pointer;">Undo</span>' : ''}
      </div>`).join('');
  } else {
    lastDate.innerText = "Setup Required";
  }
}

// --- 4. WEATHER ENGINE ---
async function updateWeather(isFullRefresh = true) {
  if (isFullRefresh) document.getElementById('sync-tag').innerText = "YYC SENSOR • SYNCING...";
  const url = "https://api.open-meteo.com/v1/forecast?latitude=51.05&longitude=-114.07&daily=temperature_2m_max,precipitation_sum&hourly=precipitation,temperature_2m,wind_speed_10m&timezone=America/Edmonton&past_days=5";
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const todayIdx = 5, curHr = (todayIdx * 24) + new Date().getHours(); 
    const curTemp = data.hourly.temperature_2m[curHr], wind = data.hourly.wind_speed_10m[curHr];
    const isStrict = document.getElementById('risk-toggle')?.checked ?? true;
    const isHighVoltage = document.getElementById('ev-toggle')?.checked ?? false;

    // Road Wetness
    let hadMelt = false, totalPrec = 0;
    for (let i = 0; i <= todayIdx; i++) {
        if (data.daily.temperature_2m_max[i] > 0) hadMelt = true;
        totalPrec += (data.daily.precipitation_sum[i] || 0);
    }
    const roadsFreezeDried = (curTemp < -8 && wind > 18);
    const effectiveWetness = (hadMelt || totalPrec > 0.1) && !roadsFreezeDried;

    // Verdict
    let vText = "WAIT", vCol = "var(--accent)", status = "🔵 NEUTRAL";
    if (curTemp < -12) { vText = "NO GO: FREEZE RISK"; vCol = "var(--blue)"; status = "❄️ TOO COLD"; }
    else if (effectiveWetness || (curTemp > -5 && curTemp < 3)) { vText = "WAIT: SALTY SLUSH"; vCol = "#92400e"; status = "🚜 ROADS ARE MESSY"; }
    else if (curTemp > -6) { vText = "GO: MAINTENANCE WINDOW"; vCol = "var(--green)"; status = "🚿 WASH NOW"; }

    document.getElementById('final-verdict').innerText = vText;
    document.getElementById('final-verdict').style.backgroundColor = vCol;
    document.body.style.backgroundColor = vCol;
    document.getElementById('status-badge').innerText = status;
    document.getElementById('cur-temp-display').innerText = Math.round(curTemp) + "°C Currently";

    // Adaptive Banners
    const setDisp = (id, cond) => { const el = document.getElementById(id); if (el) el.style.display = cond ? 'flex' : 'none'; };
    setDisp('plugin-alert', curTemp <= -20);
    setDisp('regen-alert', isHighVoltage && curTemp <= -15);
    setDisp('fluid-alert', curTemp < -8 && curTemp > -18);
    setDisp('chip-alert', curTemp < -14);
    setDisp('rust-alert', (curTemp > -5 && curTemp < 3 && effectiveWetness));
    if (curTemp < 0) {
        let fT = Math.max(3, Math.round(20 + (curTemp * 1.5) - (wind * 0.4)));
        document.getElementById('freeze-val').innerText = `${fT} MIN UNTIL FREEZE ▼`;
        setDisp('freeze-alert', true);
    } else { setDisp('freeze-alert', false); }

    // Strategic Opening
    let finalIdx = todayIdx;
    for (let k = todayIdx; k < data.daily.time.length; k++) {
      if (data.daily.temperature_2m_max[k] > -6 && (data.daily.precipitation_sum[k] || 0) < 0.1) {
        finalIdx = k; break;
      }
    }
    document.getElementById('next-val').innerText = data.daily.time[finalIdx];

    // Corrosion Speedometer
    const needle = document.getElementById('corrosion-needle');
    const desc = document.getElementById('corrosion-desc');
    if (needle) {
      let risk = curTemp <= -15 ? 5 : curTemp < 0 ? 65 : 100;
      if (!effectiveWetness && curTemp < 0) risk *= 0.4;
      needle.style.left = `${risk}%`;
      desc.innerText = risk < 20 ? "DORMANT" : risk < 70 ? "ACTIVE" : "CRITICAL";
    }

    updateUI();
    document.getElementById('card').style.display = 'block';
    if (isFullRefresh) document.getElementById('sync-tag').innerText = "YYC UPDATED";
  } catch (e) { console.error(e); }
}

// --- 5. INIT ---
function saveProfile() {
  localStorage.setItem('isEV', document.getElementById('ev-toggle').checked);
  localStorage.setItem('isStrict', document.getElementById('risk-toggle').checked);
  updateWeather(false); 
}
document.getElementById('ev-toggle').checked = localStorage.getItem('isEV') === 'true';
document.getElementById('risk-toggle').checked = localStorage.getItem('isStrict') !== 'false';
updateWeather();

// --- 6. GESTURES ---
let touchStartY = 0;
const card = document.getElementById('card');
document.addEventListener('touchstart', e => { touchStartY = e.touches[0].pageY; }, {passive: true});
document.addEventListener('touchmove', e => {
    const distance = e.touches[0].pageY - touchStartY;
    if (card.scrollTop === 0 && distance > 0) card.style.transform = `translateY(${Math.min(distance / 5, 30)}px)`;
}, {passive: true});
document.addEventListener('touchend', e => {
    const distance = e.changedTouches[0].pageY - touchStartY;
    if (card.scrollTop === 0 && distance > 150) {
        card.classList.add('syncing');
        updateWeather().then(() => { card.classList.remove('syncing'); card.style.transform = "translateY(0)"; });
    } else card.style.transform = "translateY(0)";
}, {passive: true});
