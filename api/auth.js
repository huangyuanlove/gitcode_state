export default async (req, res) => {
  if (req.method === 'POST') {
    const { username } = req.body;
    res.status(200).json({ token: `${username}-${Date.now()}` });
  } else {
        const width = parseInt(req.query.width) || 200;
    const height = parseInt(req.query.height) || 200;
    const color = req.query.color || 'red';
    const text = req.query.text || '动态图片';
    
    // 创建画布
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // 添加文字
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height / 2);
    
    // 设置响应头并返回图片
    res.set('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  }
};