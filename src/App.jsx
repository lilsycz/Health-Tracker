import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────
const DAYS = [
  {
    id: "A", label: "A天", sub: "臀腿", color: "#2E7D32", accent: "#81C784",
    exercises: [
      { name: "死虫式 Dead Bug", type: "核心", sets: 3, reps: "10次/边", weight: "自重", note: "腰部全程贴地" },
      { name: "保加利亚单腿蹲", type: "主项", sets: 4, reps: "8–10次", weight: "10–14kg/边", note: "核心收紧，膝盖对脚尖" },
      { name: "臀推", type: "主项", sets: 4, reps: "10–12次", weight: "60–70kg", note: "顶部停顿1秒" },
      { name: "单腿硬拉", type: "辅项", sets: 3, reps: "10次/边", weight: "10–12kg/边", note: "脊椎中立，不弯腰" },
    ],
  },
  {
    id: "B", label: "B天", sub: "背", color: "#1565C0", accent: "#64B5F6",
    exercises: [
      { name: "侧板支撑", type: "核心", sets: 3, reps: "30秒/边", weight: "自重", note: "身体成一条直线" },
      { name: "高位下拉 / 辅助引体", type: "主项", sets: 4, reps: "8–10次", weight: "45–50kg / 辅助30–35kg", note: "肩胛骨主动下沉" },
      { name: "V-bar划船", type: "主项", sets: 4, reps: "10–12次", weight: "45–50kg", note: "挺胸，肘部贴身" },
      { name: "单臂哑铃划船", type: "辅项", sets: 3, reps: "10次/边", weight: "16–20kg", note: "腰椎中立，不旋转" },
    ],
  },
  {
    id: "C", label: "C天", sub: "胸肩", color: "#E65100", accent: "#FFB74D",
    exercises: [
      { name: "死虫式 Dead Bug", type: "核心", sets: 3, reps: "10次/边", weight: "自重", note: "配合呼吸，慢速控制" },
      { name: "平板卧推", type: "主项", sets: 4, reps: "6–8次", weight: "35–40kg", note: "肩胛骨收紧下沉" },
      { name: "上斜哑铃卧推", type: "主项", sets: 3, reps: "10–12次", weight: "12.5–15kg/边", note: "控制下放，感受拉伸" },
      { name: "坐姿推肩", type: "辅项", sets: 3, reps: "10–12次", weight: "8–10kg/边", note: "充分热身后进行" },
      { name: "弹力带肩外旋", type: "辅项", sets: 3, reps: "15次/边", weight: "轻阻力弹力带", note: "肘贴肋骨，康复为主" },
    ],
  },
];

const TYPE_STYLE = {
  核心: { bg: "#FFF9C4", color: "#F57F17" },
  主项: { bg: "#E8F5E9", color: "#2E7D32" },
  辅项: { bg: "#FFF3E0", color: "#E65100" },
};

const PROTEINS = [
  { id: "p1", name: "三文鱼", amount: "200g", protein: 40, fat: 26, carb: 0, cal: 416 },
  { id: "p2", name: "金枪鱼 + 1个蛋", amount: "150g + 1蛋", protein: 43, fat: 8, carb: 0, cal: 252 },
  { id: "p3", name: "虾", amount: "200g", protein: 40, fat: 2, carb: 0, cal: 176 },
  { id: "p4", name: "鳕鱼", amount: "200g", protein: 40, fat: 2, carb: 0, cal: 176 },
  { id: "p5", name: "三文鱼 + 3个蛋", amount: "100g + 3蛋", protein: 38, fat: 28, carb: 0, cal: 392 },
  { id: "p6", name: "豆腐 + 3个蛋", amount: "200g + 3蛋", protein: 34, fat: 16, carb: 3, cal: 256 },
];

const CARBS = [
  { id: "c1", name: "土豆", amount: "280–300g", protein: 5, fat: 0, carb: 60, cal: 260 },
  { id: "c2", name: "藜麦饭", amount: "220–240g", protein: 6, fat: 2, carb: 60, cal: 282 },
  { id: "c3", name: "杂粮饭", amount: "180–200g", protein: 5, fat: 1, carb: 60, cal: 268 },
];

const VEGS = [
  { id: "v1", name: "混合蔬菜" },
  { id: "v2", name: "番茄" },
  { id: "v3", name: "玉米" },
  { id: "v4", name: "豌豆" },
];

const OIL = { fat: 14, cal: 120 };

// ─── SHARED COMPONENTS ───────────────────────────────────────────
function Checkmark() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── FITNESS COMPONENTS ──────────────────────────────────────────
function SetDot({ done, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 34, height: 34, borderRadius: "50%",
      border: done ? "none" : "2px solid #BDBDBD",
      background: done ? "#43A047" : "#F5F5F5",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
    }}>
      {done && <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M3.5 9L7.5 13L14.5 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>}
    </button>
  );
}

function ExerciseCard({ exercise, dayColor, checks, onToggle }) {
  const done = checks.every(Boolean);
  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "12px 14px", marginBottom: 8,
      border: `1px solid ${done ? dayColor : "#E0E0E0"}`,
      opacity: done ? 0.6 : 1, transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", textDecoration: done ? "line-through" : "none" }}>
          {exercise.name}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
          background: TYPE_STYLE[exercise.type]?.bg, color: TYPE_STYLE[exercise.type]?.color,
        }}>{exercise.type}</span>
      </div>
      <div style={{ fontSize: 11, color: "#757575", marginBottom: 8 }}>
        <span style={{ marginRight: 10 }}>⚡ {exercise.weight}</span>
        <span>🔄 {exercise.reps}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#9E9E9E", minWidth: 28 }}>组数</span>
        {checks.map((d, i) => <SetDot key={i} done={d} onClick={() => onToggle(i)} />)}
        <span style={{ fontSize: 11, color: "#9E9E9E" }}>{checks.filter(Boolean).length}/{checks.length}</span>
      </div>
      {exercise.note && (
        <div style={{ marginTop: 8, fontSize: 11, color: "#9E9E9E", borderTop: "1px solid #F5F5F5", paddingTop: 6 }}>
          💡 {exercise.note}
        </div>
      )}
    </div>
  );
}

const WEEKDAYS = ["周日","周一","周二","周三","周四","周五","周六"];
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()} ${WEEKDAYS[d.getDay()]}`;
}
function fullTimeStr() {
  const d = new Date();
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()} ${WEEKDAYS[d.getDay()]} ${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function FitnessModule({ checks, setChecks, fitnessLogs, setFitnessLogs }) {
  const [subTab, setSubTab] = useState("train");
  const [activeDay, setActiveDay] = useState(0);
  const [cardio, setCardio] = useState("");
  const [isCardioDay, setIsCardioDay] = useState(false);

  const toggle = (exIdx, setIdx) => {
    setChecks(prev => {
      const next = prev.map(d => d.map(e => [...e]));
      next[activeDay][exIdx][setIdx] = !next[activeDay][exIdx][setIdx];
      return next;
    });
  };

  const reset = () => {
    setChecks(prev => {
      const next = [...prev];
      next[activeDay] = DAYS[activeDay].exercises.map(ex => Array(ex.sets).fill(false));
      return next;
    });
  };

  const day = DAYS[activeDay];
  const totalSets = day.exercises.reduce((s, e) => s + e.sets, 0);
  const doneSets = checks[activeDay].reduce((s, e) => s + e.filter(Boolean).length, 0);
  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
  const totalAll = checks.flat(2).length;
  const doneAll = checks.flat(2).filter(Boolean).length;

  return (
    <div>
      {/* Sticky header */}
      <div style={{ background: "#1A1A1A", padding: "16px 16px 0", position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
          <div style={{ fontSize: 11, color: "#616161", letterSpacing: 2 }}>稳定期 6–8周</div>
          <div style={{ fontSize: 11, color: "#616161" }}>{todayStr()}</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 12 }}>训练追踪</div>
        <div style={{ display: "flex" }}>
          {[["train", "今日训练"], ["log", `训练记录${fitnessLogs.length > 0 ? ` (${fitnessLogs.length})` : ""}`]].map(([t, label]) => (
            <button key={t} onClick={() => setSubTab(t)} style={{
              flex: 1, padding: "9px", border: "none", background: "none",
              color: subTab === t ? "white" : "#616161",
              fontWeight: subTab === t ? 700 : 400, fontSize: 13, cursor: "pointer",
              borderBottom: subTab === t ? "2px solid white" : "2px solid transparent",
              transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 14px 20px" }}>
        {subTab === "train" ? (
          <>
            {/* Day tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {DAYS.map((d, i) => {
                const ds = d.exercises.reduce((s, e) => s + e.sets, 0);
                const dd = checks[i]?.flat().filter(Boolean).length ?? 0;
                const active = activeDay === i && !isCardioDay;
                return (
                  <button key={i} onClick={() => { setActiveDay(i); setIsCardioDay(false); }} style={{
                    flex: 1, padding: "7px 4px", borderRadius: 8, border: "none",
                    background: active ? d.color : "#E8E8E8",
                    color: active ? "white" : "#616161",
                    fontWeight: active ? 700 : 400, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                  }}>
                    {d.label}<br />
                    <span style={{ fontSize: 10, opacity: 0.8 }}>{dd}/{ds}</span>
                  </button>
                );
              })}
              <button onClick={() => setIsCardioDay(true)} style={{
                flex: 1, padding: "7px 4px", borderRadius: 8, border: "none",
                background: isCardioDay ? "#FDD835" : "#E8E8E8",
                color: isCardioDay ? "white" : "#616161",
                fontWeight: isCardioDay ? 700 : 400, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
              }}>
                🏃<br />
                <span style={{ fontSize: 10, opacity: 0.8 }}>有氧</span>
              </button>
            </div>

            {isCardioDay ? (
              <>
                {/* 纯有氧日 */}
                <div style={{ background: "#FDD835", borderRadius: "12px 12px 0 0", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#1A1A1A" }}>有氧训练</div>
                    <div style={{ fontSize: 11, color: "#5D4037", marginTop: 2 }}>记录今日有氧内容</div>
                  </div>
                  {cardio.trim() && <div style={{ fontSize: 26, fontWeight: 900, color: "#1A1A1A" }}>100%</div>}
                </div>
                <div style={{ height: 3, background: "#E0E0E0", marginBottom: 10 }}>
                  <div style={{ height: "100%", width: cardio.trim() ? "100%" : "0%", background: "#FDD835", transition: "width 0.4s" }} />
                </div>

                <div style={{ background: "white", borderRadius: 12, padding: "12px 13px", marginBottom: 8, border: "1px solid #E0E0E0" }}>
                  <textarea
                    value={cardio}
                    onChange={e => setCardio(e.target.value.slice(0, 100))}
                    placeholder="例：跑步30分钟、骑车45分钟、游泳1小时..."
                    style={{
                      width: "100%", minHeight: 80, padding: "9px 11px",
                      borderRadius: 8, border: "1.5px solid #E0E0E0",
                      fontSize: 12, color: "#1A1A1A", resize: "none",
                      fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "#FDD835"}
                    onBlur={e => e.target.style.borderColor = "#E0E0E0"}
                  />
                  <div style={{ fontSize: 11, color: "#9E9E9E", marginTop: 4 }}>{cardio.length}/100字</div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setCardio("")} style={{
                    flex: 1, padding: "9px", background: "none",
                    border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 12, color: "#9E9E9E", cursor: "pointer",
                  }}>清空</button>
                  <button onClick={() => {
                    if (!cardio.trim()) return;
                    setFitnessLogs(prev => [{
                      id: Date.now(),
                      time: fullTimeStr(),
                      day: "有氧",
                      sub: cardio.trim(),
                      color: "#FDD835",
                      doneSets: 0,
                      totalSets: 0,
                      pct: 100,
                      cardio: cardio.trim(),
                      type: "有氧",
                    }, ...prev]);
                    setSubTab("log");
                  }} style={{
                    flex: 2, padding: "9px",
                    background: cardio.trim() ? "#FDD835" : "#E0E0E0",
                    border: "none", borderRadius: 8, fontSize: 12,
                    color: cardio.trim() ? "#1A1A1A" : "#9E9E9E",
                    cursor: cardio.trim() ? "pointer" : "not-allowed",
                    fontWeight: 600, transition: "all 0.2s",
                  }}>记录有氧训练 →</button>
                </div>
              </>
            ) : (
              <>

            {/* Day card */}
            <div style={{ background: day.color, borderRadius: "12px 12px 0 0", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "white" }}>{day.label} · {day.sub}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{day.exercises.length}个动作 · {totalSets}组</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "white" }}>{pct}%</div>
                {pct === 100 && <div style={{ fontSize: 11, color: day.accent, fontWeight: 600 }}>完成 ✓</div>}
              </div>
            </div>
            <div style={{ height: 3, background: "#E0E0E0", marginBottom: 10 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: day.color, transition: "width 0.4s" }} />
            </div>

            {day.exercises.map((ex, ei) => (
              <ExerciseCard key={ei} exercise={ex} dayColor={day.color}
                checks={checks[activeDay][ei]} onToggle={(si) => toggle(ei, si)} />
            ))}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={reset} style={{
                flex: 1, padding: "9px", background: "none",
                border: "1px solid #E0E0E0", borderRadius: 8, fontSize: 12, color: "#9E9E9E", cursor: "pointer",
              }}>重置</button>
              <button onClick={() => {
                if (doneSets === 0) return;
                setFitnessLogs(prev => [{
                  id: Date.now(),
                  time: fullTimeStr(),
                  day: day.label,
                  sub: day.sub,
                  color: day.color,
                  doneSets,
                  totalSets,
                  pct,
                  cardio: "",
                  type: "举铁",
                }, ...prev]);
                setSubTab("log");
              }} style={{
                flex: 2, padding: "9px",
                background: doneSets > 0 ? day.color : "#E0E0E0",
                border: "none", borderRadius: 8, fontSize: 12,
                color: doneSets > 0 ? "white" : "#9E9E9E",
                cursor: doneSets > 0 ? "pointer" : "not-allowed",
                fontWeight: 600, transition: "all 0.2s",
              }}>记录本次训练 →</button>
            </div>

            {/* Week summary */}
            <div style={{
              marginTop: 12, background: "white", borderRadius: 10, padding: "12px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 12, color: "#757575" }}>本周总进度</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{doneAll} / {totalAll} 组</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: doneAll === totalAll ? "#2E7D32" : "#9E9E9E" }}>
                {Math.round((doneAll / totalAll) * 100)}%
              </div>
            </div>
            </>
            )}
          </>
        ) : (
          <>
            {fitnessLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "#9E9E9E" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🏋️</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>还没有训练记录</div>
                <div style={{ fontSize: 11 }}>完成训练后点击"记录本次训练"</div>
              </div>
            ) : (
              <>
                {/* Log summary */}
                <div style={{
                  background: "#1A1A1A", borderRadius: 12, padding: "12px 14px", marginBottom: 12,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#616161", marginBottom: 3 }}>累计训练</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{fitnessLogs.length} 次</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#616161", marginBottom: 3 }}>平均完成率</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#81C784" }}>
                      {Math.round(fitnessLogs.reduce((s, l) => s + l.pct, 0) / fitnessLogs.length)}%
                    </div>
                  </div>
                </div>

                {fitnessLogs.map(log => (
                  <div key={log.id} style={{
                    background: "white", borderRadius: 11, padding: "11px 13px", marginBottom: 8,
                    border: `1px solid ${log.color}40`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                            background: `${log.color}20`, color: log.color,
                          }}>{log.day} · {log.sub}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#9E9E9E", marginBottom: 6 }}>{log.time}</div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <div style={{ fontSize: 11 }}>
                            <span style={{ color: log.color, fontWeight: 600 }}>{log.doneSets}/{log.totalSets}</span>
                            <span style={{ color: "#9E9E9E", marginLeft: 2 }}>组</span>
                          </div>
                          <div style={{ fontSize: 11 }}>
                            <span style={{ color: log.color, fontWeight: 600 }}>{log.pct}%</span>
                            <span style={{ color: "#9E9E9E", marginLeft: 2 }}>完成</span>
                          </div>
                        </div>
                        {log.cardio && (
                          <div style={{ fontSize: 11, color: "#1565C0", marginTop: 4 }}>
                            🏃 {log.cardio}
                          </div>
                        )}
                      </div>
                      <button onClick={() => setFitnessLogs(prev => prev.filter(x => x.id !== log.id))} style={{
                        background: "none", border: "none", color: "#BDBDBD", cursor: "pointer", fontSize: 18, padding: "0 0 0 8px",
                      }}>×</button>
                    </div>
                  </div>
                ))}

                <button onClick={() => setSubTab("train")} style={{
                  width: "100%", padding: "11px", marginTop: 4, borderRadius: 9,
                  border: "1.5px solid #E0E0E0", background: "white",
                  fontSize: 13, fontWeight: 600, color: "#1A1A1A", cursor: "pointer",
                }}>+ 继续训练</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── MEAL COMPONENTS ─────────────────────────────────────────────
function CheckItem({ item, selected, onToggle, color, multi }) {
  return (
    <button onClick={onToggle} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "9px 12px", marginBottom: 5, borderRadius: 10,
      border: `1.5px solid ${selected ? color : "#E0E0E0"}`,
      background: selected ? `${color}12` : "white", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
    }}>
      <div style={{
        width: 20, height: 20, flexShrink: 0, transition: "all 0.2s",
        borderRadius: multi ? 4 : "50%",
        border: `2px solid ${selected ? color : "#BDBDBD"}`,
        background: selected ? color : "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <Checkmark />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{item.name}</div>
        <div style={{ fontSize: 11, color: "#9E9E9E", marginTop: 1 }}>
          {item.amount && <span>{item.amount}</span>}
          {item.protein != null && <span style={{ marginLeft: 8, color: "#2E7D32" }}>蛋白质 {item.protein}g</span>}
          {item.carb != null && item.carb > 0 && <span style={{ marginLeft: 8, color: "#1565C0" }}>碳水 {item.carb}g</span>}
          {item.cal != null && <span style={{ marginLeft: 8, color: "#9E9E9E" }}>{item.cal}kcal</span>}
        </div>
      </div>
    </button>
  );
}

function SectionTitle({ emoji, label, color, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{label}</span>
      {done && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: `${color}20`, color }}>✓</span>}
    </div>
  );
}

// 早餐固定配置
const BREAKFAST = {
  name: "酸奶燕麦早餐",
  items: "高蛋白酸奶100g + 开菲尔100g + 燕麦20g + 南瓜籽一把 + 奇亚籽少量 + 椰子脆片 + 冻芒果少量",
  protein: 20, carb: 28, fat: 10, cal: 280,
};

function MealModule({ records, setRecords }) {
  const [subTab, setSubTab] = useState("plan");
  const [mealType, setMealType] = useState(null);
  const [selP, setSelP] = useState(null);
  const [selC, setSelC] = useState(null);
  const [selV, setSelV] = useState([]);
  const [snackPP, setSnackPP] = useState(false);
  const [snackEggs, setSnackEggs] = useState(0);
  const [feeling, setFeeling] = useState("");
  const [weight, setWeight] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // null | "success" | "error"

  const WEBHOOK = "https://script.google.com/macros/s/AKfycbzTisAbO30mHPBnaJsGQorG6k1wwH5MATpgnsYnRFzZ_60MOtq1C6K0pFwIUF7UkOvj/exec";

  const syncToSheet = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const today = new Date();
      const dateStr = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`;
      const totalProtein = records.reduce((s, r) => s + r.totalProtein, 0);
      const totalCarb = records.reduce((s, r) => s + r.totalCarb, 0);
      const totalFat = records.reduce((s, r) => s + r.totalFat, 0);
      const totalCal = records.reduce((s, r) => s + r.totalCal, 0);
      const trainingStr = records.map(r => r.mealType).join("、");
      const typeStr = [...new Set(records.map(r => r.mealType))].join("+");

      const params = new URLSearchParams({
        action: "sync",
        date: dateStr,
        training: trainingStr,
        type: typeStr,
        protein: totalProtein,
        carb: totalCarb,
        fat: totalFat,
        cal: totalCal,
        weight: weight || "",
        feeling: feeling || "",
      });

      const res = await fetch(`${WEBHOOK}?${params.toString()}`);
      const json = await res.json();
      setSyncStatus(json.success ? "success" : "error");
    } catch (err) {
      setSyncStatus("error");
    } finally {
      setSyncing(false);
    }
  };

  const isBreakfast = mealType === "早餐";
  const isSnack = mealType === "加餐";
  const canSave = isBreakfast ? true
    : isSnack ? (snackPP || snackEggs > 0)
    : (mealType && selP && selC);

  const save = () => {
    if (!canSave) return;
    if (isBreakfast) {
      setRecords(prev => [{
        id: Date.now(), time: fullTimeStr(), mealType: "早餐",
        protein: BREAKFAST.name,
        carb: BREAKFAST.items,
        vegs: null,
        totalProtein: BREAKFAST.protein,
        totalCarb: BREAKFAST.carb,
        totalFat: BREAKFAST.fat,
        totalCal: BREAKFAST.cal,
        isBreakfast: true,
      }, ...prev]);
    } else if (isSnack) {
      const ppProtein = snackPP ? 26 : 0;
      const ppCal = snackPP ? 170 : 0;
      const eggProtein = snackEggs * 6;
      const eggCal = snackEggs * 80;
      const eggFat = snackEggs * 5;
      const items = [snackPP ? "蛋白粉44g" : null, snackEggs > 0 ? `鸡蛋${snackEggs}个` : null].filter(Boolean).join(" + ");
      setRecords(prev => [{
        id: Date.now(), time: fullTimeStr(), mealType: "加餐",
        protein: items,
        carb: "",
        vegs: null,
        totalProtein: ppProtein + eggProtein,
        totalCarb: 0,
        totalFat: eggFat,
        totalCal: ppCal + eggCal,
        isSnack: true,
      }, ...prev]);
    } else {
      setRecords(prev => [{
        id: Date.now(), time: fullTimeStr(), mealType,
        protein: `${selP.name} ${selP.amount}`,
        carb: `${selC.name} ${selC.amount}`,
        vegs: selV.length > 0 ? selV.map(v => v.name).join("、") : null,
        totalProtein: (selP.protein || 0) + (selC.protein || 0),
        totalCarb: (selP.carb || 0) + (selC.carb || 0),
        totalFat: (selP.fat || 0) + OIL.fat,
        totalCal: (selP.cal || 0) + (selC.cal || 0) + OIL.cal,
      }, ...prev]);
    }
    setMealType(null); setSelP(null); setSelC(null); setSelV([]);
    setSnackPP(false); setSnackEggs(0);
    setSubTab("record");
  };

  const todayP = records.reduce((s, r) => s + r.totalProtein, 0);
  const todayCal = records.reduce((s, r) => s + r.totalCal, 0);

  return (
    <div>
      {/* Sticky meal header */}
      <div style={{
        background: "#1A1A1A", padding: "16px 16px 0",
        position: "sticky", top: 0, zIndex: 5,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
          <div style={{ fontSize: 11, color: "#616161", letterSpacing: 2 }}>减脂保肌</div>
          <div style={{ fontSize: 11, color: "#616161" }}>{todayStr()}</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 12 }}>饮食追踪</div>
        <div style={{ display: "flex" }}>
          {[["plan", "搭配餐食"], ["record", `饮食记录${records.length > 0 ? ` (${records.length})` : ""}`]].map(([t, label]) => (
            <button key={t} onClick={() => setSubTab(t)} style={{
              flex: 1, padding: "9px", border: "none", background: "none",
              color: subTab === t ? "white" : "#616161",
              fontWeight: subTab === t ? 700 : 400, fontSize: 13, cursor: "pointer",
              borderBottom: subTab === t ? "2px solid white" : "2px solid transparent",
              transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 14px 24px" }}>
        {subTab === "plan" ? (
          <>
            {/* Meal type */}
            <div style={{ background: "white", borderRadius: 12, padding: "12px 13px", marginBottom: 10 }}>
              <SectionTitle emoji="🕐" label="选择餐次" color="#6A1B9A" done={!!mealType} />
              <div style={{ display: "flex", gap: 6 }}>
                {["早餐", "午餐", "晚餐", "加餐"].map(m => (
                  <button key={m} onClick={() => { setMealType(m); setSelP(null); setSelC(null); setSelV([]); setSnackPP(false); setSnackEggs(0); }} style={{
                    flex: 1, padding: "8px 4px", borderRadius: 9,
                    border: `1.5px solid ${mealType === m ? "#6A1B9A" : "#E0E0E0"}`,
                    background: mealType === m ? "#F3E5F5" : "white",
                    color: mealType === m ? "#6A1B9A" : "#757575",
                    fontWeight: mealType === m ? 700 : 400, fontSize: 12, cursor: "pointer",
                  }}>{m}</button>
                ))}
              </div>
            </div>

            {/* Snack card */}
            {isSnack && (
              <div style={{ background: "white", borderRadius: 12, padding: "12px 13px", marginBottom: 10 }}>
                <SectionTitle emoji="💪" label="加餐（可多选）" color="#00838F" done={snackPP || snackEggs > 0} />

                {/* Protein powder */}
                <button onClick={() => setSnackPP(p => !p)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 12px", marginBottom: 8, borderRadius: 10,
                  border: `1.5px solid ${snackPP ? "#00838F" : "#E0E0E0"}`,
                  background: snackPP ? "#E0F7FA" : "white", cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${snackPP ? "#00838F" : "#BDBDBD"}`,
                    background: snackPP ? "#00838F" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {snackPP && <Checkmark />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>蛋白粉</div>
                    <div style={{ fontSize: 11, color: "#9E9E9E" }}>44g · 蛋白质26g · 170kcal</div>
                  </div>
                </button>

                {/* Eggs counter */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "9px 12px", borderRadius: 10,
                  border: `1.5px solid ${snackEggs > 0 ? "#00838F" : "#E0E0E0"}`,
                  background: snackEggs > 0 ? "#E0F7FA" : "white",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>鸡蛋</div>
                    <div style={{ fontSize: 11, color: "#9E9E9E" }}>每个 · 蛋白质6g · 80kcal</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => setSnackEggs(n => Math.max(0, n - 1))} style={{
                      width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #E0E0E0",
                      background: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#757575",
                    }}>−</button>
                    <span style={{ fontSize: 16, fontWeight: 700, minWidth: 20, textAlign: "center", color: snackEggs > 0 ? "#00838F" : "#9E9E9E" }}>{snackEggs}</span>
                    <button onClick={() => setSnackEggs(n => Math.min(6, n + 1))} style={{
                      width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #E0E0E0",
                      background: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#757575",
                    }}>+</button>
                  </div>
                </div>

                {/* Snack summary */}
                {(snackPP || snackEggs > 0) && (
                  <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "#F5F5F5", display: "flex", gap: 12 }}>
                    {[
                      { label: "蛋白质", value: `${(snackPP ? 26 : 0) + snackEggs * 6}g`, color: "#2E7D32" },
                      { label: "热量", value: `${(snackPP ? 170 : 0) + snackEggs * 80}kcal`, color: "#757575" },
                    ].map(n => (
                      <div key={n.label} style={{ fontSize: 11 }}>
                        <span style={{ color: n.color, fontWeight: 700 }}>{n.value}</span>
                        <span style={{ color: "#9E9E9E", marginLeft: 2 }}>{n.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={save} disabled={!canSave} style={{
                  width: "100%", padding: "12px", marginTop: 10, borderRadius: 10, border: "none",
                  background: canSave ? "#00838F" : "#E0E0E0",
                  color: canSave ? "white" : "#9E9E9E",
                  fontSize: 14, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed",
                }}>✓ 记录加餐</button>
              </div>
            )}

            {/* Breakfast: fixed card + one-tap record */}
            {isBreakfast && (
              <div style={{ background: "white", borderRadius: 12, padding: "12px 13px", marginBottom: 10 }}>
                <SectionTitle emoji="🥣" label="酸奶燕麦早餐（固定）" color="#F57F17" done />
                <div style={{
                  background: "#FFF8E1", borderRadius: 10, padding: "11px 13px", marginBottom: 12,
                  border: "1.5px solid #FFE082",
                }}>
                  <div style={{ fontSize: 12, color: "#5D4037", lineHeight: 1.7 }}>{BREAKFAST.items}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                    {[
                      { label: "蛋白质", value: `${BREAKFAST.protein}g`, color: "#2E7D32" },
                      { label: "碳水", value: `${BREAKFAST.carb}g`, color: "#1565C0" },
                      { label: "热量", value: `${BREAKFAST.cal}kcal`, color: "#757575" },
                    ].map(n => (
                      <div key={n.label} style={{ fontSize: 11 }}>
                        <span style={{ color: n.color, fontWeight: 700 }}>{n.value}</span>
                        <span style={{ color: "#9E9E9E", marginLeft: 2 }}>{n.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={save} style={{
                  width: "100%", padding: "12px", borderRadius: 10, border: "none",
                  background: "#F57F17", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>✓ 记录早餐</button>
              </div>
            )}

            {/* Protein / Carb / Veg — only for lunch and dinner */}
            {!isBreakfast && !isSnack && (<>
            {/* Protein */}
            <div style={{ background: "white", borderRadius: 12, padding: "12px 13px", marginBottom: 10 }}>
              <SectionTitle emoji="🥩" label="蛋白质（选一种）" color="#2E7D32" done={!!selP} />
              {PROTEINS.map(p => (
                <CheckItem key={p.id} item={p} selected={selP?.id === p.id}
                  onToggle={() => setSelP(selP?.id === p.id ? null : p)} color="#2E7D32" />
              ))}
            </div>

            {/* Carb */}
            <div style={{ background: "white", borderRadius: 12, padding: "12px 13px", marginBottom: 10 }}>
              <SectionTitle emoji="🍚" label="碳水（选一种）" color="#1565C0" done={!!selC} />
              {CARBS.map(c => (
                <CheckItem key={c.id} item={c} selected={selC?.id === c.id}
                  onToggle={() => setSelC(selC?.id === c.id ? null : c)} color="#1565C0" />
              ))}
            </div>

            {/* Veg */}
            <div style={{ background: "white", borderRadius: 12, padding: "12px 13px", marginBottom: 10 }}>
              <SectionTitle emoji="🥦" label="蔬菜（可多选，不限量）" color="#558B2F" done={selV.length > 0} />
              {VEGS.map(v => (
                <CheckItem key={v.id} item={{ ...v, amount: v.id === "v2" ? "少量" : "随意" }}
                  selected={selV.some(s => s.id === v.id)}
                  onToggle={() => setSelV(prev => prev.some(s => s.id === v.id) ? prev.filter(s => s.id !== v.id) : [...prev, v])}
                  color="#558B2F" multi />
              ))}
              <div style={{ padding: "9px 12px", borderRadius: 10, background: "#F9FBE7", border: "1.5px solid #E0E0E0", fontSize: 12, color: "#757575" }}>
                🫙 椰子油 1汤匙（已固定）
              </div>
            </div>

            {/* Summary */}
            {canSave && !isBreakfast && !isSnack && selP && selC && (
              <div style={{
                background: "linear-gradient(135deg, #1A1A1A, #2D2D2D)",
                borderRadius: 13, padding: "14px", marginBottom: 12, color: "white",
              }}>
                <div style={{ fontSize: 12, color: "#757575", marginBottom: 10 }}>本餐营养汇总</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  {[
                    { label: "蛋白质", value: `${(selP.protein||0)+(selC.protein||0)}g`, color: "#81C784" },
                    { label: "碳水", value: `${(selP.carb||0)+(selC.carb||0)}g`, color: "#64B5F6" },
                    { label: "脂肪", value: `${(selP.fat||0)+OIL.fat}g`, color: "#FFB74D" },
                    { label: "热量", value: `${(selP.cal||0)+(selC.cal||0)+OIL.cal}`, color: "#F48FB1" },
                  ].map(n => (
                    <div key={n.label} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: n.color }}>{n.value}</div>
                      <div style={{ fontSize: 10, color: "#616161", marginTop: 2 }}>{n.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #333", paddingTop: 10, fontSize: 12 }}>
                  <div style={{ color: "white", marginBottom: 3 }}>🥩 {selP.name} {selP.amount}</div>
                  <div style={{ color: "white", marginBottom: 3 }}>🍚 {selC.name} {selC.amount}</div>
                  {selV.length > 0 && <div style={{ color: "white", marginBottom: 3 }}>🥦 {selV.map(v => v.name).join("、")}</div>}
                  <div style={{ color: "white" }}>🫙 椰子油 1汤匙</div>
                </div>
              </div>
            )}

            <button onClick={save} disabled={!canSave} style={{
              width: "100%", padding: "13px", borderRadius: 11, border: "none",
              background: canSave ? "#1A1A1A" : "#E0E0E0",
              color: canSave ? "white" : "#9E9E9E",
              fontSize: 14, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed", transition: "all 0.2s",
            }}>
              {canSave ? "记录这餐 →" : "请先选择蛋白质 + 碳水"}
            </button>
            </>)}
          </>
        ) : (
          <>
            {records.length > 0 && (
              <div style={{
                background: "#1A1A1A", borderRadius: 12, padding: "12px 14px", marginBottom: 12,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "#616161", marginBottom: 3 }}>今日累计</div>
                  <div style={{ fontSize: 13, color: "white" }}>
                    <span style={{ color: "#81C784", fontWeight: 700 }}>{todayP}g</span>
                    <span style={{ color: "#616161", margin: "0 5px" }}>蛋白质</span>
                    <span style={{ color: "#FFB74D", fontWeight: 700 }}>{todayCal}</span>
                    <span style={{ color: "#616161", marginLeft: 3 }}>kcal</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#616161", marginBottom: 3 }}>目标</div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: todayP >= 150 ? "#81C784" : "#FF8A65", fontWeight: 700 }}>{todayP}</span>
                    <span style={{ color: "#616161" }}> / 150g</span>
                  </div>
                </div>
              </div>
            )}

            {records.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "#9E9E9E" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🍽</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>还没有记录</div>
                <div style={{ fontSize: 11 }}>去搭配餐食并记录第一餐</div>
              </div>
            ) : records.map(r => (
              <div key={r.id} style={{
                background: "white", borderRadius: 11, padding: "11px 13px", marginBottom: 8,
                border: `1px solid ${r.isBreakfast ? "#FFE082" : "#E0E0E0"}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                        background: r.mealType === "早餐" ? "#FFF8E1" : r.mealType === "午餐" ? "#E3F2FD" : r.mealType === "加餐" ? "#E0F7FA" : "#EDE7F6",
                        color: r.mealType === "早餐" ? "#F57F17" : r.mealType === "午餐" ? "#1565C0" : r.mealType === "加餐" ? "#00838F" : "#4527A0",
                      }}>{r.mealType}</span>
                      <span style={{ fontSize: 11, color: "#9E9E9E" }}>{r.time}</span>
                    </div>
                    {r.isBreakfast ? (
                      <div style={{ fontSize: 12, color: "#757575", marginBottom: 3 }}>🥣 {r.protein}</div>
                    ) : r.isSnack ? (
                      <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 3 }}>💪 {r.protein}</div>
                    ) : (
                      <>
                        <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 3 }}>{r.protein} · {r.carb}</div>
                        {r.vegs && <div style={{ fontSize: 11, color: "#757575" }}>蔬菜：{r.vegs}</div>}
                      </>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 7 }}>
                      {[
                        { label: "蛋白质", value: `${r.totalProtein}g`, color: "#2E7D32" },
                        { label: "碳水", value: `${r.totalCarb}g`, color: "#1565C0" },
                        { label: "热量", value: `${r.totalCal}kcal`, color: "#757575" },
                      ].map(n => (
                        <div key={n.label} style={{ fontSize: 11 }}>
                          <span style={{ color: n.color, fontWeight: 600 }}>{n.value}</span>
                          <span style={{ color: "#9E9E9E", marginLeft: 2 }}>{n.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setRecords(prev => prev.filter(x => x.id !== r.id))} style={{
                    background: "none", border: "none", color: "#BDBDBD", cursor: "pointer", fontSize: 18, padding: "0 0 0 8px",
                  }}>×</button>
                </div>
              </div>
            ))}

            {records.length > 0 && (
              <button onClick={() => setSubTab("plan")} style={{
                width: "100%", padding: "11px", marginTop: 4, borderRadius: 9,
                border: "1.5px solid #E0E0E0", background: "white",
                fontSize: 13, fontWeight: 600, color: "#1A1A1A", cursor: "pointer",
              }}>+ 记录下一餐</button>
            )}

            {/* 今日体重 */}
            <div style={{
              marginTop: 16, background: "white", borderRadius: 12,
              padding: "12px 13px", border: "1px solid #E0E0E0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>⚖️</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>今日体重</span>
                <span style={{ fontSize: 11, color: "#9E9E9E" }}>选填</span>
                {weight && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                    background: "#E8F5E9", color: "#2E7D32",
                  }}>已记录 ✓</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="例：95.5"
                  min="30" max="300" step="0.1"
                  style={{
                    flex: 1, padding: "9px 11px", borderRadius: 8,
                    border: "1.5px solid #E0E0E0", fontSize: 14,
                    color: "#1A1A1A", outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#1A1A1A"}
                  onBlur={e => e.target.style.borderColor = "#E0E0E0"}
                />
                <span style={{ fontSize: 13, color: "#757575", flexShrink: 0 }}>kg</span>
              </div>
            </div>

            {/* 今日体感 */}
            <div style={{
              marginTop: 16, background: "white", borderRadius: 12,
              padding: "12px 13px", border: "1px solid #E0E0E0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>🌡</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>今日体感</span>
                {feeling.trim() && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                    background: "#E8F5E9", color: "#2E7D32",
                  }}>已记录 ✓</span>
                )}
              </div>
              <textarea
                value={feeling}
                onChange={e => setFeeling(e.target.value.slice(0, 200))}
                placeholder="今天训练和饮食的整体感受、身体状态、特殊情况..."
                style={{
                  width: "100%", minHeight: 80, padding: "9px 11px",
                  borderRadius: 8, border: "1.5px solid #E0E0E0",
                  fontSize: 12, color: "#1A1A1A", resize: "vertical",
                  fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = "#1A1A1A"}
                onBlur={e => e.target.style.borderColor = "#E0E0E0"}
              />
              <div style={{ fontSize: 11, color: "#9E9E9E", marginTop: 6 }}>
                {feeling.length}/200字
              </div>
            </div>

            {/* 同步按钮 */}
            <button
              onClick={syncToSheet}
              disabled={syncing || records.length === 0}
              style={{
                width: "100%", marginTop: 12, padding: "13px",
                borderRadius: 11, border: "none",
                background: syncing ? "#E0E0E0" : syncStatus === "success" ? "#2E7D32" : syncStatus === "error" ? "#C62828" : "#1A1A1A",
                color: (syncing || records.length === 0) ? "#9E9E9E" : "white",
                fontSize: 14, fontWeight: 700,
                cursor: (syncing || records.length === 0) ? "not-allowed" : "pointer",
                transition: "all 0.3s",
              }}
            >
              {syncing ? "同步中..." : syncStatus === "success" ? "✓ 已同步到 Google Sheets" : syncStatus === "error" ? "✗ 同步失败，请重试" : "📊 同步今日记录"}
            </button>
            {syncStatus === "success" && (
              <div style={{ fontSize: 11, color: "#9E9E9E", textAlign: "center", marginTop: 6 }}>
                数据已写入 Google Sheets
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── NAV ICONS ───────────────────────────────────────────────────
function IconFitness({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#616161"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M2 9l2 3-2 3M22 9l-2 3 2 3" />
    </svg>
  );
}

function IconMeal({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#616161"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────
function initChecks() {
  return DAYS.map(day => day.exercises.map(ex => Array(ex.sets).fill(false)));
}

export default function App() {
  const [module, setModule] = useState("fitness");
  const [checks, setChecks] = useState(initChecks);
  const [records, setRecords] = useState([]);
  const [fitnessLogs, setFitnessLogs] = useState([]);

  const doneAll = checks.flat(2).filter(Boolean).length;
  const totalAll = checks.flat(2).length;
  const todayP = records.reduce((s, r) => s + r.totalProtein, 0);

  return (
    <div style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      background: "#F0F0F0",
      minHeight: "100vh",
      maxWidth: 480,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 70 }}>
        {module === "fitness"
          ? <FitnessModule checks={checks} setChecks={setChecks} fitnessLogs={fitnessLogs} setFitnessLogs={setFitnessLogs} />
          : <MealModule records={records} setRecords={setRecords} />
        }
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "#1A1A1A",
        borderTop: "1px solid #2A2A2A",
        display: "flex",
        zIndex: 20,
      }}>
        {[
          { id: "fitness", label: "训练", badge: `${doneAll}/${totalAll}`, Icon: IconFitness },
          { id: "meal", label: "饮食", badge: `${todayP}g`, Icon: IconMeal },
        ].map(({ id, label, badge, Icon }) => {
          const active = module === id;
          return (
            <button key={id} onClick={() => setModule(id)} style={{
              flex: 1, padding: "10px 8px 12px", border: "none", background: "none",
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3,
            }}>
              <Icon active={active} />
              <span style={{ fontSize: 11, color: active ? "white" : "#616161", fontWeight: active ? 700 : 400 }}>
                {label}
              </span>
              <span style={{ fontSize: 10, color: active ? "#9E9E9E" : "#424242" }}>{badge}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}