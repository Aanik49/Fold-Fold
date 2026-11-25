import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const root = process.cwd();
const androidRoot = path.join(root, 'android');
const androidRes = path.join(androidRoot, 'app', 'src', 'main', 'res');
const manifestPath = path.join(androidRoot, 'app', 'src', 'main', 'AndroidManifest.xml');
const gradlePropsPath = path.join(androidRoot, 'gradle.properties');
const aistudioAssetsDir = path.join(
  androidRoot,
  'app',
  'src',
  'main',
  'assets',
  'public',
  'assets',
  'aistudio'
);

const iconAny = path.join(root, 'public', 'pwa-512x512.png');
const iconFallback192 = path.join(root, 'public', 'pwa-192x192.png');
const iconMaskable = path.join(root, 'public', 'pwa-maskable-512x512.png');

const MIPMAP_SIZES = {
  'mipmap-mdpi': { launcher: 48, foreground: 108 },
  'mipmap-hdpi': { launcher: 72, foreground: 162 },
  'mipmap-xhdpi': { launcher: 96, foreground: 216 },
  'mipmap-xxhdpi': { launcher: 144, foreground: 324 },
  'mipmap-xxxhdpi': { launcher: 192, foreground: 432 },
};

function hasImageMagick() {
  try {
    execFileSync('convert', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function writeResizedPng(srcPath, destPath, size, useConvert) {
  if (useConvert) {
    execFileSync(
      'convert',
      [srcPath, '-resize', `${size}x${size}!`, '-strip', `PNG32:${destPath}`],
      { stdio: 'inherit' }
    );
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}

// 1. Remove any non-app AI Studio attachments copied from public/assets/aistudio
if (fs.existsSync(aistudioAssetsDir)) {
  fs.rmSync(aistudioAssetsDir, { recursive: true, force: true });
  console.log('Cleaned non-app assets/aistudio directory from Android bundle.');
}

// 2. Apply density-sized Bauhaus Fold Fold PNG32 icons to Android mipmap directories
if (fs.existsSync(androidRes) && fs.existsSync(iconAny)) {
  const useConvert = hasImageMagick();
  const entries = fs.readdirSync(androidRes, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('mipmap-')) continue;
    const dims = MIPMAP_SIZES[entry.name];
    if (!dims) continue;

    const dir = path.join(androidRes, entry.name);
    for (const fileName of ['ic_launcher.png', 'ic_launcher_round.png']) {
      const target = path.join(dir, fileName);
      if (fs.existsSync(target)) {
        const src = useConvert ? iconAny : (fs.existsSync(iconFallback192) ? iconFallback192 : iconAny);
        writeResizedPng(src, target, dims.launcher, useConvert);
      }
    }

    const fgTarget = path.join(dir, 'ic_launcher_foreground.png');
    if (fs.existsSync(fgTarget) && fs.existsSync(iconMaskable)) {
      writeResizedPng(iconMaskable, fgTarget, dims.foreground, useConvert);
    }
  }

  // Update adaptive icon background to Bauhaus Newsprint #F2EFE9
  const bgColorXml = path.join(androidRes, 'values', 'ic_launcher_background.xml');
  if (fs.existsSync(bgColorXml)) {
    const content = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#F2EFE9</color>\n</resources>\n`;
    fs.writeFileSync(bgColorXml, content, 'utf-8');
  }
  console.log(`Applied Fold Fold Bauhaus launcher icons (${useConvert ? 'density-resized PNG32' : 'direct PNG32'}).`);
}

// 3. Lock orientation to portrait for comfortable swipe-folding play
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf-8');
  if (!manifest.includes('android:screenOrientation=')) {
    manifest = manifest.replace(
      /(<activity\b[^>]*android:name="\.MainActivity")/,
      '$1\n            android:screenOrientation="portrait"'
    );
    fs.writeFileSync(manifestPath, manifest, 'utf-8');
    console.log('Configured portrait screenOrientation in AndroidManifest.xml.');
  }
}

// 4. Tune android/gradle.properties for reliable CI builds
if (fs.existsSync(gradlePropsPath)) {
  let props = fs.readFileSync(gradlePropsPath, 'utf-8');
  if (/^org\.gradle\.jvmargs=/m.test(props)) {
    props = props.replace(
      /^org\.gradle\.jvmargs=.*$/m,
      'org.gradle.jvmargs=-Xmx3072m -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8'
    );
  } else {
    props += '\norg.gradle.jvmargs=-Xmx3072m -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8\n';
  }
  if (!/^org\.gradle\.daemon=/m.test(props)) {
    props += 'org.gradle.daemon=false\n';
  }
  fs.writeFileSync(gradlePropsPath, props, 'utf-8');
  console.log('Configured Gradle JVM heap and non-daemon mode in android/gradle.properties.');
}
