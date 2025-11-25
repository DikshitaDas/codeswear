import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

  // Core fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Optional shipping fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  const decodeEmail = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const em = payload?.user?.email;
          if (em) return String(em).toLowerCase();
        }
      }
    } catch {}
    const stored = localStorage.getItem("user_email");
    return stored ? String(stored).toLowerCase() : "";
  };

  useEffect(() => {
    const em = decodeEmail();
    if (!em) {
      router.push("/login");
      return;
    }
    setUserEmail(em);

    (async () => {
      try {
        const res = await fetch("/api/userPersonalDetails", {
          headers: { "x-user-email": em },
        });
        if (res.ok) {
          const data = await res.json();
          const p = data.data || {};
          setFullName(p.fullName || "");
          setEmail(p.email || em);
          setPhone(p.phone || "");
          setAddress(p.address || "");
          setCity(p.city || "");
          setState(p.state || "");
          setPincode(p.pincode || "");
          setNewsletter(Boolean(p.newsletter));
        } else {
          setEmail(em);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userEmail) return;
    try {
      const res = await fetch("/api/userPersonalDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
        body: JSON.stringify({
          fullName,
          phone,
          address,
          city,
          state,
          pincode,
          newsletter,
          }),
        });
      if (res.ok) {
        setMessage("✅ Profile saved successfully");
      } else {
        setMessage("❌ Failed to save profile");
      }
    } catch {
      setMessage("❌ Failed to save profile");
    } finally {
      setTimeout(() => setMessage(""), 1800);
    }
  };

  const initials = (fullName || email || " ")
    .trim()
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Header */}
      <div className="relative bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-xl font-semibold ring-1 ring-white/20">
            {initials || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-sm text-gray-300">
              Manage your personal info and shipping details
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-12 w-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-semibold">
                {initials || "U"}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {fullName || "Your Name"}
                </div>
                <div className="text-sm text-gray-500">{email}</div>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">📞 Phone</span>
                <span className="font-medium">{phone || "—"}</span>
              </div>

              <div className="pt-3 border-t">
                <div className="text-gray-500 mb-1">📦 Shipping Address</div>
                {address || city || state || pincode ? (
                  <div className="text-gray-800 leading-relaxed">
                    {address && <div>{address}</div>}
                    <div>
                      {city}
                      {state ? `, ${state}` : ""} {pincode}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No address added</div>
                )}
              </div>

              <div className="pt-3 border-t flex items-center justify-between">
                <span className="text-gray-500">📰 Newsletter</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    newsletter
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {newsletter ? "Subscribed" : "Not Subscribed"}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Edit Details
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Keep your personal info up to date
            </p>

            <form onSubmit={handleSave} className="space-y-8">
              {/* Personal */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Used for login & communication
          </p>
        </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="pt-2 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Shipping Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      placeholder="House no, Street, Area"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kolkata"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="West Bengal"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Pincode / ZIP
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="700001"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1 sm:col-span-2">
                    <input
                      id="newsletter"
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                    />
                    <label
                      htmlFor="newsletter"
                      className="text-sm text-gray-700"
                    >
                      Subscribe to newsletter
                    </label>
                  </div>
                </div>
              </div>

              {message && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                  {message}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                >
                  Save Changes
                </button>
        <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                >
                  Back to Home
        </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
