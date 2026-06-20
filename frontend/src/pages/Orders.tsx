import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Order flow state
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<{product_id: number, quantity: number, price: number}[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([api.get('/customers'), api.get('/products')]);
      setCustomers(cRes.data);
      setProducts(pRes.data);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchInitialData();
  }, []);

  const handleCreateOrder = async () => {
    try {
      await api.post('/orders', {
        customer_id: selectedCustomer,
        items: orderItems.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
      });
      setIsModalOpen(false);
      setStep(1);
      setSelectedCustomer(null);
      setOrderItems([]);
      fetchOrders();
    } catch (error: any) {
      console.error('Error creating order', error);
      alert(error.response?.data?.detail || 'Failed to create order');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Cancel this order?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order', error);
      }
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-gray-400 mt-1">Manage sales and transactions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={18} />
          <span>New Order</span>
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500 bg-white/5">
                <th className="p-6 font-medium">Order ID</th>
                <th className="p-6 font-medium">Customer ID</th>
                <th className="p-6 font-medium">Date</th>
                <th className="p-6 font-medium">Total Amount</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-mono font-medium">#{order.id.toString().padStart(4, '0')}</td>
                    <td className="p-6 text-gray-400">Customer #{order.customer_id}</td>
                    <td className="p-6 text-gray-500 text-sm">{new Date(order.created_at).toLocaleString()}</td>
                    <td className="p-6 font-bold">${order.total_amount.toFixed(2)}</td>
                    <td className="p-6 flex justify-end space-x-3">
                      <button onClick={() => handleDelete(order.id)} className="text-gray-400 hover:text-red-400 transition-colors p-2 bg-white/5 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Flow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <h3 className="text-2xl font-bold">New Order</h3>
              <div className="flex space-x-2 text-sm text-gray-500 font-medium">
                <span className={step === 1 ? 'text-white' : ''}>1. Customer</span>
                <span>/</span>
                <span className={step === 2 ? 'text-white' : ''}>2. Products</span>
                <span>/</span>
                <span className={step === 3 ? 'text-white' : ''}>3. Review</span>
              </div>
            </div>

            {/* Step 1: Select Customer */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-4">Select a customer for this order:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
                  {customers.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCustomer(c.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedCustomer === c.id 
                          ? 'border-white bg-white/10' 
                          : 'border-white/10 hover:border-white/30 bg-transparent'
                      }`}
                    >
                      <div className="font-bold">{c.full_name}</div>
                      <div className="text-xs text-gray-400 mt-1">{c.email}</div>
                    </button>
                  ))}
                </div>
                <div className="flex space-x-4 mt-8 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                  <button 
                    disabled={!selectedCustomer} 
                    onClick={() => setStep(2)} 
                    className="btn-primary flex-1 flex justify-center items-center disabled:opacity-50"
                  >
                    Next <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Select Products */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-4">Add products to the order:</p>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {products.map(p => {
                    const existingItem = orderItems.find(item => item.product_id === p.id);
                    return (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                        <div>
                          <div className="font-bold">{p.name}</div>
                          <div className="text-sm text-gray-400">${p.price.toFixed(2)} • Stock: {p.quantity}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input 
                            type="number" 
                            min="0" 
                            max={p.quantity}
                            value={existingItem?.quantity || 0}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 0;
                              if (qty === 0) {
                                setOrderItems(orderItems.filter(item => item.product_id !== p.id));
                              } else {
                                if (existingItem) {
                                  setOrderItems(orderItems.map(item => item.product_id === p.id ? { ...item, quantity: qty } : item));
                                } else {
                                  setOrderItems([...orderItems, { product_id: p.id, quantity: qty, price: p.price }]);
                                }
                              }
                            }}
                            className="input-field w-24 text-center py-2"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex space-x-4 mt-8 pt-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <button 
                    disabled={orderItems.length === 0} 
                    onClick={() => setStep(3)} 
                    className="btn-primary flex-1 flex justify-center items-center disabled:opacity-50"
                  >
                    Review Order <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="font-bold text-gray-400 text-sm mb-4">ORDER SUMMARY</h4>
                  <div className="space-y-3">
                    {orderItems.map((item, idx) => {
                      const product = products.find(p => p.id === item.product_id);
                      return (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {product?.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-8 pt-4">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                  <button onClick={handleCreateOrder} className="btn-primary flex-1">Confirm & Create Order</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
