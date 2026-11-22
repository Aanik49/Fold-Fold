# Fold Fold — Bauhaus Risograph Origami Puzzle

An origami paper-folding puzzle game with intuitive swipe mechanics, 5 themed categories × 20 BFS-verified levels (100 levels total), one-way hazard tape, duplex flip ink, wild prisms, brass eyelet pins, and procedural marimba audio.

## Download Android APK via GitHub (No Android Studio Needed)

This repository includes an automated GitHub Actions workflow (`.github/workflows/build-android-apk.yml`) that compiles a standalone offline **`Fold-Fold.apk`** directly in the cloud.

### Steps
1. **Push / Export** this project to a GitHub repository (on the `main` or `master` branch).
2. Open your repository on GitHub and click the **Actions** tab.
   - The **Build Android APK** workflow starts automatically on push (you can also trigger it anytime via **Actions → Build Android APK → Run workflow**).
3. Wait ~2–3 minutes for the green checkmark, then download **`Fold-Fold.apk`** from either:
   - **GitHub Releases** (right sidebar → **Releases** → **`Fold-Fold.apk`** — direct download link!), or
   - Inside the completed workflow run under **Artifacts → `Fold-Fold-Android-APK`**.
4. Transfer or open `Fold-Fold.apk` on your Android phone to install.

## Local Web Development

```bash
npm install
npm run dev
```
