// Copies every Squarespace-hosted image the site references into public/images/
// and rewrites the references to the local copies.
//
//   npm run images            download and rewrite
//   npm run images -- --dry   list what would be downloaded
//
// Images are saved as WebP, at most 1800px wide, when the `sharp` package is installed
// (it is a dev dependency of this project). Without it the originals are saved as they are.
//
// Run this once before cancelling Squarespace: the remote URLs stop working when the old site goes away.
// It is safe to run again; images that are already saved are skipped.
import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.env.PORTFOLIO_ROOT ?? path.resolve(import.meta.dirname, '..');
const SOURCES = ['src/content', 'src/pages'];
const REMOTE = /https:\/\/images\.squarespace-cdn\.com\/content\/v1\/[^\s"')>]+/g;
const MAX_WIDTH = 1800;
const dry = process.argv.includes('--dry');

const sharp = await import('sharp').then((m) => m.default, () => null);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(md|astro)$/.test(entry.name)) yield full;
  }
}

const slugify = (name) =>
  decodeURIComponent(name.replace(/\+/g, ' '))
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

const exists = (file) => access(file).then(() => true, () => false);

let downloaded = 0;
let skipped = 0;
const failed = [];

for (const source of SOURCES) {
  for await (const file of walk(path.join(ROOT, source))) {
    let text = await readFile(file, 'utf8');
    const urls = [...new Set(text.match(REMOTE) ?? [])];
    if (urls.length === 0) continue;

    // content/work/coopai.md -> public/images/work/coopai/
    const rel = path.relative(path.join(ROOT, 'src'), file).replace(/\.(md|astro)$/, '');
    const folder = rel.split(path.sep).join('/').replace(/^content\//, '').replace(/\[|\]/g, '');

    for (const remote of urls) {
      const clean = remote.split('?')[0];
      const original = slugify(clean.split('/').pop());
      const webp = original.replace(/\.\w+$/, '.webp');
      const dir = path.join(ROOT, 'public', 'images', folder);

      if (dry) {
        console.log(`${clean}\n  -> public/images/${folder}/${sharp ? webp : original}`);
        continue;
      }

      // Use whichever copy is already there.
      let name = (await exists(path.join(dir, webp))) ? webp : (await exists(path.join(dir, original))) ? original : null;

      if (name) {
        skipped++;
      } else {
        // 2500w is the largest size Squarespace serves.
        const res = await fetch(`${clean}?format=2500w`).catch((error) => ({ ok: false, status: error.message }));
        if (!res.ok) {
          failed.push(`${res.status} ${clean}`);
          continue;
        }
        const data = Buffer.from(await res.arrayBuffer());
        await mkdir(dir, { recursive: true });
        if (sharp) {
          name = webp;
          await sharp(data)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(path.join(dir, name));
        } else {
          name = original;
          await writeFile(path.join(dir, name), data);
        }
        downloaded++;
        console.log(`saved public/images/${folder}/${name}`);
        await new Promise((r) => setTimeout(r, 250));
      }
      text = text.split(remote).join(`/images/${folder}/${name}`);
    }

    if (!dry) await writeFile(file, text);
  }
}

if (!dry) {
  console.log(`\n${downloaded} downloaded, ${skipped} already present, ${failed.length} failed`);
  if (failed.length) {
    console.log(failed.join('\n'));
    process.exitCode = 1;
  }
}
