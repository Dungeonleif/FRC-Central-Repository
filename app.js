// ═══════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════
const SUBS = [
  {key:'Mechanical', color:'#fab387', rgb:'250,179,135'},
  {key:'Design/CAD', color:'#89b4fa', rgb:'137,180,250'},
  {key:'Electrical', color:'#f9e2af', rgb:'249,226,175'},
  {key:'Software',   color:'#f38ba8', rgb:'243,139,168'},
  {key:'Business',   color:'#cba6f7', rgb:'203,166,247'},
  {key:'Outreach',   color:'#89dceb', rgb:'137,220,235'},
  {key:'Media',      color:'#f5c2e7', rgb:'245,194,231'},
  {key:'Awards',     color:'#f9e2af', rgb:'249,226,175'},
  {key:'Drive Team', color:'#a6e3a1', rgb:'166,227,161'},
  {key:'Scouting',   color:'#94e2d5', rgb:'148,226,213'},
];
const SC = Object.fromEntries(SUBS.map(s=>[s.key,s.color]));

const ROLES = {
  captain:  {label:'Captain',  color:'#f38ba8', canEdit:true,  canAdmin:true},
  mentor:   {label:'Mentor',   color:'#cba6f7', canEdit:true,  canAdmin:false},
  student:  {label:'Student',  color:'#94e2d5', canEdit:true,  canAdmin:false},
};

const PAGE_ACCESS = {
  dashboard:    ['captain','mentor','student'],
  sprint:       ['captain','mentor','student'],
  progress:     ['captain','mentor','student'],
  members:      ['captain','mentor'],
  tasks:        ['captain','mentor','student'],
  attendance:   ['captain','mentor'],
  scouting:     ['captain','mentor','student'],
  competitions: ['captain','mentor','student'],
  integrations: ['captain','mentor'],
  settings:     ['captain'],
};

// ═══════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════
const TEAM_PASSWORD = 'frc2025'; // default shared password
let S = {
  user: null,
  sprint: {name:'Build Season · Sprint 1', end: Date.now()+12*864e5},
  tasks: [],
  members: [],
  reports: [],
  scouts: [],
  comps: [],
  files: [],
  integrations: [
    {name:'Slack',           icon:'💬', desc:'Team messaging & channel notifications', on:false,  url:'https://slack.com'},
    {name:'The Blue Alliance',icon:'🔵',desc:'Competition data, rankings & match results',on:true, url:'https://thebluealliance.com'},
    {name:'GitHub',          icon:'🐙', desc:'Code repos & version control',            on:true,  url:'https://github.com'},
    {name:'Onshape',         icon:'📐', desc:'Cloud CAD collaboration & file sharing',  on:false, url:'https://onshape.com'},
    {name:'Google Drive',    icon:'📁', desc:'File storage & shared documents',         on:true,  url:'https://drive.google.com'},
    {name:'Chief Delphi',    icon:'🤖', desc:'FRC community forum & resources',         on:false, url:'https://chiefdelphi.com'},
    {name:'FIRST Inspires',  icon:'🏆', desc:'Official event registration & team info', on:true,  url:'https://firstinspires.org'},
  ],
  settings:{teamNum:'9999',teamName:'Iron Eagles',year:'2025',password:TEAM_PASSWORD},
  nid:1,
};

// Seed members
[
  {name:'Alex Chen',    role:'student', teams:['Design/CAD'],  absent:false},
  {name:'Jordan Lee',   role:'student', teams:['Mechanical'],  absent:false},
  {name:'Sam Rivera',   role:'student', teams:['Software'],    absent:true},
  {name:'Taylor Kim',   role:'student', teams:['Electrical'],  absent:false},
  {name:'Morgan Patel', role:'student', teams:['Mechanical'],  absent:false},
  {name:'Casey Wu',     role:'student', teams:['Drive Team'],  absent:false},
  {name:'Riley Brown',  role:'student', teams:['Scouting'],    absent:true},
  {name:'Jamie Ortiz',  role:'student', teams:['Media'],       absent:false},
  {name:'Drew Nguyen',  role:'student', teams:['Business'],    absent:false},
  {name:'Quinn Adams',  role:'student', teams:['Outreach'],    absent:false},
  {name:'Blake Torres', role:'student', teams:['Software'],    absent:false},
  {name:'Sage Miller',  role:'student', teams:['Awards'],      absent:false},
].forEach(m=>{
  S.members.push({id:S.nid++,...m,
    av:m.name.split(' ').map(w=>w[0]).join(''),
    avColor:SUBS.find(s=>m.teams.includes(s.key))?.color||'#585b70'
  });
});

// Seed tasks
[
  {title:'Model intake mechanism v2',  sub:'Design/CAD',  pri:'h',pts:8, col:'inprog', who:'Alex Chen'},
  {title:'Design elevator carriage',   sub:'Design/CAD',  pri:'h',pts:13,col:'backlog',who:'Alex Chen'},
  {title:'Drivetrain frame assembly',  sub:'Mechanical',  pri:'h',pts:13,col:'done',   who:'Jordan Lee'},
  {title:'Mill arm pivot plates',      sub:'Mechanical',  pri:'h',pts:8, col:'inprog', who:'Morgan Patel'},
  {title:'Fabricate shooter housing',  sub:'Mechanical',  pri:'m',pts:5, col:'backlog',who:'Morgan Patel'},
  {title:'Wire PDP motor controllers', sub:'Electrical',  pri:'h',pts:5, col:'inprog', who:'Taylor Kim'},
  {title:'Route CAN bus harness',      sub:'Electrical',  pri:'h',pts:5, col:'backlog',who:'Taylor Kim'},
  {title:'Test pneumatics circuit',    sub:'Electrical',  pri:'m',pts:3, col:'review', who:'Taylor Kim'},
  {title:'Implement auto path planner',sub:'Software',    pri:'h',pts:13,col:'inprog', who:'Sam Rivera'},
  {title:'AprilTag vision pipeline',   sub:'Software',    pri:'h',pts:8, col:'backlog',who:'Blake Torres'},
  {title:'Tune elevator PID',          sub:'Software',    pri:'h',pts:8, col:'review', who:'Sam Rivera'},
  {title:'Write sponsorship deck',     sub:'Business',    pri:'h',pts:5, col:'done',   who:'Drew Nguyen'},
  {title:'Update budget spreadsheet',  sub:'Business',    pri:'m',pts:2, col:'backlog',who:'Drew Nguyen'},
  {title:'Film robot reveal video',    sub:'Media',       pri:'m',pts:5, col:'backlog',who:'Jamie Ortiz'},
  {title:'Post build season update',   sub:'Media',       pri:'l',pts:1, col:'done',   who:'Jamie Ortiz'},
  {title:'Schedule FLL demo day',      sub:'Outreach',    pri:'m',pts:3, col:'backlog',who:'Quinn Adams'},
  {title:'Write Impact Award essay',   sub:'Awards',      pri:'h',pts:8, col:'inprog', who:'Sage Miller'},
  {title:'Practice drive cycles',      sub:'Drive Team',  pri:'h',pts:3, col:'inprog', who:'Casey Wu'},
  {title:'Scout Regional Week 1',      sub:'Scouting',    pri:'m',pts:3, col:'backlog',who:'Riley Brown'},
].forEach(t=>S.tasks.push({id:S.nid++,...t}));

// Seed reports
S.reports = [
  {id:S.nid++,title:'Drivetrain Assembly Complete',team:'Mechanical',date:'2025-01-15',
   body:'Full swerve drivetrain assembled. All four modules installed and torqued. Drive motors calibrated. First driving test successful — straight-line consistency within spec.',
   files:[{name:'drivetrain_v3.step',type:'cad'},{name:'assembly_photo.jpg',type:'img'}]},
  {id:S.nid++,title:'Intake Mechanism CAD v1',team:'Design/CAD',date:'2025-01-18',
   body:'First complete CAD model of intake mechanism. Uses 4 compliant rollers driven by 1 Falcon 500. Fits within frame perimeter. Awaiting mechanical review.',
   files:[{name:'intake_v1.f3d',type:'cad'},{name:'intake_render.png',type:'img'}]},
  {id:S.nid++,title:'Electrical Panel Layout',team:'Electrical',date:'2025-01-20',
   body:'PDP and all motor controllers mounted. CAN chain verified — all devices enumerate. Gyro on central plate. Ready for software integration.',
   files:[{name:'wiring_diagram.pdf',type:'pdf'}]},
];

// Seed scouting
S.scouts = [
  {id:S.nid++,num:'254', name:'The Cheesy Poofs', auto:18,tele:52,end:'Hang',   avg:72,notes:'Dominant auto, fast shooter'},
  {id:S.nid++,num:'1678',name:'Citrus Circuits',  auto:16,tele:48,end:'Hang',   avg:68,notes:'Consistent, great defense'},
  {id:S.nid++,num:'2056',name:'OP Robotics',       auto:14,tele:44,end:'Park',   avg:60,notes:'Good teleop, risky endgame'},
  {id:S.nid++,num:'4414',name:'HighTide',           auto:12,tele:38,end:'None',   avg:50,notes:'Reliable shooter, no climb'},
];

// Seed comps
S.comps = [
  {id:S.nid++,name:'Silicon Valley Regional',date:'2025-03-13',loc:'San Jose, CA',   status:'registered',teams:40, link:'https://firstinspires.org'},
  {id:S.nid++,name:'Sacramento Regional',    date:'2025-03-27',loc:'Sacramento, CA', status:'open',       teams:36, link:'https://firstinspires.org'},
  {id:S.nid++,name:'FIRST Championship',     date:'2025-04-16',loc:'Houston, TX',    status:'closed',     teams:600,link:'https://firstinspires.org'},
];

// ═══════════════════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('input[name="loginRole"]').forEach(r=>{
  r.addEventListener('change',()=>{
    document.querySelectorAll('.role-opt').forEach(o=>o.classList.remove('selected'));
    r.closest('.role-opt').classList.add('selected');
    document.getElementById('studentFields').style.display = r.value==='student'?'block':'none';
  });
});

function quickLogin(role){
  if(role==='captain'){
    document.querySelector('input[value="captain"]').checked=true;
    document.querySelector('input[value="captain"]').dispatchEvent(new Event('change'));
    document.getElementById('liTeamNum').value='9999';
    document.getElementById('liPass').value='frc2025';
  } else if(role==='mentor'){
    document.querySelector('input[value="mentor"]').checked=true;
    document.querySelector('input[value="mentor"]').dispatchEvent(new Event('change'));
    document.getElementById('liTeamNum').value='9999';
    document.getElementById('liPass').value='frc2025';
  } else {
    document.querySelector('input[value="student"]').checked=true;
    document.querySelector('input[value="student"]').dispatchEvent(new Event('change'));
    document.getElementById('liTeamNum').value='9999';
    document.getElementById('liPass').value='frc2025';
    document.getElementById('liName').value='Demo Student';
    document.getElementById('liSub').value='Software';
  }
  setTimeout(doLogin,60);
}

function doLogin(){
  const role  = document.querySelector('input[name="loginRole"]:checked').value;
  const num   = document.getElementById('liTeamNum').value.trim();
  const pass  = document.getElementById('liPass').value;
  const errEl = document.getElementById('loginErr');

  if(!num||!pass){errEl.textContent='Please enter your team number and password.';errEl.classList.add('show');return}
  if(pass!==S.settings.password){errEl.classList.add('show');return}
  errEl.classList.remove('show');

  let name=role==='captain'?'Team Captain':role==='mentor'?'Lead Mentor':'Demo Student';
  let sub = 'Mechanical';
  if(role==='student'){
    const n=document.getElementById('liName').value.trim();
    const s=document.getElementById('liSub').value;
    if(!n){errEl.textContent='Please enter your name.';errEl.classList.add('show');return}
    name=n;sub=s;
  }

  S.user = {role,name,sub,teamNum:num};
  bootApp();
}

function bootApp(){
  document.getElementById('loginScreen').style.display='none';
  const shell=document.getElementById('appShell');
  shell.style.display='flex';

  document.getElementById('tbTeam').textContent='Team '+S.user.teamNum+' · '+S.settings.teamName;

  const initials=S.user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const rc=ROLES[S.user.role];
  const av=document.getElementById('userAv');
  av.textContent=initials;
  av.style.background=rc.color+'22';
  av.style.color=rc.color;
  av.style.borderColor=rc.color+'55';
  document.getElementById('uaName').textContent=S.user.name;
  document.getElementById('uaMeta').textContent=rc.label+' · Team '+S.user.teamNum;

  document.getElementById('sfDot').style.background=rc.color;
  document.getElementById('sfRoleLabel').textContent=rc.label;

  applyRestrictions();
  updateGlobals();
  renderDashboard();
  renderIntegrations();
  toast('Welcome, '+S.user.name.split(' ')[0]+'! 👋','ok');
}

function applyRestrictions(){
  const role=S.user?.role||'student';
  ['integrations','settings','members','attendance'].forEach(pg=>{
    const allowed=PAGE_ACCESS[pg]||['captain'];
    const el=document.getElementById('nav-'+pg);
    if(el) el.classList.toggle('locked',!allowed.includes(role));
  });
}

function doLogout(){
  S.user=null;
  document.getElementById('appShell').style.display='none';
  document.getElementById('loginScreen').style.display='flex';
  document.getElementById('uaMenu').classList.remove('open');
  document.getElementById('liPass').value='';
  document.getElementById('loginErr').classList.remove('show');
}

// ═══════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════
let curPage='dashboard';
function nav(id){
  if(!S.user)return;
  const allowed=PAGE_ACCESS[id]||['captain'];
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>{
    if(n.getAttribute('onclick')?.includes("'"+id+"'")) n.classList.add('active');
  });
  if(!allowed.includes(S.user.role)){
    const dp=getOrMakeDenied();
    dp.classList.add('active');curPage=id;return;
  }
  document.getElementById('page-'+id)?.classList.add('active');
  curPage=id;
  if(id==='dashboard') renderDashboard();
  else if(id==='sprint') renderBoard();
  else if(id==='progress') renderReports();
  else if(id==='members') renderMembers();
  else if(id==='tasks') renderTasksPage();
  else if(id==='attendance') renderAttendance();
  else if(id==='scouting') renderScouting();
  else if(id==='competitions') renderComps();
  else if(id==='integrations') renderIntegrations();
  closeUA();
}
function getOrMakeDenied(){
  let d=document.getElementById('page-denied');
  if(!d){d=document.createElement('div');d.id='page-denied';d.className='page';document.querySelector('.main-area').appendChild(d)}
  d.innerHTML=`<div class="access-wall"><div class="aw-icon">🔒</div><div class="aw-title">Access Restricted</div><div class="aw-sub">Your role (${ROLES[S.user?.role]?.label||'Student'}) does not have permission to view this page.<br>Ask your Captain or Mentor for access.</div></div>`;
  return d;
}

// ═══════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════
function renderDashboard(){
  const buildSubs=[
    {key:'Mechanical',pct:72},{key:'Design/CAD',pct:85},
    {key:'Electrical',pct:60},{key:'Software',pct:45}
  ];
  document.getElementById('dashRobotBars').innerHTML=buildSubs.map(s=>`
    <div class="prog-row">
      <div class="prog-name" style="color:${SC[s.key]}">${s.key}</div>
      <div class="prog-bar"><div class="prog-fill" style="width:${s.pct}%;background:${SC[s.key]}"></div></div>
      <div class="prog-pct" style="color:${SC[s.key]}">${s.pct}%</div>
    </div>`).join('');

  const done=S.tasks.filter(t=>t.col==='done').length;
  const inprog=S.tasks.filter(t=>t.col==='inprog').length;
  const total=S.tasks.length;
  const donePts=S.tasks.filter(t=>t.col==='done').reduce((a,t)=>a+t.pts,0);
  document.getElementById('dashStats').innerHTML=[
    {n:total,  l:'Total Tasks',    note:done+' completed',           c:'var(--blue)'},
    {n:inprog, l:'In Progress',    note:S.tasks.filter(t=>t.col==='backlog').length+' in backlog', c:'var(--yellow)'},
    {n:donePts+'pt',l:'Pts Done',  note:'this sprint',               c:'var(--teal)'},
    {n:S.members.filter(m=>m.absent).length,l:'Absent Today',note:S.members.length+' total members',c:'var(--red)'},
  ].map(s=>`<div class="stat-card" style="--sc-color:${s.c}"><div class="sc-num">${s.n}</div><div class="sc-lbl">${s.l}</div><div class="sc-note">${s.note}</div></div>`).join('');

  const daysLeft=Math.max(0,Math.ceil((S.sprint.end-Date.now())/864e5));
  const allPts=S.tasks.reduce((a,t)=>a+t.pts,0);
  const pct=allPts>0?Math.round(donePts/allPts*100):0;
  document.getElementById('dashSprintCard').innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.75rem">
      <div><div style="font-size:.9rem;font-weight:700">${esc(S.sprint.name)}</div><div style="font-size:.68rem;color:var(--muted2);margin-top:.2rem">${daysLeft} days remaining</div></div>
      <div style="font-family:'Exo 2',sans-serif;font-weight:900;font-size:1.75rem;color:var(--teal);line-height:1">${pct}%</div>
    </div>
    <div style="height:7px;background:var(--s4);border-radius:4px;overflow:hidden;margin-bottom:.75rem">
      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--teal),var(--blue));border-radius:4px;transition:width .6s ease"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;text-align:center">
      ${['backlog','inprog','review','done'].map(c=>`
        <div style="background:var(--s3);border:1px solid var(--border);border-radius:var(--r);padding:.5rem">
          <div style="font-family:'Exo 2',sans-serif;font-weight:800;font-size:1.1rem">${S.tasks.filter(t=>t.col===c).length}</div>
          <div style="font-size:.58rem;color:var(--muted2);text-transform:uppercase;letter-spacing:.06em">${{backlog:'Backlog',inprog:'Active',review:'Review',done:'Done'}[c]}</div>
        </div>`).join('')}
    </div>`;

  document.getElementById('dashTeamAct').innerHTML=SUBS.slice(0,6).map(s=>{
    const tt=S.tasks.filter(t=>t.sub===s.key);
    const td=tt.filter(t=>t.col==='done').length;
    const p=tt.length>0?Math.round(td/tt.length*100):0;
    return `<div class="act-row">
      <div class="act-dot" style="background:${s.color}"></div>
      <div class="act-name">${s.key}</div>
      <div class="act-bar"><div class="act-fill" style="width:${p}%;background:${s.color}"></div></div>
      <div class="act-stats">${td}/${tt.length}</div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════
//  SPRINT BOARD
// ═══════════════════════════════════════════════════════════
let dragId=null;
function renderBoard(){
  const fsub=document.getElementById('boardFilter')?.value||'all';
  ['backlog','inprog','review','done'].forEach(col=>{
    const wrap=document.getElementById('bcc-'+col);
    [...wrap.querySelectorAll('.tcard')].forEach(c=>c.remove());
    [...wrap.querySelectorAll('.empty')].forEach(c=>c.remove());
    const dz=document.getElementById('dz-'+col);
    let tasks=S.tasks.filter(t=>t.col===col);
    if(fsub!=='all') tasks=tasks.filter(t=>t.sub===fsub);
    tasks.forEach(t=>wrap.insertBefore(buildTCard(t),dz));
    if(tasks.length===0){const e=document.createElement('div');e.className='empty';e.style.cssText='margin:.25rem;padding:1.5rem;font-size:.75rem';e.textContent='No tasks';wrap.insertBefore(e,dz)}
    document.getElementById('bc-'+col).textContent=S.tasks.filter(t=>t.col===col).length;
  });
  const allPts=S.tasks.reduce((a,t)=>a+t.pts,0);
  const donePts=S.tasks.filter(t=>t.col==='done').reduce((a,t)=>a+t.pts,0);
  const pct=allPts>0?Math.round(donePts/allPts*100):0;
  const days=Math.max(0,Math.ceil((S.sprint.end-Date.now())/864e5));
  document.getElementById('sprintChips').innerHTML=[
    S.sprint.name,`⏱ ${days}d left`,`📦 ${allPts} pts`,`✅ ${donePts} done`,`🚀 ${pct}% complete`
  ].map(c=>`<div class="chip">${c}</div>`).join('');
}
function buildTCard(t){
  const el=document.createElement('div');
  el.className='tcard';el.draggable=true;el.dataset.id=t.id;
  el.style.setProperty('--tc-c',SC[t.sub]||'#585b70');
  const prv={h:'pri-h',m:'pri-m',l:'pri-l'}[t.pri]||'pri-l';
  const prl={h:'High',m:'Med',l:'Low'}[t.pri]||'Low';
  const absent=S.members.find(m=>m.name===t.who&&m.absent);
  el.innerHTML=`
    <div class="tc-acts">
      <button class="tc-ab" onclick="editTask(${t.id})">✏</button>
      <button class="tc-ab" onclick="openReassign(${t.id})">↔</button>
      <button class="tc-ab" onclick="delTask(${t.id})">✕</button>
    </div>
    <div class="tc-sub">${t.sub}</div>
    <div class="tc-title">${esc(t.title)}</div>
    <div class="tc-who" style="${absent?'color:var(--red)':''}">👤 ${esc(t.who||'Unassigned')}${absent?' ⚠ ABSENT':''}</div>
    <div class="tc-foot"><span class="tc-pts">${t.pts}pt</span><span class="tc-pri ${prv}">${prl}</span></div>`;
  el.addEventListener('dragstart',e=>{dragId=t.id;el.classList.add('dragging');e.dataTransfer.effectAllowed='move'});
  el.addEventListener('dragend',()=>{el.classList.remove('dragging');dragId=null;clearDZ()});
  return el;
}
function onDragOver(e){e.preventDefault();const col=e.currentTarget.id.replace('bcc-','');document.getElementById('dz-'+col)?.classList.add('active')}
function onDragLeave(e){const wrap=e.currentTarget;if(!wrap.contains(e.relatedTarget)){const col=wrap.id.replace('bcc-','');document.getElementById('dz-'+col)?.classList.remove('active')}}
function onDrop(e,col){e.preventDefault();clearDZ();if(!dragId)return;const t=S.tasks.find(x=>x.id===dragId);if(t&&t.col!==col){t.col=col;toast('Moved to '+{backlog:'Backlog',inprog:'In Progress',review:'Review',done:'Done'}[col]);renderBoard();updateGlobals()}}
function clearDZ(){document.querySelectorAll('.drop-z').forEach(d=>d.classList.remove('active'))}

// ═══════════════════════════════════════════════════════════
//  PROGRESS REPORTS
// ═══════════════════════════════════════════════════════════
function renderReports(){
  const fEl=document.getElementById('uploadedFiles');
  fEl.innerHTML=S.files.map(f=>`
    <div class="rc-file">
      <span>${fIcon(f.type)}</span><span>${esc(f.name)}</span>
      <span style="margin-left:.2rem;color:var(--red);cursor:pointer" onclick="removeFile('${esc(f.name)}')">✕</span>
    </div>`).join('');
  const grid=document.getElementById('reportsGrid');
  if(!S.reports.length){grid.innerHTML='<div class="empty" style="grid-column:1/-1">No reports yet. Create one with the button above.</div>';return}
  grid.innerHTML=S.reports.map(r=>`
    <div class="report-card">
      <div class="rc-hd">
        <div><div class="rc-title">${esc(r.title)}</div><div class="rc-meta">📅 ${r.date} · ${r.team}</div></div>
        <span class="rc-badge" style="color:${SC[r.team]||'#888'};background:${SC[r.team]||'#888'}15;border:1px solid ${SC[r.team]||'#888'}33">${r.team}</span>
      </div>
      <div class="rc-body">${esc(r.body)}</div>
      ${r.files.length?`<div class="rc-files">${r.files.map(f=>`<div class="rc-file"><span>${fIcon(f.type)}</span><span>${esc(f.name)}</span></div>`).join('')}</div>`:''}
    </div>`).join('');
}
function fIcon(t){return{cad:'📐',pdf:'📄',img:'🖼',vid:'🎬'}[t]||'📎'}
function handleUpload(e){
  [...e.target.files].forEach(f=>{
    const ext=f.name.split('.').pop().toLowerCase();
    const type=['step','stl','f3d','sldprt','dxf'].includes(ext)?'cad':['pdf'].includes(ext)?'pdf':['jpg','jpeg','png','gif','webp'].includes(ext)?'img':['mp4','mov'].includes(ext)?'vid':'other';
    if(!S.files.find(u=>u.name===f.name)) S.files.push({name:f.name,type,size:f.size});
  });
  toast(e.target.files.length+' file(s) staged','ok');
  renderReports();
}
function removeFile(name){S.files=S.files.filter(f=>f.name!==name);renderReports()}

// ═══════════════════════════════════════════════════════════
//  MEMBERS
// ═══════════════════════════════════════════════════════════
let mSubFilter='all';
function renderMembers(){
  const sb=document.getElementById('memberSubbar');
  sb.innerHTML=`<div class="sp-all ${mSubFilter==='all'?'on':''}" onclick="mSubFilter='all';renderMembers()">All</div>`
    +SUBS.map(s=>`<div class="sp ${mSubFilter===s.key?'on':''}" style="--sp-c:${s.color};--sp-rgb:${s.rgb}" onclick="mSubFilter='${s.key}';renderMembers()"><span class="sp-d"></span>${s.key}</div>`).join('');
  let members=S.members;
  if(mSubFilter!=='all') members=members.filter(m=>m.teams.includes(mSubFilter));
  const grid=document.getElementById('membersGrid');
  if(!members.length){grid.innerHTML='<div class="empty" style="grid-column:1/-1">No members in this subsection</div>';return}
  grid.innerHTML=members.map(m=>{
    const ot=S.tasks.filter(t=>t.who===m.name&&t.col!=='done').length;
    return `<div class="member-card">
      <div class="mc-top">
        <div class="mc-av" style="background:${m.avColor}22;color:${m.avColor}">${m.av}</div>
        <div style="flex:1;min-width:0">
          <div class="mc-name">${esc(m.name)}</div>
          <div class="mc-role">${esc(m.role)}</div>
        </div>
        ${m.absent?'<span class="absent-tag">absent</span>':''}
      </div>
      <div class="mc-teams">${m.teams.map(t=>`<span class="mc-t" style="color:${SC[t]||'#888'};border-color:${SC[t]||'#888'}33">${t}</span>`).join('')}</div>
      <div class="mc-foot">
        <div class="mc-status"><div class="mc-sdot" style="background:${m.absent?'var(--red)':'var(--teal)'}"></div>${m.absent?'Absent':'Active'} · ${ot} tasks</div>
        <div style="display:flex;gap:.3rem">
          <button class="tb-btn" style="padding:.28rem .6rem;font-size:.62rem" onclick="toggleAbsent(${m.id})">${m.absent?'✓ Present':'✗ Absent'}</button>
          <button class="tb-btn" style="padding:.28rem .5rem;font-size:.62rem" onclick="editMember(${m.id})">✏</button>
          <button class="tb-btn" style="padding:.28rem .5rem;font-size:.62rem;color:var(--red)" onclick="delMember(${m.id})">✕</button>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('nb-members').textContent=S.members.length;
}
function toggleAbsent(id){const m=S.members.find(x=>x.id===id);if(!m)return;m.absent=!m.absent;toast(m.name+(m.absent?' marked absent':' is present'),m.absent?'warn':'ok');renderMembers();renderAttendance()}
function delMember(id){S.members=S.members.filter(x=>x.id!==id);toast('Member removed');renderMembers();renderAttendance()}

// ═══════════════════════════════════════════════════════════
//  TASKS PAGE
// ═══════════════════════════════════════════════════════════
let tSubFilter='all';
function renderTasksPage(){
  const sb=document.getElementById('taskSubbar');
  sb.innerHTML=`<div class="sp-all ${tSubFilter==='all'?'on':''}" onclick="tSubFilter='all';renderTasksPage()">All</div>`
    +SUBS.map(s=>`<div class="sp ${tSubFilter===s.key?'on':''}" style="--sp-c:${s.color};--sp-rgb:${s.rgb}" onclick="tSubFilter='${s.key}';renderTasksPage()"><span class="sp-d"></span>${s.key}</div>`).join('');
  let tasks=tSubFilter==='all'?S.tasks:S.tasks.filter(t=>t.sub===tSubFilter);
  tasks=[...tasks].sort((a,b)=>({backlog:0,inprog:1,review:2,done:3}[a.col]-{backlog:0,inprog:1,review:2,done:3}[b.col]));
  const tbl=document.getElementById('tasksTable');
  if(!tasks.length){tbl.innerHTML='<div class="empty">No tasks found</div>';return}
  tbl.innerHTML=`<div class="card" style="overflow:auto"><table class="tbl">
    <thead><tr><th>Title</th><th>Subsection</th><th>Assignee</th><th>Priority</th><th>Points</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>${tasks.map(t=>{
      const prc={h:'pri-h',m:'pri-m',l:'pri-l'}[t.pri]||'pri-l';
      const prl={h:'High',m:'Med',l:'Low'}[t.pri];
      const cl={backlog:'var(--muted)',inprog:'var(--blue)',review:'var(--yellow)',done:'var(--teal)'}[t.col];
      const cll={backlog:'Backlog',inprog:'In Progress',review:'Review',done:'Done'}[t.col];
      const absent=S.members.find(m=>m.name===t.who&&m.absent);
      return `<tr>
        <td style="font-weight:600;max-width:220px">${esc(t.title)}</td>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:.65rem;font-weight:700;color:${SC[t.sub]||'#888'}">${t.sub}</span></td>
        <td style="${absent?'color:var(--red)':''}">${esc(t.who||'—')}${absent?'<span style="font-size:.6rem;margin-left:.3rem;color:var(--red)">⚠</span>':''}</td>
        <td><span class="tc-pri ${prc}">${prl}</span></td>
        <td style="font-family:'JetBrains Mono',monospace;font-weight:700">${t.pts}pt</td>
        <td><span style="font-family:'JetBrains Mono',monospace;font-size:.65rem;font-weight:700;color:${cl}">${cll}</span></td>
        <td style="white-space:nowrap">
          <button class="tc-ab" onclick="editTask(${t.id})" style="padding:.25rem .5rem">✏ Edit</button>
          <button class="tc-ab" onclick="openReassign(${t.id})" style="padding:.25rem .5rem;margin-left:.2rem">↔ Reassign</button>
          <button class="tc-ab" onclick="delTask(${t.id})" style="padding:.25rem .5rem;margin-left:.2rem;color:var(--red)">✕</button>
        </td>
      </tr>`;}).join('')}
    </tbody></table></div>`;
  document.getElementById('nb-tasks').textContent=S.tasks.length;
}
function delTask(id){S.tasks=S.tasks.filter(t=>t.id!==id);toast('Task deleted');if(curPage==='sprint')renderBoard();else renderTasksPage();updateGlobals()}

// ═══════════════════════════════════════════════════════════
//  ATTENDANCE
// ═══════════════════════════════════════════════════════════
function renderAttendance(){
  const d=new Date();
  document.getElementById('attDateLbl').textContent=d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  document.getElementById('attGrid').innerHTML=S.members.map(m=>`
    <div class="att-card ${m.absent?'absent':'present'}" onclick="toggleAbsent(${m.id})">
      <div class="att-dot" style="background:${m.absent?'var(--red)':'var(--teal)'}"></div>
      <div><div class="att-name">${esc(m.name)}</div><div class="att-role">${esc(m.teams[0])}</div></div>
    </div>`).join('');

  const absents=S.members.filter(m=>m.absent);
  const alrt=document.getElementById('absentAlert');
  if(!absents.length){alrt.innerHTML='';return}
  const affected=S.tasks.filter(t=>absents.find(m=>m.name===t.who)&&t.col!=='done');
  alrt.innerHTML=`<div class="card" style="border-color:var(--redbrd);background:var(--redbg)">
    <div class="card-h" style="color:var(--red)">⚠ ${absents.length} absent — ${affected.length} task(s) at risk</div>
    ${affected.map(t=>{
      const avail=S.members.filter(m=>!m.absent&&m.teams.includes(t.sub)&&m.name!==t.who);
      return `<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.4rem;background:var(--s3);border:1px solid var(--border);border-radius:var(--r);padding:.55rem .75rem">
        <div style="flex:1;font-size:.8rem;font-weight:600">${esc(t.title)}</div>
        <div style="font-size:.68rem;color:var(--red)">${esc(t.who)}</div>
        <select style="background:var(--s2);border:1px solid var(--border2);color:var(--text);font-size:.7rem;padding:.25rem .5rem;border-radius:var(--r);outline:none;font-family:'Exo 2',sans-serif" onchange="quickReassign(${t.id},this.value)">
          <option value="">Reassign to…</option>
          ${avail.map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('')}
        </select>
      </div>`;}).join('')}
  </div>`;
}
function markAllPresent(){S.members.forEach(m=>m.absent=false);toast('All marked present','ok');renderAttendance();renderMembers()}
function autoReassign(){
  let n=0;
  S.tasks.forEach(t=>{
    const a=S.members.find(m=>m.name===t.who&&m.absent);
    if(!a||t.col==='done')return;
    const avail=S.members.filter(m=>!m.absent&&m.teams.includes(t.sub)&&m.name!==t.who);
    if(!avail.length)return;
    avail.sort((a,b)=>S.tasks.filter(x=>x.who===a.name&&x.col!=='done').length-S.tasks.filter(x=>x.who===b.name&&x.col!=='done').length);
    t.who=avail[0].name;n++;
  });
  toast(`Auto-reassigned ${n} task(s)`,'ok');renderAttendance();if(curPage==='sprint')renderBoard();if(curPage==='tasks')renderTasksPage();
}
function quickReassign(id,name){if(!name)return;const t=S.tasks.find(x=>x.id===id);if(t){t.who=name;toast('Reassigned to '+name,'ok');renderAttendance();if(curPage==='sprint')renderBoard()}}

// ═══════════════════════════════════════════════════════════
//  SCOUTING
// ═══════════════════════════════════════════════════════════
function renderScouting(){
  const sorted=[...S.scouts].sort((a,b)=>b.avg-a.avg);
  document.getElementById('scoutBody').innerHTML=sorted.map((t,i)=>`<tr>
    <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:var(--blue)">${t.num}</td>
    <td style="font-weight:600">${esc(t.name)}</td>
    <td>${t.auto}</td><td>${t.tele}</td>
    <td><span class="badge" style="${t.end==='Hang'?'background:var(--tealbg);color:var(--teal)':t.end==='Park'?'background:var(--yellowbg);color:var(--yellow)':'background:var(--s4);color:var(--muted2)'}">${t.end}</span></td>
    <td style="font-family:'JetBrains Mono',monospace;font-weight:700">${t.avg}</td>
    <td><span class="rank-pill" style="${i<3?'background:var(--yellowbg);color:var(--yellow)':'background:var(--s4);color:var(--muted2)'}">#${i+1}</span></td>
    <td style="color:var(--muted2);font-size:.72rem;max-width:150px">${esc(t.notes)}</td>
    <td><button class="tc-ab" onclick="S.scouts=S.scouts.filter(x=>x.id!==${t.id});renderScouting()">✕</button></td>
  </tr>`).join('');
}

// ═══════════════════════════════════════════════════════════
//  COMPETITIONS
// ═══════════════════════════════════════════════════════════
function renderComps(){
  const grid=document.getElementById('compsGrid');
  grid.innerHTML=S.comps.map(c=>`
    <div class="comp-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="comp-name">${esc(c.name)}</div>
        <span class="comp-st ${c.status==='registered'?'st-reg':c.status==='open'?'st-open':'st-closed'}">${c.status==='registered'?'✓ Registered':c.status==='open'?'Open':'Closed'}</span>
      </div>
      <div class="comp-meta"><span>📅 ${c.date}</span><span>📍 ${esc(c.loc)}</span><span>👥 ${c.teams} teams</span></div>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.2rem">
        ${c.status==='open'?`<button class="tb-btn accent" onclick="registerComp(${c.id})" style="font-size:.68rem;padding:.3rem .7rem">Register Now</button>`:''}
        ${c.status==='registered'?`<button class="tb-btn" style="font-size:.68rem;padding:.3rem .7rem;color:var(--teal);border-color:var(--tealbrd)">✓ Registered</button>`:''}
        <a href="${c.link}" target="_blank" class="tb-btn" style="text-decoration:none;font-size:.68rem;padding:.3rem .7rem">↗ View Event</a>
        <button class="tb-btn" onclick="S.comps=S.comps.filter(x=>x.id!==${c.id});renderComps()" style="font-size:.68rem;padding:.3rem .5rem;color:var(--red)">✕</button>
      </div>
    </div>`).join('');
}
function registerComp(id){const c=S.comps.find(x=>x.id===id);if(c){c.status='registered';toast('Registered for '+c.name,'ok');renderComps()}}

// ═══════════════════════════════════════════════════════════
//  INTEGRATIONS
// ═══════════════════════════════════════════════════════════
function renderIntegrations(){
  document.getElementById('intList').innerHTML=S.integrations.map((i,idx)=>`
    <div class="int-row">
      <div class="int-icon">${i.icon}</div>
      <div class="int-info"><div class="int-name">${i.name}</div><div class="int-desc">${i.desc}</div></div>
      <span class="int-st ${i.on?'int-on':'int-off'}">${i.on?'Connected':'Disconnected'}</span>
      <button class="tb-btn" style="margin-left:.5rem;font-size:.65rem" onclick="toggleInt(${idx})">${i.on?'Disconnect':'Connect'}</button>
      <a href="${i.url}" target="_blank" class="tb-btn" style="text-decoration:none;font-size:.65rem;margin-left:.3rem">↗</a>
    </div>`).join('');
}
function toggleInt(idx){
  S.integrations[idx].on=!S.integrations[idx].on;
  toast((S.integrations[idx].on?'Connected: ':'Disconnected: ')+S.integrations[idx].name,S.integrations[idx].on?'ok':'warn');
  renderIntegrations();
}

// ═══════════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════════
function saveSettings(){
  S.settings.teamNum=document.getElementById('setTeamNum').value||S.settings.teamNum;
  S.settings.teamName=document.getElementById('setTeamName').value||S.settings.teamName;
  if(document.getElementById('setPass').value) S.settings.password=document.getElementById('setPass').value;
  S.settings.year=document.getElementById('setYear').value||S.settings.year;
  document.getElementById('tbTeam').textContent='Team '+S.settings.teamNum+' · '+S.settings.teamName;
  toast('Settings saved','ok');
}

// ═══════════════════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════════════════
let mMode='',mEditId=null,mDefCol='backlog';
function openModal(type,extra){
  mMode=type;mEditId=null;mDefCol=extra||'backlog';
  const box=document.getElementById('modalBox');
  if(type==='task')       box.innerHTML=taskHTML();
  else if(type==='sprint')box.innerHTML=sprintHTML();
  else if(type==='report')box.innerHTML=reportHTML();
  else if(type==='member')box.innerHTML=memberHTML();
  else if(type==='scout') box.innerHTML=scoutHTML();
  else if(type==='comp')  box.innerHTML=compHTML();
  document.getElementById('overlay').classList.add('open');
  setTimeout(()=>box.querySelector('input,textarea')?.focus(),80);
}
function closeModal(){document.getElementById('overlay').classList.remove('open')}
function closeMOBG(e){if(e.target===document.getElementById('overlay'))closeModal()}

function editTask(id){
  const t=S.tasks.find(x=>x.id===id);if(!t)return;
  mMode='task';mEditId=id;
  document.getElementById('modalBox').innerHTML=taskHTML(t);
  document.getElementById('overlay').classList.add('open');
}
function editMember(id){
  const m=S.members.find(x=>x.id===id);if(!m)return;
  mMode='member';mEditId=id;
  document.getElementById('modalBox').innerHTML=memberHTML(m);
  document.getElementById('overlay').classList.add('open');
}
function openReassign(id){
  const t=S.tasks.find(x=>x.id===id);if(!t)return;
  mMode='reassign';mEditId=id;
  const box=document.getElementById('modalBox');
  box.innerHTML=`<h2>Reassign Task</h2>
    <div style="margin-bottom:1rem;font-size:.82rem;color:var(--text2);background:var(--s3);padding:.65rem .85rem;border-radius:var(--r);border:1px solid var(--border)">${esc(t.title)}</div>
    <div class="mf"><label>Assign To</label>
      <select id="reTo">
        ${S.members.map(m=>`<option value="${esc(m.name)}" ${t.who===m.name?'selected':''}>${esc(m.name)} — ${m.teams.join(', ')}${m.absent?' ⚠ ABSENT':''}</option>`).join('')}
      </select>
    </div>
    <div class="mb-row">
      <button class="mb mb-cancel" onclick="closeModal()">Cancel</button>
      <button class="mb mb-primary" onclick="doReassign()">Reassign</button>
    </div>`;
  document.getElementById('overlay').classList.add('open');
}
function doReassign(){
  const t=S.tasks.find(x=>x.id===mEditId);if(!t)return;
  t.who=document.getElementById('reTo').value;
  toast('Reassigned to '+t.who,'ok');closeModal();
  if(curPage==='sprint')renderBoard();
  else if(curPage==='tasks')renderTasksPage();
  renderAttendance();
}

function taskHTML(t){
  return `<h2>${t?'Edit Task':'New Task'}</h2>
    <div class="mf"><label>Title</label><input id="mTitle" value="${esc(t?.title||'')}"/></div>
    <div class="mf-row">
      <div class="mf"><label>Subsection</label><select id="mSub">
        ${SUBS.map(s=>`<option value="${s.key}" ${(t?.sub||'Mechanical')===s.key?'selected':''}>${s.key}</option>`).join('')}
      </select></div>
      <div class="mf"><label>Assignee</label><select id="mWho">
        <option value="">Unassigned</option>
        ${S.members.map(m=>`<option value="${esc(m.name)}" ${t?.who===m.name?'selected':''}>${esc(m.name)}</option>`).join('')}
      </select></div>
    </div>
    <div class="mf-row">
      <div class="mf"><label>Priority</label><select id="mPri">
        <option value="h" ${(!t||t?.pri==='h')?'selected':''}>🔴 High</option>
        <option value="m" ${t?.pri==='m'?'selected':''}>🟡 Medium</option>
        <option value="l" ${t?.pri==='l'?'selected':''}>🟢 Low</option>
      </select></div>
      <div class="mf"><label>Story Points</label><select id="mPts">
        ${[1,2,3,5,8,13].map(n=>`<option value="${n}" ${(t?.pts||3)===n?'selected':''}>${n}</option>`).join('')}
      </select></div>
    </div>
    <div class="mf"><label>Column</label><select id="mCol">
      ${['backlog','inprog','review','done'].map(c=>`<option value="${c}" ${(t?.col||mDefCol)===c?'selected':''}>${{backlog:'Backlog',inprog:'In Progress',review:'Review',done:'Done'}[c]}</option>`).join('')}
    </select></div>
    <div class="mb-row">
      <button class="mb mb-cancel" onclick="closeModal()">Cancel</button>
      ${t?`<button class="mb mb-danger" onclick="delTask(${t.id});closeModal()">Delete</button>`:''}
      <button class="mb mb-primary" onclick="saveTask()">Save Task</button>
    </div>`;
}
function saveTask(){
  const title=document.getElementById('mTitle')?.value?.trim();
  if(!title){document.getElementById('mTitle')?.focus();return}
  const d={title,sub:document.getElementById('mSub').value,who:document.getElementById('mWho').value,pri:document.getElementById('mPri').value,pts:Number(document.getElementById('mPts').value),col:document.getElementById('mCol').value};
  if(mEditId){Object.assign(S.tasks.find(t=>t.id===mEditId),d);toast('Task updated','ok')}
  else{S.tasks.push({id:S.nid++,...d});toast('Task added','ok')}
  closeModal();
  if(curPage==='sprint')renderBoard();
  else if(curPage==='tasks')renderTasksPage();
  else if(curPage==='dashboard')renderDashboard();
  updateGlobals();
}

function sprintHTML(){
  const fmt=d=>new Date(d).toISOString().split('T')[0];
  return `<h2>Manage Sprint</h2>
    <div class="mf"><label>Sprint Name</label><input id="mSpN" value="${esc(S.sprint.name)}"/></div>
    <div class="mf-row">
      <div class="mf"><label>Start Date</label><input type="date" id="mSpS" value="${fmt(Date.now()-7*864e5)}"/></div>
      <div class="mf"><label>End Date</label><input type="date" id="mSpE" value="${fmt(S.sprint.end)}"/></div>
    </div>
    <div class="mb-row">
      <button class="mb mb-cancel" onclick="closeModal()">Cancel</button>
      <button class="mb mb-primary" onclick="saveSprint()">Save Sprint</button>
    </div>`;
}
function saveSprint(){
  S.sprint.name=document.getElementById('mSpN').value||S.sprint.name;
  S.sprint.end=new Date(document.getElementById('mSpE').value).getTime();
  document.getElementById('tbSprintName').textContent=S.sprint.name;
  const days=Math.max(0,Math.ceil((S.sprint.end-Date.now())/864e5));
  document.getElementById('tbSprintDays').textContent=days+'d left';
  toast('Sprint updated','ok');closeModal();renderBoard();
}

function reportHTML(){
  return `<h2>New Progress Report</h2>
    <div class="mf"><label>Title</label><input id="mRTitle" placeholder="e.g. Intake Mechanism v2 Complete"/></div>
    <div class="mf-row">
      <div class="mf"><label>Subsection</label><select id="mRTeam">
        ${SUBS.map(s=>`<option value="${s.key}">${s.key}</option>`).join('')}
      </select></div>
      <div class="mf"><label>Date</label><input type="date" id="mRDate" value="${new Date().toISOString().split('T')[0]}"/></div>
    </div>
    <div class="mf"><label>Report Body</label><textarea id="mRBody" placeholder="Progress made, blockers, next steps…"></textarea></div>
    <div style="font-size:.7rem;color:var(--muted2);margin-top:-.4rem;margin-bottom:.7rem">📎 ${S.files.length} file(s) staged from upload area</div>
    <div class="mb-row">
      <button class="mb mb-cancel" onclick="closeModal()">Cancel</button>
      <button class="mb mb-primary" onclick="saveReport()">Save Report</button>
    </div>`;
}
function saveReport(){
  const title=document.getElementById('mRTitle')?.value?.trim();if(!title)return;
  S.reports.unshift({id:S.nid++,title,team:document.getElementById('mRTeam').value,date:document.getElementById('mRDate').value,body:document.getElementById('mRBody').value,files:[...S.files]});
  S.files=[];toast('Report saved','ok');closeModal();renderReports();
}

function memberHTML(m){
  return `<h2>${m?'Edit Member':'Add Member'}</h2>
    <div class="mf"><label>Full Name</label><input id="mMName" value="${esc(m?.name||'')}"/></div>
    <div class="mf-row">
      <div class="mf"><label>Role</label><select id="mMRole">
        <option value="student" ${(!m||m?.role==='student')?'selected':''}>Student</option>
        <option value="mentor" ${m?.role==='mentor'?'selected':''}>Mentor</option>
        <option value="captain" ${m?.role==='captain'?'selected':''}>Captain</option>
      </select></div>
      <div class="mf"><label>Primary Subsection</label><select id="mMSub">
        ${SUBS.map(s=>`<option value="${s.key}" ${m?.teams.includes(s.key)?'selected':''}>${s.key}</option>`).join('')}
      </select></div>
    </div>
    <div class="mb-row">
      <button class="mb mb-cancel" onclick="closeModal()">Cancel</button>
      <button class="mb mb-primary" onclick="saveMember()">Save Member</button>
    </div>`;
}
function saveMember(){
  const name=document.getElementById('mMName')?.value?.trim();if(!name)return;
  const role=document.getElementById('mMRole').value;
  const sub=document.getElementById('mMSub').value;
  const color=SUBS.find(s=>s.key===sub)?.color||'#585b70';
  if(mEditId){
    const m=S.members.find(x=>x.id===mEditId);
    Object.assign(m,{name,role,teams:[sub],avColor:color,av:name.split(' ').map(w=>w[0]).join('')});
    toast('Member updated','ok');
  } else {
    S.members.push({id:S.nid++,name,role,teams:[sub],absent:false,avColor:color,av:name.split(' ').map(w=>w[0]).join('')});
    toast('Member added','ok');
  }
  closeModal();renderMembers();renderAttendance();
}

function scoutHTML(){
  return `<h2>Add Team Data</h2>
    <div class="mf-row">
      <div class="mf"><label>Team #</label><input id="mSNum" type="number" placeholder="1234"/></div>
      <div class="mf"><label>Team Name</label><input id="mSName" placeholder="Team Name"/></div>
    </div>
    <div class="mf-row">
      <div class="mf"><label>Auto Points</label><input id="mSAuto" type="number" placeholder="0"/></div>
      <div class="mf"><label>Teleop Points</label><input id="mSTele" type="number" placeholder="0"/></div>
    </div>
    <div class="mf"><label>Endgame</label><select id="mSEnd"><option>Hang</option><option>Park</option><option>None</option></select></div>
    <div class="mf"><label>Strategy Notes</label><textarea id="mSNote" placeholder="Observations, defense, consistency…"></textarea></div>
    <div class="mb-row">
      <button class="mb mb-cancel" onclick="closeModal()">Cancel</button>
      <button class="mb mb-primary" onclick="saveScout()">Save</button>
    </div>`;
}
function saveScout(){
  const num=document.getElementById('mSNum')?.value;if(!num)return;
  const auto=Number(document.getElementById('mSAuto').value)||0;
  const tele=Number(document.getElementById('mSTele').value)||0;
  S.scouts.push({id:S.nid++,num,name:document.getElementById('mSName').value,auto,tele,end:document.getElementById('mSEnd').value,avg:auto+tele,notes:document.getElementById('mSNote').value});
  toast('Team data saved','ok');closeModal();renderScouting();
}

function compHTML(){
  return `<h2>Add Competition</h2>
    <div class="mf"><label>Event Name</label><input id="mCName" placeholder="Regional / District Event Name"/></div>
    <div class="mf-row">
      <div class="mf"><label>Date</label><input type="date" id="mCDate"/></div>
      <div class="mf"><label>Location</label><input id="mCLoc" placeholder="City, State"/></div>
    </div>
    <div class="mf-row">
      <div class="mf"><label>Team Count</label><input id="mCTeams" type="number" placeholder="40"/></div>
      <div class="mf"><label>Status</label><select id="mCStat"><option value="open">Open</option><option value="registered">Registered</option><option value="closed">Closed</option></select></div>
    </div>
    <div class="mf"><label>Event Link</label><input id="mCLink" type="url" placeholder="https://firstinspires.org/…"/></div>
    <div class="mb-row">
      <button class="mb mb-cancel" onclick="closeModal()">Cancel</button>
      <button class="mb mb-primary" onclick="saveComp()">Save Competition</button>
    </div>`;
}
function saveComp(){
  const name=document.getElementById('mCName')?.value?.trim();if(!name)return;
  S.comps.push({id:S.nid++,name,date:document.getElementById('mCDate').value,loc:document.getElementById('mCLoc').value,status:document.getElementById('mCStat').value,teams:Number(document.getElementById('mCTeams').value)||0,link:document.getElementById('mCLink').value||'#'});
  toast('Competition added','ok');closeModal();renderComps();
}

// ═══════════════════════════════════════════════════════════
//  GLOBALS & UTILS
// ═══════════════════════════════════════════════════════════
function updateGlobals(){
  const done=S.tasks.filter(t=>t.col==='done').length;
  const total=S.tasks.length;
  const buildSubs=['Mechanical','Design/CAD','Electrical','Software'];
  const bd=S.tasks.filter(t=>buildSubs.includes(t.sub)&&t.col==='done').length;
  const bt=S.tasks.filter(t=>buildSubs.includes(t.sub)).length;
  const pct=bt>0?Math.round(bd/bt*100):0;
  document.getElementById('robotFill').style.width=pct+'%';
  document.getElementById('robotPct').textContent=pct+'%';
  document.getElementById('nb-tasks').textContent=total;
  document.getElementById('nb-members').textContent=S.members.length;
}

function toggleUA(){document.getElementById('uaMenu').classList.toggle('open')}
function closeUA(){document.getElementById('uaMenu').classList.remove('open')}
document.addEventListener('click',e=>{
  const w=document.getElementById('ua-wrap')||document.querySelector('.ua-wrap');
  if(w&&!w.contains(e.target)) closeUA();
});

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
let toastT;
function toast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast show'+(type?' '+type:'');
  clearTimeout(toastT);toastT=setTimeout(()=>t.className='toast',2300);
}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeModal();
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();if(S.user)openModal('task')}
});
