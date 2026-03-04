import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Ensure data directory exists for database persistence
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'farm.db');
const db = new Database(dbPath);

export function initDb() {
  // Users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT, -- In a real app, hash this!
      role TEXT DEFAULT 'user', -- 'user' or 'admin'
      balance REAL DEFAULT 0,
      name TEXT,
      phone TEXT
    )
  `);

  // Pigs
  db.exec(`
    CREATE TABLE IF NOT EXISTS pigs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE, -- Ear tag
      breed TEXT,
      birth_date TEXT,
      entry_weight REAL,
      current_weight REAL,
      status TEXT DEFAULT 'available', -- available, adopted, slaughtered, sick
      price REAL,
      image_url TEXT,
      video_url TEXT,
      coop_number TEXT,
      description TEXT
    )
  `);

  // Adoptions
  db.exec(`
    CREATE TABLE IF NOT EXISTS adoptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      pig_id INTEGER,
      adoption_date TEXT,
      status TEXT DEFAULT 'active', -- active, completed
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(pig_id) REFERENCES pigs(id)
    )
  `);

  // Feed Products
  db.exec(`
    CREATE TABLE IF NOT EXISTS feed_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      weight_kg REAL,
      image_url TEXT
    )
  `);

  // Feed Orders
  db.exec(`
    CREATE TABLE IF NOT EXISTS feed_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      pig_id INTEGER,
      product_id INTEGER,
      status TEXT DEFAULT 'pending', -- pending, fed
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(pig_id) REFERENCES pigs(id),
      FOREIGN KEY(product_id) REFERENCES feed_products(id)
    )
  `);

  // Growth/Health Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pig_id INTEGER,
      date TEXT,
      type TEXT, -- weight, health, vaccine, feed
      value TEXT, -- e.g., weight value or health status
      notes TEXT,
      image_url TEXT,
      FOREIGN KEY(pig_id) REFERENCES pigs(id)
    )
  `);

  // Seed data if empty
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    console.log('Seeding database...');
    
    // Admin
    db.prepare('INSERT INTO users (username, password, role, name, phone) VALUES (?, ?, ?, ?, ?)').run('admin', 'admin123', 'admin', '农场管理员', '13800000000');
    // Demo User
    db.prepare('INSERT INTO users (username, password, role, name, phone, balance) VALUES (?, ?, ?, ?, ?, ?)').run('user', 'user123', 'user', '张三', '13900000000', 5000);

    // Pigs
    const insertPig = db.prepare('INSERT INTO pigs (code, breed, birth_date, entry_weight, current_weight, price, image_url, coop_number, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertPig.run('PIG-001', '黑猪', '2025-12-01', 15.5, 25.0, 1200, 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80', 'A-01', '活泼健康，食欲旺盛。');
    insertPig.run('PIG-002', '杜洛克', '2025-12-05', 14.0, 22.5, 1100, 'https://images.unsplash.com/photo-1604848698030-c434ba08ece1?auto=format&fit=crop&w=800&q=80', 'A-02', '生长速度快，体型健壮。');
    insertPig.run('PIG-003', '长白猪', '2025-12-10', 13.5, 20.0, 1000, 'https://images.unsplash.com/photo-1541689221361-ad95003448dc?auto=format&fit=crop&w=800&q=80', 'B-01', '性情温顺，易于管理。');
    insertPig.run('PIG-004', '大白猪', '2025-12-12', 12.0, 18.0, 950, 'https://images.unsplash.com/photo-1595624634269-80b67283620e?auto=format&fit=crop&w=800&q=80', 'B-02', '需要额外照料，潜力巨大。');

    // Feed Products
    const insertFeed = db.prepare('INSERT INTO feed_products (name, description, price, weight_kg, image_url) VALUES (?, ?, ?, ?, ?)');
    insertFeed.run('精选幼猪饲料', '高蛋白配方，适合幼猪生长', 50, 10, 'https://images.unsplash.com/photo-1605218427368-35b08968e2e9?auto=format&fit=crop&w=800&q=80');
    insertFeed.run('有机蔬菜混合包', '新鲜蔬菜补充维生素', 30, 5, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80');
    insertFeed.run('益生菌调理包', '调节肠道健康，增强免疫力', 80, 1, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80');
  }
}

export default db;
