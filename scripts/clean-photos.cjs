const fs = require("fs");
const path = require("path");

// Photos to REMOVE per car (wrong car / documents / service stickers),
// identified by visual audit of every listing's contact sheet.
const REMOVE = {
  "peugeot-2008-2019": [2, 3, 9, 11],
  "audi-a1-2014": [2, 12],
  "audi-a1-2015": [2, 3, 7, 8, 11],
  "audi-a3-2009": [2, 3, 9],
  "bmw-318-2008": [2, 3],
  "chevrolet-spark-2012": [2, 3, 9],
  "citroen-c4cactus-2015": [2, 3, 11],
  "citroen-c4cactus-2017": [2, 3, 10, 11],
  "dacia-duster-2011": [2, 3],
  "fiat-panda-2010": [2, 3],
  "fiat-punto-2011": [2, 10],
  "ford-fiesta-2009": [2, 3],
  "hyundai-getz-2008": [2, 3],
  "hyundai-i20-2010": [2, 3, 12],
  "hyundai-i30-2011": [2, 3, 9],
  "hyundai-i30-2014": [2, 3, 11],
  "kia-rio-2013": [2, 3],
  "lancia-delta-2009": [2, 3, 9],
  "mazda-3-2012": [2],
  "nissan-juke-2012": [2, 3, 10],
  "nissan-micra-2009": [2, 3],
  "opel-corsa-2012": [2],
  "opel-meriva-2012": [2, 3, 9],
  "peugeot-207-2009": [2, 3, 13],
  "peugeot-208-2016": [2, 8],
  "peugeot-308-2015": [2, 3, 11],
  "renault-clio-2007": [2, 3, 12],
  "renault-laguna-2011": [2, 3],
  "renault-megane-2012": [2, 3, 8],
  "renault-twingo-2013": [2, 3, 9],
  "seat-alhambra-2010": [2, 3],
  "seat-alhambra-2011": [2, 3],
  "volkswagen-golf-2011": [2, 3, 13],
  "volkswagen-golf-2011-072": [2, 3, 12],
};

const pad = (n) => String(n).padStart(2, "0");
let totalRemoved = 0;

for (const [slug, nums] of Object.entries(REMOVE)) {
  const dir = path.join("public/cars", slug);
  if (!fs.existsSync(dir)) {
    console.log("MISSING DIR:", slug);
    continue;
  }
  // 1) delete flagged
  const del = new Set(nums.map(pad));
  for (const n of del) {
    const p = path.join(dir, `${n}.jpg`);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      totalRemoved++;
    } else {
      console.log("  ! not found:", slug, n);
    }
  }
  // 2) renumber remaining sequentially (temp pass to avoid collisions)
  let remaining = fs
    .readdirSync(dir)
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort();
  remaining.forEach((f, i) =>
    fs.renameSync(path.join(dir, f), path.join(dir, `tmp_${pad(i + 1)}.jpg`))
  );
  const tmp = fs
    .readdirSync(dir)
    .filter((f) => /^tmp_/.test(f))
    .sort();
  tmp.forEach((f, i) =>
    fs.renameSync(path.join(dir, f), path.join(dir, `${pad(i + 1)}.jpg`))
  );
  console.log(`${slug}: -${nums.length} -> ${tmp.length} photos`);
}
console.log("total removed:", totalRemoved);
