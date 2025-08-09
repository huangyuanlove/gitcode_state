const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
  res.send('Node项目已启动！');
});