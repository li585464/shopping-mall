const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '050724@Li',
  database: 'shopping_mall'
});

db.connect(err => {
  if (err) console.error('数据库连接失败:', err);
  else console.log('数据库连接成功');
});

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE username=? AND password=?',
    [username, password],
    (err, result) => {
      if (err) return res.json({ code: 500 });
      if (result.length > 0) {
        res.json({ code: 200, user: result[0], msg: '登录成功' });
      } else {
        res.json({ code: 400, msg: '账号或密码错误' });
      }
    }
  );
});

// 注册
app.post('/api/register', (req, res) => {
  const { username, password, nickname, phone } = req.body;
  db.query('INSERT INTO users (username,password,nickname,phone) VALUES (?,?,?,?)',
    [username, password, nickname, phone],
    (err) => {
      if (err) return res.json({ code: 500 });
      res.json({ code: 200, msg: '注册成功' });
    }
  );
});

// 商品列表
app.get('/api/goods', (req, res) => {
  db.query('SELECT * FROM goods', (err, result) => {
    res.json(result || []);
  });
});


// 加入购物车
app.post('/api/cart/add', (req, res) => {
  const { user_id, goods_id, goods_name, price, goods_image } = req.body;

  if (!user_id || !goods_id) {
    return res.json({ code: 400, msg: '参数错误' });
  }

  // 先查是否已存在
  db.query('SELECT * FROM cart WHERE user_id=? AND goods_id=?', [user_id, goods_id], (err, result) => {
    if (result.length > 0) {
      // 已存在 数量+1
      db.query('UPDATE cart SET num=num+1 WHERE id=?', [result[0].id], () => {
        res.json({ code: 200, msg: '数量+1' });
      });
    } else {
      // 不存在 新增
      db.query(
        'INSERT INTO cart (user_id,goods_id,goods_name,price,goods_image,num) VALUES (?,?,?,?,?,1)',
        [user_id, goods_id, goods_name, price, goods_image],
        () => {
          res.json({ code: 200, msg: '加入购物车成功' });
        }
      );
    }
  });
});


// 获取购物车
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query('SELECT * FROM cart WHERE user_id=?', [userId], (err, result) => {
    res.json(result || []);
  });
});

// 删除购物车
app.post('/api/cart/clear', (req, res) => {
  const { userId } = req.body
  if (!userId) return res.json({ code: 400, msg: '用户不存在' })

  db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
    if (err) return res.json({ code: 500 })
    res.json({ code: 200, msg: '清空成功' })
  })
})

app.listen(3000, () => {
  console.log('服务已启动：http://localhost:3000');
});