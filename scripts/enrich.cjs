// One-off: turn scraped /tmp/cars.json into enriched English car records.
const fs = require("fs");
const cars = require("C:/Users/marko/avto-plac-dado/scripts/_cars_raw.json");

const SOLD = new Set(["5628109", "5807831"]);

const MAKE = {
  VW: "Volkswagen",
  "VW Volkswagen": "Volkswagen",
  Dacija: "Dacia",
  Citroen: "Citroën",
};
const SLUG = {
  Renault: "renault", Audi: "audi", Lancia: "lancia", Seat: "seat",
  Volkswagen: "volkswagen", BMW: "bmw", Chevrolet: "chevrolet", Ford: "ford",
  Fiat: "fiat", Peugeot: "peugeot", Hyundai: "hyundai", Dacia: "dacia",
  Nissan: "nissan", Opel: "opel", Kia: "kia", "Citroën": "citroen", Mazda: "mazda",
};
const FUEL = { "Дизел": "Diesel", "Бензин": "Petrol" };
const TRANS = { "Рачен": "Manual", "Автоматски": "Automatic" };
const COLOR = {
  "Сива": "Grey", "Црна": "Black", "Сина": "Blue", "Бела": "White",
  "Црвена": "Red", "Жолта": "Yellow", "Кафеава": "Brown", "Зелена": "Green",
  "Сребрена": "Silver", "Портокалова": "Orange",
};
// reklama5 body → our Body enum
const BODY = {
  "Седани": "Sedan", "Хеџбек": "Hatchback", "Maли градски": "Hatchback",
  "Мали градски": "Hatchback", "Моноволумен": "MPV", "Каравани": "Estate",
  "Теренци - SUV": "SUV", "Купе": "Coupé",
};

// Feature bullet (UPPERCASE mk-latin) → English. Longest keys matched first.
const FEAT = [
  ["KLIMATRONIK", "Climate control"],
  ["KLIMA", "Air conditioning"],
  ["BORD KOMPJUTER", "Trip computer"],
  ["TEMPOMAT", "Cruise control"],
  ["PARKING SENZORI", "Parking sensors"],
  ["ZADNA KAMERA", "Rear camera"],
  ["NAVIGACIJA", "Navigation"],
  ["HENON SVETLA", "Xenon headlights"],
  ["HENON", "Xenon headlights"],
  ["MAGLENKI", "Fog lights"],
  ["GREACI NA SEDISTA", "Heated seats"],
  ["ALUMINSKI BANDASI", "Alloy wheels"],
  ["SERVISNA ISTORIJA", "Full service history"],
  ["FABRICKO CD RADIO", "Factory CD radio"],
  ["DVD RADIO", "DVD radio"],
  ["RADIO CD", "CD radio"],
  ["ELEKTRICNI STAKLA", "Electric windows"],
  ["CENTRALNO", "Central locking"],
  ["SERVO", "Power steering"],
  ["2 KLUCEVI", "Two keys"],
  ["ABS,ESP", "ABS & ESP"],
  ["ABS", "ABS"],
  ["ESP", "ESP"],
  ["8X AIR BAG", "8 airbags"],
  ["6X AIR BAG", "6 airbags"],
  ["4X AIR BAG", "4 airbags"],
  ["AIR BAG", "Airbags"],
  ["EURO KUKA ATESTIRANA", "Certified tow bar"],
  ["EURO KUKA", "Tow bar"],
  ["ZATEMNETI ZADNI STAKLA", "Tinted rear windows"],
  ["ISOFIX", "ISOFIX"],
  ["AUX", "AUX input"],
  ["USB", "USB"],
  ["ZIMSKI GUMI", "Winter tyres"],
  ["LETNI GUMI", "Summer tyres"],
];

const CN = { "Македонска": "Macedonian" };

function titleCaseModel(m) {
  return m
    .replace(/[Аа]/g, "A") // stray cyrillic A
    .replace(/^Volkswagen\s+/i, "")
    .trim();
}

function euroOf(c) {
  const m = (c.emisija || "").match(/(\d)/);
  if (m) return `Euro ${m[1]}`;
  const d = c.desc.match(/EURO\s*(\d)/i);
  return d ? `Euro ${d[1]}` : "";
}

function powerOf(c) {
  // "81 kw / 110 ks" → { kw, hp }
  const m = c.power.match(/(\d+)\s*kw\s*\/\s*(\d+)\s*ks/i);
  if (m) return { kw: +m[1], hp: +m[2], label: `${m[1]} kW / ${m[2]} hp` };
  return { kw: 0, hp: 0, label: c.power };
}

function engineOf(title) {
  const m = title.match(/(\d\.\d)\s*(TDI|HDI|DCI|CRDI|CDTI|JTD|TDCI|BENZIN|BENZI)?/i);
  return m ? m[1] : "";
}

function featuresOf(desc) {
  const bullets = desc.split(/--|,,/).map((s) => s.trim().toUpperCase()).filter(Boolean);
  const found = [];
  const seen = new Set();
  for (const b of bullets) {
    for (const [k, en] of FEAT) {
      if (b.includes(k) && !seen.has(en)) {
        seen.add(en);
        found.push(en);
      }
    }
  }
  // Stable, sensible display order
  const ORDER = FEAT.map((f) => f[1]);
  return found.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
}

function narrativeOf(c, make, model, fuel, trans, power, color, euro) {
  const km = Number(c.km).toLocaleString("en-US");
  const imported = /UVEZEN[AO]\s+OD\s+SLOVEN/i.test(c.desc) ? " Imported from Slovenia," : "";
  const service = /SERVISNA ISTORIJA/i.test(c.desc) ? " with full service history" : "";
  const eng = engineOf(c.title);
  const engStr = eng ? `${eng}-litre ` : "";
  return (
    `This ${c.godina} ${make} ${model} runs a ${engStr}${fuel.toLowerCase()} engine ` +
    `producing ${power.label}, paired with a ${trans.toLowerCase()} gearbox, and has covered ` +
    `${km} km${service}.${imported} Finished in ${color.toLowerCase()}, it's presented in ` +
    `excellent mechanical and technical condition — engine, body and interior all like new — ` +
    `with complete documentation prepared and ready for registration. ${euro} compliant.`
  );
}

const usedSlugs = new Set();
const out = [];
for (const c of cars) {
  if (SOLD.has(c.id)) continue;
  const make = MAKE[c.marka] || c.marka;
  const brandSlug = SLUG[make];
  const model = titleCaseModel(c.model);
  const fuel = FUEL[c.gorivo] || c.gorivo;
  const trans = TRANS[c.menuvac] || c.menuvac;
  const color = COLOR[c.boja] || c.boja || "—";
  const body = BODY[c.body] || "Hatchback";
  const power = powerOf(c);
  const euro = euroOf(c);
  const year = Number(c.godina) || 0;
  const name = `${make} ${model}`;

  let slug = `${brandSlug}-${model.toLowerCase().replace(/[^a-z0-9]+/g, "")}-${year}`;
  if (usedSlugs.has(slug)) slug += "-" + c.id.slice(-3);
  usedSlugs.add(slug);

  const registration =
    c.reg && c.regDo ? `${CN[c.reg] || c.reg}, registered until ${c.regDo}` : "";

  out.push({
    id: slug,
    adId: c.id,
    name,
    make,
    brandSlug,
    model,
    price: c.price,
    year,
    mileage: Number(c.km) || 0,
    fuel,
    transmission: trans,
    body,
    power: power.label,
    hp: power.hp,
    color,
    euro,
    registration,
    features: featuresOf(c.desc),
    description: narrativeOf(c, make, model, fuel, trans, power, color, euro),
    photos: c.photos,
  });
}

fs.writeFileSync(
  "C:/Users/marko/avto-plac-dado/scripts/_enriched.json",
  JSON.stringify(out, null, 1)
);
console.log("cars:", out.length);
for (const o of out)
  console.log(
    `${o.id} | ${o.name} | ${o.year} | ${o.price}€ | ${o.mileage}km | ${o.fuel}/${o.transmission} | ${o.body} | ${o.power} | ${o.color} | ${o.euro} | feats:${o.features.length} | ph:${o.photos.length}`
  );
