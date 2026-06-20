import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10)
      });
      setIsModalOpen(false);
      setFormData({ name: '', sku: '', price: '', quantity: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product', error);
      alert('Failed to create product. Check SKU uniqueness.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-gray-400 mt-1">Manage your inventory catalog.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-6 font-medium">Product Name</th>
                <th className="p-6 font-medium">SKU</th>
                <th className="p-6 font-medium">Price</th>
                <th className="p-6 font-medium">Stock</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-medium">{product.name}</td>
                    <td className="p-6 text-gray-400 font-mono text-sm">{product.sku}</td>
                    <td className="p-6 text-gray-300">${product.price.toFixed(2)}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.quantity > 10 ? 'bg-white/10 text-white' : 'bg-red-500/20 text-red-400'}`}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="p-6 flex justify-end space-x-3">
                      <button className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-400 transition-colors p-2 bg-white/5 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6">Add New Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">SKU</label>
                <input required type="text" className="input-field" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                  <input required type="number" step="0.01" min="0.01" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Initial Stock</label>
                  <input required type="number" min="0" className="input-field" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
              </div>
              <div className="flex space-x-4 mt-8 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
