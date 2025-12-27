## [yyc-wash](https://cjdulay.github.io/yyc-wash/) <-- link here

# 🚗 YYC Car Wash Forecaster (V74)

A specialized weather utility built for the unique challenges of driving in Calgary, Alberta. This app moves beyond simple temperature forecasts to provide actionable advice on vehicle maintenance, road safety, and "Strategic Wash Windows."

![YYC Wash Logo](logo.png)

## 📋 Project Overview
Calgary winters are characterized by extreme temperature swings (Chinooks), abrasive road treatments ("Pickle"), and high-risk freezing conditions. This project helps drivers—particularly those with **hybrid vehicles**—navigate these conditions to protect their vehicle's finish and mechanical components.

---

## ⚙️ Summary of Operations
The core of this app is a custom logic engine that interprets data from the Open-Meteo API through a Calgary-specific lens.

### 1. The Thermal Lag Logic ("The Ice Cube Effect")
* **The Science:** Steel is a high-density thermal mass. If Calgary was at -20°C overnight, the car's frame remains sub-zero long after the air warms up.
* **The Feature:** The **Drying Window** timer is automatically capped if a deep freeze was detected in the last 24 hours. It tells you exactly how much time you have to hand-dry door seals before they freeze shut.

### 2. Road Chemistry Phase Shifts
* **Brine Phase (0°C to -12°C):** Salt is highly active and corrosive. The app prioritizes "Wash Now" verdicts.
* **Inert Phase (Below -15°C):** Salt is chemically dead. The City switches to **Pickle** (97% gravel).
* **The Feature:** The app triggers the **High Chip Risk** banner, shifting focus from rust prevention to rock chip avoidance.

### 3. The Chinook "Slush-Cycle" Guard
* **The Science:** Sudden warm-ups melt roadside snowbanks into a "brown river" of brine and grit.
* **The Feature:** If a temperature spike follows a snowfall, the app enters **Wait Mode** and triggers the **Active Slush** alert, preventing users from wasting money on a wash that will be ruined within minutes.

### 4. Black Ice & Refreezing Logic
* **The Science:** Invisible ice forms when moisture from a daytime melt refreezes as the sun sets.
* **The Feature:** An **Indigo Alert** triggers during "refreezing" conditions, specifically warning about bridges and overpasses.

---

## ✨ Key Features
* **Hybrid Specialist Tips:** Advice on regenerative braking and salt-seizure prevention for brakes.
* **Proactive Maintenance Nag:** Alerts users if it has been 7+ days since the last logged wash.
* **Interactive Wash Log:** A local-storage history tracker to monitor protection frequency.
* **Strategic Opening:** A forecast analyzer that finds the best "Dry Window" for a long-lasting clean.

---

## 📲 How to Install (iOS & Android)
This tool is a **Progressive Web App (PWA)**. You don't need an app store; you can install it directly from your browser to your home screen for a full-screen experience.

### For iPhone (iOS - Safari)
1.  Open the website in **Safari**.
2.  Tap the **Share** icon (the square with an arrow pointing up at the bottom).
3.  Scroll down and tap **"Add to Home Screen."**
4.  Tap "Add" in the top right corner.

### For Android (Chrome)
1.  Open the website in **Chrome**.
2.  Tap the **three-dot menu icon** in the top right corner.
3.  Tap **"Add to Home Screen"** (or sometimes "Install App").
4.  Follow the prompt to place the icon

---

## 🛠️ Maintenance Strategy
* **Silicone Rule:** Apply silicone spray to rubber gaskets when the Drying Window is < 10 mins.
* **Thermal Shock:** Pre-heat your car before washing in extreme cold to protect the windshield.
* **Brake Clear:** Firmly engage mechanical brakes after a wash to evaporate moisture.
