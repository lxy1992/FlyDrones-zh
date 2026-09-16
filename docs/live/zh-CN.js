// 只转换展示文案；保留模拟引擎中的英文标识和全部计算规则。
const gestures = {
  "no hand": "未检测到手", "open palm": "张开手掌", fist: "握拳悬停",
  "hand left": "手向左移", "hand right": "手向右移", "hand dropped": "放下手掌",
  "fist, moved right": "握拳向右移", "hand rushes at camera": "手掌快速靠近",
  "fist, close": "近距离握拳", "half open": "半张手掌",
};

const channels = {
  "scene drifts up -> T4c -> VS -> DNg02 up -> climb": "画面上移 → T4c → VS → DNg02 活动增强 → 上升",
  "no motion -> DNg02 at rest -> hold": "画面静止 → DNg02 回到基线 → 悬停",
  "scene rotates right -> HS -> DNg02 R>L -> yaw": "画面右转 → HS → DNg02 右侧强于左侧 → 转向",
  "scene rotates left -> HS -> DNg02 L>R -> yaw": "画面左转 → HS → DNg02 左侧强于右侧 → 转向",
  "scene drifts down -> T4d -> LPi -| DNg02 -> descend": "画面下移 → T4d → LPi 抑制 DNg02 → 下降",
  "camera optic flow only": "仅使用模拟相机的画面运动信息（光流）",
  "expansion -> LPLC2 + LC4 -> giant fiber DNp01": "物体在视野中扩大 → LPLC2 + LC4 → 巨纤维 DNp01",
  "looming -> DNp03 / DNp01 -> brake + saccade": "物体逼近 → DNp03 / DNp01 → 减速并快速转向",
  "optic flow -> T4/T5 -> HS/VS -> DNg02 -> steady flight": "画面运动 → T4/T5 → HS/VS → DNg02 → 平稳飞行",
  "expansion -> LPLC2 + LC4 -> giant fiber DNp01 -> jump": "物体逼近 → LPLC2 + LC4 → 巨纤维 DNp01 → 跳跃躲避",
  "LPLC2 + LC4 -> giant fiber DNp01 -> escape": "LPLC2 + LC4 → 巨纤维 DNp01 → 逃逸反应",
  "LPLC2 + LC4 -> giant fiber DNp01 -> escape climb": "LPLC2 + LC4 → 巨纤维 DNp01 → 上升躲避",
};

const notes = {
  settling: "正在稳定", "warming up the brain": "神经网络预热中",
  ceiling: "高度上限保护", floor: "最低高度保护", geofence: "活动范围保护",
  "giant fiber escape (climb)": "巨纤维触发上升躲避",
  "giant fiber escape (drop)": "巨纤维触发下降躲避",
  "giant fiber escape (brake)": "巨纤维触发减速躲避",
};

export const gestureZh = (label) => gestures[label] ?? label;
export const channelZh = (channel) => channels[channel] ?? channel;
export const noteZh = (note) => note ? note.split("; ").map((s) => notes[s] ?? s).join("；") : "指令已通过保护层";
export const sideZh = (side) => ({ L: "左", R: "右" }[side] ?? side);
export const viewZh = (view) => ({ orbit: "环绕", chase: "跟随", drone: "机载相机" }[view] ?? view);
export const furnitureZh = (name) => ({ chair: "椅子", bed: "床", wardrobe: "衣柜" }[name] ?? name);
