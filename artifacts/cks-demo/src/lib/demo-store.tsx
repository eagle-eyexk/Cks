import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Asset = { id: string; symbol: string; name: string; demoPriceEurMinor: number; quantityAtomic: number; decimals: number; changePercentIllustrative: number; color: string; icon: string };
export type LedgerEntry = { id: string; assetSymbol: string; account: string; side: 'debit' | 'credit'; quantityAtomic: number };
export type DemoTransaction = { id: string; type: 'buy' | 'sell' | 'send' | 'receive' | 'card'; assetSymbol: string; quantityAtomic: number; amountEurMinor: number; feeEurMinor: number; status: string; reference: string; createdAt: string; note: string; ledgerEntries: LedgerEntry[] };
export type DemoState = { balances: Record<string, number>; transactions: DemoTransaction[]; hiddenBalances: boolean; displayCurrency: string; cardFrozen: boolean; cardApplied?: boolean };
const KEY = 'cks-demo-state-v1';
const now = Date.now();
function buildLedgerEntries(type: DemoTransaction['type'], symbol: string, quantity: number, amount: number, fee: number): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  const post = (assetSymbol: string, account: string, side: LedgerEntry['side'], value: number) => {
    if (value > 0) entries.push({ id: `entry-${entries.length + 1}`, assetSymbol, account, side, quantityAtomic: value });
  };
  if (type === 'buy') {
    post('EUR', 'Customer EUR balance', 'debit', amount + fee);
    post('EUR', 'Demo settlement', 'credit', amount);
    post('EUR', 'Demo fee revenue', 'credit', fee);
    post(symbol, 'Demo asset inventory', 'debit', quantity);
    post(symbol, `Customer ${symbol} balance`, 'credit', quantity);
  } else if (type === 'sell') {
    post(symbol, `Customer ${symbol} balance`, 'debit', quantity);
    post(symbol, 'Demo asset inventory', 'credit', quantity);
    post('EUR', 'Demo settlement', 'debit', amount);
    post('EUR', 'Customer EUR balance', 'credit', amount - fee);
    post('EUR', 'Demo fee revenue', 'credit', fee);
  } else if (type === 'send') {
    if (symbol === 'EUR') {
      post('EUR', 'Customer EUR balance', 'debit', quantity + fee);
      post('EUR', 'Demo outbound clearing', 'credit', quantity);
      post('EUR', 'Demo fee revenue', 'credit', fee);
    } else {
      post(symbol, `Customer ${symbol} balance`, 'debit', quantity);
      post(symbol, 'Demo outbound clearing', 'credit', quantity);
      post('EUR', 'Customer EUR balance', 'debit', fee);
      post('EUR', 'Demo fee revenue', 'credit', fee);
    }
  } else if (type === 'receive') {
    post(symbol, 'Demo receive clearing', 'debit', quantity);
    post(symbol, `Customer ${symbol} balance`, 'credit', quantity);
  } else {
    post('EUR', 'Customer EUR balance', 'debit', amount + fee);
    post('EUR', 'Demo card settlement', 'credit', amount);
    post('EUR', 'Demo fee revenue', 'credit', fee);
  }
  const totals = new Map<string, { debit: number; credit: number }>();
  for (const entry of entries) {
    const total = totals.get(entry.assetSymbol) ?? { debit: 0, credit: 0 };
    total[entry.side] += entry.quantityAtomic;
    totals.set(entry.assetSymbol, total);
  }
  if ([...totals.values()].some(total => total.debit !== total.credit)) {
    throw new Error('Demo ledger transaction is not balanced by asset.');
  }
  return entries;
}
export const assetCatalog: Asset[] = [
  { id:'bitcoin',symbol:'BTC',name:'Bitcoin',demoPriceEurMinor:6254000,quantityAtomic:3820000,decimals:8,changePercentIllustrative:2.38,color:'#d9a24a',icon:'₿' },
  { id:'ethereum',symbol:'ETH',name:'Ethereum',demoPriceEurMinor:328700,quantityAtomic:124000000,decimals:8,changePercentIllustrative:1.16,color:'#7185ad',icon:'Ξ' },
  { id:'solana',symbol:'SOL',name:'Solana',demoPriceEurMinor:14820,quantityAtomic:3600000000,decimals:8,changePercentIllustrative:-0.74,color:'#83a592',icon:'S' },
  { id:'euro',symbol:'EUR',name:'Euro',demoPriceEurMinor:100,quantityAtomic:0,decimals:2,changePercentIllustrative:0,color:'#6885a0',icon:'€' },
];
export const seedState: DemoState = {
  balances:{ BTC:3820000, ETH:124000000, SOL:3600000000, EUR:184250 },
  transactions:[
    {id:'seed-1',type:'buy',assetSymbol:'BTC',quantityAtomic:85000,amountEurMinor:5316,feeEurMinor:52,status:'Completed · demo',reference:'CKS-DEMO-240518-A7Q2',createdAt:new Date(now-3600000*4).toISOString(),note:'Illustrative Bitcoin purchase',ledgerEntries:buildLedgerEntries('buy','BTC',85000,5316,52)},
    {id:'seed-2',type:'receive',assetSymbol:'EUR',quantityAtomic:75000,amountEurMinor:75000,feeEurMinor:0,status:'Completed · demo',reference:'CKS-DEMO-240517-P9L4',createdAt:new Date(now-86400000).toISOString(),note:'Seeded demo balance',ledgerEntries:buildLedgerEntries('receive','EUR',75000,75000,0)},
    {id:'seed-3',type:'sell',assetSymbol:'SOL',quantityAtomic:12000000,amountEurMinor:1778,feeEurMinor:18,status:'Completed · demo',reference:'CKS-DEMO-240515-K2M8',createdAt:new Date(now-86400000*3).toISOString(),note:'Illustrative Solana sale',ledgerEntries:buildLedgerEntries('sell','SOL',12000000,1778,18)},
  ],
  hiddenBalances:false, displayCurrency:'EUR', cardFrozen:false, cardApplied:false
};
export function readDemoState(): DemoState {
  if (typeof window === 'undefined') return seedState;
  try { const value=localStorage.getItem(KEY); if(value){const parsed=JSON.parse(value) as DemoState; if(parsed?.balances&&Array.isArray(parsed.transactions))return{...parsed,transactions:parsed.transactions.map(tx=>({...tx,ledgerEntries:buildLedgerEntries(tx.type,tx.assetSymbol,tx.quantityAtomic,tx.amountEurMinor,tx.feeEurMinor)}))};} } catch { /* restore seed for invalid sandbox data */ }
  return seedState;
}
type Store = { state: DemoState; update: (fn:(s:DemoState)=>DemoState)=>void; reset:()=>void; toast:(message:string)=>void; notice:string; dismiss:()=>void };
const DemoContext=createContext<Store | null>(null);
export function DemoProvider({children}:{children:ReactNode}) {
  const [state,setState]=useState<DemoState>(readDemoState);
  const [notice,setNotice]=useState('');
  useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(state));},[state]);
  useEffect(()=>{if(!notice)return;const timer=window.setTimeout(()=>setNotice(''),3200);return()=>window.clearTimeout(timer)},[notice]);
  const value=useMemo(()=>({state,update:(fn:(s:DemoState)=>DemoState)=>setState(s=>fn(s)),reset:()=>{setState({...seedState,transactions:seedState.transactions.map(t=>({...t}))});setNotice('Demo scenario restored to its original state.');},toast:(m:string)=>setNotice(m),notice,dismiss:()=>setNotice('')}),[state,notice]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
export function useDemo(){const value=useContext(DemoContext);if(!value)throw new Error('DemoProvider is missing');return value;}
export function amountFor(symbol:string,state:DemoState){const a=assetCatalog.find(x=>x.symbol===symbol);if(!a)return 0;return Number(BigInt(a.demoPriceEurMinor)*BigInt(state.balances[symbol])/(10n**BigInt(a.decimals)));}
export function formatMoney(minor:number,currency='EUR'){const symbol=currency==='EUR'?'€':currency;return `${symbol}${(minor/100).toLocaleString('en-IE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;}
export function formatDisplayMoney(minor:number,currency='EUR'){const rates:Record<string,number>={EUR:1,GBP:.86,USD:1.08};const symbols:Record<string,string>={EUR:'€',GBP:'£',USD:'$'};const value=Math.round(minor*(rates[currency]||1));return `${symbols[currency]||'€'}${(value/100).toLocaleString('en-IE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;}
export function formatQuantity(atomic:number,asset:Asset){return (atomic/(10**asset.decimals)).toLocaleString('en-IE',{maximumFractionDigits:asset.decimals===8?6:2});}
export function parseMajorToMinor(value:string){const normalized=value.trim();if(!/^\d+(?:\.\d{0,2})?$/.test(normalized))return Number.NaN;const [whole,fraction='']=normalized.split('.');const minor=BigInt(whole)*100n+BigInt((fraction+'00').slice(0,2));return minor<=BigInt(Number.MAX_SAFE_INTEGER)?Number(minor):Number.NaN;}
export function parseQuantity(value:string,decimals:number){const normalized=value.trim();if(!/^\d+(?:\.\d+)?$/.test(normalized))return Number.NaN;const [whole,fraction='']=normalized.split('.');if(fraction.length>decimals)return Number.NaN;const atomic=BigInt(whole)*(10n**BigInt(decimals))+BigInt((fraction+'0'.repeat(decimals)).slice(0,decimals)||'0');return atomic<=BigInt(Number.MAX_SAFE_INTEGER)?Number(atomic):Number.NaN;}
export function makeTransaction(type:DemoTransaction['type'],symbol:string,qty:number,amount:number,fee:number,note:string):DemoTransaction{
  const stamp=new Date();return {id:`tx-${stamp.getTime()}-${Math.random().toString(36).slice(2,7)}`,type,assetSymbol:symbol,quantityAtomic:qty,amountEurMinor:amount,feeEurMinor:fee,status:'Completed · demo',reference:`CKS-DEMO-${stamp.toISOString().slice(2,10).replaceAll('-','')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,createdAt:stamp.toISOString(),note,ledgerEntries:buildLedgerEntries(type,symbol,qty,amount,fee)};
}
export const demoIdentifier='CKS-DEMO-ONLY-DO-NOT-SEND';
