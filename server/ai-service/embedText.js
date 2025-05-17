// 1. Load env first
import dotenv from 'dotenv';
dotenv.config();

// 2. Import Cohere client
import { CohereClient } from 'cohere-ai';

// 3. Initialize with your key
const cohere = new CohereClient({
  apiKey: process.env.COHERE_API_KEY,
});

// 4. Export a simple embed function
export async function embedText(text, type = 'search_document') {
  try {
    const response = await cohere.embed({
      model: 'embed-english-v3.0',
      texts: [text],
      input_type: type, // "search_document" for DB, "search_query" for user
    });
    return response.embeddings[0];
  } catch (err) {
    console.error('Embedding error:', err);
    throw err;
  }
}

