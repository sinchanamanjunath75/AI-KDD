import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#050A14", bgCard: "#0A1628", bgCard2: "#0D1F3C",
  accent: "#00D4FF", accent2: "#7B2FFF", accent3: "#FF4D6D",
  text: "#E8EDF5", muted: "#7A8BA0", border: "#1A2E4A",
  glow: "rgba(0,212,255,0.15)", green: "#4CAF50", amber: "#FFB347",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Space Grotesk',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:${C.bg}}
  ::-webkit-scrollbar-thumb{background:${C.accent};border-radius:3px}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
  @keyframes pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
  @keyframes spin3d{0%{transform:rotateY(0deg) rotateX(10deg)}100%{transform:rotateY(360deg) rotateX(10deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
  @keyframes orbit{0%{transform:rotate(0deg) translateX(110px) rotate(0deg)}100%{transform:rotate(360deg) translateX(110px) rotate(-360deg)}}
  @keyframes orbit2{0%{transform:rotate(0deg) translateX(160px) rotate(0deg)}100%{transform:rotate(360deg) translateX(160px) rotate(-360deg)}}
  @keyframes orbit3{0%{transform:rotate(0deg) translateX(210px) rotate(0deg)}100%{transform:rotate(360deg) translateX(210px) rotate(-360deg)}}
  @keyframes nodeGlow{0%,100%{box-shadow:0 0 8px ${C.accent}}50%{box-shadow:0 0 28px ${C.accent},0 0 50px ${C.accent2}}}
  @keyframes dataFlow{0%{stroke-dashoffset:1000}100%{stroke-dashoffset:0}}
  @keyframes slideRight{from{width:0}to{width:var(--w)}}
  @keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.9}}
  @keyframes neuralPulse{0%,100%{r:3}50%{r:6}}
  @keyframes waveform{0%,100%{height:4px}50%{height:var(--h)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
  @keyframes tickerMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  .page{min-height:100vh;animation:fadeIn .5s ease}
  .nav-link{cursor:pointer;transition:color .25s;color:${C.muted};font-size:14px;font-weight:500;white-space:nowrap}
  .nav-link:hover,.nav-link.active{color:${C.accent}}
  .btn-primary{background:linear-gradient(135deg,${C.accent2},${C.accent});border:none;color:#fff;padding:12px 28px;border-radius:8px;font-family:'Space Grotesk',sans-serif;font-weight:600;cursor:pointer;transition:all .25s;letter-spacing:.4px;font-size:14px}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,212,255,.4)}
  .btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .btn-outline{background:transparent;border:1px solid ${C.accent};color:${C.accent};padding:10px 22px;border-radius:8px;font-family:'Space Grotesk',sans-serif;font-weight:500;cursor:pointer;transition:all .25s;font-size:13px}
  .btn-outline:hover{background:${C.glow};box-shadow:0 0 18px rgba(0,212,255,.25)}
  .card{background:${C.bgCard};border:1px solid ${C.border};border-radius:16px;padding:24px;transition:border-color .25s,box-shadow .25s}
  .card:hover{border-color:rgba(0,212,255,.35);box-shadow:0 0 28px rgba(0,212,255,.08)}
  .input-field{background:${C.bgCard2};border:1px solid ${C.border};border-radius:8px;padding:12px 16px;color:${C.text};font-family:'Space Grotesk',sans-serif;font-size:14px;width:100%;outline:none;transition:all .25s;resize:vertical}
  .input-field:focus{border-color:${C.accent};box-shadow:0 0 14px rgba(0,212,255,.18)}
  .input-field::placeholder{color:${C.muted}}
  .tag{background:rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.3);color:${C.accent};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:500;display:inline-block}
  .metric-card{background:${C.bgCard};border:1px solid ${C.border};border-radius:12px;padding:20px;position:relative;overflow:hidden}
  .metric-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${C.accent2},${C.accent})}
  .drift-bar{height:8px;border-radius:4px;background:${C.bgCard2};overflow:hidden;margin-top:8px}
  .drift-bar-fill{height:100%;border-radius:4px;animation:slideRight 1.4s ease forwards}
  .section-title{font-family:'Orbitron',monospace;font-size:clamp(1.4rem,3vw,2.4rem);font-weight:700;line-height:1.2}
  .glass{background:rgba(8,18,36,.75);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid ${C.border}}
  .update-card{background:${C.bgCard};border:1px solid ${C.border};border-radius:14px;padding:20px;transition:all .25s}
  .update-card:hover{border-color:rgba(0,212,255,.3);transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.3)}
  .cat-pill{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px;display:inline-block}
  .upvote-btn{background:none;border:1px solid ${C.border};border-radius:8px;padding:6px 12px;color:${C.muted};font-family:'Space Grotesk',sans-serif;font-size:12px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:5px;white-space:nowrap}
  .upvote-btn:hover,.upvote-btn.voted{border-color:${C.accent};color:${C.accent};background:rgba(0,212,255,.08)}
  .contact-input{background:${C.bgCard2};border:1px solid ${C.border};border-radius:10px;padding:13px 16px;color:${C.text};font-family:'Space Grotesk',sans-serif;font-size:14px;width:100%;outline:none;transition:all .25s;resize:none}
  .contact-input:focus{border-color:${C.accent};box-shadow:0 0 14px rgba(0,212,255,.15)}
  .contact-input::placeholder{color:${C.muted}}
  .ticker-wrap{overflow:hidden;white-space:nowrap;border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};background:${C.bgCard};padding:9px 0}
  .ticker-inner{display:inline-flex;gap:48px;animation:tickerMove 28s linear infinite}
`;

// ── Shared visual primitives ──────────────────────────────────────────────────

function Stars() {
  const stars = useRef(
    Array.from({length:100},()=>({
      x:Math.random()*100,y:Math.random()*100,
      r:Math.random()*1.8+.4,delay:Math.random()*5,dur:Math.random()*3+2
    }))
  ).current;
  return (
    <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      <svg width="100%" height="100%">
        {stars.map((s,i)=>(
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill={C.accent} opacity=".4"
            style={{animation:`twinkle ${s.dur}s ${s.delay}s infinite`}}/>
        ))}
      </svg>
    </div>
  );
}

function Scanline() {
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:998,overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',
        background:'linear-gradient(transparent,rgba(0,212,255,.05),transparent)',
        animation:'scanline 9s linear infinite'}}/>
    </div>
  );
}

function Globe3D() {
  return (
    <div style={{width:280,height:280,position:'relative',transformStyle:'preserve-3d',
      animation:'spin3d 22s linear infinite',margin:'auto'}}>
      {[0,60,120].map((rot,i)=>(
        <div key={i} style={{position:'absolute',inset:0,
          border:`1px solid rgba(0,212,255,${.14+i*.05})`,borderRadius:'50%',
          transform:`rotateY(${rot}deg)`,boxShadow:'0 0 12px rgba(12, 14, 15, 0.08)'}}/>
      ))}
      <div style={{position:'absolute',inset:'24%',borderRadius:'50%',
        background:`radial-gradient(circle at 33% 33%,${C.accent2},${C.bg})`,
        boxShadow:`0 0 40px ${C.accent2},0 0 70px rgba(123,47,255,.3)`}}/>
      {[0,1,2,3,4,5].map(i=>(
        <div key={i} style={{position:'absolute',top:'50%',left:'50%',
          width:7,height:7,borderRadius:'50%',marginTop:-3.5,marginLeft:-3.5,
          background:i%2===0?C.accent:C.accent2,
          animation:`orbit${i%3===0?'':i%3===1?'2':'3'} ${9+i*2}s linear infinite`,
          animationDelay:`${i*.5}s`,boxShadow:'0 0 8px currentColor'}}/>
      ))}
    </div>
  );
}

function NeuralNet() {
  const layers=[[1,2,3],[4,5,6,7],[8,9,10],[11,12]];
  const W=340,H=220;
  const pos=layers.map((l,li)=>{const x=40+li*90;return l.map((_,ni)=>({x,y:(H/(l.length+1))*(ni+1)}));});
  const conns=[];
  for(let li=0;li<pos.length-1;li++)
    for(const a of pos[li]) for(const b of pos[li+1])
      conns.push({x1:a.x,y1:a.y,x2:b.x,y2:b.y,active:Math.random()>.5});
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
      {conns.map((c,i)=>(
        <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke={c.active?C.accent:C.border} strokeWidth={c.active?1:.5}
          opacity={c.active?.75:.25}
          style={{strokeDasharray:c.active?'200':'none',strokeDashoffset:c.active?'200':'none',
            animation:c.active?`dataFlow ${2+i*.08}s ${i*.04}s linear infinite`:'none'}}/>
      ))}
      {pos.map((layer,li)=>layer.map((p,ni)=>{
        const drift=li===2&&ni===1;
        return (
          <g key={`${li}-${ni}`}>
            <circle cx={p.x} cy={p.y} r={drift?8:6}
              fill={drift?C.accent3:li===0?C.accent2:C.accent}
              style={{animation:drift?'nodeGlow 2s infinite':`neuralPulse ${2+ni*.3}s ${ni*.2}s infinite`}}/>
            {drift&&<text x={p.x+13} y={p.y+4} fontSize="9" fill={C.accent3} fontFamily="Space Grotesk">drift!</text>}
          </g>
        );
      }))}
    </svg>
  );
}

function Waveform({color=C.accent,bars=36}) {
  const hs=useRef(Array.from({length:bars},()=>Math.floor(Math.random()*50+4))).current;
  return (
    <div style={{display:'flex',alignItems:'center',gap:3,height:54}}>
      {hs.map((h,i)=>(
        <div key={i} style={{width:4,borderRadius:2,
          background:`linear-gradient(to top,${color},${C.accent2})`,
          '--h':`${h}px`,
          animation:`waveform ${.5+Math.random()*.9}s ${i*.04}s ease-in-out infinite`,
          height:h}}/>
      ))}
    </div>
  );
}

function DriftRing({score=73,label="Drift",color=C.accent3}) {
  const r=38,circ=2*Math.PI*r,offset=circ*(1-score/100);
  return (
    <div style={{textAlign:'center',display:'inline-block'}}>
      <svg width={96} height={96} viewBox="0 0 96 96">
        <circle cx={48} cy={48} r={r} fill="none" stroke={C.border} strokeWidth={5.5}/>
        <circle cx={48} cy={48} r={r} fill="none" stroke={color} strokeWidth={5.5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 48 48)" style={{transition:'stroke-dashoffset 1s ease'}}/>
        <text x={48} y={44} textAnchor="middle" fill={color} fontSize={15} fontWeight={700}
          fontFamily="Orbitron,monospace">{score}%</text>
        <text x={48} y={60} textAnchor="middle" fill={C.muted} fontSize={9}
          fontFamily="Space Grotesk">{label}</text>
      </svg>
    </div>
  );
}

function LiveFeed() {
  const items=[
    {id:1,model:'GPT-4o',event:'Semantic drift detected',severity:'HIGH',time:'now',score:82},
    {id:2,model:'Claude 3.5',event:'Knowledge gap: Post-2024 events',severity:'MED',time:'2m',score:54},
    {id:3,model:'LLaMA 3.1',event:'Confidence calibration off',severity:'LOW',time:'5m',score:31},
    {id:4,model:'Gemini 1.5',event:'Hallucination spike',severity:'HIGH',time:'8m',score:91},
    {id:5,model:'Mistral 7B',event:'Temporal anchor bias',severity:'MED',time:'12m',score:67},
  ];
  const sc=s=>s==='HIGH'?C.accent3:s==='MED'?C.amber:C.green;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {items.map((it,i)=>(
        <div key={it.id} className="card" style={{padding:'10px 15px',display:'flex',
          alignItems:'center',gap:12,borderLeft:`3px solid ${sc(it.severity)}`,
          animation:`fadeIn .4s ${i*.08}s both`}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:sc(it.severity),
            boxShadow:`0 0 7px ${sc(it.severity)}`,animation:'pulse 2s infinite',flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600}}>{it.model}</div>
            <div style={{fontSize:11,color:C.muted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{it.event}</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:12,color:sc(it.severity),fontWeight:700}}>{it.severity}</div>
            <div style={{fontSize:10,color:C.muted}}>{it.time} ago</div>
          </div>
          <DriftRing score={it.score} label="" color={sc(it.severity)}/>
        </div>
      ))}
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({page,setPage,user,onLogout}) {
  const links=user
    ?[{id:'dashboard',label:'Dashboard'},{id:'updates',label:'GenAI Updates'},{id:'contact',label:'Contact'}]
    :[{id:'landing',label:'Home'},{id:'updates',label:'GenAI Updates'},{id:'contact',label:'Contact'}];
  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,
      padding:'0 20px',height:64,display:'flex',alignItems:'center',
      justifyContent:'space-between',gap:16}} className="glass">
      <div style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',flexShrink:0}}
        onClick={()=>setPage('landing')}>
        <div style={{width:34,height:34,borderRadius:8,
          background:`linear-gradient(135deg,${C.accent2},${C.accent})`,
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>⚡</div>
        <span style={{fontFamily:'Orbitron,monospace',fontWeight:700,fontSize:13,
          background:`linear-gradient(90deg,${C.accent},${C.accent2})`,
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>DRIFT.AI</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:22,flexWrap:'nowrap',overflowX:'auto'}}>
        {links.map(l=>(
          <span key={l.id} className={`nav-link${page===l.id?' active':''}`}
            onClick={()=>setPage(l.id)}>{l.label}</span>
        ))}
        {user?(
          <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <span style={{fontSize:13,color:C.muted,whiteSpace:'nowrap'}}>👤 {user.name}</span>
            <button className="btn-outline" style={{padding:'6px 14px',fontSize:12}} onClick={onLogout}>Logout</button>
          </div>
        ):(
          <div style={{display:'flex',gap:8,flexShrink:0}}>
            <button className="btn-outline" style={{padding:'7px 14px',fontSize:13}} onClick={()=>setPage('login')}>Login</button>
            <button className="btn-primary" style={{padding:'7px 14px',fontSize:13}} onClick={()=>setPage('signup')}>Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Landing ────────────────────────────────────────────────────────────────────
function Landing({setPage}) {
  const features=[
    {icon:'🔍',title:'Real-time Detection',desc:'Monitor knowledge boundaries across 50+ AI models simultaneously with sub-second latency alerts.'},
    {icon:'📊',title:'Drift Analytics',desc:'Visualise how model knowledge decays over time with our proprietary drift scoring algorithms.'},
    {icon:'🧠',title:'Neural Mapping',desc:'Map semantic drift patterns across model architecture layers to pinpoint knowledge gaps.'},
    {icon:'⚡',title:'Instant Alerts',desc:'Receive immediate notifications when critical knowledge drift thresholds are breached.'},
    {icon:'🌐',title:'Multi-Model Support',desc:'Compatible with GPT, Claude, Gemini, LLaMA, Mistral and all major LLM providers.'},
    {icon:'🛡️',title:'Bias Detection',desc:'Automatically detect temporal anchor bias and hallucination spikes before they reach production.'},
  ];
  const stats=[{val:'99.2%',label:'Detection Accuracy'},{val:'50+',label:'Supported Models'},{val:'<50ms',label:'Alert Latency'},{val:'10M+',label:'Events Monitored'}];
  const ticker=['GPT-4o Drift: 82%','Claude 3.5 Drift: 54%','Gemini 1.5 Drift: 91%','LLaMA 3.1 Drift: 31%','Mistral 7B Drift: 67%','Falcon 180B Drift: 23%','BERT Drift: 19%','Palm 2 Drift: 48%'];
  return (
    <div className="page" style={{paddingTop:64}}>
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...ticker,...ticker].map((t,i)=>(
            <span key={i} style={{fontSize:12,color:C.muted}}>
              <span style={{color:C.accent,marginRight:6}}>●</span>{t}
            </span>
          ))}
        </div>
      </div>
      <section style={{minHeight:'88vh',display:'flex',alignItems:'center',padding:'60px 24px',
        position:'relative',overflow:'hidden',maxWidth:1200,margin:'0 auto'}}>
        <div style={{position:'absolute',width:560,height:560,
          background:`radial-gradient(circle,rgba(123,47,255,.13),transparent 70%)`,
          top:'-80px',right:'-80px',pointerEvents:'none'}}/>
        <div style={{position:'absolute',width:360,height:360,
          background:`radial-gradient(circle,rgba(230, 243, 246, 0.09),transparent 70%)`,
          bottom:0,left:'-40px',pointerEvents:'none'}}/>
        <div style={{display:'flex',alignItems:'center',gap:60,flexWrap:'wrap',position:'relative',zIndex:1,width:'100%'}}>
          <div style={{flex:'1',minWidth:270}}>
            <div className="tag" style={{marginBottom:16}}>🚀 Next-Gen AI Monitoring</div>
            <h1 className="section-title" style={{marginBottom:20,lineHeight:1.15}}>
              Detect AI{' '}
              <span style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Knowledge Drift</span>
              {' '}Before It Costs You
            </h1>
            <p style={{color:C.muted,lineHeight:1.75,maxWidth:500,marginBottom:30,fontSize:15}}>
              The world's most advanced platform for detecting, measuring, and mitigating knowledge drift in large language models. Stay ahead of model degradation with real-time intelligence.
            </p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <button className="btn-primary" style={{fontSize:15,padding:'13px 28px'}} onClick={()=>setPage('signup')}>Start Free Trial →</button>
              <button className="btn-outline" style={{fontSize:15,padding:'13px 28px'}} onClick={()=>setPage('updates')}>GenAI Updates</button>
              <button className="btn-outline" style={{fontSize:15,padding:'13px 28px'}} onClick={()=>setPage('contact')}>Contact Sales</button>
            </div>
          </div>
          <div style={{flex:'1',minWidth:260,display:'flex',justifyContent:'center',perspective:'900px'}}>
            <Globe3D/>
          </div>
        </div>
      </section>
      <section style={{background:`linear-gradient(90deg,${C.bgCard},${C.bgCard2})`,
        borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:'38px 24px'}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:28,textAlign:'center'}}>
          {stats.map((s,i)=>(
            <div key={i} style={{animation:`countUp .7s ${i*.15}s both`}}>
              <div style={{fontFamily:'Orbitron,monospace',fontSize:30,fontWeight:900,
                background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s.val}</div>
              <div style={{color:C.muted,marginTop:5,fontSize:13}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{maxWidth:1200,margin:'0 auto',padding:'70px 24px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <div className="tag" style={{marginBottom:12}}>Features</div>
          <h2 className="section-title">
            Everything You Need to{' '}
            <span style={{color:C.accent}}>Monitor AI Knowledge</span>
          </h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>
          {features.map((f,i)=>(
            <div key={i} className="card" style={{animation:`fadeIn .5s ${i*.08}s both`}}>
              <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
              <h3 style={{fontSize:16,fontWeight:600,marginBottom:7}}>{f.title}</h3>
              <p style={{color:C.muted,lineHeight:1.65,fontSize:13}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section style={{margin:'0 24px 68px',borderRadius:20,padding:'52px 32px',textAlign:'center',
        background:`linear-gradient(135deg,rgba(123,47,255,.18),rgba(0,212,255,.09))`,
        border:`1px solid rgba(123,47,255,.3)`}}>
        <h2 className="section-title" style={{marginBottom:16}}>Ready to Detect Drift?</h2>
        <p style={{color:C.muted,maxWidth:460,margin:'0 auto 28px',lineHeight:1.7,fontSize:15}}>
          Join thousands of AI teams using DRIFT.AI to keep their models accurate, reliable, and trustworthy.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn-primary" style={{fontSize:15,padding:'13px 32px'}} onClick={()=>setPage('signup')}>Create Free Account</button>
          <button className="btn-outline" style={{fontSize:15,padding:'13px 32px'}} onClick={()=>setPage('contact')}>Talk to Sales</button>
        </div>
      </section>
      <footer style={{borderTop:`1px solid ${C.border}`,padding:'26px 24px',textAlign:'center'}}>
        <div style={{fontFamily:'Orbitron,monospace',fontWeight:700,fontSize:13,color:C.accent,marginBottom:5}}>DRIFT.AI</div>
        <p style={{color:C.muted,fontSize:12}}>© 2025 Drift.AI — AI Knowledge Drift Detection Platform</p>
      </footer>
    </div>
  );
}

// ── GenAI Updates ──────────────────────────────────────────────────────────────
const CATEGORIES=['All','Model Release','Research','Tool','Policy','Dataset','Benchmark'];
const CAT_COL={
  'Model Release':{bg:'rgba(0,212,255,.12)',br:'rgba(0,212,255,.4)',tx:C.accent},
  'Research':{bg:'rgba(123,47,255,.12)',br:'rgba(123,47,255,.4)',tx:C.accent2},
  'Tool':{bg:'rgba(76,175,80,.12)',br:'rgba(76,175,80,.4)',tx:'#4CAF50'},
  'Policy':{bg:'rgba(255,77,109,.12)',br:'rgba(255,77,109,.4)',tx:C.accent3},
  'Dataset':{bg:'rgba(255,179,71,.12)',br:'rgba(255,179,71,.4)',tx:C.amber},
  'Benchmark':{bg:'rgba(0,212,255,.08)',br:'rgba(0,212,255,.25)',tx:'#80E8FF'},
};
const SEED=[
  {id:1,title:'GPT-4o Turbo Introduces Real-time Vision API',category:'Model Release',author:'OpenAI',date:'2025-06-10',content:'OpenAI released an updated GPT-4o Turbo with a new real-time vision API enabling frame-by-frame video understanding at 30 fps with sub-200ms latency. Knowledge drift score remains elevated at 82%.',upvotes:142,tags:['GPT-4o','Vision','API'],drift:82},
  {id:2,title:'Google DeepMind Publishes Gemini 2.0 Technical Report',category:'Research',author:'DeepMind',date:'2025-06-08',content:'The full technical report for Gemini 2.0 is now available, detailing architectural improvements including a new sparse mixture-of-experts routing mechanism that reduces temporal hallucination by 34%.',upvotes:98,tags:['Gemini','MoE','Research'],drift:47},
  {id:3,title:"Anthropic Releases Claude's Constitutional AI v2",category:'Policy',author:'Anthropic',date:'2025-06-05',content:'Anthropic updated its Constitutional AI framework with 47 new principles focusing on epistemic honesty, knowledge boundary awareness, and temporal calibration of factual claims.',upvotes:76,tags:['Claude','Safety','Policy'],drift:31},
  {id:4,title:'Meta Releases LLaMA 3.2 with 1M Token Context',category:'Model Release',author:'Meta AI',date:'2025-06-02',content:'LLaMA 3.2 ships with a 1-million token context window, gradient-based sparse attention, and improved knowledge cutoff awareness mechanisms that reduce temporal drift by 28%.',upvotes:214,tags:['LLaMA','Context','Open Source'],drift:28},
  {id:5,title:'HuggingFace Launches Drift-Eval Benchmark Suite',category:'Benchmark',author:'HuggingFace',date:'2025-05-29',content:'A new standardised benchmark suite for evaluating AI knowledge drift, temporal reasoning, and factual consistency across 12 evaluation dimensions covering 50+ mainstream models.',upvotes:67,tags:['Benchmark','Evaluation','Drift'],drift:null},
  {id:6,title:'Mistral Releases Codestral-2025 with 256K Context',category:'Model Release',author:'Mistral AI',date:'2025-05-26',content:'Codestral-2025 targets enterprise developers with 256K context window, improved repository-level code understanding, and multi-file editing capabilities. Knowledge drift tested at 44%.',upvotes:53,tags:['Mistral','Code','Enterprise'],drift:44},
];

function GenAIUpdates({user,setPage}) {
  const [updates,setUpdates]=useState(SEED);
  const [filter,setFilter]=useState('All');
  const [sort,setSort]=useState('newest');
  const [search,setSearch]=useState('');
  const [voted,setVoted]=useState(new Set());
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({title:'',category:'Model Release',content:'',tags:'',author:user?.name||''});
  const [formErr,setFormErr]=useState({});
  const [submitted,setSubmitted]=useState(false);

  const filtered=updates
    .filter(u=>filter==='All'||u.category===filter)
    .filter(u=>!search||u.title.toLowerCase().includes(search.toLowerCase())||u.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>sort==='newest'?b.id-a.id:sort==='upvotes'?b.upvotes-a.upvotes:a.title.localeCompare(b.title));

  const toggleVote=id=>{
    setVoted(prev=>{
      const next=new Set(prev);
      if(next.has(id)){next.delete(id);setUpdates(u=>u.map(x=>x.id===id?{...x,upvotes:x.upvotes-1}:x));}
      else{next.add(id);setUpdates(u=>u.map(x=>x.id===id?{...x,upvotes:x.upvotes+1}:x));}
      return next;
    });
  };

  const validateForm=()=>{
    const e={};
    if(!form.title.trim()) e.title='Title is required';
    if(!form.content.trim()||form.content.trim().length<20) e.content='Content must be at least 20 characters';
    if(!form.author.trim()) e.author='Author / Organisation is required';
    setFormErr(e);return Object.keys(e).length===0;
  };

  const submitUpdate=()=>{
    if(!validateForm()) return;
    const nu={
      id:Date.now(),title:form.title,category:form.category,
      author:form.author,date:new Date().toISOString().slice(0,10),
      content:form.content,upvotes:0,
      tags:form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      drift:null,isNew:true
    };
    setUpdates(u=>[nu,...u]);
    setSubmitted(true);
    setTimeout(()=>{setShowForm(false);setSubmitted(false);setForm({title:'',category:'Model Release',content:'',tags:'',author:user?.name||''});},2200);
  };

  const cc=cat=>CAT_COL[cat]||{bg:'rgba(122,139,160,.12)',br:C.border,tx:C.muted};

  return (
    <div className="page" style={{paddingTop:64}}>
      <div style={{maxWidth:1060,margin:'0 auto',padding:'34px 20px'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:14,marginBottom:28}}>
          <div>
            <div className="tag" style={{marginBottom:10}}>📡 Community Powered</div>
            <h1 className="section-title">GenAI Updates</h1>
            <p style={{color:C.muted,marginTop:7,fontSize:14,maxWidth:460}}>
              Stay current with the latest releases, research, and developments across the generative AI landscape. Share what you know.
            </p>
          </div>
          <button className="btn-primary" style={{padding:'11px 22px',alignSelf:'flex-start'}}
            onClick={()=>{if(!user){setPage('login');}else{setShowForm(s=>!s);}}}>
            {showForm?'✕ Cancel':'+ Post Update'}
          </button>
        </div>

        {/* Submission form */}
        {showForm&&(
          <div className="card" style={{marginBottom:24,border:`1px solid rgba(0,212,255,.3)`,
            animation:'slideUp .35s ease',boxShadow:`0 0 36px rgba(0,212,255,.07)`}}>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:18,display:'flex',alignItems:'center',gap:7}}>
              <span style={{color:C.accent}}>⚡</span> Share a GenAI Update
            </h3>
            {submitted?(
              <div style={{textAlign:'center',padding:'30px 0',animation:'fadeIn .4s ease'}}>
                <div style={{fontSize:50,marginBottom:12,animation:'float 2s infinite'}}>🎉</div>
                <div style={{fontSize:16,fontWeight:600,color:C.accent}}>Update posted successfully!</div>
                <div style={{fontSize:13,color:C.muted,marginTop:5}}>Your contribution is now live for the community.</div>
              </div>
            ):(
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
                <div style={{gridColumn:'1/-1'}}>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Update Title *</label>
                  <input className="input-field" placeholder="e.g. GPT-5 Released with 10M Context Window"
                    value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
                    style={formErr.title?{borderColor:C.accent3}:{}}/>
                  {formErr.title&&<div style={{fontSize:11,color:C.accent3,marginTop:3}}>{formErr.title}</div>}
                </div>
                <div>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Category *</label>
                  <select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{appearance:'none',cursor:'pointer'}}>
                    {CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Author / Organisation *</label>
                  <input className="input-field" placeholder="e.g. OpenAI, Meta AI, your name…"
                    value={form.author} onChange={e=>setForm({...form,author:e.target.value})}
                    style={formErr.author?{borderColor:C.accent3}:{}}/>
                  {formErr.author&&<div style={{fontSize:11,color:C.accent3,marginTop:3}}>{formErr.author}</div>}
                </div>
                <div style={{gridColumn:'1/-1'}}>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Description * (min 20 chars)</label>
                  <textarea className="input-field" rows={4}
                    placeholder="Describe the update — what changed, why it matters, how it affects knowledge drift…"
                    value={form.content} onChange={e=>setForm({...form,content:e.target.value})}
                    style={formErr.content?{borderColor:C.accent3}:{}}/>
                  {formErr.content&&<div style={{fontSize:11,color:C.accent3,marginTop:3}}>{formErr.content}</div>}
                </div>
                <div style={{gridColumn:'1/-1'}}>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Tags (comma-separated, optional)</label>
                  <input className="input-field" placeholder="e.g. GPT-5, Context Window, Reasoning"
                    value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/>
                </div>
                <div style={{gridColumn:'1/-1',display:'flex',justifyContent:'flex-end',gap:10}}>
                  <button className="btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                  <button className="btn-primary" onClick={submitUpdate}>Publish Update →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:18}}>
          <input className="input-field" style={{maxWidth:250,padding:'8px 13px',fontSize:13}}
            placeholder="🔍 Search updates…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',flex:1}}>
            {CATEGORIES.map(cat=>(
              <button key={cat} onClick={()=>setFilter(cat)} style={{
                padding:'5px 13px',borderRadius:20,
                border:`1px solid ${filter===cat?C.accent:C.border}`,
                background:filter===cat?'rgba(0,212,255,.12)':'transparent',
                color:filter===cat?C.accent:C.muted,cursor:'pointer',
                fontSize:11,fontWeight:500,fontFamily:'Space Grotesk',transition:'all .2s'}}>
                {cat}
              </button>
            ))}
          </div>
          <select className="input-field" style={{maxWidth:150,padding:'8px 13px',fontSize:13,appearance:'none',cursor:'pointer'}}
            value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="upvotes">Most Upvoted</option>
            <option value="alpha">A–Z</option>
          </select>
        </div>
        <div style={{fontSize:12,color:C.muted,marginBottom:14}}>{filtered.length} update{filtered.length!==1?'s':''} found</div>

        {/* Cards */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {filtered.length===0?(
            <div style={{textAlign:'center',padding:'56px 20px',color:C.muted}}>
              <div style={{fontSize:40,marginBottom:10}}>🔭</div>
              <div style={{fontSize:15}}>No updates match your filters.</div>
              <button className="btn-outline" style={{marginTop:14}} onClick={()=>{setFilter('All');setSearch('');}}>Clear Filters</button>
            </div>
          ):filtered.map((u,i)=>{
            const col=cc(u.category);
            const dc=u.drift!=null?(u.drift>70?C.accent3:u.drift>50?C.amber:C.green):null;
            return (
              <div key={u.id} className="update-card"
                style={{animation:`fadeIn .4s ${i*.05}s both`,
                  border:u.isNew?`1px solid rgba(0,212,255,.45)`:`1px solid ${C.border}`}}>
                {u.isNew&&(
                  <div style={{fontSize:11,color:C.accent,fontWeight:600,marginBottom:7,display:'flex',alignItems:'center',gap:4}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:C.accent,display:'inline-block',animation:'pulse 1.5s infinite'}}/>
                    JUST POSTED
                  </div>
                )}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:14,flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:9}}>
                      <span className="cat-pill" style={{background:col.bg,border:`1px solid ${col.br}`,color:col.tx}}>{u.category}</span>
                      {dc&&(
                        <span className="cat-pill" style={{
                          background:`rgba(${u.drift>70?'255,77,109':u.drift>50?'255,179,71':'76,175,80'},.12)`,
                          border:`1px solid rgba(${u.drift>70?'255,77,109':u.drift>50?'255,179,71':'76,175,80'},.35)`,
                          color:dc}}>
                          Drift {u.drift}%
                        </span>
                      )}
                    </div>
                    <h3 style={{fontSize:15,fontWeight:600,lineHeight:1.4,marginBottom:7}}>{u.title}</h3>
                    <p style={{fontSize:13,color:C.muted,lineHeight:1.65,marginBottom:10}}>{u.content}</p>
                    {u.tags?.length>0&&(
                      <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                        {u.tags.map(t=>(
                          <span key={t} style={{fontSize:11,color:C.muted,background:C.bgCard2,
                            border:`1px solid ${C.border}`,borderRadius:12,padding:'2px 8px'}}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:9,flexShrink:0}}>
                    <button className={`upvote-btn${voted.has(u.id)?' voted':''}`} onClick={()=>toggleVote(u.id)}>
                      <span>{voted.has(u.id)?'▲':'△'}</span>
                      <span style={{fontWeight:600}}>{u.upvotes}</span>
                    </button>
                    <div style={{fontSize:11,color:C.muted,textAlign:'right'}}>
                      <div style={{fontWeight:500,color:C.text,fontSize:12}}>{u.author}</div>
                      <div>{u.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {!user&&(
          <div style={{textAlign:'center',marginTop:32,padding:'24px',borderRadius:14,
            background:`linear-gradient(135deg,rgba(0,212,255,.05),rgba(123,47,255,.05))`,
            border:`1px solid rgba(0,212,255,.2)`}}>
            <p style={{color:C.muted,fontSize:14,marginBottom:14}}>
              Sign in to post your own GenAI updates and vote on community contributions.
            </p>
            <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
              <button className="btn-outline" onClick={()=>setPage('login')}>Sign In</button>
              <button className="btn-primary" onClick={()=>setPage('signup')}>Create Account →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Contact Page ───────────────────────────────────────────────────────────────
function Contact({setPage}) {
  const [form,setForm]=useState({name:'',email:'',company:'',subject:'General Inquiry',message:''});
  const [err,setErr]=useState({});
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);
  const subjects=['General Inquiry','Sales & Pricing','Technical Support','Partnership','Press & Media','Bug Report','Feature Request'];
  const validate=()=>{
    const e={};
    if(!form.name.trim()) e.name='Name required';
    if(!form.email.includes('@')) e.email='Valid email required';
    if(!form.message.trim()||form.message.trim().length<10) e.message='Message must be at least 10 characters';
    setErr(e);return Object.keys(e).length===0;
  };
  const submit=async()=>{
    if(!validate()) return;
    setSending(true);
    await new Promise(r=>setTimeout(r,1600));
    setSending(false);setSent(true);
  };
  const contactCards=[
    {icon:'📧',title:'Email Us',desc:'hello@drift.ai',sub:'We reply within 24 hours',color:C.accent},
    {icon:'💬',title:'Live Chat',desc:'Available 9am–6pm UTC',sub:'Mon–Fri business days',color:C.accent2},
    {icon:'📞',title:'Phone',desc:'+1 (415) 555-0198',sub:'Enterprise clients only',color:C.green},
    {icon:'🗺️',title:'Headquarters',desc:'San Francisco, CA',sub:'55 2nd Street, Suite 800',color:C.amber},
  ];
  const faqs=[
    {q:'How does DRIFT.AI detect knowledge drift?',a:'We use semantic similarity scoring, temporal probing, and multi-dimensional benchmark evaluation to continuously assess model knowledge boundaries.'},
    {q:'What LLMs do you support?',a:'We support 50+ models including GPT-4o, Claude 3.5, Gemini 1.5 Pro, LLaMA 3.1, Mistral, Falcon, and all major open-source and proprietary models.'},
    {q:'Is there a free plan?',a:'Yes! Our free plan supports up to 5 models with basic alerting and 7-day history. Upgrade to Pro for unlimited models and real-time alerting.'},
    {q:'How do I integrate DRIFT.AI with my workflow?',a:'We offer a REST API, Python SDK, and pre-built integrations with Slack, PagerDuty, Datadog, and GitHub Actions.'},
  ];
  return (
    <div className="page" style={{paddingTop:64}}>
      <div style={{maxWidth:1060,margin:'0 auto',padding:'38px 20px'}}>
        {/* Header */}
        <div style={{textAlign:'center',marginBottom:48}}>
          <div className="tag" style={{marginBottom:12}}>📬 Get in Touch</div>
          <h1 className="section-title" style={{marginBottom:14}}>
            We'd Love to{' '}
            <span style={{background:`linear-gradient(135deg,${C.accent},${C.accent2})`,
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Hear from You</span>
          </h1>
          <p style={{color:C.muted,maxWidth:480,margin:'0 auto',lineHeight:1.7,fontSize:15}}>
            Whether you have a question about drift detection, pricing, integrations, or anything else — our team is ready to help.
          </p>
        </div>

        {/* Contact method cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:44}}>
          {contactCards.map((c,i)=>(
            <div key={i} className="card" style={{textAlign:'center',animation:`fadeIn .5s ${i*.1}s both`}}>
              <div style={{fontSize:30,marginBottom:10}}>{c.icon}</div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>{c.title}</div>
              <div style={{fontSize:13,color:c.color,fontWeight:500,marginBottom:3}}>{c.desc}</div>
              <div style={{fontSize:12,color:C.muted}}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Form + sidebar */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24,marginBottom:44}}>
          {/* Form */}
          <div className="card" style={{position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:2,
              background:`linear-gradient(90deg,${C.accent2},${C.accent})`}}/>
            <h2 style={{fontSize:17,fontWeight:600,marginBottom:20}}>Send a Message</h2>
            {sent?(
              <div style={{textAlign:'center',padding:'36px 0',animation:'fadeIn .4s ease'}}>
                <div style={{fontSize:52,marginBottom:14,animation:'float 2.5s infinite'}}>✅</div>
                <div style={{fontSize:17,fontWeight:600,color:C.green,marginBottom:7}}>Message Sent!</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>
                  Thanks for reaching out.<br/>We'll be in touch within 24 hours.
                </div>
                <button className="btn-outline" style={{marginTop:22}}
                  onClick={()=>{setSent(false);setForm({name:'',email:'',company:'',subject:'General Inquiry',message:''});}}>
                  Send Another
                </button>
              </div>
            ):(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Full Name *</label>
                    <input className="contact-input" placeholder="Jane Doe"
                      value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                      style={err.name?{borderColor:C.accent3}:{}}/>
                    {err.name&&<div style={{fontSize:11,color:C.accent3,marginTop:3}}>{err.name}</div>}
                  </div>
                  <div>
                    <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Email *</label>
                    <input className="contact-input" type="email" placeholder="jane@acme.com"
                      value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                      style={err.email?{borderColor:C.accent3}:{}}/>
                    {err.email&&<div style={{fontSize:11,color:C.accent3,marginTop:3}}>{err.email}</div>}
                  </div>
                </div>
                <div>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Company (optional)</label>
                  <input className="contact-input" placeholder="Acme Corp"
                    value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
                </div>
                <div>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Subject</label>
                  <select className="contact-input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}
                    style={{appearance:'none',cursor:'pointer'}}>
                    {subjects.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>Message *</label>
                  <textarea className="contact-input" rows={5}
                    placeholder="Tell us how we can help you…"
                    value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                    style={err.message?{borderColor:C.accent3}:{}}/>
                  {err.message&&<div style={{fontSize:11,color:C.accent3,marginTop:3}}>{err.message}</div>}
                </div>
                <button className="btn-primary" style={{width:'100%',padding:'13px'}}
                  onClick={submit} disabled={sending}>
                  {sending?'📡 Sending…':'Send Message →'}
                </button>
                <p style={{fontSize:11,color:C.muted,textAlign:'center'}}>
                  We respect your privacy. Your data is never sold or shared.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            {/* Map */}
            <div className="card" style={{padding:0,overflow:'hidden',minHeight:180}}>
              <div style={{background:`linear-gradient(135deg,${C.bgCard2},${C.bgCard})`,
                height:180,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                <svg width="100%" height="180" viewBox="0 0 400 180" style={{position:'absolute',opacity:.28}}>
                  {Array.from({length:8},(_,i)=>(
                    <line key={i} x1={i*60} y1={0} x2={i*60} y2={180} stroke={C.border} strokeWidth=".5"/>
                  ))}
                  {Array.from({length:5},(_,i)=>(
                    <line key={i} x1={0} y1={i*45} x2={400} y2={i*45} stroke={C.border} strokeWidth=".5"/>
                  ))}
                  <circle cx={200} cy={90} r={36} fill="none" stroke={C.accent} strokeWidth=".5" opacity=".4"/>
                  <circle cx={200} cy={90} r={62} fill="none" stroke={C.accent} strokeWidth=".3" opacity=".22"/>
                  <circle cx={200} cy={90} r={10} fill={C.accent2} opacity=".85"/>
                  <circle cx={200} cy={90} r={5} fill={C.accent}/>
                  <circle cx={200} cy={90} r={18} fill="none" stroke={C.accent} strokeWidth="1" style={{animation:'pulse 2s infinite'}}/>
                </svg>
                <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
                  <div style={{fontSize:30,marginBottom:6}}>📍</div>
                  <div style={{fontWeight:600,fontSize:14}}>San Francisco, CA</div>
                  <div style={{fontSize:12,color:C.muted}}>55 2nd Street, Suite 800</div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="card">
              <h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Follow DRIFT.AI</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                {[{icon:'🐦',label:'Twitter/X',handle:'@driftai'},{icon:'💼',label:'LinkedIn',handle:'DRIFT.AI'},{icon:'🐙',label:'GitHub',handle:'drift-ai'},{icon:'📺',label:'YouTube',handle:'DriftAI'}].map((s,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 11px',
                    borderRadius:8,background:C.bgCard2,cursor:'pointer',
                    border:`1px solid ${C.border}`,transition:'border-color .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <span style={{fontSize:17}}>{s.icon}</span>
                    <div>
                      <div style={{fontSize:12,fontWeight:500}}>{s.label}</div>
                      <div style={{fontSize:11,color:C.muted}}>{s.handle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SLA */}
            <div className="card" style={{background:`linear-gradient(135deg,rgba(123,47,255,.09),rgba(0,212,255,.04))`}}>
              <h3 style={{fontSize:13,fontWeight:600,marginBottom:11}}>⚡ Response Times</h3>
              {[{type:'Sales Inquiries',time:'< 2 hours',color:C.green},{type:'Technical Support',time:'< 4 hours',color:C.accent},{type:'General Questions',time:'< 24 hours',color:C.amber},{type:'Enterprise SLA',time:'< 30 minutes',color:C.accent2}].map((r,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'6px 0',borderBottom:i<3?`1px solid ${C.border}`:'none'}}>
                  <span style={{fontSize:12,color:C.muted}}>{r.type}</span>
                  <span style={{fontSize:12,color:r.color,fontWeight:600}}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{marginBottom:44}}>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:22,textAlign:'center'}}>
            Frequently Asked <span style={{color:C.accent}}>Questions</span>
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14}}>
            {faqs.map((f,i)=>(
              <div key={i} className="card" style={{animation:`fadeIn .5s ${i*.1}s both`}}>
                <h4 style={{fontSize:13,fontWeight:600,marginBottom:9,lineHeight:1.45,color:C.accent}}>{f.q}</h4>
                <p style={{fontSize:13,color:C.muted,lineHeight:1.65}}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────────────────────
function Login({setPage,onLogin}) {
  const [form,setForm]=useState({email:'',password:''});
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const handle=async()=>{
    if(!form.email||!form.password){setError('Please fill in all fields.');return;}
    setLoading(true);setError('');
    await new Promise(r=>setTimeout(r,1100));
    onLogin({name:form.email.split('@')[0],email:form.email});
  };
  return (
    <div className="page" style={{minHeight:'100vh',display:'flex',alignItems:'center',
      justifyContent:'center',padding:'24px',position:'relative'}}>
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
        <div style={{position:'absolute',width:460,height:460,
          background:`radial-gradient(circle,rgba(123,47,255,.1),transparent 70%)`,top:'8%',left:'-80px'}}/>
        <div style={{position:'absolute',width:340,height:340,
          background:`radial-gradient(circle,rgba(0,212,255,.09),transparent 70%)`,bottom:0,right:'-40px'}}/>
      </div>
      <div style={{width:'100%',maxWidth:420,position:'relative',zIndex:1}}>
        <div className="glass" style={{borderRadius:20,padding:'36px 32px'}}>
          <div style={{textAlign:'center',marginBottom:28}}>
            <div style={{width:50,height:50,borderRadius:12,margin:'0 auto 12px',
              background:`linear-gradient(135deg,${C.accent2},${C.accent})`,
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>⚡</div>
            <h1 style={{fontFamily:'Orbitron,monospace',fontSize:20,fontWeight:700,marginBottom:5}}>Welcome Back</h1>
            <p style={{color:C.muted,fontSize:13}}>Sign in to your DRIFT.AI account</p>
          </div>
          {error&&<div style={{background:'rgba(255,77,109,.1)',border:`1px solid ${C.accent3}`,
            borderRadius:8,padding:'9px 13px',marginBottom:16,fontSize:13,color:C.accent3}}>{error}</div>}
          <div style={{display:'flex',flexDirection:'column',gap:13}}>
            {[{k:'email',l:'Email',t:'email',p:'you@company.com'},{k:'password',l:'Password',t:'password',p:'••••••••'}].map(f=>(
              <div key={f.k}>
                <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>{f.l}</label>
                <input className="input-field" type={f.t} placeholder={f.p}
                  value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}
                  onKeyDown={e=>e.key==='Enter'&&handle()}/>
              </div>
            ))}
            <div style={{textAlign:'right'}}>
              <span style={{fontSize:12,color:C.accent,cursor:'pointer'}}>Forgot password?</span>
            </div>
            <button className="btn-primary" style={{width:'100%',padding:'12px'}} onClick={handle} disabled={loading}>
              {loading?'🔄 Signing in…':'Sign In →'}
            </button>
          </div>
          <div style={{marginTop:22,paddingTop:18,borderTop:`1px solid ${C.border}`}}>
            <div style={{display:'flex',gap:9}}>
              {['🌐 Google','🐙 GitHub'].map(s=>(
                <button key={s} className="btn-outline" style={{flex:1,fontSize:12,padding:'8px'}} onClick={handle}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{marginTop:18,textAlign:'center',fontSize:13,color:C.muted}}>
            New?{' '}<span style={{color:C.accent,cursor:'pointer',fontWeight:500}} onClick={()=>setPage('signup')}>Create account</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Signup ─────────────────────────────────────────────────────────────────────
function Signup({setPage,onLogin}) {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:'',email:'',password:'',confirm:'',plan:'pro',org:''});
  const [loading,setLoading]=useState(false);
  const [errors,setErrors]=useState({});
  const plans=[
    {id:'free',label:'Free',price:'$0/mo',features:['5 models','Basic alerts','7-day history']},
    {id:'pro',label:'Pro',price:'$49/mo',features:['Unlimited models','Real-time alerts','90-day history','API access']},
    {id:'enterprise',label:'Enterprise',price:'Custom',features:['Everything in Pro','SLA guarantee','Dedicated support','Custom integrations']},
  ];
  const validate1=()=>{
    const e={};
    if(!form.name.trim()) e.name='Required';
    if(!form.email.includes('@')) e.email='Valid email required';
    if(form.password.length<6) e.password='Min 6 characters';
    if(form.password!==form.confirm) e.confirm='Passwords do not match';
    setErrors(e);return Object.keys(e).length===0;
  };
  const next=()=>{if(step===1&&!validate1()) return;setStep(s=>s+1);};
  const submit=async()=>{setLoading(true);await new Promise(r=>setTimeout(r,1400));onLogin({name:form.name,email:form.email,plan:form.plan});};
  return (
    <div className="page" style={{minHeight:'100vh',display:'flex',alignItems:'center',
      justifyContent:'center',padding:'80px 24px 36px',position:'relative'}}>
      <div style={{width:'100%',maxWidth:500,position:'relative',zIndex:1}}>
        <div style={{display:'flex',gap:7,marginBottom:26}}>
          {[1,2,3].map(s=>(
            <div key={s} style={{flex:1,height:3,borderRadius:2,
              background:s<=step?`linear-gradient(90deg,${C.accent2},${C.accent})`:C.border,transition:'background .35s'}}/>
          ))}
        </div>
        <div className="glass" style={{borderRadius:20,padding:'36px 32px'}}>
          <div style={{textAlign:'center',marginBottom:26}}>
            <h1 style={{fontFamily:'Orbitron,monospace',fontSize:20,fontWeight:700,marginBottom:5}}>
              {step===1?'Create Account':step===2?'Choose Plan':'🎉 All Set!'}
            </h1>
            <p style={{color:C.muted,fontSize:13}}>
              {step===1?'Join the DRIFT.AI intelligence network':step===2?'Pick a plan that fits your needs':'Setting up your workspace…'}
            </p>
          </div>
          {step===1&&(
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              {[{k:'name',l:'Full Name',t:'text',p:'Jane Doe'},{k:'org',l:'Organisation (optional)',t:'text',p:'Acme Corp'},{k:'email',l:'Work Email',t:'email',p:'jane@acme.com'},{k:'password',l:'Password',t:'password',p:'Min 6 chars'},{k:'confirm',l:'Confirm Password',t:'password',p:'Repeat'}].map(f=>(
                <div key={f.k}>
                  <label style={{fontSize:12,color:C.muted,display:'block',marginBottom:5}}>{f.l}</label>
                  <input className="input-field" type={f.t} placeholder={f.p}
                    value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}
                    style={errors[f.k]?{borderColor:C.accent3}:{}}/>
                  {errors[f.k]&&<div style={{fontSize:11,color:C.accent3,marginTop:3}}>{errors[f.k]}</div>}
                </div>
              ))}
              <button className="btn-primary" style={{width:'100%',padding:'12px',marginTop:4}} onClick={next}>Continue →</button>
            </div>
          )}
          {step===2&&(
            <div>
              <div style={{display:'flex',flexDirection:'column',gap:11,marginBottom:22}}>
                {plans.map(p=>(
                  <div key={p.id} onClick={()=>setForm({...form,plan:p.id})} style={{
                    border:`2px solid ${form.plan===p.id?C.accent:C.border}`,borderRadius:12,
                    padding:'13px 16px',cursor:'pointer',transition:'all .2s',
                    background:form.plan===p.id?'rgba(0,212,255,.05)':'transparent',
                    display:'flex',alignItems:'center',gap:13}}>
                    <div style={{width:18,height:18,borderRadius:'50%',flexShrink:0,
                      border:`2px solid ${form.plan===p.id?C.accent:C.border}`,
                      background:form.plan===p.id?C.accent:'transparent',
                      display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {form.plan===p.id&&<div style={{width:7,height:7,borderRadius:'50%',background:C.bg}}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <span style={{fontWeight:600,fontSize:14}}>{p.label}</span>
                        <span style={{color:C.accent,fontWeight:700,fontFamily:'Orbitron,monospace',fontSize:13}}>{p.price}</span>
                      </div>
                      <div style={{fontSize:11,color:C.muted,marginTop:3}}>{p.features.join(' · ')}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:9}}>
                <button className="btn-outline" style={{flex:1,padding:'10px'}} onClick={()=>setStep(1)}>← Back</button>
                <button className="btn-primary" style={{flex:2,padding:'10px'}} onClick={next}>Continue →</button>
              </div>
            </div>
          )}
          {step===3&&(
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:58,marginBottom:18,animation:'float 2.5s infinite'}}>🚀</div>
              <div style={{background:`linear-gradient(135deg,rgba(0,212,255,.05),rgba(123,47,255,.05))`,
                border:`1px solid rgba(0,212,255,.2)`,borderRadius:12,padding:'16px',marginBottom:22}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:5}}>Selected plan</div>
                <div style={{fontFamily:'Orbitron,monospace',fontSize:18,fontWeight:700,color:C.accent}}>
                  {plans.find(p=>p.id===form.plan)?.label} Plan
                </div>
              </div>
              <button className="btn-primary" style={{width:'100%',padding:'12px',fontSize:15}}
                onClick={submit} disabled={loading}>
                {loading?'🔄 Creating account…':'⚡ Launch Dashboard'}
              </button>
              <div style={{marginTop:13,fontSize:13,color:C.muted}}>
                Already have an account?{' '}
                <span style={{color:C.accent,cursor:'pointer'}} onClick={()=>setPage('login')}>Sign in</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({user,setPage}) {
  const [activeTab,setActiveTab]=useState('overview');
  const [time,setTime]=useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
  const tabs=['overview','models','alerts','analytics'];
  const driftModels=[
    {name:'GPT-4o',drift:82,health:'critical',version:'2024-05',tokens:'1.8T'},
    {name:'Claude 3.5 Sonnet',drift:54,health:'warning',version:'2024-04',tokens:'2.1T'},
    {name:'Gemini 1.5 Pro',drift:91,health:'critical',version:'2024-03',tokens:'3.2T'},
    {name:'LLaMA 3.1 70B',drift:31,health:'good',version:'2024-07',tokens:'950B'},
    {name:'Mistral 7B Instruct',drift:67,health:'warning',version:'2024-06',tokens:'420B'},
    {name:'Falcon 180B',drift:23,health:'good',version:'2023-09',tokens:'1.2T'},
  ];
  const hc=h=>h==='critical'?C.accent3:h==='warning'?C.amber:C.green;
  const chartData=[42,55,63,58,71,68,77,82,79,88,84,91];
  return (
    <div className="page" style={{paddingTop:64}}>
      <div style={{maxWidth:1400,margin:'0 auto',padding:'22px 18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:13,marginBottom:22}}>
          <div>
            <div className="tag" style={{marginBottom:7}}>🟢 Live Monitoring Active</div>
            <h1 style={{fontFamily:'Orbitron,monospace',fontSize:21,fontWeight:700,marginBottom:3}}>Mission Control</h1>
            <p style={{color:C.muted,fontSize:13}}>
              Welcome back, <span style={{color:C.accent}}>{user?.name}</span> · {time.toLocaleTimeString()}
            </p>
          </div>
          <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
            <button className="btn-outline" style={{fontSize:12,padding:'7px 13px'}} onClick={()=>setPage('updates')}>📡 GenAI Updates</button>
            <button className="btn-outline" style={{fontSize:12,padding:'7px 13px'}}>⬇ Export</button>
            <button className="btn-primary" style={{fontSize:12,padding:'7px 13px'}}>+ Add Model</button>
          </div>
        </div>
        <div style={{display:'flex',gap:2,marginBottom:22,borderBottom:`1px solid ${C.border}`,overflowX:'auto'}}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={{
              background:'none',border:'none',color:activeTab===t?C.accent:C.muted,
              borderBottom:activeTab===t?`2px solid ${C.accent}`:'2px solid transparent',
              padding:'8px 16px',cursor:'pointer',fontFamily:'Space Grotesk',fontWeight:500,
              fontSize:13,textTransform:'capitalize',transition:'all .2s',marginBottom:-1,whiteSpace:'nowrap'}}>
              {t}
            </button>
          ))}
        </div>
        {activeTab==='overview'&&(
          <div style={{animation:'fadeIn .4s ease'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(185px,1fr))',gap:13,marginBottom:18}}>
              {[{icon:'🔴',label:'Critical Drifts',val:'3',sub:'+2 today',c:C.accent3},{icon:'⚠️',label:'Models Warning',val:'8',sub:'15 total',c:C.amber},{icon:'📡',label:'Events/Hour',val:'24.8K',sub:'↑ 12% avg',c:C.accent},{icon:'🎯',label:'Avg Drift Score',val:'62.4',sub:'↑ 4.2 this week',c:C.accent2}].map((k,i)=>(
                <div key={i} className="metric-card" style={{animation:`fadeIn .5s ${i*.1}s both`}}>
                  <div style={{fontSize:22,marginBottom:7}}>{k.icon}</div>
                  <div style={{fontFamily:'Orbitron,monospace',fontSize:24,fontWeight:700,color:k.c}}>{k.val}</div>
                  <div style={{fontSize:13,marginTop:3,fontWeight:500}}>{k.label}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))',gap:16,marginBottom:16}}>
              <div className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:13}}>
                  <h3 style={{fontSize:14,fontWeight:600}}>Neural Drift Map</h3>
                  <span className="tag">Live</span>
                </div>
                <NeuralNet/>
                <div style={{marginTop:9,fontSize:11,color:C.muted}}>🔴 Active drift at layer 2, neuron 2</div>
              </div>
              <div className="card" style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <h3 style={{fontSize:14,fontWeight:600,marginBottom:14,alignSelf:'flex-start'}}>Global Model Network</h3>
                <div style={{transform:'scale(.58)',transformOrigin:'top center',height:162}}>
                  <Globe3D/>
                </div>
                <div style={{display:'flex',gap:10,marginTop:6}}>
                  <DriftRing score={73} label="Avg" color={C.accent3}/>
                  <DriftRing score={92} label="Max" color={C.accent3}/>
                  <DriftRing score={23} label="Min" color={C.green}/>
                </div>
              </div>
              <div className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:13}}>
                  <h3 style={{fontSize:14,fontWeight:600}}>Drift Trend (30d)</h3>
                  <span style={{fontSize:12,color:C.accent3}}>↑ 12.4%</span>
                </div>
                <div style={{display:'flex',alignItems:'flex-end',gap:3,height:105}}>
                  {chartData.map((v,i)=>(
                    <div key={i} style={{flex:1,borderRadius:'3px 3px 0 0',height:`${(v/100)*105}px`,
                      background:v>75?`linear-gradient(to top,${C.accent3},#FF8A80)`:v>55?`linear-gradient(to top,${C.amber},#FFD180)`:`linear-gradient(to top,${C.accent2},${C.accent})`,
                      opacity:.8+(i/chartData.length)*.2}}/>
                  ))}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:10,color:C.muted}}>
                  <span>30d ago</span><span>Today</span>
                </div>
                <div style={{marginTop:13}}><Waveform color={C.accent} bars={26}/></div>
              </div>
            </div>
            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <h3 style={{fontSize:15,fontWeight:600}}>Live Drift Events</h3>
                <div style={{display:'flex',gap:7,alignItems:'center'}}>
                  <div style={{width:7,height:7,borderRadius:'50%',background:C.green,animation:'pulse 2s infinite'}}/>
                  <span style={{fontSize:12,color:C.green}}>Streaming</span>
                </div>
              </div>
              <LiveFeed/>
            </div>
          </div>
        )}
        {activeTab==='models'&&(
          <div style={{animation:'fadeIn .4s ease',display:'flex',flexDirection:'column',gap:13}}>
            {driftModels.map((m,i)=>(
              <div key={i} className="card" style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',animation:`fadeIn .4s ${i*.07}s both`}}>
                <div style={{width:40,height:40,borderRadius:9,flexShrink:0,
                  background:`linear-gradient(135deg,${C.accent2},${C.accent})`,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🤖</div>
                <div style={{flex:1,minWidth:170}}>
                  <div style={{fontWeight:600,marginBottom:2,fontSize:14}}>{m.name}</div>
                  <div style={{fontSize:12,color:C.muted}}>v{m.version} · {m.tokens} tokens</div>
                  <div className="drift-bar" style={{marginTop:8}}>
                    <div className="drift-bar-fill" style={{'--w':`${m.drift}%`,width:`${m.drift}%`,
                      background:m.drift>70?`linear-gradient(90deg,${C.accent3},#FF8A80)`:m.drift>50?`linear-gradient(90deg,${C.amber},#FFD180)`:`linear-gradient(90deg,${C.accent2},${C.accent})`}}/>
                  </div>
                </div>
                <DriftRing score={m.drift} label="Drift" color={hc(m.health)}/>
                <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'flex-end'}}>
                  <span style={{background:`rgba(${m.health==='critical'?'255,77,109':m.health==='warning'?'255,179,71':'76,175,80'},.12)`,
                    border:`1px solid ${hc(m.health)}`,color:hc(m.health),
                    padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600}}>{m.health.toUpperCase()}</span>
                  <button className="btn-outline" style={{fontSize:11,padding:'5px 12px'}}>Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab==='alerts'&&(
          <div style={{animation:'fadeIn .4s ease'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:14,marginBottom:18}}>
              {[{level:'Critical',count:3,icon:'🔴',color:C.accent3},{level:'Warning',count:8,icon:'⚠️',color:C.amber},{level:'Info',count:14,icon:'ℹ️',color:C.accent}].map((a,i)=>(
                <div key={i} className="metric-card" style={{textAlign:'center'}}>
                  <div style={{fontSize:32,marginBottom:9}}>{a.icon}</div>
                  <div style={{fontFamily:'Orbitron,monospace',fontSize:32,fontWeight:900,color:a.color}}>{a.count}</div>
                  <div style={{fontSize:13,color:C.muted,marginTop:4}}>{a.level} Alerts</div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{fontSize:15,fontWeight:600,marginBottom:16}}>Alert Timeline</h3>
              <LiveFeed/>
            </div>
          </div>
        )}
        {activeTab==='analytics'&&(
          <div style={{animation:'fadeIn .4s ease'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
              <div className="card">
                <h3 style={{fontSize:14,fontWeight:600,marginBottom:16}}>Drift Score Distribution</h3>
                <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <DriftRing score={82} label="GPT-4o" color={C.accent3}/>
                  <DriftRing score={54} label="Claude" color={C.amber}/>
                  <DriftRing score={91} label="Gemini" color={C.accent3}/>
                  <DriftRing score={31} label="LLaMA" color={C.green}/>
                </div>
              </div>
              <div className="card">
                <h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Waveform Activity</h3>
                {['High Drift','Medium','Low Drift'].map((label,i)=>(
                  <div key={i} style={{marginBottom:13}}>
                    <div style={{fontSize:11,color:C.muted,marginBottom:5}}>{label}</div>
                    <Waveform color={i===0?C.accent3:i===1?C.amber:C.accent} bars={20}/>
                  </div>
                ))}
              </div>
              <div className="card">
                <h3 style={{fontSize:14,fontWeight:600,marginBottom:14}}>Model Health Overview</h3>
                {driftModels.map((m,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:9,marginBottom:11}}>
                    <div style={{fontSize:11,color:C.muted,width:100,flexShrink:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.name.split(' ')[0]}</div>
                    <div className="drift-bar" style={{flex:1}}>
                      <div className="drift-bar-fill" style={{'--w':`${m.drift}%`,width:`${m.drift}%`,
                        background:m.drift>70?`linear-gradient(90deg,${C.accent3},#FF8A80)`:m.drift>50?`linear-gradient(90deg,${C.amber},#FFD180)`:`linear-gradient(90deg,${C.accent2},${C.accent})`}}/>
                    </div>
                    <span style={{fontSize:11,color:hc(m.health),width:28,textAlign:'right'}}>{m.drift}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState('landing');
  const [user,setUser]=useState(null);
  const onLogin=u=>{setUser(u);setPage('dashboard');};
  const onLogout=()=>{setUser(null);setPage('landing');};
  return (
    <>
      <style>{css}</style>
      <Stars/>
      <Scanline/>
      <Navbar page={page} setPage={setPage} user={user} onLogout={onLogout}/>
      {page==='landing'   && <Landing setPage={setPage}/>}
      {page==='login'     && <Login setPage={setPage} onLogin={onLogin}/>}
      {page==='signup'    && <Signup setPage={setPage} onLogin={onLogin}/>}
      {page==='updates'   && <GenAIUpdates user={user} setPage={setPage}/>}
      {page==='contact'   && <Contact setPage={setPage}/>}
      {page==='dashboard' && (user ? <Dashboard user={user} setPage={setPage}/> : <Login setPage={setPage} onLogin={onLogin}/>)}
    </>
  );
}