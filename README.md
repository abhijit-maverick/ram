# 🪷 Jai Shri Ram — Japa Counter v2

Devotional japa counter with the approved temple design, मन जप (touch) and
वाणी जप (voice) modes, streaks, history calendar, and full Hindi/English UI.

## Setup in Codespaces (after uploading to GitHub)
```bash
npm install --legacy-peer-deps
npx expo install --fix        # pins correct SDK 54 versions
```

## Local APK build (free, unlimited)
```bash
# one-time environment (persisted in ~/.bashrc after first run)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=~/android-sdk
export PATH=$JAVA_HOME/bin:$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

npx expo prebuild --platform android --clean
cd android
./gradlew assembleRelease --no-daemon --max-workers=1
# APK: android/app/build/outputs/apk/release/app-release.apk
# Serve: cd to that folder → python3 -m http.server 8001 → download via Ports tab
```

## वाणी जप counting — v5 max-tracking algorithm
- Counts every Ram name variant (राम, जय राम, श्री राम, जय श्री राम, सियाराम,
  सीताराम, रघुपति, राघव, hare ram, and Roman spellings)
- Longest-match-first so "जय श्री राम" = 1 jap, not 3
- Max-seen tracking: only counts when the phrase's Ram-count grows past its
  previous maximum; the engine's downward revisions are ignored (fixes over-counting)
- `EXTRA_PREFER_OFFLINE` requests the on-device engine; Settings screen guides
  users to download the Hindi offline pack for fully offline recognition

## || जय श्री राम ||
