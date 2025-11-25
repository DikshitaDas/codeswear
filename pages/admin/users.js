import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data.users || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AdminLayout title="Users">
      <div className="mb-6 flex items-center justify-between">
        <span></span>
        <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-6 py-4" colSpan={4}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td className="px-6 py-4" colSpan={4}>No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">{u.name || '-'}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4 bg-gray-50">{u.role}</td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;


