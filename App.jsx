import { useState, useRef, useEffect } from "react";

const PROFESSIONS = [
  { emoji: "💼", label: "HR", val: "HR从业者（懂招聘、人才、组织架构）" },
  { emoji: "⚖️", label: "律师/法务", val: "律师或法务从业者（懂法律、合规、谈判）" },
  { emoji: "📊", label: "财务/会计", val: "财务或会计从业者（懂数字、税务、财报分析）" },
  { emoji: "🤝", label: "销售", val: "销售从业者（懂客户开发、逼单、关系维护）" },
  { emoji: "🎨", label: "设计/创意", val: "设计师或创意从业者（懂审美、视觉、品牌）" },
  { emoji: "💻", label: "程序员/技术", val: "程序员或技术从业者（懂代码、产品开发）" },
  { emoji: "📣", label: "市场/运营", val: "市场或运营从业者（懂内容、增长、用户运营）" },
  { emoji: "🏥", label: "医疗/健康", val: "医疗或健康行业从业者（懂健康管理、医学）" },
  { emoji: "🎓", label: "教育/老师", val: "教育从业者或老师（懂教学设计、知识讲解）" },
  { emoji: "🛒", label: "电商/零售", val: "电商或零售从业者（懂选品、店铺运营、供应链）" },
  { emoji: "🏗️", label: "工程/制造", val: "工程师或制造业从业者（懂技术、生产、工艺）" },
  { emoji: "✏️", label: "内容/写作", val: "内容创作者或写作从业者（懂文字、叙事、传播）" },
];

const LIFE_STAGES = [
  { emoji: "👩‍🍼", label: "宝妈/宝爸", val: "有孩子需要照顾，时间碎片化，优先在家办公" },
  { emoji: "🎓", label: "在校学生", val: "在校学生，经验有限，时间相对充裕" },
  { emoji: "🌱", label: "刚毕业", val: "毕业1-3年，经验有限，想快速积累收入" },
  { emoji: "🔄", label: "想转行", val: "目前工作不满意，想通过副业探索新方向" },
  { emoji: "🏠", label: "全职在家", val: "目前没有固定工作，需要稳定收入来源" },
  { emoji: "✈️", label: "想位置自由", val: "渴望不受地点限制，实现远程办公" },
];

const TAGS = ["⏱ 时间少(<2h)", "💰 快速变现", "🧠 发挥专业技能", "📱 手机就能做", "😶 不想出镜", "🌐 做海外市场", "🤖 重度用AI", "📦 实物产品方向"];
const BUDGETS = ["0元", "500元", "1k", "2k", "5k", "1万", "2万", "5万", "10万", "20万", "50万+"];

const S = { bg:"#0a0a0f", surface:"#13131a", border:"#22222e", accent:"#c8ff00", accent2:"#7c3aed", text:"#f0f0f0", muted:"#555" };

const SYSTEM_PROMPT = `你是"超级个体副业顾问"，专注帮助普通中国人找到适合自己的副业赛道。

你遵循的核心方法论是「超级个体9步法」：
① 选市场：用Google Trends找"正在往上走的赛道"（CAGR向上，近2年加速）
② 找产品：去YouTube长视频（day in the life/routine/vlog）里挖"早期采用者产品"，用AI从文字稿提炼
③ 找人群：听她们说品类词而非品牌词，找到"品类成立但品牌未饱和"的机会
④ 做品牌：用"身份感"包装，不堆功能，让用户觉得"用了之后会成为那种人"
⑤ 找供应链：写制造需求文档，Alibaba按供应商搜，私信20-50家，用数据谈价
⑥ 做视觉资产：一次专业拍摄，覆盖网站主视觉/电商产品图/广告主图/短视频切片4类素材
⑦ 做爆款短视频：开头3秒借势已火视频，30秒必须有"啊原来是这样"的X因子
⑧ 做重定向投放：先让内容自然跑，再把广告只投给看过视频≥50%的人
⑨ 用Shopify/国内平台承接成交，转化率目标7%+

你的输出要求：
- 结合用户的具体身份和背景，给出真正个性化的建议，不说泛泛的废话
- 每个赛道建议都要体现上述9步逻辑中最相关的几步
- 如果用户有内容创作背景或粉丝积累，必须优先推荐知识变现/内容电商路径
- 语气像朋友说真心话，简洁有力，不用"当然""首先"等口水词`;

function ChipGrid({ items, selected, onToggle, cols, dimmed }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:8, marginBottom:8, opacity:dimmed?0.3:1, transition:"opacity 0.2s", pointerEvents:dimmed?"none":"auto" }}>
      {items.map(item => {
        const active = selected.includes(item.val);
        return (
          <button key={item.val} onClick={() => onToggle(item.val)}
            style={{ background:active?"rgba(200,255,0,0.06)":S.surface, border:`1px solid ${active?S.accent:S.border}`, color:active?S.accent:S.muted, padding:"10px 6px", cursor:"pointer", fontSize:12, textAlign:"center", transition:"all 0.15s", lineHeight:1.4 }}>
            <div style={{ fontSize:18, marginBottom:3 }}>{item.emoji}</div>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// Key 配置面板
function KeyPanel({ apiKey, setApiKey, keyProvider, setKeyProvider }) {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState(apiKey);
  const [visible, setVisible] = useState(false);

  const save = () => {
    const trimmed = input.trim();
    if (trimmed) {
      localStorage.setItem("sb_api_key", trimmed);
      localStorage.setItem("sb_key_provider", keyProvider);
      setApiKey(trimmed);
      setShow(false);
    }
  };
  const clear = () => {
    localStorage.removeItem("sb_api_key");
    localStorage.removeItem("sb_key_provider");
    setApiKey(""); setInput(""); setShow(false);
  };

  return (
    <div style={{ marginBottom:32 }}>
      {!show ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", background:S.surface, border:`1px solid ${apiKey?S.accent:S.border}` }}>
          <div style={{ fontSize:12, color:apiKey?S.accent:S.muted }}>
            {apiKey ? `✓ API Key 已设置 (${keyProvider})` : "⚠ 请先设置 API Key 才能生成"}
          </div>
          <button onClick={()=>setShow(true)} style={{ background:"none", border:`1px solid ${S.border}`, color:S.muted, fontSize:11, padding:"4px 12px", cursor:"pointer" }}>
            {apiKey?"修改":"设置 Key"}
          </button>
        </div>
      ) : (
        <div style={{ padding:20, background:S.surface, border:`1px solid ${S.accent}` }}>
          <div style={{ fontSize:13, color:S.text, marginBottom:16, lineHeight:1.8 }}>
            🔑 <strong>你的 Key 只存在浏览器本地，不会发送到任何服务器</strong><br/>
            <span style={{ color:S.muted, fontSize:12 }}>
              没有 Key？→ 去 <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color:S.accent }}>console.anthropic.com</a> 注册免费获取（Claude）<br/>
              或 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color:S.accent }}>platform.openai.com</a>（ChatGPT）
            </span>
          </div>

          {/* 选择提供商 */}
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {["Claude (Anthropic)", "OpenAI (ChatGPT)"].map(p => (
              <button key={p} onClick={()=>setKeyProvider(p)}
                style={{ flex:1, padding:"8px", background:keyProvider===p?"rgba(200,255,0,0.06)":S.bg, border:`1px solid ${keyProvider===p?S.accent:S.border}`, color:keyProvider===p?S.accent:S.muted, fontSize:12, cursor:"pointer" }}>
                {p}
              </button>
            ))}
          </div>

          <div style={{ position:"relative", marginBottom:12 }}>
            <input type={visible?"text":"password"} value={input} onChange={e=>setInput(e.target.value)}
              placeholder={keyProvider.includes("Claude")?"sk-ant-...":"sk-..."}
              style={{ width:"100%", background:S.bg, border:`1px solid ${S.border}`, color:S.text, padding:"10px 40px 10px 12px", fontSize:13, outline:"none", fontFamily:"monospace", boxSizing:"border-box" }}
            />
            <button onClick={()=>setVisible(v=>!v)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:S.muted, cursor:"pointer", fontSize:14 }}>
              {visible?"🙈":"👁"}
            </button>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={save} style={{ flex:1, background:S.accent, color:"#0a0a0f", border:"none", padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer" }}>保存</button>
            {apiKey && <button onClick={clear} style={{ padding:"10px 16px", background:"none", border:`1px solid ${S.border}`, color:S.muted, fontSize:13, cursor:"pointer" }}>清除</button>}
            <button onClick={()=>setShow(false)} style={{ padding:"10px 16px", background:"none", border:`1px solid ${S.border}`, color:S.muted, fontSize:13, cursor:"pointer" }}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("sb_api_key") || "");
  const [keyProvider, setKeyProvider] = useState(() => localStorage.getItem("sb_key_provider") || "Claude (Anthropic)");

  const [selProf, setSelProf] = useState([]);
  const [selLife, setSelLife] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [extraNote, setExtraNote] = useState("");
  const [time, setTime] = useState(2);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [resultMeta, setResultMeta] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatHistory, chatLoading]);

  const usingCustom = customInput.trim().length > 0;
  const toggleProf = v => setSelProf(p => p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const toggleLife = v => setSelLife(p => p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const toggleTag  = t => setActiveTags(p => p.includes(t)?p.filter(x=>x!==t):[...p,t]);

  const buildIdentity = () => {
    if (usingCustom) return customInput.trim();
    const parts = [];
    if (selProf.length) parts.push(selProf.join("；"));
    if (selLife.length) parts.push(selLife.join("；"));
    return parts.join("，同时");
  };
  const buildLabel = () => {
    if (usingCustom) return customInput.trim().slice(0,24);
    return [...selProf.map(v=>PROFESSIONS.find(p=>p.val===v)?.label), ...selLife.map(v=>LIFE_STAGES.find(p=>p.val===v)?.label)].filter(Boolean).join(" · ");
  };
  const buildEmoji = () => {
    if (usingCustom) return "👤";
    return [...selProf.map(v=>PROFESSIONS.find(p=>p.val===v)?.emoji), ...selLife.map(v=>LIFE_STAGES.find(p=>p.val===v)?.emoji)].filter(Boolean).slice(0,2).join("")||"👤";
  };
  const hasSelection = usingCustom || selProf.length>0 || selLife.length>0;

  const callAPI = async (messages) => {
    const isOpenAI = keyProvider.includes("OpenAI");
    if (isOpenAI) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
        body: JSON.stringify({ model:"gpt-4o", max_tokens:2000, messages:[{role:"system",content:SYSTEM_PROMPT},...messages] }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices?.[0]?.message?.content || "生成失败";
    } else {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "x-api-key":apiKey, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, system:SYSTEM_PROMPT, messages }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message);
      return data.content?.[0]?.text || "生成失败";
    }
  };

  const generate = async () => {
    const identity = buildIdentity();
    if (!identity) { alert("请先选择职业身份或描述你的情况 👆"); return; }
    if (!apiKey) { alert("请先设置 API Key ☝️"); return; }

    const tags = activeTags.join("、") || "不限";
    const timeLabel = time + "h";
    const budgetLabel = BUDGETS[budget];

    setLoading(true); setResult(""); setChatHistory([]);
    setResultMeta({ emoji:buildEmoji(), label:buildLabel(), sub:`每天 ${timeLabel} · 预算 ${budgetLabel}` });

    const userMsg = `请为我生成副业路径报告。

我的信息：
- 职业/背景：${identity}
- 最在意：${tags}
- 每天可用时间：${timeLabel}
- 启动资金预算：${budgetLabel}${extraNote.trim()?`\n- 补充：${extraNote.trim()}`:""}

输出格式：

🎯 最适合你的副业赛道（2-3个，最推荐→次推荐）

每个赛道：
【赛道名称】
• 为什么适合你：
• 市场趋势（Google Trends方向）：
• 你的切入点（早期采用者产品方向）：
• 人群锚点（她们说什么词、有什么痛点）：
• 品牌身份感（卖的不是产品，是什么身份）：
• 变现模式（第一笔钱从哪来）：
• 第一步行动（本周可做，越细越好）：
• 关键AI工具（2-3个）：
• 首月目标（保守/乐观）：

⚠️ 你要避开的2个陷阱

💬 最重要的一句话（量身定制）`;

    try {
      const text = await callAPI([{ role:"user", content:userMsg }]);
      setResult(text);
      setChatHistory([{ role:"user", content:userMsg }, { role:"assistant", content:text }]);
    } catch(e) {
      setResult("生成失败：" + e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    const newHistory = [...chatHistory, { role:"user", content:msg }];
    setChatHistory(newHistory);
    setChatLoading(true);
    try {
      const reply = await callAPI(newHistory);
      setChatHistory([...newHistory, { role:"assistant", content:reply }]);
    } catch(e) {
      setChatHistory([...newHistory, { role:"assistant", content:"回复失败："+e.message }]);
    } finally {
      setChatLoading(false);
    }
  };

  const QUICK_Q = ["为什么没推荐内容变现/卖课？", "第一个赛道怎么具体开始？", "我有粉丝基础，怎么最快变现？", "哪个赛道最适合0预算启动？"];

  return (
    <div style={{ background:S.bg, minHeight:"100vh", color:S.text, fontFamily:"'Noto Sans SC', sans-serif", padding:"32px 20px" }}>
      <div style={{ maxWidth:760, margin:"0 auto" }}>

        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"inline-block", fontSize:11, letterSpacing:3, textTransform:"uppercase", color:S.accent, border:`1px solid ${S.accent}`, padding:"4px 12px", marginBottom:20 }}>
            Super Individual · 超级个体
          </div>
          <div style={{ fontSize:"clamp(1.8rem,5vw,3rem)", fontWeight:800, letterSpacing:-1, lineHeight:1.05, marginBottom:12 }}>
            AI<span style={{ color:S.accent }}>副业</span>生成器
          </div>
          <div style={{ color:S.muted, fontSize:14 }}>告诉我你是谁 → 获得专属赚钱路径</div>
        </div>

        {/* Key Panel */}
        <KeyPanel apiKey={apiKey} setApiKey={setApiKey} keyProvider={keyProvider} setKeyProvider={setKeyProvider} />

        {/* ① 职业身份 */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:S.muted, marginBottom:8 }}>
            ① 职业身份 <span style={{ color:"#444", letterSpacing:0, textTransform:"none", fontSize:11, marginLeft:8 }}>可多选</span>
          </div>
          <ChipGrid items={PROFESSIONS} selected={selProf} onToggle={toggleProf} cols={4} dimmed={usingCustom} />
        </div>

        {/* ② 当前处境 */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:S.muted, marginBottom:8 }}>
            ② 当前处境 <span style={{ color:"#444", letterSpacing:0, textTransform:"none", fontSize:11, marginLeft:8 }}>可叠加</span>
          </div>
          <ChipGrid items={LIFE_STAGES} selected={selLife} onToggle={toggleLife} cols={3} dimmed={usingCustom} />
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:S.border }} />
          <span style={{ fontSize:11, color:"#444", whiteSpace:"nowrap" }}>或者直接描述你自己（会覆盖上面的选项）</span>
          <div style={{ flex:1, height:1, background:S.border }} />
        </div>
        <div style={{ marginBottom:32, position:"relative" }}>
          <input type="text" value={customInput} onChange={e=>setCustomInput(e.target.value)}
            placeholder="比如：35岁HR，全网4k粉，喜欢研究AI，每天有2小时..."
            style={{ width:"100%", background:S.surface, border:`1px solid ${usingCustom?S.accent:S.border}`, color:S.text, padding:"12px 16px", fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
          />
          {usingCustom && <button onClick={()=>setCustomInput("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:S.muted, cursor:"pointer", fontSize:16 }}>✕</button>}
        </div>

        {/* ③ 最在意 */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:S.muted, marginBottom:10 }}>③ 你最在意什么（可多选）</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {TAGS.map(tag => {
              const active = activeTags.includes(tag);
              return <span key={tag} onClick={()=>toggleTag(tag)} style={{ background:active?"rgba(124,58,237,0.1)":"#1a1a24", border:`1px solid ${active?S.accent2:S.border}`, color:active?"#a78bfa":S.muted, fontSize:12, padding:"5px 12px", cursor:"pointer", transition:"all 0.15s" }}>{tag}</span>;
            })}
          </div>
        </div>

        {/* ④ 时间+预算 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:S.muted, marginBottom:8 }}>每天可用时间 <span style={{ color:S.accent, fontWeight:700 }}>{time}h</span></div>
            <input type="range" min={0.5} max={8} step={0.5} value={time} onChange={e=>setTime(e.target.value)} style={{ width:"100%", accentColor:S.accent }} />
          </div>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:S.muted, marginBottom:8 }}>启动预算 <span style={{ color:S.accent, fontWeight:700 }}>{BUDGETS[budget]}</span></div>
            <input type="range" min={0} max={10} step={1} value={budget} onChange={e=>setBudget(parseInt(e.target.value))} style={{ width:"100%", accentColor:S.accent }} />
          </div>
        </div>

        {/* ⑤ 补充 */}
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:S.muted, marginBottom:8 }}>
            ⑤ 还有什么想让 AI 知道的？<span style={{ color:"#444", letterSpacing:0, textTransform:"none", fontSize:11, marginLeft:8 }}>选填</span>
          </div>
          <textarea value={extraNote} onChange={e=>setExtraNote(e.target.value)}
            placeholder="比如：全网4k粉丝、做过猎头、有LinkedIn人脉、不想做短视频..."
            rows={3}
            style={{ width:"100%", background:S.surface, border:`1px solid ${extraNote?S.accent2:S.border}`, color:S.text, padding:"12px 16px", fontSize:13, outline:"none", fontFamily:"inherit", resize:"vertical", lineHeight:1.8, boxSizing:"border-box" }}
          />
        </div>

        <button onClick={generate} disabled={loading||!hasSelection||!apiKey}
          style={{ width:"100%", background:loading||!hasSelection||!apiKey?S.border:S.accent, color:loading||!hasSelection||!apiKey?S.muted:"#0a0a0f", border:"none", padding:18, fontSize:15, fontWeight:700, letterSpacing:2, textTransform:"uppercase", cursor:loading||!hasSelection||!apiKey?"not-allowed":"pointer", marginBottom:40, transition:"all 0.2s" }}>
          {loading?"⏳ AI生成中...":"▶ 生成我的专属副业路径"}
        </button>

        {/* 结果 */}
        {(loading||result) && resultMeta && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:16, padding:"20px 24px", background:"rgba(200,255,0,0.04)", border:"1px solid rgba(200,255,0,0.2)", marginBottom:1 }}>
              <div style={{ minWidth:48, height:48, background:S.accent, color:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, padding:"0 6px" }}>{resultMeta.emoji}</div>
              <div>
                <div style={{ fontSize:17, fontWeight:700 }}>{resultMeta.label}</div>
                <div style={{ fontSize:12, color:S.muted, marginTop:3 }}>{resultMeta.sub} · 基于超级个体9步法</div>
              </div>
            </div>
            <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderTop:"none", padding:"28px 24px", fontSize:14, lineHeight:2, whiteSpace:"pre-wrap", color:S.text }}>
              {loading ? <span style={{ color:S.muted }}><span style={{ color:S.accent }}>●</span> AI正在分析你的赚钱路径，请稍候...</span> : result}
            </div>

            {!loading && result && (
              <div style={{ border:`1px solid ${S.border}`, borderTop:"none" }}>
                {chatHistory.length > 2 && (
                  <div style={{ background:"#0d0d12", padding:"0 24px" }}>
                    {chatHistory.slice(2).map((msg, i) => (
                      <div key={i} style={{ padding:"16px 0", borderTop:`1px solid ${S.border}`, display:"flex", gap:12, alignItems:"flex-start" }}>
                        <div style={{ width:28, height:28, flexShrink:0, background:msg.role==="user"?"#1a1a2e":S.accent, color:msg.role==="user"?S.muted:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>
                          {msg.role==="user"?"你":"AI"}
                        </div>
                        <div style={{ fontSize:13, lineHeight:1.9, whiteSpace:"pre-wrap", color:msg.role==="user"?S.muted:S.text, flex:1 }}>{msg.content}</div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div style={{ padding:"16px 0", borderTop:`1px solid ${S.border}`, display:"flex", gap:12, alignItems:"center" }}>
                        <div style={{ width:28, height:28, flexShrink:0, background:S.accent, color:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>AI</div>
                        <span style={{ color:S.muted, fontSize:13 }}><span style={{ color:S.accent }}>●</span> 思考中...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
                <div style={{ background:"#0d0d12", padding:"16px 24px", borderTop:`1px solid ${S.border}` }}>
                  <div style={{ fontSize:11, color:"#444", marginBottom:10, letterSpacing:1 }}>快捷追问</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                    {QUICK_Q.map(q => (
                      <button key={q} onClick={()=>setChatInput(q)} style={{ background:"#13131a", border:`1px solid ${S.border}`, color:S.muted, fontSize:12, padding:"5px 12px", cursor:"pointer" }}>{q}</button>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <input type="text" value={chatInput} onChange={e=>setChatInput(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();} }}
                      placeholder="继续追问，Enter 发送..."
                      style={{ flex:1, background:S.surface, border:`1px solid ${chatInput?S.accent2:S.border}`, color:S.text, padding:"10px 14px", fontSize:13, outline:"none", fontFamily:"inherit" }}
                    />
                    <button onClick={sendChat} disabled={!chatInput.trim()||chatLoading}
                      style={{ background:chatInput.trim()&&!chatLoading?S.accent2:"#1a1a24", color:chatInput.trim()&&!chatLoading?"#fff":S.muted, border:"none", padding:"10px 20px", fontSize:13, cursor:chatInput.trim()&&!chatLoading?"pointer":"not-allowed", fontWeight:700 }}>
                      发送 ↵
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
