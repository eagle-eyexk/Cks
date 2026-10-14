import { Link, useLocation } from 'wouter';
import type { ReactNode } from 'react';
import { Activity, ArrowLeftRight, ChevronDown, CreditCard, LayoutDashboard, LineChart, Settings, ShieldCheck, Wallet } from 'lucide-react';
import { useDemo } from '@/lib/demo-store';

const links=[
  {href:'/',label:'Overview',Icon:LayoutDashboard},
  {href:'/markets',label:'Markets',Icon:LineChart},
  {href:'/trade',label:'Trade',Icon:ArrowLeftRight},
  {href:'/wallet',label:'Wallet',Icon:Wallet},
  {href:'/activity',label:'Activity',Icon:Activity},
  {href:'/card',label:'Card preview',Icon:CreditCard},
  {href:'/settings',label:'Settings',Icon:Settings},
];
export function Brand(){return <div className="brand"><div className="brand-mark"><ShieldCheck size={22}/></div><div><div className="brand-name">CKS</div><div className="brand-sub">Crypto Klein Shop</div></div></div>}
export function Shell({children}:{children:ReactNode}){
 const [location]=useLocation();const {notice,dismiss}=useDemo();
  return <div className="app-shell"><aside className="sidebar"><Brand/><div className="nav-label">Your account</div><nav aria-label="Main navigation">{links.map(({href,label,Icon})=><Link key={href} href={href} className={`nav-link ${location.split('?')[0]===href?'active':''}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ','-')}`}><Icon size={17}/><span>{label}</span></Link>)}</nav><div className="sidebar-bottom"><div className="demo-sidebar-note"><span className="demo-dot"/><strong>Sandbox environment</strong><br/>Illustrative values only. No real assets or funds.</div><div className="muted" style={{fontSize:10,padding:'0 13px'}}>CKS demo · Version 1.0</div></div></aside><div className="shell-main"><header className="topbar"><div className="top-title">Personal portfolio</div><div className="top-right"><span className="demo-pill"><span className="demo-dot"/>Demo only</span><div className="user-chip"><div className="avatar-initial">CK</div><div><strong style={{fontSize:11}}>Demo customer</strong><div className="muted" style={{fontSize:10}}>Personal</div></div><ChevronDown size={14} className="muted"/></div></div></header>{children}</div>{notice&&<div className="toast" role="status" data-testid="status-toast">{notice}<button onClick={dismiss} aria-label="Dismiss notification" data-testid="button-dismiss-toast" style={{marginLeft:12,background:'transparent',border:0,color:'white'}}>×</button></div>}</div>
}
export function PageHead({eyebrow,title,description,aside}:{eyebrow:string;title:string;description:string;aside?:ReactNode}){return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="page-desc">{description}</p></div>{aside||<span className="demo-pill"><span className="demo-dot"/>Illustrative demo</span>}</div>}
