import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { InvoiceCard } from '../components/InvoiceCard';
import { InvoiceForm } from '../components/InvoiceForm';

interface Invoice {
  id: string;
  number: string;
  client: string;
  clientEmail?: string;
  amount: number;
  status: string;
  dueDate: string;
  paidDate?: string;
  items: any[];
  notes?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/v1/finance/invoices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      if (result.status === 'success') {
        setInvoices(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (data: any) => {
    try {
      const response = await fetch('/api/v1/finance/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setShowForm(false);
        fetchInvoices();
      }
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/finance/invoices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Paid', paidDate: new Date() })
      });
      const result = await response.json();
      if (result.status === 'success') {
        fetchInvoices();
      }
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
    }
  };

  const handleVoid = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/finance/invoices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'Void' })
      });
      const result = await response.json();
      if (result.status === 'success') {
        fetchInvoices();
      }
    } catch (error) {
      console.error('Failed to void invoice:', error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const outstandingAmount = invoices.filter(i => i.status !== 'Paid' && i.status !== 'Void').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Invoices</h1>
          <p className="text-white/40">Manage client invoices</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#BAFF00] text-black rounded-xl font-bold text-sm hover:bg-[#BAFF00]/80"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <p className="text-sm text-white/40 mb-1">Total Invoiced</p>
          <p className="text-2xl font-black text-white">${totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <p className="text-sm text-white/40 mb-1">Paid</p>
          <p className="text-2xl font-black text-green-500">${paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <p className="text-sm text-white/40 mb-1">Outstanding</p>
          <p className="text-2xl font-black text-yellow-500">${outstandingAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/5">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by client or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#BAFF00]/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#BAFF00]/50"
            >
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Void">Void</option>
            </select>
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="bg-[#1a1d24] rounded-2xl p-12 border border-white/5 text-center">
          <p className="text-white/40 mb-4">No invoices found</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#BAFF00] text-black rounded-xl font-bold text-sm hover:bg-[#BAFF00]/80"
          >
            Create your first invoice
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvoices.map(invoice => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onPay={() => handleMarkPaid(invoice.id)}
              onVoid={() => handleVoid(invoice.id)}
              onClick={() => setSelectedInvoice(invoice)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <InvoiceForm
          onSubmit={handleCreateInvoice}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}