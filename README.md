# Himanshu Menghani — Full-Stack & AI Engineer Portfolio

🌐 **Live Website**: [https://himanshu-menghani.vercel.app/](https://himanshu-menghani.vercel.app/)

The source code for my personal portfolio website, engineered to showcase AI agent systems, high-throughput RAG backends, developer tools, and full-stack web applications.

---

## 🚀 Featured Engineering Projects

* **CodeMate OS** ([Live App](https://codemate-os.vercel.app/) | [Repository](https://github.com/524himanshu/codemate)): Active-learning IDE studio featuring real-time AST Python execution tracing, WebSockets (<50ms latency), subprocess compiler sandboxes, and an Autonomous Self-Healing Debugger Agent.
* **DrishtiAI** ([Repository](https://github.com/524himanshu/drishti-ai)): Real-time pharmacovigilance adverse event detection engine using scispaCy & RAG (**Shortlisted for Prototype Stage at AI for Bharat 2026**).
* **CF AI Career Coach**: Serverless AI mentorship assistant deployed on Cloudflare Workers, running Llama 3.3 inference at the edge with zero cold starts.
* **RecruitIQ**: Intelligent candidate ranking engine evaluating resume vector embeddings and cosine similarity.

---

## 🛡️ Security Architecture

This portfolio incorporates production-grade defensive security measures:
* **DOMParser XSS Shield**: User chat inputs are rendered using `textContent` and AI bot responses are sanitized via client-side `DOMParser` filtering to neutralize script injection and inline event handlers.
* **Defensive HTTP Security Headers**: Configured via `vercel.json` (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, Modern CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism), JavaScript (ES6+), Boxicons.
* **Serverless Backend**: Cloudflare Workers, Cloudflare Workers AI (Llama 3.3), Durable Objects.
* **Deployment & Hosting**: Vercel Edge Network.

---

## 📬 Contact & Links

* **Portfolio**: [himanshu-menghani.vercel.app](https://himanshu-menghani.vercel.app/)
* **GitHub**: [github.com/524himanshu](https://github.com/524himanshu)
* **LinkedIn**: [linkedin.com/in/himanshu-menghani-926394182](https://in.linkedin.com/in/himanshu-menghani-926394182)
* **Email**: [himanshumenghani524@gmail.com](mailto:himanshumenghani524@gmail.com)
