# RAG Chatbot - Intelligent Document Assistant

An advanced Retrieval-Augmented Generation (RAG) chatbot that allows users to chat with their documents (PDFs) and structured data. It leverages local embedding generation and powerful LLMs for accurate, context-aware responses.

## 🚀 Features

- **Document RAG**: Upload PDF files to automatically extract text, generate embeddings, and index them for searching.
- **Structured Data Support**: Supports indexing structured JSON data (e.g., insurance records).
- **AI Powered Chat**: Intelligent conversational interface powered by **Groq (Llama 3.3 70B)**.
- **Local Embeddings**: Uses **Transformers.js (Xenova)** to generate embeddings locally, ensuring efficiency and cost-effectiveness.
- **Vector Search**: Utilizes **MongoDB Atlas Vector Search** for high-performance retrieval.
- **Voice Interface**: 
    - **Speech-to-Text**: Ask questions using your voice.
    - **Text-to-Speech**: Listen to AI responses.
- **Modern UI**: Sleek, responsive dashboard built with React and Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Vector Search)
- **PDF Parsing**: PDF.js
- **AI Integration**: Groq SDK, @google/generative-ai
- **Embeddings**: Transformers.js (@xenova/transformers)

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account with a Vector Search index created.
- Groq API Key.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   MONGO_URL=your_mongodb_atlas_connection_string
   PORT=5000
   GROQ_API_KEY=your_groq_api_key
   ```
4. **Important**: Ensure you have created a vector search index in MongoDB Atlas named `vector_index_rag` on the `insurance_embeddings` collection.
5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd my-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```
rag app/
├── backend/
│   ├── controller/      # Logic for PDF processing and AI queries
│   ├── routes/          # API endpoints
│   ├── services/        # AI service wrappers (Groq, Xenova)
│   ├── data/            # Sample data (details.json)
│   ├── db.js            # MongoDB connection
│   ├── generate.js      # Script to seed database with embeddings
│   └── index.js         # Main entry point
├── my-project/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/       # Home and Dashboard pages
│   │   ├── component/   # Reusable components
│   │   └── App.jsx      # Router configuration
└── README.md            # You are here
```

---

## 📝 Usage

1. **Ask Questions**: Type your query in the dashboard to get answers based on indexed data.
2. **Upload PDF**: Use the "Upload PDF" button to add new documents to the knowledge base.
3. **Voice Search**: Click the microphone icon to speak your question.
4. **Seed Data**: Run `node backend/generate.js` to process the sample insurance data in `backend/data/details.json`.

---

## 🔒 License
This project is licensed under the ISC License.
