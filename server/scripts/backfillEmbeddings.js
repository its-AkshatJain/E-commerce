// scripts/backfillEmbeddings.js
import 'dotenv/config';
import pool from '../config/db.js';
import { embedText } from '../ai-service/embedText.js';
import { toSql } from 'pgvector';

async function backfillEmbeddings() {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, description, category FROM products WHERE embedding IS NULL'
    );

    if (rows.length === 0) {
      console.log('✅ No products need embedding.');
      return;
    }

    console.log(`🔄 Found ${rows.length} products without embedding...`);

    for (const product of rows) {
      const text = `${product.name} ${product.category || ''} ${product.description || ''}`;
      const embeddingArray = await embedText(text);
      await pool.query(
        'UPDATE products SET embedding = $1 WHERE id = $2',
        [toSql(embeddingArray), product.id]
      );
      console.log(`✅ Embedded product ID: ${product.id}`);
    }

    console.log('🎉 All embeddings updated!');
    process.exit();
  } catch (err) {
    console.error('❌ Error backfilling embeddings:', err);
    process.exit(1);
  }
}

backfillEmbeddings();
