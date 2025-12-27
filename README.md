# 🚀 Expense Anomaly Detector

An AI-powered expense validation and anomaly detection system that helps organizations catch fraudulent expenses, ensure policy compliance, and streamline reimbursement workflows.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-Agents-412991?style=flat-square&logo=openai)
![Supabase](https://img.shields.io/badge/Supabase-Vector_DB-3FCF8E?style=flat-square&logo=supabase)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Detection** | Uses OpenAI Agents SDK for multi-agent invoice analysis |
| 📄 **Smart OCR** | Automatically extracts data from invoices, receipts & documents |
| 🛡️ **Policy Compliance** | Validates expenses against company policies stored in Supabase Vector DB |
| ⚡ **Risk Scoring** | Flags suspicious transactions with severity levels (approved/flagged/rejected) |
| 🌓 **Modern UI** | Beautiful glassmorphism design with light/dark mode support |
| 📊 **Batch Processing** | Analyze multiple invoices simultaneously |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend & AI
- **AI Agents:** OpenAI Agents SDK
- **LLM Integration:** LangChain
- **Database:** Supabase (PostgreSQL + Vector DB)
- **Type Safety:** TypeScript, Zod Schemas

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- OpenAI API Key
- Supabase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KoushikwebDev/Expense-Anomaly-Detector.git
   cd Expense-Anomaly-Detector
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

---

## 📁 Project Structure

```
├── app/
│   ├── anomaly-detector/    # Invoice upload & analysis page
│   ├── features/            # Features showcase page
│   ├── how-it-works/        # How it works guide
│   ├── pricing/             # Pricing plans page
│   ├── actions/             # Server actions
│   └── page.tsx             # Landing page
├── components/
│   ├── Hero.tsx             # Hero section
│   ├── Navbar.tsx           # Navigation bar
│   └── theme-provider.tsx   # Theme context
├── lib/
│   ├── schemas/             # Zod validation schemas
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

---

## 🔄 How It Works

1. **📤 Upload** — Drag & drop invoices (PDF, images, or documents)
2. **🔍 AI Analysis** — OpenAI agents extract and validate document data
3. **📋 Policy Check** — Validates against company policies in the knowledge base
4. **🎯 Anomaly Detection** — Flags suspicious patterns and calculates risk scores
5. **✅ Review & Action** — Get detailed reports with clear recommendations

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <b>Subhamay Paul</b>
    </td>
    <td align="center">
      <b>Vishal Sinha</b>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/KoushikwebDev/Expense-Anomaly-Detector/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for the Agents SDK
- [Supabase](https://supabase.com/) for the database and vector storage
- [Vercel](https://vercel.com/) for Next.js framework

---

<p align="center">
  Made with ❤️ by the ExpenseAD Team
</p>
