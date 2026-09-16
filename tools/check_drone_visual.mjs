// Lock the renderer to the pre-2.0 page shown in the user's reference screenshot.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const app = readFileSync(new URL("../docs/live/app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../docs/index.html", import.meta.url), "utf8");
const version = JSON.parse(readFileSync(new URL("../docs/live/upstream-version.json", import.meta.url), "utf8"));
assert.equal(version.upstream_commit, "2409f08c03f3e4c9deda3f10996f37a031014c02");
assert.ok(!/\bcreateFly\b|\bcreateRoom\b|\bcreateSwatter\b/.test(app), "Do not reintroduce 2.0 scene models");
assert.ok(!/bSwat|bTheme|bView|bSound|点击果蝇/.test(html), "Keep the previous version's controls and layout");

const hash = (value) => createHash("sha256").update(value).digest("hex");
const section = (start, end) => {
  assert.ok(app.includes(start) && app.includes(end), "Missing original renderer section");
  return app.slice(app.indexOf(start), app.indexOf(end));
};
const render = section(
  "// ================================================================== three.js scene",
  "// ================================================================== HUD canvases",
).replace("furnitureZh(b.name)", "b.name.toUpperCase()")
  .replaceAll("ui-monospace, Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', monospace", "ui-monospace, Menlo, Consolas, monospace");
assert.equal(hash(render), version.render_sha256, "Camera, room, drone, lighting or visual setup changed from the previous version");
const animation = section("let lastEsc = false;", "// ================================================================== loop / record API");
assert.equal(hash(animation), version.animation_sha256, "Original flight animation must stay unchanged");
console.log("ok: previous-version room, quadcopter, camera, lighting and animation preserved exactly (except Chinese labels)");
