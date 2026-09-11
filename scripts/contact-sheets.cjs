const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const CARS_DIR = "public/cars";
const OUT_DIR = "scripts/_sheets";
fs.mkdirSync(OUT_DIR, { recursive: true });

const CELL = 260;      // thumb size
const PAD = 6;
const COLS = 5;
const LABEL_H = 22;

(async () => {
  const folders = fs.readdirSync(CARS_DIR).filter((f) =>
    fs.statSync(path.join(CARS_DIR, f)).isDirectory()
  );
  for (const folder of folders) {
    const dir = path.join(CARS_DIR, folder);
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.jpe?g$/i.test(f))
      .sort();
    const rows = Math.ceil(files.length / COLS);
    const W = COLS * CELL + (COLS + 1) * PAD;
    const H = rows * (CELL + LABEL_H) + (rows + 1) * PAD;

    const composites = [];
    for (let i = 0; i < files.length; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = PAD + col * (CELL + PAD);
      const y = PAD + row * (CELL + LABEL_H + PAD);
      const thumb = await sharp(path.join(dir, files[i]))
        .resize(CELL, CELL, { fit: "cover" })
        .jpeg({ quality: 72 })
        .toBuffer();
      composites.push({ input: thumb, left: x, top: y + LABEL_H });
      // number label
      const label = Buffer.from(
        `<svg width="${CELL}" height="${LABEL_H}"><text x="2" y="16" font-family="sans-serif" font-size="15" fill="black">${files[i]}</text></svg>`
      );
      composites.push({ input: label, left: x, top: y });
    }
    await sharp({
      create: { width: W, height: H, channels: 3, background: "#ffffff" },
    })
      .composite(composites)
      .jpeg({ quality: 74 })
      .toFile(path.join(OUT_DIR, `${folder}.jpg`));
    console.log(folder, files.length);
  }
  console.log("done");
})();
