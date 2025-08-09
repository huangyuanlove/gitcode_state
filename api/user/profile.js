export default function handler(req, res) {
  const { id } = req.query;
  res.status(200).json({
    user: `Profile data for user ${id}`,
    timestamp: new Date().toISOString()
  });
}