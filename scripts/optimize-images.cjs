// Run from the repository root: node scripts/optimize-images.cjs [--write]
// Defaults to a dry run. Originals are retained in ignored image-originals/.
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

async function files(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? files(filename) : [filename];
  }))).flat();
}

async function main() {
  const write = process.argv.includes('--write');
  const sourceFiles = (await files('src')).filter(file => /\.(tsx?|css|json)$/.test(file));
  const sources = new Map(await Promise.all(sourceFiles.map(async file => [file, await fs.readFile(file, 'utf8')])));
  const sourceText = [...sources.values()].join('\n');
  const report = [];
  for (const file of await files('public/images')) {
    if (!/\.(png|jpe?g|webp)$/i.test(file) || /\.optimized-[a-f0-9]+\.webp$/.test(file)) continue;
    const relative = file.slice('public/'.length);
    // Only direct source references; leave dynamically selected assets untouched.
    if (!sourceText.includes(relative) || /images\/(specials|logos)\//.test(relative)) continue;
    const originalBytes = (await fs.stat(file)).size;
    if (originalBytes < 200_000) continue;
    const maxWidth = relative.includes('/hero/') ? 2400 : 1600;
    const quality = /\/(hand-drawn|holiday-meats)\//.test(relative) ? 85 : 80;
    const metadata = await sharp(file).metadata();
    if ((metadata.pages ?? 1) > 1) continue;
    const buffer = await sharp(file).rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, alphaQuality: 100, effort: 6 }).toBuffer();
    if (buffer.length >= originalBytes * 0.9) continue;
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 10);
    const optimized = relative.replace(/\.[^.]+$/, `.optimized-${hash}.webp`);
    report.push({ original: relative, optimized, originalBytes, optimizedBytes: buffer.length,
      originalWidth: metadata.width, originalHeight: metadata.height, maxWidth, quality });
    if (write) {
      const originalHash = crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex').slice(0, 10);
      const backup = path.join('image-originals', relative.slice('images/'.length) + '.' + originalHash);
      await fs.mkdir(path.dirname(backup), { recursive: true });
      // Never overwrite an earlier original.
      try {
        await fs.copyFile(file, backup, require('node:fs').constants.COPYFILE_EXCL);
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
      }
      await fs.writeFile(path.join('public', optimized), buffer);
      for (const [sourceFile, content] of sources) {
        const updated = content.split(relative).join(optimized);
        if (updated !== content) {
          await fs.writeFile(sourceFile, updated);
          sources.set(sourceFile, updated);
        }
      }
      await fs.unlink(file);
    }
  }
  if (write && report.length > 0) {
    await fs.mkdir('docs', { recursive: true });
    await fs.writeFile('docs/image-optimization-report.json', JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify({ write, images: report.length,
    originalBytes: report.reduce((sum, row) => sum + row.originalBytes, 0),
    optimizedBytes: report.reduce((sum, row) => sum + row.optimizedBytes, 0), report }, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
