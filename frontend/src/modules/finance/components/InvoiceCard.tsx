import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface InvoiceCardProps {
  invoice: {
    id: string;
    number: string;
    client: string;
    clientEmail?: string;
    amount: number;
    status: string;
    dueDate: string;
    paidDate?: string;
    items: any[];
  };
  onPay?: () => void;
  onVoid?: () => void;
  onClick?: () => void;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  Draft: { icon: FileText, color: 'bg-white/10 text-foreground/60', label: 'Draft' },
  Sent: { icon: Clock, color: 'bg-backgroundackgroundlue-500/20 text-blue-500', label: 'Sent' },
  Paid: { icon: CheckCircle, color: 'bg-green-500/20 text-green-500', label: 'Paid' },
  Overdue: { icon: XCircle, color: 'bg-red-500/20 text-red-500', label: 'Overdue' },
  Void: { icon: XCircle, color: 'bg-white/10 text-foreground/40', label: 'Void' },
};

export function InvoiceCard({ invoice, onPay, onVoid, onClick }: InvoiceCardProps) {
  const status = statusConfig[invoice.status] || statusConfig.Draft;
  const isDueSoon = new Date(invoice.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid';

  return (
    <div 
      onClick={onClick}
      className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5 hover:border-[#BAFF00]/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground text-lg">INV-{invoice.number}</h3>
          <p className="text-sm text-foreground/60">{invoice.client}</p>
          {invoice.clientEmail && (
            <p className="text-xs text-foreground/40">{invoice.clientEmail}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-black text-foreground">${invoice.amount.toLocaleString()}</p>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-foreground/40">Due Date</span>
          <span className={isOverdue ? 'text-red-500' : isDueSoon ? 'text-yellow-500' : 'text-foreground/60'}>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </span>
        </div>
        {invoice.paidDate && (
          <div className="flex justify-between">
            <span className="text-foreground/40">Paid Date</span>
            <span className="text-foreground/60">
              {new Date(invoice.paidDate).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-foreground/40">Items</span>
          <span className="text-foreground/60">{invoice.items?.length || 0}</span>
        </div>
      </div>

      {invoice.status !== 'Paid' && invoice.status !== 'Void' && (
        <div className="flex gap-2">
          {onPay && invoice.status === 'Sent' && (
            <button
              onClick={(e) => { e.stopPropagation(); onPay(); }}
              className="flex-1 px-4 py-2 bg-[#BAFF00] text-black rounded-xl font-bold text-sm hover:bg-[#BAFF00]/80 transition-colors"
            >
              Mark Paid
            </button>
          )}
          {onVoid && (
            <button
              onClick={(e) => { e.stopPropagation(); onVoid(); }}
              className="flex-1 px-4 py-2 border border-white/10 rounded-xl text-foreground font-bold text-sm hover:bg-white/5 transition-colors"
            >
              Void
            </button>
          )}
        </div>
      )}
    </div>
  );
}