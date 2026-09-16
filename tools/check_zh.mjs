// No dependencies: check the localization without changing the simulation.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_TIMELINE } from "../docs/live/engine.js";
import { gestureZh, channelZh, noteZh, sideZh, viewZh } from "../docs/live/zh-CN.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
const html = read("docs/index.html"), app = read("docs/live/app.js");
for (const [file, expected] of Object.entries({
  "docs/live/engine.js": "e35873aa03c77866fee673d58e44546802c01a903c6ba7795065f661a8c5582b",
  "docs/live/minifly.json": "19f787599993ec3fcb53307ddff61dd5c58c355103d60620522cb7a85db66575",
})) {
  const actual = createHash("sha256").update(readFileSync(resolve(root, file))).digest("hex");
  assert.equal(actual, expected, `Upstream simulation changed: ${file}`);
}
console.log("ok: original MiniFly engine and network are byte-for-byte unchanged");

assert.match(html, /<html lang="zh-CN">/);
for (const text of ["中文试玩", "张掌上升", "握拳悬停", "放电栅格", "拍打挑战", "原作 SpikeCalls / MIT"])
  assert.ok(html.includes(text), `Missing Chinese UI: ${text}`);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate HTML IDs");
for (const [, id] of app.matchAll(/\$\("([^"]+)"\)/g))
  assert.ok(ids.includes(id), `Missing UI element: ${id}`);
console.log("ok: Chinese page and UI element wiring");

const labels = new Set(DEMO_TIMELINE.map(([, g]) => g.label));
for (const [, label] of app.matchAll(/label:\s*"([^"]+)"/g)) labels.add(label);
labels.add("half open");
for (const label of labels) assert.match(gestureZh(label), /[\u4e00-\u9fff]/u, `Untranslated gesture: ${label}`);
for (const channel of [
  "scene drifts up -> T4c -> VS -> DNg02 up -> climb", "no motion -> DNg02 at rest -> hold",
  "scene rotates right -> HS -> DNg02 R>L -> yaw", "scene rotates left -> HS -> DNg02 L>R -> yaw",
  "scene drifts down -> T4d -> LPi -| DNg02 -> descend", "camera optic flow only",
  "expansion -> LPLC2 + LC4 -> giant fiber DNp01", "looming -> DNp03 / DNp01 -> brake + saccade",
  "optic flow -> T4/T5 -> HS/VS -> DNg02 -> steady flight",
  "expansion -> LPLC2 + LC4 -> giant fiber DNp01 -> jump", "LPLC2 + LC4 -> giant fiber DNp01 -> escape",
]) assert.match(channelZh(channel), /[\u4e00-\u9fff]/u, `Untranslated channel: ${channel}`);
assert.equal(noteZh("giant fiber escape (climb); ceiling"), "巨纤维触发上升躲避；高度上限保护");
assert.equal(noteZh(""), "指令已通过保护层");
assert.equal(sideZh("L"), "左");
assert.equal(viewZh("drone"), "机载相机");
console.log("ok: gestures, pathways, status messages and view names");

const imports = JSON.parse(html.match(/<script type="importmap">\s*([\s\S]*?)<\/script>/)[1]).imports;
const seen = new Set();
function checkImports(file) {
  if (seen.has(file)) return;
  seen.add(file);
  assert.ok(existsSync(file), `Missing static asset: ${file}`);
  const source = readFileSync(file, "utf8");
  for (const [, spec] of source.matchAll(/(?:from\s+|import\s*)["']([^"']+)["']/g)) {
    let target;
    if (spec.startsWith(".")) target = resolve(dirname(file), spec);
    else if (imports[spec]) target = resolve(root, "docs", imports[spec]);
    else {
      const prefix = Object.keys(imports).find((p) => p.endsWith("/") && spec.startsWith(p));
      assert.ok(prefix, `Unmapped module: ${spec}`);
      target = resolve(root, "docs", imports[prefix], spec.slice(prefix.length));
    }
    checkImports(target);
  }
}
checkImports(resolve(root, "docs/live/app.js"));
console.log(`ok: ${seen.size} local JavaScript modules resolve for GitHub project Pages`);
