import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface InvoiceFormProps {
  invoice?: {
    id: string;
    number: string;
    client: string;
    clientEmail?: string;
    amount: number;
    dueDate: string;
    items: { description: string; quantity: number; price: number }[];
    notes?: string;
  };
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function InvoiceForm({ invoice, onSubmit, onClose }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    client: invoice?.client || '',
    clientEmail: invoice?.clientEmail || '',
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: invoice?.notes || '',
    items: invoice?.items || [{ description: '', quantity: 1, price: 0 }],
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceNumber = invoice?.number || `INV-${Date.now()}`;
    onSubmit({
      ...formData,
      number: invoiceNumber,
      amount: total,
      dueDate: new Date(formData.dueDate),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1d24] rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {invoice ? 'Edit Invoice' : 'Create Invoice'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Client Name *</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#BAFF00]/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Client Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#BAFF00]/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#BAFF00]/50"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/60">Line Items</label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-[#BAFF00] hover:text-[#BAFF00]/80"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#BAFF00]/50"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="w-16 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#BAFF00]/50"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                    className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#BAFF00]/50"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-white/40 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#BAFF00]/50"
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div>
              <p className="text-sm text-white/40">Total</p>
              <p className="text-2xl font-black text-white">${total.toLocaleString()}</p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-white/10 rounded-xl text-white font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#BAFF00] text-black rounded-xl font-bold hover:bg-[#BAFF00]/80 transition-colors"
              >
                {invoice ? 'Update' : 'Create'} Invoice
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}