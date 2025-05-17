-- CREATE TABLE IF NOT EXISTS products (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   price NUMERIC NOT NULL,
--   description TEXT,
--   image_url TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Products table with embedding and category
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  embedding vector(1024),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional but recommended: vector index for faster search
-- CREATE INDEX IF NOT EXISTS idx_products_embedding
--   ON products USING ivfflat (embedding vector_cosine_ops);


-- WISHLIST TABLE
CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CART TABLE
CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
