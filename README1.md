<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b90700a3-c786-4547-88aa-55390c9db45d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


   =========================================================================


   # AQUAID Development Guide

# AQUAID
**A Mobile-Based Fish Recognition and Classification System Using Artificial Intelligence for Sustainable Fisheries**

---

# Technology Stack

| Component | Technology |
|------------|------------|
| Frontend UI | React + TypeScript + Vite |
| Mobile Packaging | Capacitor |
| Android Development | Android Studio |
| Offline AI | TensorFlow Lite |
| Offline Database | SQLite |
| Online Database | Firebase Firestore |
| Online AI | AI API / TensorFlow Server |
| Backend | Node.js + Express |
| Final Output | Android APK / Android App Bundle (AAB) |

---

# Development Workflow

AQUAID is developed in two stages.

Stage 1 focuses on building the application.

Stage 2 converts the web application into a real Android application.

---

# PROJECT FLOW

VS Code

↓

React + TypeScript

↓

Browser Testing

↓

Production Build

↓

Capacitor

↓

Android Studio

↓

APK

↓

Android Phone

---

# STEP 1 — Install Node Modules

First install all required libraries.

Command

```bash
npm install
```

What happens?

• Reads package.json

• Downloads React

• Downloads TypeScript

• Downloads Vite

• Downloads Capacitor

• Downloads every required package

Creates

```
node_modules/
```

Only run once after cloning the project.

---

# STEP 2 — Start Development Mode

Command

```bash
npm run dev
```

What happens?

Vite starts a development server.

Example

```
VITE ready

Local:

http://localhost:5173/
```

Open the URL in Chrome.

This is only for development.

Changes update automatically without rebuilding.

Nothing is installed on your phone yet.

---

# STEP 3 — Start the Backend (Optional)

If the project has a backend server.

Command

```bash
npm run server
```

Example

```
AQUAID Server booted on

http://localhost:3000
```

Purpose

Backend API

Firebase communication

AI communication

Database requests

---

# STEP 4 — Develop the Application

Most development happens inside

```
src/
```

Create

• Home Screen

• Camera Screen

• Scan Screen

• History

• Settings

• Navigation

• AI Result Screen

• Components

Also develop

• Firebase

• SQLite

• TensorFlow Lite

• AI API

---

# STEP 5 — Test in Browser

Continue using

```bash
npm run dev
```

Every time you save

The browser refreshes automatically.

Fast development.

No APK required.

---

# STEP 6 — Build Production Version

When the UI is complete

Run

```bash
npm run build
```

What happens?

React is converted into optimized files.

Creates

```
dist/
```

Contains

HTML

CSS

JavaScript

Optimized production files

These files are what Android will use.

---

# STEP 7 — Sync with Capacitor

Command

```bash
npx cap sync
```

What happens?

Capacitor copies everything from

```
dist/
```

into

```
android/
```

It also updates

Plugins

Android resources

Native configuration

Whenever the web code changes

Run

```bash
npm run build

npx cap sync
```

---

# STEP 8 — Open Android Studio

Command

```bash
npx cap open android
```

What happens?

Android Studio opens automatically.

It loads

```
android/
```

Now the project becomes a real Android project.

---

# STEP 9 — Run on Android Emulator

Inside Android Studio

Click

▶ Run

Android Studio

Builds the APK

Installs the APK

Starts the emulator

Launches AQUAID

Perfect for testing.

---

# STEP 10 — Run on Physical Android Phone

Enable

Developer Options

USB Debugging

Connect phone

Click

▶ Run

Android Studio installs AQUAID directly.

---

# STEP 11 — Create Release APK

Inside Android Studio

Build

↓

Generate Signed Bundle / APK

Creates

```
AQUAID.apk
```

or

```
AQUAID.aab
```

Now the application is installable.

---

# FINAL RESULT

Android Phone

↓

Tap

AQUAID.apk

↓

Install

↓

AQUAID appears on Home Screen

Exactly like any Play Store application.

---

# Development Flow

VS Code

↓

React + TypeScript

↓

Browser

↓

UI Development

↓

Build

↓

Capacitor

↓

Android Studio

↓

APK

↓

Android Phone

---

# AI FLOW

User Opens AQUAID

↓

Camera

↓

Capture Fish

↓

Internet Available?

YES

↓

AI API

↓

TensorFlow Server

↓

Fish Recognition

↓

Firebase Firestore

↓

Fish Information

↓

Save History

↓

SQLite Cache

↓

Display Result

NO

↓

TensorFlow Lite

↓

Local AI Model

↓

SQLite Database

↓

Fish Information

↓

Display Result

---

# Offline Mode

Uses

TensorFlow Lite

SQLite

Features

✔ No internet required

✔ Local fish recognition

✔ Local fish database

✔ Offline history

---

# Online Mode

Uses

AI API

Firebase Firestore

Features

✔ Latest fish species

✔ Cloud synchronization

✔ Updated fish information

✔ Better AI accuracy

---

# Recommended Development Order

Phase 1

✔ Build UI

Phase 2

✔ Camera

Phase 3

✔ Navigation

Phase 4

✔ Firebase

Phase 5

✔ SQLite

Phase 6

✔ AI API

Phase 7

✔ TensorFlow Lite

Phase 8

✔ Testing

Phase 9

✔ APK Generation

Phase 10

✔ Deployment

---

# Folder You Will Work On Most

```
src/
```

Contains

Home Screen

Camera

History

Settings

Components

Navigation

AI Screens

Firebase Integration

SQLite Integration

TensorFlow Lite Integration

---

# Folder You Rarely Edit

```
android/
```

Purpose

Android configuration

Permissions

APK generation

App signing

Native plugins

Android Studio manages most of this folder.

---

# Common Commands

Install Packages

```bash
npm install
```

Run Development

```bash
npm run dev
```

Run Backend

```bash
npm run server
```

Build Production

```bash
npm run build
```

Sync Capacitor

```bash
npx cap sync
```

Open Android Studio

```bash
npx cap open android
```

Run Android Emulator

Use ▶ Run inside Android Studio

Generate APK

Build

↓

Generate Signed APK

---

# Final Output

```
AQUAID.apk
```

Install on Android

↓

Fish Recognition

↓

AI Classification

↓

Offline + Online Support

↓

Sustainable Fisheries Assistant








Step 2: Clear the app's local storage

Now type exactly:

localStorage.clear();

Press Enter.

Step 3: Reload the page

Now type:

location.reload();

Press Enter.











1. Install the Android package
npm install @capacitor/android

This downloads the Capacitor Android library into your project.

Think of it as installing the tools needed to create an Android app.

It updates things like:

node_modules/
package.json
package-lock.json

It does not create an Android app yet.

2. Create the Android project
npx cap add android

This creates the native Android project by generating an android/ folder.

After running it, your project will look like:

aquaid/
├── android/      ← New Android project
├── src/
├── dist/
├── node_modules/
├── package.json
├── capacitor.config.ts
...

Inside android/ are all the files Android Studio needs to build an APK or AAB.