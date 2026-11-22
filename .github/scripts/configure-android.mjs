import fs from 'fs';
import path from 'path';

const root = process.cwd();
const androidRes = path.join(root, 'android', 'app', 'src', 'main', 'res');
const manifestPath = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');

const iconAny = path.join(root, 'public', 'pwa-512x512.png');
const iconMaskable = path.join(root, 'public', 'pwa-maskable-512x512.png');

// 1. Apply Bauhaus Fold Fold PNG icons to Android mipmap directories
if (fs.existsSync(androidRes) && fs.existsSync(iconAny)) {
  const entries = fs.readdirSync(androidRes, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('mipmap-')) continue;
    const dir = path.join(androidRes, entry.name);
    for (const fileName of ['ic_launcher.png', 'ic_launcher_round.png']) {
      const target = path.join(dir, fileName);
      if (fs.existsSync(target)) {
        fs.copyFileSync(iconAny, target);
      }
    }
    const fgTarget = path.join(dir, 'ic_launcher_foreground.png');
    if (fs.existsSync(fgTarget) && fs.existsSync(iconMaskable)) {
      fs.copyFileSync(iconMaskable, fgTarget);
    }
  }

  // Update adaptive icon background to Bauhaus Newsprint #F2EFE9
  const bgColorXml = path.join(androidRes, 'values', 'ic_launcher_background.xml');
  if (fs.existsSync(bgColorXml)) {
    const content = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#F2EFE9</color>\n</resources>\n`;
    fs.writeFileSync(bgColorXml, content, 'utf-8');
  }
  console.log('Applied Fold Fold Bauhaus launcher icons to Android project.');
}

// 2. Lock orientation to portrait for comfortable swipe-folding play
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf-8');
  if (!manifest.includes('android:screenOrientation=')) {
    manifest = manifest.replace(
      '<activity',
      '<activity\n            android:screenOrientation="portrait"'
    );
    fs.writeFileSync(manifestPath, manifest, 'utf-8');
    console.log('Configured portrait screenOrientation in AndroidManifest.xml.');
  }
}
