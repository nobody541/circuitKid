/**
 * Practice Simulation – Circuit-board style with realistic SVG components
 *
 * Layout: components arranged in a rectangular loop.
 *   Battery on top, LED(s) on bottom, optional switch on right.
 *   Realistic drawn components with clickable terminal circles.
 *   Tapping two terminals draws a coloured wire.
 *   After all hints -> Show Answer.
 *   Inline "Continue" button after completion (no popup).
 */
import { el, mount, icon } from '../utils/dom.js';
import { createMascotWithSpeech } from '../ui/mascot.js';
import { sounds } from '../utils/audio.js';

/* ─── colours for wires ─── */
const WIRE_COLORS = ['#E53935','#1E88E5','#43A047','#FB8C00','#8E24AA','#00ACC1'];

export function mountPracticeSim(container, lessonData, onComplete) {
  const simData = lessonData.practiceSim;
  let hintIndex = 0;
  let completed = false;
  let selectedTerminal = null;
  let lastHintText = null;
  const wires = [];

  const comps  = simData.preplacedComponents || [];
  const terms  = buildTerminals(comps);
  const answer = simData.correctWires || autoAnswer(comps);

  assignPositions(comps, terms);

  /* ── terminal builder ── */
  function buildTerminals(cs) {
    const out = [];
    cs.forEach((c, i) => {
      const id = 'c' + i;
      if (c.type === 'battery') {
        out.push({ id: id+'-pos', ci: i, label:'+', full:'Battery +', type:'battery' });
        out.push({ id: id+'-neg', ci: i, label:'\u2212', full:'Battery \u2212', type:'battery' });
      } else if (c.type.startsWith('led')) {
        const col = c.type.replace('led-','') || 'red';
        const nm = col[0].toUpperCase()+col.slice(1);
        out.push({ id: id+'-anode', ci: i, label:'+', full:nm+' LED +', type:'led', ledColor:col });
        out.push({ id: id+'-cathode', ci: i, label:'\u2212', full:nm+' LED \u2212', type:'led', ledColor:col });
      } else if (c.type === 'switch') {
        out.push({ id: id+'-a', ci: i, label:'L', full:'Switch L', type:'switch' });
        out.push({ id: id+'-b', ci: i, label:'R', full:'Switch R', type:'switch' });
      }
    });
    return out;
  }

  /* ── lay out terminals – rectangular circuit ── */
  function assignPositions(cs, ts) {
    const bi = cs.findIndex(c => c.type === 'battery');
    const lis = cs.map((c,i) => c.type.startsWith('led') ? i : -1).filter(i=>i>=0);
    const si = cs.findIndex(c => c.type === 'switch');
    const W = 580, H = 400;

    const set = (id, x, y) => { const t = ts.find(t=>t.id===id); if(t){t.x=x; t.y=y;} };

    if (si >= 0 && lis.length === 1) {
      /* Battery(top) -> Switch(right) -> LED(bottom) */
      set('c'+bi+'-neg', W*0.22, 65);
      set('c'+bi+'-pos', W*0.78, 65);
      set('c'+si+'-a',   W*0.88, H*0.35);
      set('c'+si+'-b',   W*0.88, H*0.65);
      set('c'+lis[0]+'-anode',   W*0.72, H-65);
      set('c'+lis[0]+'-cathode', W*0.28, H-65);
    } else if (si >= 0 && lis.length >= 2) {
      set('c'+bi+'-neg', W*0.22, 65);
      set('c'+bi+'-pos', W*0.78, 65);
      set('c'+si+'-a',   W*0.88, H*0.35);
      set('c'+si+'-b',   W*0.88, H*0.65);
      /* Spread LEDs widely at bottom */
      if (lis.length === 2) {
        set('c'+lis[0]+'-anode',   W*0.52, H-65);
        set('c'+lis[0]+'-cathode', W*0.15, H-65);
        set('c'+lis[1]+'-anode',   W*0.78, H-65);
        set('c'+lis[1]+'-cathode', W*0.42, H-65);
      } else {
        const gap = W * 0.7 / (lis.length + 1);
        lis.forEach((li, idx) => {
          const cx = W*0.1 + gap*(idx+1);
          set('c'+li+'-anode',   cx + 55, H-65);
          set('c'+li+'-cathode', cx - 55, H-65);
        });
      }
    } else if (lis.length === 1) {
      /* Simple loop: battery top, LED bottom */
      set('c'+bi+'-neg',         W*0.22, 65);
      set('c'+bi+'-pos',         W*0.78, 65);
      set('c'+lis[0]+'-anode',   W*0.72, H-65);
      set('c'+lis[0]+'-cathode', W*0.28, H-65);
    } else {
      /* Parallel LEDs, no switch */
      set('c'+bi+'-neg', W*0.22, 65);
      set('c'+bi+'-pos', W*0.78, 65);
      if (lis.length === 2) {
        set('c'+lis[0]+'-anode',   W*0.52, H-65);
        set('c'+lis[0]+'-cathode', W*0.15, H-65);
        set('c'+lis[1]+'-anode',   W*0.78, H-65);
        set('c'+lis[1]+'-cathode', W*0.42, H-65);
      } else {
        const gap = W * 0.7 / (lis.length + 1);
        lis.forEach((li, idx) => {
          const cx = W*0.1 + gap*(idx+1);
          set('c'+li+'-anode',   cx + 55, H-65);
          set('c'+li+'-cathode', cx - 55, H-65);
        });
      }
    }
  }

  /* ── auto-generate correct wires ── */
  function autoAnswer(cs) {
    const w=[], bi=cs.findIndex(c=>c.type==='battery');
    const lis=cs.map((c,i)=>c.type.startsWith('led')?i:-1).filter(i=>i>=0);
    const si=cs.findIndex(c=>c.type==='switch');
    if(bi<0||lis.length===0) return w;
    if(si>=0&&lis.length===1){
      w.push({from:'c'+bi+'-pos',to:'c'+si+'-a'});
      w.push({from:'c'+si+'-b',to:'c'+lis[0]+'-anode'});
      w.push({from:'c'+lis[0]+'-cathode',to:'c'+bi+'-neg'});
    } else if(si>=0&&lis.length>=2){
      w.push({from:'c'+bi+'-pos',to:'c'+si+'-a'});
      for(const li of lis){w.push({from:'c'+si+'-b',to:'c'+li+'-anode'});w.push({from:'c'+li+'-cathode',to:'c'+bi+'-neg'});}
    } else if(lis.length===1){
      w.push({from:'c'+bi+'-pos',to:'c'+lis[0]+'-anode'});
      w.push({from:'c'+lis[0]+'-cathode',to:'c'+bi+'-neg'});
    } else {
      for(const li of lis){w.push({from:'c'+bi+'-pos',to:'c'+li+'-anode'});w.push({from:'c'+li+'-cathode',to:'c'+bi+'-neg'});}
    }
    return w;
  }

  /* ── wire helpers ── */
  function has(a,b){ return wires.some(w=>(w.from===a&&w.to===b)||(w.from===b&&w.to===a)); }
  function ok(a,b) { return answer.some(c=>(c.from===a&&c.to===b)||(c.from===b&&c.to===a)); }
  function done()  { return answer.length>0 && answer.every(c=>has(c.from,c.to)); }
  function isConn(tid){ return wires.some(w=>w.from===tid||w.to===tid); }

  /* ── tap handler ── */
  function handleTap(tid){
    if(completed) return;
    if(!selectedTerminal){ selectedTerminal=tid; sounds.click(); render(); return; }
    if(selectedTerminal===tid){ selectedTerminal=null; sounds.click(); render(); return; }
    const a=selectedTerminal, b=tid;
    const ta=terms.find(t=>t.id===a), tb=terms.find(t=>t.id===b);
    if(ta&&tb&&ta.ci===tb.ci){ sounds.error(); selectedTerminal=null; render(); return; }
    if(has(a,b)){ selectedTerminal=null; render(); return; }
    if(ok(a,b)){
      wires.push({from:a,to:b,color:WIRE_COLORS[wires.length%WIRE_COLORS.length]});
      sounds.success();
      selectedTerminal=null;
      if(done()){ completed=true; sounds.celebrate(); render(); return; }
    } else { sounds.error(); selectedTerminal=null; }
    render();
  }

  function showAnswer(){
    for(const c of answer){ if(!has(c.from,c.to)) wires.push({from:c.from,to:c.to,color:WIRE_COLORS[wires.length%WIRE_COLORS.length]}); }
    completed=true; sounds.celebrate(); render();
  }

  /* ── LED color map ── */
  const LED_COLORS = {red:'#F44336',green:'#4CAF50',blue:'#2196F3',yellow:'#FDD835',white:'#EEEEEE',purple:'#9C27B0',orange:'#FF9800'};

  /* ══════════════════════════════════════════════════════
     DRAW REALISTIC COMPONENTS
     ══════════════════════════════════════════════════════ */

  function drawBattery(svg, neg, pos) {
    const cx = (neg.x + pos.x) / 2;
    const cy = (neg.y + pos.y) / 2;

    /* Main battery body */
    const bodyW = Math.abs(pos.x - neg.x) - 20;
    const bodyH = 44;
    svg.push(svgEl('rect',{x: cx - bodyW/2, y: cy - bodyH/2, width: bodyW, height: bodyH, rx: 6, fill:'#546E7A', stroke:'#37474F', 'stroke-width':2}));

    /* Negative cap (flat, left side) */
    svg.push(svgEl('rect',{x: neg.x - 10, y: cy - bodyH/2 - 2, width: 22, height: bodyH + 4, rx: 4, fill:'#37474F', stroke:'#263238', 'stroke-width':2}));
    svg.push(svgEl('text',{x: neg.x + 1, y: cy - bodyH/2 - 8, 'font-size':18, 'font-weight':'900', fill:'#37474F', 'text-anchor':'middle'},'\u2212'));

    /* Positive cap (bump, right side) */
    svg.push(svgEl('rect',{x: pos.x - 12, y: cy - bodyH/2 - 2, width: 22, height: bodyH + 4, rx: 4, fill:'#C62828', stroke:'#B71C1C', 'stroke-width':2}));
    svg.push(svgEl('rect',{x: pos.x + 8, y: cy - 8, width: 10, height: 16, rx: 3, fill:'#C62828', stroke:'#B71C1C', 'stroke-width':1.5}));
    svg.push(svgEl('text',{x: pos.x - 1, y: cy - bodyH/2 - 8, 'font-size':18, 'font-weight':'900', fill:'#C62828', 'text-anchor':'middle'},'+'));

    /* Battery label */
    svg.push(svgEl('text',{x: cx, y: cy + 2, 'font-size':13, 'font-weight':'800', fill:'#ECEFF1', 'text-anchor':'middle', 'dominant-baseline':'middle'},'BATTERY'));
    svg.push(svgEl('text',{x: cx, y: cy + 16, 'font-size':9, fill:'#B0BEC5', 'text-anchor':'middle'},'1.5V'));
  }

  function drawLED(svg, cathode, anode, color) {
    const cx = (cathode.x + anode.x) / 2;
    const cy = (cathode.y + anode.y) / 2;
    const ledCol = LED_COLORS[color] || '#F44336';
    const darkCol = darkenColor(ledCol);

    /* LED dome/bulb */
    const domeW = 32, domeH = 30;
    const dY = cy - 20; /* dome center raised above terminal center */
    const dPath = 'M'+cx+','+(dY - domeH/2)
      + ' C'+(cx+domeW*0.6)+','+(dY - domeH/2)+' '+(cx+domeW/2)+','+(dY+4)+' '+(cx+domeW*0.35)+','+(dY+domeH/2-2)
      + ' L'+(cx-domeW*0.35)+','+(dY+domeH/2-2)
      + ' C'+(cx-domeW/2)+','+(dY+4)+' '+(cx-domeW*0.6)+','+(dY - domeH/2)+' '+cx+','+(dY - domeH/2)+' Z';
    /* glow */
    svg.push(svgEl('ellipse',{cx:cx, cy:dY, rx:domeW*0.65, ry:domeH*0.65, fill:ledCol, opacity:0.15}));
    /* dome body */
    svg.push(svgEl('path',{d:dPath, fill:ledCol, stroke:darkCol, 'stroke-width':2}));
    /* flat base */
    svg.push(svgEl('rect',{x: cx - domeW*0.38, y: dY + domeH/2 - 3, width: domeW*0.76, height: 5, rx:1, fill:'#9E9E9E', stroke:'#757575', 'stroke-width':1}));
    /* highlight */
    svg.push(svgEl('ellipse',{cx: cx - 4, cy: dY - 5, rx: 5, ry: 7, fill:'rgba(255,255,255,0.35)'}));

    /* === LEGS === */
    const baseY = dY + domeH/2 + 2;

    /* Anode leg (LONG - right side, +) */
    const anodeLegX = cx + 10;
    svg.push(svgEl('line',{x1:anodeLegX, y1:baseY, x2:anode.x, y2:anode.y-14,
      stroke:'#757575', 'stroke-width':3, 'stroke-linecap':'round'}));
    svg.push(svgEl('circle',{cx:anodeLegX, cy:baseY, r:2, fill:'#757575'}));

    /* Cathode leg (SHORT - left side, -) — shorter with a bend */
    const cathodeLegX = cx - 10;
    const shortEnd = baseY + (anode.y - 14 - baseY) * 0.5;
    svg.push(svgEl('line',{x1:cathodeLegX, y1:baseY, x2:cathodeLegX, y2:shortEnd,
      stroke:'#757575', 'stroke-width':3, 'stroke-linecap':'round'}));
    svg.push(svgEl('line',{x1:cathodeLegX, y1:shortEnd, x2:cathode.x, y2:cathode.y-14,
      stroke:'#757575', 'stroke-width':3, 'stroke-linecap':'round'}));
    svg.push(svgEl('circle',{cx:cathodeLegX, cy:baseY, r:2, fill:'#757575'}));

    /* Label - just "LED" (color shown by dome color, not repeated in text) */
    svg.push(svgEl('text',{x:cx, y:dY - domeH/2 - 8, 'font-size':10, 'font-weight':'700', fill:'#555', 'text-anchor':'middle'},'LED'));
  }

  function drawSwitch(svg, termA, termB) {
    const cx = (termA.x + termB.x) / 2;
    const cy = (termA.y + termB.y) / 2;
    const dist = Math.abs(termB.y - termA.y);

    /* Housing */
    const bw = 36, bh = dist - 30;
    svg.push(svgEl('rect',{x: cx - bw/2, y: cy - bh/2, width: bw, height: bh, rx: 6, fill:'#ECEFF1', stroke:'#78909C', 'stroke-width':2}));

    /* Contact points inside housing */
    const topY = cy - bh/2 + 16;
    const botY = cy + bh/2 - 16;
    svg.push(svgEl('circle',{cx:cx, cy:topY, r:5, fill:'#FFD600', stroke:'#F9A825', 'stroke-width':2}));
    svg.push(svgEl('circle',{cx:cx, cy:botY, r:5, fill:'#FFD600', stroke:'#F9A825', 'stroke-width':2}));

    /* Lever arm (angled = OFF position) */
    svg.push(svgEl('line',{x1:cx, y1:topY, x2:cx+12, y2:botY-4,
      stroke:'#455A64', 'stroke-width':4, 'stroke-linecap':'round'}));
    svg.push(svgEl('circle',{cx:cx+12, cy:botY-4, r:4, fill:'#B71C1C', stroke:'#7F0000', 'stroke-width':1.5}));

    /* Label */
    svg.push(svgEl('text',{x:cx, y:cy, 'font-size':9, 'font-weight':'700', fill:'#455A64', 'text-anchor':'middle', 'dominant-baseline':'middle'},'SWITCH'));
  }

  function darkenColor(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return '#' + [r,g,b].map(v=>Math.max(0,Math.floor(v*0.7)).toString(16).padStart(2,'0')).join('');
  }

  /* ═══════ RENDER ═══════ */
  function render(){
    const BW=580, BH=400;
    const svgChildren = [];

    /* board background */
    svgChildren.push(svgEl('rect',{x:0,y:0,width:BW,height:BH,rx:18,fill:'#D7CCC8',stroke:'#5D4037','stroke-width':4}));
    for(let gx=30;gx<BW;gx+=30) svgChildren.push(svgEl('line',{x1:gx,y1:0,x2:gx,y2:BH,stroke:'rgba(0,0,0,0.06)','stroke-width':1}));
    for(let gy=30;gy<BH;gy+=30) svgChildren.push(svgEl('line',{x1:0,y1:gy,x2:BW,y2:gy,stroke:'rgba(0,0,0,0.06)','stroke-width':1}));

    /* — Draw wires — */
    for(const w of wires){
      const ft=terms.find(t=>t.id===w.from), tt=terms.find(t=>t.id===w.to);
      if(!ft||!tt) continue;
      const path = 'M'+ft.x+','+ft.y+' L'+ft.x+','+(ft.y+tt.y)/2+' L'+tt.x+','+(ft.y+tt.y)/2+' L'+tt.x+','+tt.y;
      svgChildren.push(svgEl('path',{d:path,fill:'none',stroke:'rgba(0,0,0,0.15)','stroke-width':8,'stroke-linecap':'round','stroke-linejoin':'round'}));
      svgChildren.push(svgEl('path',{d:path,fill:'none',stroke:w.color||'#333','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round'}));
    }

    /* — Draw realistic components — */
    comps.forEach((comp,idx)=>{
      const myTerms = terms.filter(t=>t.ci===idx);
      if(myTerms.length<2) return;

      if(comp.type==='battery'){
        const neg = myTerms.find(t=>t.label==='\u2212');
        const pos = myTerms.find(t=>t.label==='+');
        if(neg && pos) drawBattery(svgChildren, neg, pos);
      } else if(comp.type.startsWith('led')){
        const col = comp.type.replace('led-','') || 'red';
        const cathode = myTerms.find(t=>t.label==='\u2212');
        const anode = myTerms.find(t=>t.label==='+');
        if(cathode && anode) drawLED(svgChildren, cathode, anode, col);
      } else if(comp.type==='switch'){
        const tA = myTerms.find(t=>t.label==='L');
        const tB = myTerms.find(t=>t.label==='R');
        if(tA && tB) drawSwitch(svgChildren, tA, tB);
      }
    });

    /* — Draw terminal circles — */
    for(const t of terms){
      if(t.x==null) continue;
      const conn = isConn(t.id);
      const sel  = selectedTerminal===t.id;
      const r = 14;

      if(!conn && !sel){
        svgChildren.push(svgEl('circle',{cx:t.x,cy:t.y,r:r+4,fill:'none',stroke:'#FF9800','stroke-width':2,'stroke-dasharray':'4 3',opacity:0.7}));
      }
      const fill = conn ? '#4CAF50' : sel ? '#1E88E5' : '#FF9800';
      const stroke = conn ? '#2E7D32' : sel ? '#0D47A1' : '#E65100';
      svgChildren.push(svgEl('circle',{cx:t.x,cy:t.y,r:r,fill:fill,stroke:stroke,'stroke-width':3,style:'cursor:pointer'}));
      const txt = conn ? '\u2713' : t.label;
      svgChildren.push(svgEl('text',{x:t.x,y:t.y+1,'font-size':conn?12:13,'font-weight':'bold',fill:'#FFF','text-anchor':'middle','dominant-baseline':'middle',style:'pointer-events:none'},txt));
      svgChildren.push(svgEl('text',{x:t.x,y:t.y+r+12,'font-size':9,'font-weight':'bold',fill:'#5D4037','text-anchor':'middle',style:'pointer-events:none'},t.full));

      const hit = svgEl('circle',{cx:t.x,cy:t.y,r:r+12,fill:'transparent',style:'cursor:pointer'});
      hit.addEventListener('pointerdown',(e)=>{e.stopPropagation(); e.preventDefault(); handleTap(t.id);});
      svgChildren.push(hit);
    }

    /* Board title */
    svgChildren.push(svgEl('rect',{x:BW/2-70,y:-2,width:140,height:22,rx:6,fill:'#5D4037'}));
    svgChildren.push(svgEl('text',{x:BW/2,y:14,'font-size':11,'font-weight':'bold',fill:'#FFF','text-anchor':'middle'},'CIRCUIT BOARD'));

    /* assemble SVG */
    const svgBoard = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgBoard.setAttribute('viewBox','0 -10 '+BW+' '+(BH+20));
    svgBoard.setAttribute('width','100%');
    svgBoard.style.maxWidth = BW+'px';
    svgBoard.style.display = 'block';
    svgBoard.style.margin = '0 auto';
    svgBoard.style.touchAction = 'none';
    svgBoard.style.userSelect = 'none';
    for(const ch of svgChildren){ if(ch) svgBoard.appendChild(ch); }

    /* — Status — */
    let statusEl;
    if(completed){
      statusEl = el('div',{style:{textAlign:'center',fontSize:'1.2rem',fontWeight:'800',color:'#2E7D32',padding:'10px',background:'#E8F5E9',borderRadius:'12px',border:'2px solid #4CAF50',margin:'8px 0'}},
        'Circuit Complete! +30 Stars!');
    } else if(selectedTerminal){
      const st=terms.find(t=>t.id===selectedTerminal);
      statusEl = el('div',{style:{textAlign:'center',fontSize:'1rem',fontWeight:'700',color:'#1565C0',padding:'8px',background:'#E3F2FD',borderRadius:'12px',border:'2px solid #42A5F5',margin:'8px 0'}},
        'Selected: ',el('strong',{},st?st.full:''),' \u2014 now tap another terminal!');
    } else {
      statusEl = el('div',{style:{textAlign:'center',fontSize:'1rem',fontWeight:'700',color:'#E65100',padding:'8px',background:'#FFF3E0',borderRadius:'12px',border:'2px solid #FFB300',margin:'8px 0'}},
        'Tap an orange circle to start a wire!');
    }

    /* — Progress — */
    const pct = answer.length>0?(wires.length/answer.length*100):0;
    const prog = answer.length>0
      ? el('div',{style:{marginBottom:'6px'}},
          el('div',{style:{display:'flex',justifyContent:'space-between',fontSize:'0.8rem',fontWeight:'700',marginBottom:'3px'}},
            el('span',{},'Wires'),el('span',{},wires.length+'/'+answer.length)),
          el('div',{style:{height:'10px',background:'#ddd',borderRadius:'5px',overflow:'hidden'}},
            el('div',{style:{height:'100%',width:pct+'%',background:'linear-gradient(90deg,#43A047,#66BB6A)',borderRadius:'5px',transition:'width 0.3s'}})))
      : null;

    /* — Buttons — */
    const allHintsUsed = !simData.hints || hintIndex>=simData.hints.length;
    const btns = el('div',{style:{display:'flex',justifyContent:'center',gap:'10px',marginTop:'10px',flexWrap:'wrap'}},
      !allHintsUsed ? el('button',{class:'btn btn--outline btn--small',onClick:()=>showHint()},'Hint ('+(simData.hints.length-hintIndex)+')') : null,
      allHintsUsed&&!completed ? el('button',{class:'btn btn--small',style:{background:'#FF9800',color:'#fff',border:'none'},onClick:()=>showAnswer()},'Show Answer') : null,
      completed ? el('button',{class:'btn btn--success btn--large',style:{padding:'12px 32px',fontSize:'1.1rem'},onClick:()=>{sounds.click();onComplete();}},'Continue \u25B6') : null,
      !completed ? el('button',{class:'btn btn--accent btn--small',onClick:()=>{sounds.click();onComplete();}},'Skip \u25B6') : null
    );

    /* — Assemble page — */
    const page = el('div',{class:'screen-enter',style:{maxWidth:'700px',width:'100%'}},
      el('div',{class:'card',style:{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'linear-gradient(135deg,#E3F2FD,#BBDEFB)',border:'2px solid #42A5F5',marginBottom:'8px'}},
        el('div',{style:{fontSize:'1.8rem'}},''),
        el('div',{},
          el('div',{style:{fontWeight:'800',color:'#1565C0',fontSize:'1rem'}},'Your Mission:'),
          el('div',{style:{color:'#333',fontSize:'0.9rem'}},simData.objective))),
      prog, statusEl,
      el('div',{style:{marginTop:'6px'}}, svgBoard),
      lastHintText ? el('div',{style:{marginTop:'10px'}},createMascotWithSpeech(lastHintText,45)) : null,
      btns
    );
    mount(container, page);
  }

  function showHint(){
    if(simData.hints && hintIndex<simData.hints.length){
      lastHintText=simData.hints[hintIndex]; hintIndex++; sounds.click(); render();
    }
  }

  render();
  return ()=>{};
}

/* ── SVG element helper ── */
function svgEl(tag, attrs, text){
  const ns='http://www.w3.org/2000/svg';
  const e=document.createElementNS(ns,tag);
  if(attrs) for(const[k,v] of Object.entries(attrs)){
    if(k==='style') e.setAttribute('style',v);
    else e.setAttribute(k,String(v));
  }
  if(text!=null) e.textContent=text;
  return e;
}
