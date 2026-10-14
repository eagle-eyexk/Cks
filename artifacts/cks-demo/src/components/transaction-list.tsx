import { ArrowDownLeft, ArrowUpRight, Repeat2, ShoppingBag } from 'lucide-react';
import { assetCatalog, formatMoney, formatQuantity, type DemoTransaction } from '@/lib/demo-store';
export function TransactionRow({tx,onClick,hidden=false}:{tx:DemoTransaction;onClick?:()=>void;hidden?:boolean}){
 const Icon=tx.type==='buy'?ArrowDownLeft:tx.type==='sell'?ArrowUpRight:tx.type==='send'?ArrowUpRight:tx.type==='card'?ShoppingBag:Repeat2;
 const title=tx.type==='buy'?'Bought':tx.type==='sell'?'Sold':tx.type==='send'?'Sent':tx.type==='card'?'Card activity':'Received';
 const asset=assetCatalog.find(a=>a.symbol===tx.assetSymbol);
  return <button type="button" onClick={onClick} className="activity-row" data-testid={`button-transaction-${tx.id}`} style={{width:'100%',textAlign:'left',background:'transparent',border:0,cursor:onClick?'pointer':'default'}}>
  <span className="activity-icon"><Icon size={16}/></span><span><span className="activity-name">{title} {tx.assetSymbol}</span><span className="activity-meta">{new Date(tx.createdAt).toLocaleString('en-IE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})} · {hidden?'••••':asset?formatQuantity(tx.quantityAtomic,asset):tx.quantityAtomic} {hidden?'':tx.assetSymbol}</span></span><span><span className="activity-amount" data-testid={`value-transaction-amount-${tx.id}`}>{hidden?'••••••':formatMoney(tx.amountEurMinor)}</span><span className="activity-status">{tx.status}</span></span>
 </button>
}
