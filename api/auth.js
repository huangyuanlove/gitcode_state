export default async (req, res) => {
  if (req.method === 'POST') {
    const { username } = req.body;
    res.status(200).json({ token: `${username}-${Date.now()}` });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};