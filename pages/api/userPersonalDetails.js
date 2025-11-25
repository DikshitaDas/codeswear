import connectDb from "../../middleware/mongoose";
import UserPersonalDetails from "../../models/UserPersonalDetails";
import User from "../../models/User";

const getEmailFromReq = (req) => {
  const headerEmail = req.headers["x-user-email"];
  if (typeof headerEmail === 'string' && headerEmail.trim()) return headerEmail.toLowerCase().trim();
  return null;
};

const handler = async (req, res) => {
  try {
    const email = getEmailFromReq(req);
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === 'GET') {
      const doc = await UserPersonalDetails.findOne({ email }).lean();
      return res.status(200).json({ success: true, data: doc || null });
    }

    if (req.method === 'POST') {
      const payload = { ...(req.body || {}), email };
      const created = await UserPersonalDetails.findOneAndUpdate(
        { email },
        payload,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      // Sync name with User if present
      if (payload.fullName !== undefined) {
        await User.findOneAndUpdate(
          { email },
          { name: payload.fullName },
          { new: true }
        );
      }
      return res.status(200).json({ success: true, data: created });
    }

    if (req.method === 'PUT') {
      const payload = req.body || {};
      const updated = await UserPersonalDetails.findOneAndUpdate(
        { email },
        payload,
        { new: true }
      ).lean();
      // Sync name with User if present
      if (payload.fullName !== undefined) {
        await User.findOneAndUpdate(
          { email },
          { name: payload.fullName },
          { new: true }
        );
      }
      return res.status(200).json({ success: true, data: updated });
    }

    if (req.method === 'DELETE') {
      await UserPersonalDetails.findOneAndDelete({ email });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);


