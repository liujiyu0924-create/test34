import express from "express";
import { createServer as createViteServer } from "vite";
import { initDb } from "./src/db";
import db from "./src/db";

async function startServer() {
  const app = express();
  const PORT = 7731;

  app.use(express.json());

  // Initialize DB
  initDb();

  // --- API Routes ---

  // Auth (Simplified for demo)
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { username, password, name, phone } = req.body;
    try {
      const result = db.prepare('INSERT INTO users (username, password, name, phone) VALUES (?, ?, ?, ?)').run(username, password, name, phone);
      res.json({ success: true, userId: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ success: false, message: "Username likely taken" });
    }
  });

  // Pigs
  app.get("/api/pigs", (req, res) => {
    const { status } = req.query;
    let query = 'SELECT * FROM pigs';
    if (status) {
      query += ` WHERE status = '${status}'`;
    }
    const pigs = db.prepare(query).all();
    res.json(pigs);
  });

  app.get("/api/pigs/:id", (req, res) => {
    const pig = db.prepare('SELECT * FROM pigs WHERE id = ?').get(req.params.id);
    res.json(pig);
  });

  // Adoptions
  app.post("/api/adopt", (req, res) => {
    const { userId, pigId } = req.body;
    
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    const pig = db.prepare('SELECT price, status FROM pigs WHERE id = ?').get(pigId) as any;

    if (!user || !pig) return res.status(404).json({ message: "User or Pig not found" });
    if (pig.status !== 'available') return res.status(400).json({ message: "Pig not available" });
    if (user.balance < pig.price) return res.status(400).json({ message: "Insufficient balance" });

    // Transaction
    const adopt = db.transaction(() => {
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(pig.price, userId);
      db.prepare('UPDATE pigs SET status = ? WHERE id = ?').run('adopted', pigId);
      db.prepare('INSERT INTO adoptions (user_id, pig_id, adoption_date) VALUES (?, ?, ?)').run(userId, pigId, new Date().toISOString());
    });

    try {
      adopt();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: "Transaction failed" });
    }
  });

  app.get("/api/my-pigs", (req, res) => {
    const { userId } = req.query;
    const pigs = db.prepare(`
      SELECT p.*, a.adoption_date 
      FROM pigs p 
      JOIN adoptions a ON p.id = a.pig_id 
      WHERE a.user_id = ?
    `).all(userId);
    res.json(pigs);
  });

  // Feed Products
  app.get("/api/feed-products", (req, res) => {
    const products = db.prepare('SELECT * FROM feed_products').all();
    res.json(products);
  });

  // Feed Orders
  app.post("/api/feed", (req, res) => {
    const { userId, pigId, productId } = req.body;
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as any;
    const product = db.prepare('SELECT price FROM feed_products WHERE id = ?').get(productId) as any;

    if (user.balance < product.price) return res.status(400).json({ message: "Insufficient balance" });

    const order = db.transaction(() => {
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(product.price, userId);
      db.prepare('INSERT INTO feed_orders (user_id, pig_id, product_id, created_at) VALUES (?, ?, ?, ?)').run(userId, pigId, productId, new Date().toISOString());
    });

    try {
      order();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: "Order failed" });
    }
  });

  // Admin: Stats
  app.get("/api/admin/stats", (req, res) => {
    const totalPigs = db.prepare('SELECT count(*) as count FROM pigs').get() as any;
    const adoptedPigs = db.prepare("SELECT count(*) as count FROM pigs WHERE status = 'adopted'").get() as any;
    const totalUsers = db.prepare('SELECT count(*) as count FROM users WHERE role = "user"').get() as any;
    const pendingFeed = db.prepare("SELECT count(*) as count FROM feed_orders WHERE status = 'pending'").get() as any;
    
    res.json({
      totalPigs: totalPigs.count,
      adoptedPigs: adoptedPigs.count,
      totalUsers: totalUsers.count,
      pendingFeed: pendingFeed.count
    });
  });

  // Admin: Orders
  app.get("/api/admin/orders", (req, res) => {
    const orders = db.prepare(`
      SELECT o.id, u.name as user_name, p.code as pig_code, fp.name as product_name, o.status, o.created_at
      FROM feed_orders o
      JOIN users u ON o.user_id = u.id
      JOIN pigs p ON o.pig_id = p.id
      JOIN feed_products fp ON o.product_id = fp.id
      ORDER BY o.created_at DESC
    `).all();
    res.json(orders);
  });

  // Admin: Confirm Order
  app.post("/api/admin/orders/:id/confirm", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE feed_orders SET status = 'fed' WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Admin: Logs
  app.post("/api/logs", (req, res) => {
    const { pigId, type, value, notes } = req.body;
    db.prepare('INSERT INTO logs (pig_id, date, type, value, notes) VALUES (?, ?, ?, ?, ?)').run(pigId, new Date().toISOString(), type, value, notes);
    
    // If weight, update current weight of pig
    if (type === 'weight') {
      db.prepare('UPDATE pigs SET current_weight = ? WHERE id = ?').run(value, pigId);
    }
    
    res.json({ success: true });
  });

  app.get("/api/logs/:pigId", (req, res) => {
    const logs = db.prepare('SELECT * FROM logs WHERE pig_id = ? ORDER BY date DESC').all(req.params.pigId);
    res.json(logs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    
    app.use(express.static(path.join(__dirname, "dist")));
    
    // Handle SPA routing: serve index.html for any unknown routes
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
