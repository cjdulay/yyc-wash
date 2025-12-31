
// --- 1. UI NAVIGATION & LAYERS ---
function toggleElement(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const isOpening = target.style.display !== 'block';
    
    // Define IDs that are nested inside other drawers
    const internalIDs = ['ev-info', 'strict-info', 'window-info'];
    const isInternal = internalIDs.includes(id);

    // 1. Only close main drawers if the new ID is a main drawer
    if (!isInternal) {
        const mainDrawers = document.querySelectorAll('.drawer, .info-drawer, .alert-drawer, #logic-info');
        mainDrawers.forEach(d => d.style.display = 'none');

        // Reset the Gold Glow on all tiles
        document.querySelectorAll('.tile, .tile-wide, .banner').forEach(el => {
            el.classList.remove('active-tile');
        });
    } else {
        // If it's an 'i' info panel, only close other 'i' panels
        document.querySelectorAll('.info-drawer').forEach(d => {
            if (d.id !== id) d.style.display = 'none';
        });
    }

    // 2. Toggle the selected element
    if (isOpening) {
        target.style.display = 'block';
        
        // 3. Apply Gold Glow only to the main Tile/Banner parents
        if (!isInternal) {
            document.querySelectorAll('.tile, .tile-wide, .banner').forEach(parent => {
                if (parent.getAttribute('onclick')?.includes(id) || 
                    parent.querySelector('[onclick*="' + id + '"]')) {
                    parent.classList.add('active-tile');
                }
            });
            if (id === 'logic-info') document.querySelector('.tile-wide')?.classList.add('active-tile');
        }

        // 4. Scroll to view
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        target.style.display = 'none';
    }
}

 
function toggleLogicLayers() {
    toggleElement('logic-info');
    if (document.getElementById('logic-info').style.display === 'block') {
        switchLayer('layer-logic');
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



// --- 2. ASSETS & INSIGHTS ---
const yycInsights = [
  "<b>HYBRID TIP:</b> At -19\u00B0C, regen braking is limited because the BMS restricts power intake until the cells warm up.",
  "<b>WIPER TIP:</b> Wipe blades with winter fluid after a wash. This removes residue that causes them to freeze to the windshield.",
  "<b>FLUID TIP:</b> Only use washer fluid rated for -40\u00B0C. Summer fluids will freeze and crack your reservoir in a Calgary snap.",
  "<b>YYC FACT:</b> 'Pickle' mixture is 97% gravel and 3% salt. Salt is inert below -15\u00B0C, making sand the primary grip provider.",
  "<b>CHINOOK FACT:</b> A rapid thaw creates 'Active Slush'\u2014the most corrosive road state. Wait for dry roads before washing.",
  "<b>LOCK TIP:</b> Avoid high-pressure spray directly into door handles at -15\u00B0C. Water forced into the tumbler will leave you locked out.",
  "<b>GARAGE WARNING:</b> Parking in a heated garage 'wakes up' frozen salt. Rusting happens 10x faster at room temperature than in the cold.",
  "<b>MAG-CHLORIDE FACT:</b> Calgary uses liquid Mag-Brine on Deerfoot. It is more corrosive than rock salt and stays wet longer.",
  "<b>VISIBILITY TIP:</b> Road spray at -5\u00B0C creates a 'Salt Film' that can consume an entire reservoir of fluid in one commute. Top up now and always keep a spare jug of winter-rated washer fluid in the trunk.",
  "<b>COLD SNAP CHECKLIST:</b> For every 5\u00B0C drop, tires lose ~1 PSI of pressure. Check your levels when the 'Plug-In' alert is active to prevent uneven wear and reduced range.",
  "<b>BATTERY FACT:</b> At -18\u00B0C, a standard lead-acid battery loses 40% of its cranking power. If the 'Corrosion Speedometer' is Dormant, prioritize battery health over aesthetics.",
  "<b>PSI TIP:</b> Nitro-filled tires still fluctuate in Calgary snaps. Always calibrate your pressure in the morning before the tires warm up from road friction.",
  "<b>DOOR SEAL HACK:</b> After a winter wash, apply a thin layer of silicone lubricant or even non-stick cooking spray to the rubber weatherstripping to prevent door bonding.",
  "<b>EV RANGE TIP:</b> In deep cold, use 'Seat Heat' instead of the cabin heater to save up to 15% of your battery range during short city commutes.",
  "<b>BLACK ICE PHYSICS:</b> When the air is -5\u00B0C but the sun is out, asphalt absorbs thermal energy. This creates a thin, invisible melt-layer that flash-freezes in shadows.",
  "<b>UNDERBODY CARE:</b> Salt-dust is hygroscopic, meaning it pulls moisture out of the air. Even on dry days, salt 'dust' on your chassis can start corroding if the humidity rises.",
  "<b>WASHER FLUID PHYSICS:</b> Avoid using 'De-Icer' fluid on a bone-dry windshield. The alcohol evaporates too fast, leaving a 'white-out' streak that blocks vision instantly.",
  "<b>CHINOOK CAUTION:</b> A rapid 20\u00B0C rise doesn't just melt ice\u2014it expands the metal panels of your car. This can 'pop' existing windshield chips into full-length cracks."
  
];

// --- 3. WASH LOGGING & HISTORY ---
function addNewWash() {
  let h = JSON.parse(localStorage.getItem('washLogV2') || "[]");
  h.unshift(new Date().toISOString());
  if (h.length > 5) h.pop();
  localStorage.setItem('washLogV2', JSON.stringify(h));
  updateUI();
  if (navigator.vibrate) navigator.vibrate(25);
  setTimeout(() => { 
    const drawer = document.getElementById('log-drawer');
    if (drawer) drawer.style.display = 'none'; 
  }, 800);
}

function undoWash() {
  let h = JSON.parse(localStorage.getItem('washLogV2') || "[]");
  if (h.length > 0) { h.shift(); localStorage.setItem('washLogV2', JSON.stringify(h)); updateUI(); }
}


function updateUI() {
  const currentKey = 'washLogV2'; 
  const backupKeys = ['washLogV1', 'washLog', 'yycWashLog'];

  // --- 1. DATA RECOVERY ---
  if (!localStorage.getItem(currentKey)) {
    for (const oldKey of backupKeys) {
      const rescuedData = localStorage.getItem(oldKey);
      if (rescuedData) {
        localStorage.setItem(currentKey, rescuedData);
        console.log(`Recovered data from ${oldKey}`);
        break; 
      }
    }
  }

  // --- 2. SET UP VARIABLES ---
  const h = JSON.parse(localStorage.getItem('washLogV2') || "[]");
  const isStrict = document.getElementById('risk-toggle')?.checked ?? true;
  const threshold = isStrict ? 12 : 7; 

  const bar = document.getElementById('salt-load-bar');
  const loadLabel = document.getElementById('load-percent');
  const exposureVal = document.getElementById('exposure-val');
  const exposureStatus = document.getElementById('exposure-status');
  const list = document.getElementById('log-list');
  const lastDate = document.getElementById('last-date');
  const nag = document.getElementById('maintenance-nag');
  const fBox = document.getElementById('random-fact');
  const prompt = document.getElementById('log-reminder-prompt');

  // --- 3. UPDATING GLOBAL UI ---
  if (fBox) fBox.innerHTML = yycInsights[Math.floor(Math.random() * yycInsights.length)];
  if (prompt) prompt.style.display = (h.length === 0) ? 'flex' : 'none';

  if (h.length > 0) {
    const dLast = new Date(h[0]);
    const days = Math.floor((new Date() - dLast) / 86400000);
    const resetLink = document.getElementById('reset-link-container');
    if (resetLink) resetLink.style.display = 'none';
    
    // Update Salt Load Bar
    const percent = Math.min(Math.round((days / threshold) * 100), 100);
    if (bar) bar.style.width = `${percent}%`;
    if (loadLabel) loadLabel.innerText = `${percent}%`;

    // Update Main Stats
    if (lastDate) lastDate.innerText = dLast.toLocaleDateString('en-CA', {month:'short', day:'numeric'});
    if (nag) nag.style.display = days >= 7 ? 'block' : 'none';
    
    if (exposureVal) { 
        exposureVal.innerText = days; 
        exposureVal.style.color = days >= threshold ? "#f43f5e" : days >= (threshold / 2) ? "#fbbf24" : "#10b981"; 
    }
    
    if (exposureStatus) {
        exposureStatus.innerHTML = days >= threshold ? " <b>CRITICAL:</b> Salt pitted." : days >= (threshold / 2) ? "<b>MODERATE:</b> Brine bonding." : "<b>SAFE:</b> Minimal salt.";
    }

    // Render History List
    if (list) {
      list.innerHTML = h.map((item, idx) => `
        <div style="padding:6px 0; border-bottom:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
          <span> ${new Date(item).toLocaleDateString('en-CA', {month:'short', day:'numeric'})} <span style="color:#94a3b8; font-size:0.9em; margin-left:4px;">${new Date(item).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
          ${idx === 0 ? '<span onclick="undoWash()" style="color:#f43f5e; font-weight:bold; cursor:pointer;">Undo</span>' : ''}
        </div>`).join('');
    }

    } else {
    // --- EMPTY STATE / FIRST LOG PROMPT ---
    if (lastDate) lastDate.innerText = "Setup Required";
    if (bar) bar.style.width = '0%';
    const resetLink = document.getElementById('reset-link-container');
    if (resetLink) resetLink.style.display = 'block';
    
    // The Blinking Instruction
    if (loadLabel) {
        loadLabel.innerHTML = `<span class="pulse-text">LOG FIRST WASH TO SYNC</span>`;
    }
    
    // Clean Placeholder for the Score
    if (exposureVal) {
        exposureVal.innerText = "--";
        exposureVal.style.color = "#475569"; 
    }
    
    if (exposureStatus) {
        exposureStatus.innerHTML = "Sensor offline. Log a wash to begin tracking.";
    }
    
    // Empty History Placeholder
    if (list) {
        list.innerHTML = `
          <div style="text-align:center; padding:30px 10px; color:#64748b; font-size:0.85em;">
            <div style="font-size:2em; margin-bottom:10px; opacity:0.3;"></div>
            Waiting for your first entry to calculate chassis chemistry.
          </div>`;
    }
  }

}
  

// --- 4. CORE WEATHER ENGINE ---
async function updateWeather(isFullRefresh = true) {
  const card = document.getElementById('card');
  const syncTag = document.getElementById('sync-tag');

  if (isFullRefresh) {
    if (syncTag) syncTag.innerText = "YYC SENSOR � SYNCING...";
    if (card) {
        card.style.display = 'block'; // Ensure it's not hidden
        card.style.opacity = "0.5";   // Dim it
        card.style.filter = "blur(1px)"; // Optional: adds a "processing" look
    }
}
  const url = "https://api.open-meteo.com/v1/forecast?latitude=51.05&longitude=-114.07&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=precipitation,temperature_2m,wind_speed_10m&timezone=America/Edmonton&past_days=5";
  
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const todayIdx = 5, curHr = (todayIdx * 24) + new Date().getHours(); 
    const curTemp = data.hourly.temperature_2m[curHr], wind = data.hourly.wind_speed_10m[curHr];
    const isStrict = document.getElementById('risk-toggle')?.checked ?? true;
    const isHighVoltage = document.getElementById('ev-toggle')?.checked ?? false;

    // Road Wetness Logic
    let hadMelt = false, totalPrec = 0;
    for (let i = 0; i <= todayIdx; i++) {
        if (data.daily.temperature_2m_max[i] > 0) hadMelt = true;
        totalPrec += (data.daily.precipitation_sum[i] || 0);
    }
    const roadsFreezeDried = (curTemp < -8 && wind > 18);
    const effectiveWetness = (hadMelt || totalPrec > 0.1) && !roadsFreezeDried;

    // Main Verdict
    let vText = "WAIT", vCol = "var(--accent)", status = " NEUTRAL", judgement = "Analyzing...";
    if (curTemp < -12) {
        vText = "NO GO: FREEZE RISK"; vCol = "var(--blue)"; status = " TOO COLD";
        judgement = curTemp <= -17 ? "<b>Salt is inert.</b> High rock chip risk." : "Mechanical risk outweighs benefit.";
    } else if (effectiveWetness || (curTemp > -5 && curTemp < 3)) {
        vText = "WAIT: SALTY SLUSH"; vCol = "#92400e"; status = " ROADS ARE MESSY"; 
        judgement = "<b>Liquid Brine:</b> Roads are tacky and salt is highly corrosive.";
    } else if (curTemp > -6) {
        vText = "GO: MAINTENANCE WINDOW"; vCol = "var(--green)"; status = " WASH NOW"; 
        judgement = "<b>Ideal Conditions:</b> Roads are dry and salt is dormant.";
    }

    document.getElementById('final-verdict').innerText = vText;
    document.getElementById('final-verdict').style.backgroundColor = vCol;
    document.body.style.backgroundColor = vCol;
    document.getElementById('status-badge').innerText = status;
    document.getElementById('status-badge').style.color = vCol;
    document.getElementById('cur-temp-display').innerText = Math.round(curTemp) + "\u00B0C Currently";
    document.getElementById('judgement-call').innerHTML = judgement;

    // Road Chemistry Labeling
    let sI = "Liquid Brine", chemMsg = "Peak corrosive state. Salt is a concentrated liquid acid.";
    if (curTemp <= -17) { sI = "Dormant Dust"; chemMsg = "Salt cannot melt ice. High paint-chip risk."; }
    else if (curTemp > -17 && curTemp < -5) { sI = "Abrasive Bond"; chemMsg = "Salt is sticky and bonding to metal."; }
    else if (curTemp >= 3) { sI = "Diluted Runoff"; chemMsg = "Road spray is mostly water."; }
    document.getElementById('salt-val').innerText = sI;
    document.getElementById('salt-logic-text').innerHTML = `<b> ${sI}:</b> ${chemMsg}`;

    // Adaptive Banners
    const setDisp = (id, cond) => { const el = document.getElementById(id); if (el) el.style.display = cond ? 'flex' : 'none'; };
    setDisp('plugin-alert', curTemp <= -20);
    setDisp('regen-alert', isHighVoltage && curTemp <= -15);
    setDisp('fluid-alert', curTemp < -8 && curTemp > -18);
    setDisp('chip-alert', curTemp < -14);
    setDisp('rust-alert', (curTemp > -5 && curTemp < 3 && effectiveWetness));
    setDisp('ice-alert', (curTemp <= 1 && effectiveWetness));
    if (curTemp < 0) {
        let fT = Math.max(3, Math.round(20 + (curTemp * 1.5) - (wind * 0.4)));
        if (document.getElementById('freeze-val')) document.getElementById('freeze-val').innerText = `${fT} MIN UNTIL FREEZE `;
        setDisp('freeze-alert', true);
    } else { setDisp('freeze-alert', false); }
    

    // --- STRATEGIC OPENING SEARCH ---
    let startSearchAt = (vText.includes("WAIT") || vText.includes("NO GO")) ? (todayIdx + 1) : todayIdx;
    let backupIdx = null, finalIdx = null;
    
    // DEDUCED BOUNDARIES
    // Strict ON: Conservative (stay clean). Strict OFF: Proactive (save paint).
    const precipLimit = isStrict ? 0.1 : 0.6; 
    const tempFloor = isStrict ? -6 : -11; 

    for (let k = startSearchAt; k < data.daily.time.length; k++) {
      const maxT = data.daily.temperature_2m_max[k];
      const snow = data.daily.precipitation_sum[k] || 0;

      if (maxT > tempFloor && snow < precipLimit) {
        const tW = data.hourly.wind_speed_10m[k * 24 + 12];
        const tT = data.hourly.temperature_2m[k * 24 + 12];
        
        if (backupIdx === null) backupIdx = k;

        if (isStrict) {
            // STRICT MODE: Still requires specific wind/temp to skip the "Tacky" phase
            if (!(tW < 8 || tT > -2)) { finalIdx = k; break; }
        } else {
            // AESTHETICS MODE: Neutralize salt as soon as safe (-11C floor)
            finalIdx = k; break; 
        }
      }
    }
    finalIdx = finalIdx || backupIdx;

    if (finalIdx !== null) {
        const k = finalIdx;
        const dDate = data.daily.time[k];
        const dateObj = new Date(dDate + "T00:00:00");
        const dateSuffix = dateObj.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
        
        let fDate = (k === todayIdx) ? `Today (${dateSuffix})` : (k === todayIdx + 1) ? `Tomorrow (${dateSuffix})` : dateSuffix;
        const tW = data.hourly.wind_speed_10m[k * 24 + 12];
        const tT = data.hourly.temperature_2m[k * 24 + 12];
        
        // Dynamic Confidence & Reasoning
        let conf = "";
        let reason = "";

        if (isStrict) {
            conf = (tW > 15 || tT < -8) 
                ? `<span style="color:#10b981; font-size:0.75em;">\uD83D\uDEE1\uFE0F HIGH CONFIDENCE</span>` 
                : `<span style="color:#f43f5e; font-size:0.75em;">\u26A0\uFE0F LOW CONFIDENCE</span>`;
            reason = (tW > 18 && tT < -8) ? "High winds will <b>freeze-dry</b> the pavement." : "Warmth means roads will likely stay <b>tacky and wet.</b>";
        } else {
            conf = `<span style="color:#38bdf8; font-size:0.75em;">\u2728 PAINT PROTECTION</span>`;
            reason = "<b>Priority: Salt Neutralization.</b> Removing current salt crust is vital to stop oxidation, even if light spray returns.";
        }

        document.getElementById('next-val').innerText = fDate;
        document.getElementById('verdict-text').innerHTML = `<b>${fDate}</b> ${conf}<br>${reason}`;

        
        // Restore Solar/Thermal Window formatting
        const formatT = (h) => { let wrap = (h + 24) % 24; return (wrap % 12 || 12) + (wrap >= 12 ? ' PM' : ' AM'); };
        const dayTemps = data.hourly.temperature_2m.slice(k * 24, (k + 1) * 24);
        const maxHr = dayTemps.indexOf(Math.max(...dayTemps));
        let wType = (maxHr > 7 && maxHr < 18) ? "\u2600\uFE0F Solar Window" : "\uD83C\uDF21\uFE0F Thermal Window";
        
        if (document.getElementById('solar-verdict-display')) {
             document.getElementById('solar-verdict-display').innerHTML = `<b>${wType}: ${formatT(maxHr-1)} \u2014 ${formatT(maxHr+2)}</b><br><span style="font-size:0.8em; font-weight:400; color:#94a3b8;">${maxHr > 7 && maxHr < 18 ? 'Best for drying seals.' : 'Night peak detected. Use heated bay.'}</span>`;
        }
        
        
    }


        // --- REFINED CALGARY WHAT-IF LOGIC ---
    const whatIf = document.getElementById('what-if-text');
    
    if (vText.includes("GO: MAIN")) {
        whatIf.innerHTML = "<b>Ideal:</b> Roads are dry. Wash now to stay clean for 48h+.";
    } 
    else if (vText.includes("WAIT: SALTY")) {
        if (isStrict) {
            // Priority: Aesthetics (Staying Clean)
            whatIf.innerHTML = "<b>Waste of money:</b> Tacky brine will coat your paint in 15 minutes. Wait for the dry window.";
        } else {
            // Priority: Protection (Neutralization)
            whatIf.innerHTML = "<b>Neutralization Window:</b> Roads are messy, but removing salt now stops clear-coat pitting. <b>Priority: Paint over Pavements.</b>";
        }
    } 
    else if (vText.includes("NO GO")) {
        // Updated for the Calgary "Wand Wash" reality
        whatIf.innerHTML = "<b>Danger:</b> Water will flash-freeze in locks instantly. Only wash if you can <b>immediately</b> wipe all door seals and hinges dry before leaving the bay.";
    }
    

    // --- REFINED FORECAST BAR (LIGHT MODE COMPATIBLE) ---
let fH = ""; 
for (let j = 5; j < 10; j++) {
  const dDate = new Date(data.daily.time[j] + "T00:00:00");
  const dName = (j === 5) ? "Today" : dDate.toLocaleDateString('en-CA', { weekday: 'short' });
  
  const isSnowy = (data.daily.precipitation_sum[j] || 0) > 0.1;
  const icon = isSnowy ? '\u2744\uFE0F' : '\u2600\uFE0F';

  const hi = Math.round(data.daily.temperature_2m_max[j]);
  const lo = Math.round(data.daily.temperature_2m_min[j]);

  fH += `
    <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center;">
      <div style="font-size: 0.6em; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">${dName}</div>
      <div style="font-size: 1.8em; margin: 2px 0; line-height: 1;">${icon}</div>
      <div style="font-size: 1.0em; font-weight: 900; color: #1e293b; margin-top: 4px;">${hi}\u00B0</div>
      <div style="font-size: 0.7em; font-weight: 700; color: #94a3b8;">${lo}\u00B0</div>
    </div>`;
}
document.getElementById('forecast').innerHTML = fH;



    if (isFullRefresh) document.getElementById('sync-tag').innerText = "YYC UPDATED: " + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    document.getElementById('card').style.display = 'block';
    
        // --- FINAL CORROSION SPEEDOMETER INJECTION ---
    const needle = document.getElementById('corrosion-needle');
    const desc = document.getElementById('corrosion-desc');
    
    if (needle && desc) {
        let riskScore = 0;
        
        // 1. ARRHEIUS KINETICS: Temperature doubling rule
        if (curTemp <= -15) riskScore = 5; 
        else if (curTemp <= -8) riskScore = 22; 
        else if (curTemp < 0) riskScore = 65; 
        else if (curTemp < 10) riskScore = 88; 
        else riskScore = 100; // Redline in heated garage

        // 2. CATALYST CHECK: Moisture is the "fuel" for rust
        // If roads are dry/freeze-dried, reaction speed drops significantly
        if (!effectiveWetness && curTemp < 0) riskScore *= 0.4;
        
        // Final UI Updates
        needle.style.left = `${Math.min(riskScore, 100)}%`;
        
        desc.innerHTML = riskScore <= 15 ? "<span style='color:#10b981;'>DORMANT:</span> Metal is chemically stable." : 
                        riskScore <= 50 ? "<span style='color:#fbbf24;'>ACTIVE:</span> Surface oxidation beginning." : 
                        riskScore <= 85 ? "<span style='color:#f43f5e;'>CRITICAL:</span> Brine wicking into chassis." :
                        "<span style='color:#f43f5e;'> REDLINE:</span> Accelerated pitting. Rinse now.";
    }
    
    // --- SUCCESS RESTORE: This "wakes up" the UI ---
    if (card) {
        card.style.opacity = "1";
        card.style.filter = "none";
        card.style.display = 'block';
    }

    if (isFullRefresh && syncTag) {
        syncTag.innerText = "YYC UPDATED: " + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }
    
    
    
    updateUI();
    
  } catch (e) { 
    console.error("Fetch Error:", e);
    if (syncTag) syncTag.innerText = "SYNC ERROR";
    // EMERGENCY WAKE UP
    if (card) {
      card.style.opacity = "1";
      card.style.filter = "none";
    }
}
}

function addManualWash(val) {
    if (!val) return;

    let h = JSON.parse(localStorage.getItem('washLogV2') || "[]");
    
    // Set to local noon to avoid timezone shifts during the save
    const selectedDate = new Date(val + "T12:00:00");
    
    h.push(selectedDate.toISOString());
    h.sort((a, b) => new Date(b) - new Date(a));

    if (h.length > 5) h.pop();
    localStorage.setItem('washLogV2', JSON.stringify(h));

    // --- TRIGGER FULL REFRESH ---
    // This matches the "Log New Wash" behavior exactly.
    location.reload(); 
}


// --- 5. INITIALIZATION & PWA ---
function saveProfile() {
  localStorage.setItem('isEV', document.getElementById('ev-toggle').checked);
  localStorage.setItem('isStrict', document.getElementById('risk-toggle').checked);
  updateWeather(false); 
}
document.getElementById('ev-toggle').checked = localStorage.getItem('isEV') === 'true';
document.getElementById('risk-toggle').checked = localStorage.getItem('isStrict') !== 'false';
updateWeather();

if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(e => {}); }
if (navigator.userAgent.match(/iphone|ipad|ipod/i)) document.getElementById('ios-prompt').style.display = 'block';

// --- 6. GESTURES REFINED ---
let touchStartY = 0;
const card = document.getElementById('card');

document.addEventListener('touchstart', e => { 
    touchStartY = e.touches[0].pageY; 
}, {passive: true});

document.addEventListener('touchmove', e => {
    const touchY = e.touches[0].pageY;
    const distance = touchY - touchStartY;
    
    // ONLY show the "Pull-down" visual effect if at the top
    if (card.scrollTop === 0 && distance > 0) {
        card.style.transform = `translateY(${Math.min(distance / 5, 30)}px)`;
    }
}, {passive: true});

document.addEventListener('touchend', e => {
    const touchY = e.changedTouches[0].pageY;
    const distance = touchY - touchStartY;

    // Trigger refresh ONLY if at the top and pulled down significantly
    if (card.scrollTop === 0 && distance > 150) {
        card.classList.add('syncing');
        updateWeather().then(() => { 
            setTimeout(() => { 
                card.classList.remove('syncing'); 
                card.style.transform = "translateY(0)"; 
            }, 500); 
        });
    } else {
        // Snap back if they were just scrolling
        card.style.transform = "translateY(0)";
    }
}, {passive: true});

function checkOnboarding() {
    const h = JSON.parse(localStorage.getItem('washLogV2') || "[]");
    const banner = document.getElementById('welcome-banner');
    const dismissed = localStorage.getItem('dismissedWelcome') === 'true';

    // Show banner only if no logs exist AND they haven't closed it manually before
    if (h.length === 0 && !dismissed) {
        banner.style.display = 'block';
    }
}

function dismissWelcome() {
    document.getElementById('welcome-banner').style.display = 'none';
    localStorage.setItem('dismissedWelcome', 'true');
}

// Call this inside your window.onload or at the very end of app.js
checkOnboarding();

function resetOnboarding() {
    localStorage.removeItem('dismissedWelcome');
    location.reload(); // Refresh to show the banner again
}

function openWeatherApp() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
        window.location.href = "weather://";
        setTimeout(() => {
            if (!document.hidden) {
                window.open("https://weather.apple.com", "_blank");
            }
        }, 800);
    } else {
        // Android: This specific URL structure usually bypasses the Play Store redirect
        const url = "https://www.google.com/search?q=calgary+weather&btnI=1"; 
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

}
