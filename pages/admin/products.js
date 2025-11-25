import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', slug: '', price: '', category: 'tshirt', availableQty: '', image: '', variant: '', size: '', color: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [openCats, setOpenCats] = useState({ tshirt: false, hoodie: false, mug: false, sticker: false });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProducts(data.products || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  // Dynamic slug from title
  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      const nextSlug = slugify(value);
      setForm({ ...form, title: value, slug: nextSlug });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result || '';
      setForm((f) => ({ ...f, image: String(dataUrl) }));
      setImagePreview(String(dataUrl));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.price || !form.availableQty) {
      toast.error("Please fill required fields (title, slug, price, stock)");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        description: '',
        image: form.image, // can be URL or base64 from upload
        category: form.category,
        price: Number(form.price),
        availableQty: Number(form.availableQty),
        size: form.size ? form.size.split(',').map(s => s.trim()) : [],
        variant: form.variant || undefined,
        color: form.color ? form.color.split(',').map(c => c.trim()) : []
      };
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product created");
        const res2 = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } });
        const d2 = await res2.json();
        setProducts(d2.products || []);
        setForm({ title: '', slug: '', price: '', category: 'tshirt', availableQty: '', image: '', variant: '', size: '', color: '' });
        setImagePreview('');
      } else {
        toast.error(data?.error || "Failed to create product");
      }
    } catch (e2) {
      toast.error("Failed to create product");
      console.error(e2);
    } finally {
      setIsSaving(false);
    }
  };

  // Group products by category
  const grouped = useMemo(() => {
    const g = { tshirt: [], hoodie: [], mug: [], sticker: [] };
    for (const p of products) {
      if (g[p.category]) g[p.category].push(p);
      else g[p.category] = [p];
    }
    return g;
  }, [products]);

  const toggleCat = (cat) => setOpenCats((s) => ({ ...s, [cat]: !s[cat] }));

  return (
    <AdminLayout title="Products">
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      <div className="mb-6 flex items-center justify-between">
        <span></span>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-1">Add New Product</h2>
        <p className="text-xs text-gray-500 mb-4">Fill the details below and submit to create a product.</p>
        <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="title" placeholder="Wear the Code Hoodie 6" value={form.title} onChange={handleChange} required />
              <p className="text-[11px] text-gray-500 mt-1">Human-readable name shown to customers.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="slug" placeholder="wear-the-code-hoodie-6" value={form.slug} onChange={handleChange} required />
              <p className="text-[11px] text-gray-500 mt-1">Auto-generated from title; you can edit if needed.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="category" value={form.category} onChange={handleChange}>
                <option value="tshirt">T-Shirt</option>
                <option value="hoodie">Hoodie</option>
                <option value="mug">Mug</option>
                <option value="sticker">Sticker</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="price" type="number" placeholder="999" value={form.price} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="availableQty" type="number" placeholder="30" value={form.availableQty} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Variant</label>
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="variant" placeholder="Regular" value={form.variant} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sizes</label>
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="size" placeholder="L, XL" value={form.size} onChange={handleChange} />
              <p className="text-[11px] text-gray-500 mt-1">Comma-separated (e.g., S, M, L, XL)</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Colors</label>
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300" name="color" placeholder="Black, Gray, Blue" value={form.color} onChange={handleChange} />
              <p className="text-[11px] text-gray-500 mt-1">Comma-separated list of colors</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageFile} className="block w-full text-sm file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-gray-800 file:text-white file:rounded file:hover:bg-gray-900" />
            <div className="mt-3">
              {imagePreview || form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview || form.image} alt="Preview" className="w-full h-32 object-cover rounded border" />
              ) : (
                <p className="text-xs text-gray-500">You can also paste an image URL below:</p>
              )}
            </div>
            <input className="mt-3 border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-300" name="image" placeholder="https://... (optional)" value={form.image} onChange={handleChange} />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button disabled={isSaving} type="submit" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50">
              {isSaving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      {/* Category-wise dropdown tables */}
      {(['tshirt','hoodie','mug','sticker']).map((cat) => (
        <div key={cat} className="bg-white rounded-2xl shadow mb-4 overflow-hidden border border-gray-100">
          <button onClick={() => toggleCat(cat)} className="w-full flex items-center justify-between px-5 py-3 text-left">
            <span className="font-semibold capitalize">{cat} ({grouped[cat]?.length || 0})</span>
            <span className="text-sm text-gray-500">{openCats[cat] ? 'Hide' : 'Show'}</span>
          </button>
          {openCats[cat] && (
            <div className="overflow-x-auto border-t">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Variants</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="px-6 py-4" colSpan={4}>Loading...</td></tr>
                  ) : (grouped[cat] || []).length === 0 ? (
                    <tr><td className="px-6 py-4" colSpan={4}>No products in this category</td></tr>
                  ) : (
                    (grouped[cat] || []).map((p) => (
                      <tr key={p._id} className="border-b">
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">{p.title}</td>
                        <td className="px-6 py-4">{Array.isArray(p.color) ? p.color.join(', ') : p.variant}</td>
                        <td className="px-6 py-4 bg-gray-50">{p.availableQty}</td>
                        <td className="px-6 py-4 text-right">₹{p.price}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </AdminLayout>
  );
};

export default AdminProducts;


