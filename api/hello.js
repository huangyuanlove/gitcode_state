const axios = require('axios');
module.exports = async (req, res) => {
    const { userName } = req.query
  const response = await axios.get(`https://api.gitcode.com/api/v5/users/${userName}`);
  res.json(response.data);
};