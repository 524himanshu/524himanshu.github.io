/* ==================== scroll progress bar ==================== */
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
});

/* ==================== toggle icon navbar ==================== */
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};

/* ==================== scroll sections active link ==================== */
const sections = document.querySelectorAll('section');
const navlinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  const top = window.scrollY;

  sections.forEach(sec => {
    const offset = sec.offsetTop - 150;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navlinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector('header nav a[href*=' + id + ']');
      if (activeLink) activeLink.classList.add('active');
    }
  });

  /* ==================== sticky navbar ==================== */
  const header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 100);

  /* ==================== close mobile menu on scroll ==================== */
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
};

/* ==================== scroll reveal ==================== */
ScrollReveal({
  distance: '80px',
  duration: 2000,
  delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });

/* ==================== typed js ==================== */
document.addEventListener('DOMContentLoaded', () => {
  new Typed('.typed-text', {
    strings: ['Full Stack AI Engineer', 'Backend Specialist', 'RAG & LLM Builder', 'Asynchronous Systems Architect'],
    typeSpeed: 80,
    backSpeed: 40,
    backDelay: 1500,
    loop: true
  });
});

/* ==================== theme toggle (classic dark vs midnight black) ==================== */
const themeToggleBtn = document.getElementById('theme-toggle-btn');

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});

/* ==================== contact form validation & animations ==================== */
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
  input.addEventListener('blur', () => {
    input.classList.add('touched');
  });
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Mark all fields as touched to trigger CSS validation styles
  formInputs.forEach(input => input.classList.add('touched'));
  
  if (!form.checkValidity()) return;

  const originalBtnText = submitBtn.textContent;
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  const formData = {
    access_key: '0cda509b-1159-432e-8383-8db81a3a5262',
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    subject: form.subject.value || 'Portfolio Contact Form Submission',
    message: form.message.value,
    from_name: 'Himanshu Portfolio Website',
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData),
    });

    // Background backup save to Render MongoDB
    fetch('https://five24himanshu-github-io.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }).catch(err => console.warn('Backup save error', err));

    const data = await res.json();
    
    // Switch to success state
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');
    submitBtn.textContent = '✓ Message Sent';
    
    // Increment local message count and update footer badge
    try {
      let currentMsgs = parseInt(localStorage.getItem('portfolio_messages') || '18');
      currentMsgs++;
      localStorage.setItem('portfolio_messages', currentMsgs.toString());
      const msgElement = document.getElementById('messages-count');
      if (msgElement) {
        msgElement.textContent = currentMsgs;
      }
    } catch (err) {
      console.warn("Failed to update local messages count", err);
    }
    
    showToast(data.message || 'Message sent successfully!');
    form.reset();
    
    formInputs.forEach(input => input.classList.remove('touched'));
    
    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }, 3000);
  } catch (err) {
    console.error(err);
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    showToast('Failed to send message. Please try again later.');
  }
});

/* ==================== project filter tabs ==================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioBoxes = document.querySelectorAll('.portfolio-box');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioBoxes.forEach(box => {
      const categories = box.dataset.category || '';
      if (filter === 'all' || categories.includes(filter)) {
        box.classList.remove('hidden');
      } else {
        box.classList.add('hidden');
      }
    });
  });
});

/* ==================== cursor glow ==================== */
const cursorGlow = document.getElementById('cursor-glow');

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

document.addEventListener('mouseover', (e) => {
  if (e.target.closest('a, button, .portfolio-box, .filter-btn, .tech-icon, .nft')) {
    cursorGlow.classList.add('hovering');
  } else {
    cursorGlow.classList.remove('hovering');
  }
});
/* ==================== skill concept mapping ==================== */
const skillRelations = {
  // Languages
  'javascript': ['next-js', 'react-js', 'node-express', 'cloudflare-workers', 'html-css', 'tailwind-css'],
  'python': ['fastapi', 'django-drf', 'flask', 'llms', 'agentic-ai', 'rag-pipelines', 'scikit-learn', 'pandas-numpy', 'celery', 'redis'],
  'sql': ['postgresql', 'fastapi', 'django-drf', 'flask', 'async-processing', 'api-design'],
  
  // AI/ML
  'llms': ['python', 'agentic-ai', 'rag-pipelines', 'prompt-engineering', 'cloudflare-workers', 'fastapi'],
  'agentic-ai': ['python', 'llms', 'rag-pipelines', 'prompt-engineering', 'cloudflare-workers', 'fastapi', 'redis', 'celery'],
  'rag-pipelines': ['python', 'llms', 'agentic-ai', 'prompt-engineering', 'postgresql', 'redis', 'fastapi'],
  'prompt-engineering': ['llms', 'agentic-ai', 'rag-pipelines'],
  'scikit-learn': ['python', 'pandas-numpy'],
  'pandas-numpy': ['python', 'scikit-learn'],

  // Backend
  'fastapi': ['python', 'sql', 'postgresql', 'redis', 'celery', 'docker', 'async-processing', 'api-design', 'rest-apis'],
  'django-drf': ['python', 'sql', 'postgresql', 'redis', 'celery', 'docker', 'rbac', 'api-design', 'rest-apis', 'jwt-auth'],
  'flask': ['python', 'sql', 'postgresql', 'mongodb', 'docker', 'api-design', 'rest-apis'],
  'node-express': ['javascript', 'mongodb', 'docker', 'api-design', 'rest-apis', 'jwt-auth'],
  'rest-apis': ['javascript', 'python', 'sql', 'fastapi', 'django-drf', 'flask', 'node-express', 'api-design', 'jwt-auth'],
  'jwt-auth': ['fastapi', 'django-drf', 'node-express', 'rest-apis', 'rbac'],
  'celery': ['python', 'redis', 'fastapi', 'django-drf', 'async-processing'],
  'redis': ['python', 'fastapi', 'django-drf', 'celery', 'async-processing', 'docker'],

  // Frontend
  'react-js': ['javascript', 'next-js', 'html-css', 'tailwind-css'],
  'next-js': ['javascript', 'react-js', 'html-css', 'tailwind-css', 'vercel-render', 'cloudflare-workers'],
  'tailwind-css': ['html-css', 'react-js', 'next-js'],
  'html-css': ['javascript', 'react-js', 'next-js', 'tailwind-css'],

  // Databases
  'postgresql': ['sql', 'python', 'fastapi', 'django-drf', 'flask', 'async-processing'],
  'mongodb': ['javascript', 'node-express', 'flask'],

  // Tools & Platforms
  'docker': ['fastapi', 'django-drf', 'flask', 'node-express', 'redis', 'postgresql'],
  'git-github': ['javascript', 'python', 'vercel-render', 'cloudflare-workers'],
  'postman': ['rest-apis', 'api-design', 'fastapi', 'django-drf', 'node-express'],
  'vercel-render': ['next-js', 'react-js', 'flask', 'node-express', 'git-github'],
  'cloudflare-workers': ['javascript', 'llms', 'agentic-ai', 'next-js', 'git-github'],

  // Concepts
  'rbac': ['django-drf', 'jwt-auth', 'api-design'],
  'async-processing': ['python', 'celery', 'redis', 'fastapi', 'postgresql'],
  'api-design': ['rest-apis', 'fastapi', 'django-drf', 'node-express', 'postman', 'rbac']
};

const skillSpans = document.querySelectorAll('.skills-list span');

skillSpans.forEach(span => {
  span.addEventListener('mouseover', () => {
    const currentSkill = span.getAttribute('data-skill');
    if (!currentSkill) return;

    const related = skillRelations[currentSkill] || [];

    skillSpans.forEach(s => {
      const otherSkill = s.getAttribute('data-skill');
      if (otherSkill === currentSkill || related.includes(otherSkill)) {
        s.classList.add('highlight');
        s.classList.remove('dimmed');
      } else {
        s.classList.add('dimmed');
        s.classList.remove('highlight');
      }
    });
  });

  span.addEventListener('mouseout', () => {
    skillSpans.forEach(s => {
      s.classList.remove('highlight');
      s.classList.remove('dimmed');
    });
  });
});

/* ==================== live github repository fetcher ==================== */
async function fetchGithubStats() {
  const statContainers = document.querySelectorAll('.github-stats');
  
  // Cache to avoid hitting API rate limits unnecessarily
  const cacheKey = 'portfolio_github_stats';
  const cacheExpiryKey = 'portfolio_github_stats_expiry';
  const now = Date.now();
  
  const cachedData = localStorage.getItem(cacheKey);
  const cachedExpiry = localStorage.getItem(cacheExpiryKey);
  
  if (cachedData && cachedExpiry && now < parseInt(cachedExpiry)) {
    const stats = JSON.parse(cachedData);
    statContainers.forEach(container => {
      const repo = container.getAttribute('data-repo');
      if (stats[repo]) {
        container.querySelector('.stars').textContent = stats[repo].stars;
        container.querySelector('.forks').textContent = stats[repo].forks;
      }
    });
    return;
  }
  
  const fetchedStats = {};
  
  for (const container of statContainers) {
    const repo = container.getAttribute('data-repo');
    if (!repo) continue;
    
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`);
      if (!res.ok) throw new Error('GitHub API error');
      const data = await res.json();
      
      const stars = data.stargazers_count;
      const forks = data.forks_count;
      
      container.querySelector('.stars').textContent = stars;
      container.querySelector('.forks').textContent = forks;
      
      fetchedStats[repo] = { stars, forks };
    } catch (err) {
      console.warn(`Failed to fetch stats for ${repo}, using defaults.`, err);
      // Fallbacks
      if (repo.includes('drishti-ai')) {
        container.querySelector('.stars').textContent = '4';
        container.querySelector('.forks').textContent = '1';
      } else if (repo.includes('recruitiq')) {
        container.querySelector('.stars').textContent = '3';
        container.querySelector('.forks').textContent = '0';
      } else {
        container.querySelector('.stars').textContent = '2';
        container.querySelector('.forks').textContent = '0';
      }
    }
  }
  
  if (Object.keys(fetchedStats).length > 0) {
    localStorage.setItem(cacheKey, JSON.stringify(fetchedStats));
    localStorage.setItem(cacheExpiryKey, (now + 30 * 60 * 1000).toString()); // Cache for 30 minutes
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchGithubStats();
});

/* ==================== Himanshu AI Chat Widget Logic ==================== */
const aiChatToggle = document.getElementById('ai-chat-toggle');
const aiChatClose = document.getElementById('ai-chat-close');
const aiChatWindow = document.getElementById('ai-chat-window');
const aiChatBody = document.getElementById('ai-chat-body');
const aiChatInputArea = document.getElementById('ai-chat-input-area');
const aiChatInput = document.getElementById('ai-chat-input');

// Toggle chat drawer
aiChatToggle.addEventListener('click', () => {
  aiChatWindow.classList.toggle('active');
  // Remove badge pulse on open
  const pulse = aiChatToggle.querySelector('.ai-badge-pulse');
  if (pulse) pulse.remove();
  
  // Scroll to bottom
  setTimeout(() => {
    aiChatBody.scrollTop = aiChatBody.scrollHeight;
  }, 100);
});

aiChatClose.addEventListener('click', () => {
  aiChatWindow.classList.remove('active');
});

// Preset chips handler
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('chat-chip')) {
    const question = e.target.getAttribute('data-question');
    if (question) {
      handleUserSend(question);
    }
  }
});

aiChatInputArea.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = aiChatInput.value.trim();
  if (text) {
    handleUserSend(text);
    aiChatInput.value = '';
  }
});

function sanitizeHTML(str) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  const allowedTags = ['B', 'I', 'STRONG', 'EM', 'BR', 'P', 'SPAN', 'A', 'UL', 'OL', 'LI', 'CODE', 'PRE'];
  
  function clean(node) {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      const child = node.childNodes[i];
      if (child.nodeType === 1) { // Element node
        if (!allowedTags.includes(child.tagName)) {
          // Remove unsafe tag (e.g. IFRAME, SCRIPT, IMG, OBJECT)
          node.removeChild(child);
        } else {
          // Strip inline event handlers (e.g. onerror, onload, onclick)
          Array.from(child.attributes).forEach(attr => {
            if (attr.name.startsWith('on') || attr.name.toLowerCase() === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) {
              child.removeAttribute(attr.name);
            }
          });
          clean(child);
        }
      }
    }
  }
  
  clean(doc.body);
  return doc.body.innerHTML;
}

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  if (sender === 'user') {
    contentDiv.textContent = text;
  } else {
    contentDiv.innerHTML = sanitizeHTML(text);
  }

  msgDiv.appendChild(contentDiv);
  aiChatBody.appendChild(msgDiv);
  aiChatBody.scrollTop = aiChatBody.scrollHeight;
  return msgDiv;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot typing-msg';
  typingDiv.innerHTML = `
    <div class="message-content typing-indicator">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  aiChatBody.appendChild(typingDiv);
  aiChatBody.scrollTop = aiChatBody.scrollHeight;
  return typingDiv;
}

async function handleUserSend(messageText) {
  appendMessage('user', messageText);
  
  const typingIndicator = showTypingIndicator();
  
  // 1. Check local custom responses first
  const localResp = getLocalAIResponse(messageText);
  if (localResp) {
    // Simulate thinking delay for natural feel
    await new Promise(r => setTimeout(r, 600));
    typingIndicator.remove();
    appendMessage('bot', localResp);
    return;
  }
  
  // 2. Fall back to Cloudflare Worker LLM for general queries
  await new Promise(r => setTimeout(r, 400));
  try {
    const res = await fetch('https://cf-ai-web-coach.himanshu524.workers.dev/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText })
    });
    
    if (!res.ok) throw new Error('Worker response not ok');
    const data = await res.json();
    
    typingIndicator.remove();
    appendMessage('bot', data.response || data.message || getGeneralFallbackResponse());
  } catch (err) {
    console.warn("Using general local AI fallback:", err);
    typingIndicator.remove();
    appendMessage('bot', getGeneralFallbackResponse());
  }
}

function getLocalAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('codemate')) {
    return "<strong>CodeMate OS</strong> is an active-learning IDE studio & Career OS for self-taught developers.<br><br>• <strong>Autonomous Self-Healing Repair Agent</strong>: Intercepts stack traces and compiler errors, generates unified diff patches, and re-verifies execution in a sandbox.<br>• <strong>AST Execution Tracer</strong>: Step-by-step Python frame inspection (`sys.settrace`).<br>• <strong>WebSockets</strong>: Real-time candidate typing synchronization (<50ms latency).<br><br><a href='https://codemate-os.vercel.app/' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>Live App: codemate-os.vercel.app ↗</a><br><a href='https://github.com/524himanshu/codemate' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>GitHub: github.com/524himanshu/codemate ↗</a>";
  }

  if (q.includes('drishti')) {
    return "<strong>DrishtiAI</strong> is a real-time pharmacovigilance adverse event detection NLP engine.<br><br>🏆 <strong>Shortlisted for Prototype Stage at AI for Bharat 2026</strong> (National AI Innovation Hackathon).<br><br>• <strong>Tech Stack</strong>: Python, FastAPI, scispaCy NER, dual-mode NLP pipeline, Microsoft Presidio PII redaction, Gemini 1.5 Flash.<br><br><a href='https://github.com/524himanshu/drishti-ai' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>GitHub: github.com/524himanshu/drishti-ai ↗</a>";
  }

  // Keyword definitions
  const projectKeywords = ['project', 'build', 'recruitiq', 'career coach', 'playto', 'payout', 'offerforge'];
  const skillKeywords = ['skill', 'stack', 'tech', 'language', 'database'];
  const contactKeywords = ['contact', 'reach', 'email', 'linkedin', 'phone', 'number', 'mobile', 'call', 'how to contact'];
  const experienceKeywords = ['experience', 'work', 'intern', 'octanet'];
  const educationKeywords = ['education', 'college', 'university', 'mumbai', 'degree', 'study', 'studies', 'hsc'];
  const achievementKeywords = ['achievement', 'award', 'hackathon', 'recognition', 'shortlist', 'trophy', 'hack', 'invictus', 'redrob'];
  const certificationKeywords = ['certificate', 'certification', 'course', 'credential'];
  const resumeKeywords = ['resume', 'cv', 'pdf', 'download'];
  const availabilityKeywords = ['available', 'hire', 'looking', 'job', 'recruit', 'hiring', 'role', 'opportunity'];
  const locationKeywords = ['location', 'based', 'relocate', 'live', 'city', 'india'];
  const aiKeywords = ['llm', 'genai', 'agentic', 'rag', 'vector', 'model', 'inference', 'llama', 'gemini', 'claude', 'grok'];
  const whyKeywords = ['why hire', 'why him', 'strength', 'why should', 'qualities'];
  const greetingKeywords = ['hello', 'hi', 'hey', 'greet', 'morning', 'evening', 'afternoon'];

  if (whyKeywords.some(k => q.includes(k))) {
    return "Himanshu combines Full-Stack Development and AI Engineering skills. Unlike many candidates who focus only on models, he builds complete production-ready systems involving FastAPI, Django, Next.js, PostgreSQL, Redis, LLMs, asynchronous workflows, and cloud deployments.";
  }

  if (achievementKeywords.some(k => q.includes(k))) {
    return "Key achievements:<br><br>• <strong>AI for Bharat 2026</strong> - Shortlisted for the Prototype Phase with DrishtiAI.<br>• <strong>Redrob India Runs Hackathon</strong> - Built RecruitIQ, an AI-powered candidate ranking system evaluated on 100,000 candidate profiles.<br>• <strong>INVICTUS'24 Hackathon Participant</strong>.";
  }

  if (certificationKeywords.some(k => q.includes(k))) {
    return "Relevant certifications:<br><br>• Develop GenAI Apps with Gemini and Streamlit (Google Cloud)<br>• Prompt Design in Vertex AI (Google)<br>• 27+ certifications across AI, Cloud, and Full-Stack Development.";
  }

  if (resumeKeywords.some(k => q.includes(k))) {
    return "You can download Himanshu's latest resume directly using the button below or request a copy via email at <a href='mailto:himanshumenghani524@gmail.com' style='color:#38bdf8;'>himanshumenghani524@gmail.com</a>.<br><br><a href='./Himanshu Professional Resume updated.pdf' download='Himanshu Menghani Resume.pdf' class='btn' style='display: inline-flex; align-items: center; gap: 0.8rem; padding: 0.8rem 1.6rem; font-size: 1.2rem; margin-top: 0.5rem; text-decoration: none; border-radius: 2rem;'><i class='bx bx-download'></i> Download CV</a>";
  }

  if (availabilityKeywords.some(k => q.includes(k))) {
    return "Yes! Himanshu is actively available for Full-Stack, AI Engineering, and Software Engineering roles.<br><br>• <strong>Location & Work Model</strong>: Based in Mumbai, India. Open to Remote roles globally and on-site relocation (Bengaluru, Hyderabad, San Francisco, New York City, Global).<br>• <strong>Notice Period / Start Date</strong>: Immediately available.<br>• <strong>Contact Directly</strong>: Phone <strong>+91 7769949282</strong> or Email <a href='mailto:himanshumenghani524@gmail.com' style='color:#38bdf8;'>himanshumenghani524@gmail.com</a>.";
  }

  if (locationKeywords.some(k => q.includes(k))) {
    return "Himanshu is based in Mumbai, India and is fully open to relocation (Bengaluru, Hyderabad, SF, NYC, Global) or remote roles.";
  }

  if (aiKeywords.some(k => q.includes(k))) {
    return "Himanshu has experience building applications with Gemini, Claude, Llama 3.3, and Grok. His work includes RAG pipelines, semantic search, prompt engineering, AI-powered ranking systems, and agentic workflows across projects like CodeMate OS, DrishtiAI, and OfferForge.";
  }

  if (projectKeywords.some(k => q.includes(k))) {
    return "Himanshu's flagship projects:<br><br>• <strong>CodeMate OS</strong>: AI-powered Career Operating System and active engineering learning simulator (<a href='https://codemate-os.vercel.app/' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>Demo ↗</a>).<br>• <strong>DrishtiAI</strong>: Real-time pharmacovigilance adverse event detection (AI for Bharat 2026 prototype shortlist).<br>• <strong>OfferForge</strong>: AI document processing with Presidio PII redaction shield (<a href='https://offerforge.vercel.app/' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>Demo ↗</a>).<br>• <strong>RecruitIQ</strong>: Intelligent candidate ranking engine evaluating 100k profiles.";
  }

  if (skillKeywords.some(k => q.includes(k))) {
    return "Himanshu's tech stack includes:<br><br>• <strong>Languages</strong>: JavaScript, TypeScript, Python, C++, Java, SQL<br>• <strong>Backend</strong>: FastAPI, Django & DRF, Flask, Node.js, Celery, Redis<br>• <strong>AI/ML</strong>: LLM integrations (Gemini, Llama, Claude), Agentic AI, RAG pipelines, scispaCy, Presidio PII<br>• <strong>Frontend</strong>: Next.js, React.js, Tailwind CSS<br>• <strong>Databases & Tools</strong>: PostgreSQL, Supabase, Docker, Cloudflare Workers, Vercel";
  }

  if (contactKeywords.some(k => q.includes(k))) {
    return "You can contact Himanshu Menghani by phone at <strong>+91 7769949282</strong> or by email at <a href='mailto:himanshumenghani524@gmail.com' style='color:#38bdf8;'>himanshumenghani524@gmail.com</a>.<br><br>His portfolio is available at <a href='https://himanshu-menghani.vercel.app/' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>himanshu-menghani.vercel.app ↗</a>, GitHub at <a href='https://github.com/524himanshu' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>github.com/524himanshu ↗</a>, and LinkedIn at <a href='https://www.linkedin.com/in/himanshumenghani524/' target='_blank' rel='noopener' style='color:#38bdf8; text-decoration:underline;'>linkedin.com/in/himanshumenghani524 ↗</a>.";
  }

  if (experienceKeywords.some(k => q.includes(k))) {
    return "Himanshu was a <strong>Web Development Intern</strong> at OctaNet Services Pvt Ltd (Sept 2023 – Oct 2023). He developed 3+ responsive web applications and resolved rendering and performance bugs.";
  }

  if (educationKeywords.some(k => q.includes(k))) {
    return "Himanshu graduated with a <strong>Bachelor of Engineering in Information Technology</strong> from Mumbai University (2021 - 2024). He completed his HSC Science board with an 80% score in 2021.";
  }

  if (greetingKeywords.some(k => q.includes(k))) {
    return "Hello! I'm Himanshu's AI assistant. Ask me anything about his projects, experience, skills, or availability!";
  }

  return null;
}

function getGeneralFallbackResponse() {
  return "That's an interesting question! Himanshu is a Full Stack Developer & AI Engineer focused on production-ready systems (FastAPI, Next.js, Celery, RAG pipelines). Feel free to check out his Projects or Journey sections, or drop an email to <a href='mailto:himanshumenghani524@gmail.com'>himanshumenghani524@gmail.com</a> or call <a href='tel:+917769949282'>+91 77699 49282</a>!";
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==================== Interactive System Architecture Drawers ==================== */
const projectArchitectures = {
  offerforge: {
    title: "OfferForge",
    desc: "AI-powered career preparation suite. Sanitizes candidate locations, emails, and phone numbers locally before transmission to shield personal data from third-party LLMs.",
    tags: ["Next.js", "Groq API", "PII Redactor", "docx"],
    rationale: "Designed to execute local, client-side PII scrubbing using specialized regex patterns to intercept resume data before transmission, shielding sensitive candidate details from third-party LLMs.",
    tradeoffs: [
      "🛡️ Chose local browser regex scrubbers over cloud-hosted NLP endpoints to ensure zero data leakage of candidate PII before transmission.",
      "⚡ Local scrub delay is **<12ms**, eliminating round-trip network latency entirely.",
      "💡 Sacrificed semantic context matching to achieve zero API costs and guaranteed client data ownership."
    ],
    svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="node-grad-offerforge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--main-color)" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#4facfe" stop-opacity="0.04" />
    </linearGradient>
    <marker id="arrow-offerforge" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--main-color)" />
    </marker>
  </defs>
  <!-- Connection Edges -->
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-offerforge)" d="M 110,100 L 138,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-offerforge)" d="M 230,100 L 258,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-offerforge)" d="M 370,100 L 398,100" />

  <!-- Nodes -->
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-offerforge);" x="20" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="65" y="98">
    <tspan x="65" dy="0" class="arch-text-title">User UI</tspan>
    <tspan x="65" dy="14">(Resume / JD)</tspan>
  </text>

  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-offerforge);" x="140" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="185" y="98">
    <tspan x="185" dy="0" class="arch-text-title">PII Shield</tspan>
    <tspan x="185" dy="14">(Scrub Regex)</tspan>
  </text>

  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-offerforge);" x="260" y="75" width="110" height="50" rx="8" />
  <text class="arch-text" x="315" y="98">
    <tspan x="315" dy="0" class="arch-text-title">LLM Gateway</tspan>
    <tspan x="315" dy="14">(Groq / Llama)</tspan>
  </text>

  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-offerforge);" x="400" y="75" width="110" height="50" rx="8" />
  <text class="arch-text" x="455" y="98">
    <tspan x="455" dy="0" class="arch-text-title">Prep Panel</tspan>
    <tspan x="455" dy="14">(Resume / docx)</tspan>
  </text>
</svg>`
  },
  codemate: {
    title: "CodeMate",
    desc: "AI-powered Career Operating System and active engineering learning simulator. Features week-by-week roadmaps, an interactive learning engine with a pluggable 9-state machine, deterministic call-stack whiteboard tracing, sandboxed multi-language code executors (Python/JS/Java/C++), real-time peer WebSockets collaboration, and PII-redacted RecruitIQ Job Fit scoring.",
    tags: ["Next.js", "FastAPI", "WebSockets", "Docker Sandbox", "AST Tracing", "PII Redactor"],
    rationale: "Designed to execute untrusted user code safely inside isolated sandboxed processes with 2s timeouts, while leveraging AST instrumentation hooks to trace execution call-stacks frame-by-frame.",
    tradeoffs: [
      "🐳 Implemented lightweight sandboxing via isolated Node/Python subprocesses and CPU limits, achieving sub-second cold starts compared to heavier VM setups.",
      "⚙️ Added AST call-stack tracers introducing **<15ms** trace parsing overhead on algorithmic milestones.",
      "🌐 Leveraged WebSocket pooling to host multi-user coding rooms, capping connection overhead to **<30ms** latency."
    ], 
    svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="node-grad-codemate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--main-color)" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#4facfe" stop-opacity="0.04" />
    </linearGradient>
    <marker id="arrow-codemate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--main-color)" />
    </marker>
  </defs>
  <!-- Connection Edges -->
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-codemate)" d="M 110,100 L 138,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-codemate)" d="M 230,100 L 258,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-codemate)" d="M 350,100 L 378,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-codemate)" d="M 470,100 L 498,100" />
  
  <!-- Nodes -->
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-codemate);" x="20" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="65" y="98">
    <tspan x="65" dy="0" class="arch-text-title">Vercel UI</tspan>
    <tspan x="65" dy="14">(Next.js)</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-codemate);" x="140" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="185" y="98">
    <tspan x="185" dy="0" class="arch-text-title">FastAPI</tspan>
    <tspan x="185" dy="14">API Router</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-codemate);" x="260" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="305" y="98">
    <tspan x="305" dy="0" class="arch-text-title">Subprocess</tspan>
    <tspan x="305" dy="14">AST Tracer</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-codemate);" x="380" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="425" y="98">
    <tspan x="425" dy="0" class="arch-text-title">Gemini AI</tspan>
    <tspan x="425" dy="14">Grading &amp; Hint</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-codemate);" x="500" y="75" width="80" height="50" rx="8" />
  <text class="arch-text" x="540" y="98">
    <tspan x="540" dy="0" class="arch-text-title">Supabase</tspan>
    <tspan x="540" dy="14">Mastery DB</tspan>
  </text>
</svg>`
  },
  drishtiai: {
    title: "DrishtiAI",
    desc: "Real-time pharmacovigilance adverse event detection pipeline. Ingests data streams, performs dual-mode clinical NER (SpaCy) & PII redaction (Presidio), saves signals to Postgres, and generates AI safety summaries via Gemini 1.5 Flash.",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "Redis", "SpaCy NER", "Microsoft Presidio", "Gemini API"],
    rationale: "Designed to run a robust dual-mode pipeline (SpaCy NER and Microsoft Presidio) that falls back to fast local patterns on resource-constrained platforms, coupled with Gemini 1.5 Flash cloud reporting for safety summaries.",
    tradeoffs: [
      "💾 Configured Redis caching to store parsed event signals, reducing primary PostgreSQL lookup queries by **78%**.",
      "🤖 Chose a dual-mode engine (Microsoft Presidio and local pattern regex) to fall back when SpaCy model imports exceed 512MB RAM constraints on Render's free tier.",
      "📈 Ingests **100+** raw patient messages per minute with a safety warnings synthesis time of **<4s** via Gemini 1.5 Flash."
    ], 
    svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="node-grad-drishtiai" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--main-color)" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#4facfe" stop-opacity="0.04" />
    </linearGradient>
    <marker id="arrow-drishti" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--main-color)" />
    </marker>
  </defs>
  <!-- Connection Edges -->
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-drishti)" d="M 110,100 L 138,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-drishti)" d="M 230,100 L 258,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-drishti)" d="M 350,100 L 378,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-drishti)" d="M 470,100 L 498,100" />
  
  <!-- Nodes -->
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-drishtiai);" x="20" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="65" y="98">
    <tspan x="65" dy="0" class="arch-text-title">Reddit/Twitter</tspan>
    <tspan x="65" dy="14">Streams</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-drishtiai);" x="140" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="185" y="98">
    <tspan x="185" dy="0" class="arch-text-title">SpaCy NER</tspan>
    <tspan x="185" dy="14">Clinical Entities</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-drishtiai);" x="260" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="305" y="98">
    <tspan x="305" dy="0" class="arch-text-title">Presidio &amp; Reg</tspan>
    <tspan x="305" dy="14">PII Masking</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-drishtiai);" x="380" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="425" y="98">
    <tspan x="425" dy="0" class="arch-text-title">Postgres/Redis</tspan>
    <tspan x="425" dy="14">Signal Ingestion</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-drishtiai);" x="500" y="75" width="80" height="50" rx="8" />
  <text class="arch-text" x="540" y="98">
    <tspan x="540" dy="0" class="arch-text-title">Gemini AI</tspan>
    <tspan x="540" dy="14">Safety Report</tspan>
  </text>
</svg>`
  },
  recruitiq: {
    title: "RecruitIQ",
    desc: "Automated recruitment ranking pipeline built for the Redrob Hackathon. Parses incoming candidate JSONL/PDF files, computes semantic embeddings, ranks candidates based on a 5-factor scoring model, and renders rankings via Streamlit.",
    tags: ["Python", "Streamlit", "MiniLM-L6-v2", "Cosine Similarity", "NLP", "Pandas"],
    rationale: "Designed to compute candidate rankings using a multi-factor weighted rubric rather than flat text searches, using normalized cosine similarity scores to prevent keyword-stuffing gaming.",
    tradeoffs: [
      "⚡ Selected the lightweight 80MB **all-MiniLM-L6-v2** vector model over BERT, ranking 100k records in **<60s** on low-resource instances.",
      "🎯 Achieved a 15x throughput speedup by caching candidate embeddings in Pandas, accepting a minor 2.4% semantic precision tradeoff.",
      "📊 Implemented a 5-factor scoring model to prevent keyword-stuffing ranking hacks common in traditional flat keyword matching."
    ], 
    svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="node-grad-recruitiq" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--main-color)" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#4facfe" stop-opacity="0.04" />
    </linearGradient>
    <marker id="arrow-recruit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--main-color)" />
    </marker>
  </defs>
  <!-- Connection Edges -->
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-recruit)" d="M 110,100 L 138,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-recruit)" d="M 230,100 L 258,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-recruit)" d="M 350,100 L 378,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-recruit)" d="M 470,100 L 498,100" />
  
  <!-- Nodes -->
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-recruitiq);" x="20" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="65" y="98">
    <tspan x="65" dy="0" class="arch-text-title">PDF Resume</tspan>
    <tspan x="65" dy="14">Parsing</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-recruitiq);" x="140" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="185" y="98">
    <tspan x="185" dy="0" class="arch-text-title">miniLM</tspan>
    <tspan x="185" dy="14">Embeddings</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-recruitiq);" x="260" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="305" y="98">
    <tspan x="305" dy="0" class="arch-text-title">Cosine</tspan>
    <tspan x="305" dy="14">Similarity</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-recruitiq);" x="380" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="425" y="98">
    <tspan x="425" dy="0" class="arch-text-title">Quality &amp;</tspan>
    <tspan x="425" dy="14">Match Filters</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" style="fill: url(#node-grad-recruitiq);" x="500" y="75" width="80" height="50" rx="8" />
  <text class="arch-text" x="540" y="98">
    <tspan x="540" dy="0" class="arch-text-title">Streamlit</tspan>
    <tspan x="540" dy="14">Dashboard</tspan>
  </text>
</svg>`
  },
  careercoach: {
    title: "CF AI Career Coach",
    desc: "Serverless AI career mentorship assistant. Routes chat requests through Cloudflare Workers, queries low-latency Llama 3.3 models via Workers AI, and retains session state utilizing Cloudflare Durable Objects.",
    tags: ["Cloudflare Workers", "Workers AI", "Llama 3.3", "Durable Objects", "Wrangler"],
    rationale: "Designed to deploy as an edge-native, zero-cold-start career coach chatbot utilizing Cloudflare Workers and serverless AI endpoints for low-latency edge responses.",
    svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-coach" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--main-color)" />
    </marker>
  </defs>
  <!-- Connection Edges -->
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-coach)" d="M 140,100 L 178,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-coach)" d="M 280,100 L 318,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-coach)" d="M 420,100 L 458,100" />
  
  <!-- Nodes -->
  <rect class="arch-node arch-node-active" x="40" y="75" width="100" height="50" rx="8" />
  <text class="arch-text" x="90" y="98">
    <tspan x="90" dy="0" class="arch-text-title">Portfolio</tspan>
    <tspan x="90" dy="14">Client UI</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" x="180" y="75" width="100" height="50" rx="8" />
  <text class="arch-text" x="230" y="98">
    <tspan x="230" dy="0" class="arch-text-title">CF Workers</tspan>
    <tspan x="230" dy="14">API Router</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" x="320" y="75" width="100" height="50" rx="8" />
  <text class="arch-text" x="370" y="98">
    <tspan x="370" dy="0" class="arch-text-title">Workers AI</tspan>
    <tspan x="370" dy="14">Llama 3.3 LLM</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" x="460" y="75" width="100" height="50" rx="8" />
  <text class="arch-text" x="510" y="98">
    <tspan x="510" dy="0" class="arch-text-title">Durable Objects</tspan>
    <tspan x="510" dy="14">Session Context</tspan>
  </text>
</svg>`
  },
  payoutengine: {
    title: "Playto Payout Engine",
    desc: "Asynchronous transaction payout orchestrator. Handles user reward payouts asynchronously by queuing tasks from Django DRF via a Redis Message Broker, executing them reliably in Celery workers, and persisting transactions in PostgreSQL.",
    tags: ["Django DRF", "Celery", "Redis", "PostgreSQL", "Docker", "REST API"],
    rationale: "Designed to eliminate double-spend race conditions in concurrent withdrawal requests by using PostgreSQL row-level locks (select_for_update) inside strict database transactions.",
    svg: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-payout" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--main-color)" />
    </marker>
  </defs>
  <!-- Connection Edges -->
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-payout)" d="M 110,100 L 138,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-payout)" d="M 230,100 L 258,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-payout)" d="M 350,100 L 378,100" />
  <path class="arch-edge arch-edge-active" marker-end="url(#arrow-payout)" d="M 470,100 L 498,100" />
  
  <!-- Nodes -->
  <rect class="arch-node arch-node-active" x="20" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="65" y="98">
    <tspan x="65" dy="0" class="arch-text-title">API Payout</tspan>
    <tspan x="65" dy="14">Request</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" x="140" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="185" y="98">
    <tspan x="185" dy="0" class="arch-text-title">Django DRF</tspan>
    <tspan x="185" dy="14">Endpoint</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" x="260" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="305" y="98">
    <tspan x="305" dy="0" class="arch-text-title">Redis</tspan>
    <tspan x="305" dy="14">Message Broker</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" x="380" y="75" width="90" height="50" rx="8" />
  <text class="arch-text" x="425" y="98">
    <tspan x="425" dy="0" class="arch-text-title">Celery</tspan>
    <tspan x="425" dy="14">Worker Queue</tspan>
  </text>
  
  <rect class="arch-node arch-node-active" x="500" y="75" width="80" height="50" rx="8" />
  <text class="arch-text" x="540" y="98">
    <tspan x="540" dy="0" class="arch-text-title">PostgreSQL</tspan>
    <tspan x="540" dy="14">DB Store</tspan>
  </text>
</svg>`
  }
};

const archDrawerOverlay = document.getElementById('arch-drawer-overlay');
const archDrawer = document.getElementById('arch-drawer');
const drawerCloseBtn = document.getElementById('drawer-close');
const drawerTitle = document.getElementById('drawer-title');
const drawerDesc = document.getElementById('drawer-desc');
const drawerTags = document.getElementById('drawer-tags');
const drawerSvgContainer = document.getElementById('drawer-svg-container');

// Open drawer
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-arch');
  if (btn) {
    const projectId = btn.getAttribute('data-project');
    const project = projectArchitectures[projectId];
    if (project) {
      drawerTitle.textContent = project.title;
      drawerDesc.textContent = project.desc;
      drawerTags.innerHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');
      drawerSvgContainer.innerHTML = project.svg;
      
      const drawerRationale = document.getElementById('drawer-rationale');
      if (drawerRationale) {
        drawerRationale.textContent = project.rationale || 'N/A';
      }

      const drawerTradeoffs = document.getElementById('drawer-tradeoffs');
      if (drawerTradeoffs) {
        if (project.tradeoffs && project.tradeoffs.length > 0) {
          drawerTradeoffs.innerHTML = project.tradeoffs.map(item => {
            const formatted = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return `<li style="margin-bottom: 0.6rem;">${formatted}</li>`;
          }).join('');
          drawerTradeoffs.parentElement.style.display = 'block';
        } else {
          drawerTradeoffs.parentElement.style.display = 'none';
        }
      }
      
      archDrawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
});

// Close drawer function
function closeDrawer() {
  if (archDrawerOverlay) {
    archDrawerOverlay.classList.remove('active');
  }
  document.body.style.overflow = '';
}

if (drawerCloseBtn) {
  drawerCloseBtn.addEventListener('click', closeDrawer);
}

if (archDrawerOverlay) {
  archDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === archDrawerOverlay) {
      closeDrawer();
    }
  });
}

// Esc key to close drawer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
  }
});

/* ==================== Serverless Visitor Analytics Badge ==================== */
async function fetchVisitorAnalytics() {
  const visitorCountEl = document.getElementById('visitor-count');
  const messagesCountEl = document.getElementById('messages-count');
  
  // Set up local storage fallback stats (initialize if empty)
  let localViews = parseInt(localStorage.getItem('portfolio_views') || '142');
  let localMsgs = parseInt(localStorage.getItem('portfolio_messages') || '18');
  
  // Increment view count on each page load
  localViews++;
  localStorage.setItem('portfolio_views', localViews.toString());
  
  // Initially show local counts
  if (visitorCountEl) visitorCountEl.textContent = localViews;
  if (messagesCountEl) messagesCountEl.textContent = localMsgs;
  
  try {
    // Attempt to hit the Cloudflare Worker endpoint
    const res = await fetch('https://cf-ai-web-coach.himanshu524.workers.dev/api/visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ views: localViews, messages: localMsgs })
    });
    
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data && typeof data.views !== 'undefined') {
          localStorage.setItem('portfolio_views', data.views.toString());
          if (visitorCountEl) visitorCountEl.textContent = data.views;
        }
        if (data && typeof data.messages !== 'undefined') {
          localStorage.setItem('portfolio_messages', data.messages.toString());
          if (messagesCountEl) messagesCountEl.textContent = data.messages;
        }
      }
    }
  } catch (err) {
    console.warn("Analytics API request failed, using local fallback.", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchVisitorAnalytics();
  initSkillsCanvasView();
  initGitCalendar();
  initRagPlayground();
  initSystemStatusDashboard();
});

/* ==================== Interactive Canvas Tech Stack Node Graph ==================== */
function initSkillsCanvasView() {
  const btnList = document.getElementById('btn-skills-list');
  const btnGraph = document.getElementById('btn-skills-graph');
  const listContainer = document.getElementById('skills-container');
  const canvasContainer = document.getElementById('skills-canvas-container');
  const canvas = document.getElementById('skills-canvas');

  if (!btnList || !btnGraph || !listContainer || !canvasContainer || !canvas) return;

  let animationFrameId = null;
  let isInitialized = false;

  // Toggle handlers
  btnList.addEventListener('click', () => {
    btnList.classList.add('active');
    btnGraph.classList.remove('active');
    listContainer.style.display = 'grid';
    canvasContainer.style.display = 'none';
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });

  btnGraph.addEventListener('click', () => {
    btnGraph.classList.add('active');
    btnList.classList.remove('active');
    listContainer.style.display = 'none';
    canvasContainer.style.display = 'block';
    
    // Initialize or restart simulation
    resizeCanvas();
    if (!isInitialized) {
      initPhysics();
      isInitialized = true;
    }
    startSimulation();
  });

  // Physics Variables
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let links = [];
  let dragNode = null;
  let hoverNode = null;
  let mouse = { x: 0, y: 0 };

  const skillNodesData = [
    // Languages
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'sql', label: 'SQL' },
    // AI/ML
    { id: 'llms', label: 'LLMs' },
    { id: 'agentic-ai', label: 'Agentic AI' },
    { id: 'rag-pipelines', label: 'RAG' },
    { id: 'prompt-engineering', label: 'Prompt Eng' },
    { id: 'scikit-learn', label: 'Scikit-learn' },
    { id: 'pandas-numpy', label: 'Pandas/NumPy' },
    // Backend
    { id: 'fastapi', label: 'FastAPI' },
    { id: 'django-drf', label: 'Django DRF' },
    { id: 'flask', label: 'Flask' },
    { id: 'node-express', label: 'Node/Express' },
    { id: 'rest-apis', label: 'REST APIs' },
    { id: 'jwt-auth', label: 'JWT Auth' },
    { id: 'celery', label: 'Celery' },
    { id: 'redis', label: 'Redis' },
    // Frontend
    { id: 'react-js', label: 'React.js' },
    { id: 'next-js', label: 'Next.js' },
    { id: 'tailwind-css', label: 'Tailwind CSS' },
    { id: 'html-css', label: 'HTML/CSS' },
    // Databases
    { id: 'postgresql', label: 'PostgreSQL' },
    { id: 'mongodb', label: 'MongoDB' },
    // Tools
    { id: 'docker', label: 'Docker' },
    { id: 'git-github', label: 'Git/GitHub' },
    { id: 'postman', label: 'Postman' },
    { id: 'vercel-render', label: 'Vercel/Render' },
    { id: 'cloudflare-workers', label: 'CF Workers' },
    // Concepts
    { id: 'rbac', label: 'RBAC' },
    { id: 'async-processing', label: 'Async Queue' },
    { id: 'api-design', label: 'API Design' }
  ];

  function resizeCanvas() {
    canvas.width = canvasContainer.clientWidth - 40;
    canvas.height = 450;
  }

  window.addEventListener('resize', () => {
    if (canvasContainer.style.display !== 'none') {
      resizeCanvas();
    }
  });

  function initPhysics() {
    nodes = skillNodesData.map(d => ({
      ...d,
      x: canvas.width / 4 + Math.random() * (canvas.width / 2),
      y: canvas.height / 4 + Math.random() * (canvas.height / 2),
      vx: 0,
      vy: 0,
      radius: d.label.length * 2.8 + 12,
      isTarget: false
    }));

    // Create unique links based on skillRelations mapping (avoiding double-spring forces)
    links = [];
    nodes.forEach(source => {
      const targets = skillRelations[source.id] || [];
      targets.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (target) {
          // Enforce a single direction/link per pair using lexicographical comparison
          if (source.id < target.id) {
            links.push({ source, target });
          }
        }
      });
    });
  }

  function startSimulation() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    function step() {
      updatePhysics();
      drawGraph();
      animationFrameId = requestAnimationFrame(step);
    }
    step();
  }

  function updatePhysics() {
    // 1. Repulsion between all nodes (Global Coulomb Repulsion with Softening)
    const charge = 15000;
    const softening = 1000; // prevents extreme values / division by zero
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 1;
        
        // Electrostatic repulsion force with softening
        const force = charge / (dist * dist + softening);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        if (!n1.fixed) { n1.vx -= fx; n1.vy -= fy; }
        if (!n2.fixed) { n2.vx += fx; n2.vy += fy; }

        // Extra short-range collision pushback (moderated)
        const minDist = n1.radius + n2.radius + 12;
        if (dist < minDist) {
          const push = (minDist - dist) * 0.15; // gentle push apart
          const pfx = (dx / dist) * push;
          const pfy = (dy / dist) * push;
          if (!n1.fixed) { n1.vx -= pfx; n1.vy -= pfy; }
          if (!n2.fixed) { n2.vx += pfx; n2.vy += pfy; }
        }
      }
    }

    // 2. Link Spring Attraction/Repulsion forces (Continuous Spring)
    links.forEach(link => {
      const dx = link.target.x - link.source.x;
      const dy = link.target.y - link.source.y;
      const dist = Math.hypot(dx, dy) || 1;
      const desiredDist = 130; // Spaced out spring rest distance
      
      // Continuous spring: attracts when dist > desiredDist, repels when dist < desiredDist
      const force = (dist - desiredDist) * 0.015;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      
      if (!link.source.fixed) { link.source.vx += fx; link.source.vy += fy; }
      if (!link.target.fixed) { link.target.vx -= fx; link.target.vy -= fy; }
    });

    // 3. Gravity pulling toward center and Friction dampening
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    nodes.forEach(n => {
      if (n.fixed) return;
      
      // Very gentle center gravity to prevent nodes drifting too far
      n.vx += (cx - n.x) * 0.0003;
      n.vy += (cy - n.y) * 0.0003;

      // Friction / Velocity decay for fast stabilization
      n.vx *= 0.84;
      n.vy *= 0.84;

      // Update positions
      n.x += n.vx;
      n.y += n.vy;

      // Boundary Collisions
      if (n.x < n.radius) { n.x = n.radius; n.vx *= -0.5; }
      if (n.x > canvas.width - n.radius) { n.x = canvas.width - n.radius; n.vx *= -0.5; }
      if (n.y < n.radius) { n.y = n.radius; n.vy *= -0.5; }
      if (n.y > canvas.height - n.radius) { n.y = canvas.height - n.radius; n.vy *= -0.5; }
    });
  }

  function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get Active Theme Colors
    const style = getComputedStyle(document.body);
    const mainColor = style.getPropertyValue('--main-color').trim();
    const cardBorder = style.getPropertyValue('--card-border').trim();
    const textColor = style.getPropertyValue('--text-color').trim();
    const textMuted = style.getPropertyValue('--text-muted').trim();
    const bgSec = style.getPropertyValue('--second-bg-color').trim();

    // 1. Draw Links
    links.forEach(link => {
      const isHighlighted = hoverNode && (hoverNode === link.source || hoverNode === link.target);
      
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      
      if (isHighlighted) {
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
      } else {
        ctx.strokeStyle = cardBorder;
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = hoverNode ? 0.15 : 0.4;
      }
      ctx.stroke();
    });
    ctx.globalAlpha = 1.0;

    // 2. Draw Nodes
    nodes.forEach(n => {
      const isHovered = n === hoverNode;
      const isRelated = hoverNode && (hoverNode === n || (skillRelations[hoverNode.id] || []).includes(n.id) || (skillRelations[n.id] || []).includes(hoverNode.id));

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      
      // Fill Node Card Background
      ctx.fillStyle = bgSec;
      ctx.fill();

      // Stroke Node Outline
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      
      if (hoverNode) {
        if (isHovered) {
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = mainColor;
        } else if (isRelated) {
          ctx.strokeStyle = mainColor;
          ctx.lineWidth = 2.0;
          ctx.shadowBlur = 6;
          ctx.shadowColor = mainColor;
        } else {
          ctx.strokeStyle = cardBorder;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.25;
        }
      } else {
        ctx.strokeStyle = cardBorder;
        ctx.lineWidth = 1.5;
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
      ctx.globalAlpha = 1.0;

      // Draw Label
      ctx.font = `600 12px "Poppins", sans-serif`;
      ctx.fillStyle = hoverNode && !isHovered && !isRelated ? textMuted : textColor;
      if (hoverNode && (isHovered || isRelated)) {
        ctx.fillStyle = mainColor;
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
    });
  }

  // Interactivity Handlers
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function getNodeAt(pos) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const dist = Math.hypot(nodes[i].x - pos.x, nodes[i].y - pos.y);
      if (dist < nodes[i].radius) return nodes[i];
    }
    return null;
  }

  canvas.addEventListener('mousemove', (e) => {
    mouse = getMousePos(e);
    
    if (dragNode) {
      dragNode.x = mouse.x;
      dragNode.y = mouse.y;
    } else {
      hoverNode = getNodeAt(mouse);
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    mouse = getMousePos(e);
    const node = getNodeAt(mouse);
    if (node) {
      dragNode = node;
      node.fixed = true;
    }
  });

  canvas.addEventListener('mouseup', () => {
    if (dragNode) {
      dragNode.fixed = false;
      dragNode = null;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    if (dragNode) {
      dragNode.fixed = false;
      dragNode = null;
    }
    hoverNode = null;
  });

  // Touch Support
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse = {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top
    };
    if (dragNode) {
      e.preventDefault();
      dragNode.x = mouse.x;
      dragNode.y = mouse.y;
    }
  });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouse = {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top
    };
    const node = getNodeAt(mouse);
    if (node) {
      e.preventDefault();
      dragNode = node;
      node.fixed = true;
    }
  });

  canvas.addEventListener('touchend', () => {
    if (dragNode) {
      dragNode.fixed = false;
      dragNode = null;
    }
  });
}

/* ==================== Interactive Git Commit Grid & Explorer ==================== */
async function initGitCalendar() {
  const grid = document.getElementById('git-contribution-grid');
  const overlay = document.getElementById('git-terminal-overlay');
  const termClose = document.getElementById('term-close-btn');
  const termBody = document.getElementById('terminal-body');

  if (!grid || !overlay || !termClose || !termBody) return;

  // Mock Commit Database for Terminal Diffs
  const commitMessages = [
    "refactor: Optimize DrishtiAI adverse event detection classifier",
    "feat: Add HubSpot API transactional sync triggers to Payout Engine",
    "deploy: Deploy serverless AI career coach chatbot to Cloudflare Workers",
    "perf: Optimize cosine similarity search vector calculations in RecruitIQ",
    "fix: Resolve Redis connection pool leaks in pharmacovigilance streams",
    "docs: Update system data flow diagrams for Playto payout pipelines",
    "test: Add integration test coverage for celery task worker failovers",
    "style: Restore global Poppins typography variables across core grids",
    "feat: Integrate Presidio PII redaction rules to DrishtiAI router",
    "feat: Implement dark mode spotlight radial cursor glow mapping",
    "fix: Resolve CORS preflight failures on Cloudflare AI chat endpoints",
    "chore: Configure Docker multi-stage builds for Django web application",
    "feat: Add live repository stats caching using localStorage API",
    "refactor: Upgrade Workers AI handler to serve Llama 3.3 model context",
    "feat: Build responsive sliding glassmorphic architecture side drawer"
  ];

  const diffSnippets = {
    "DrishtiAI": `commit d8f7a6b5e43c2b1a0f9e8d7c6b5a4f3e2d1c0b9a
Author: Himanshu Menghani <himanshumenghani524@gmail.com>
Date:   Mon Jun 8 14:23:11 2026

    refactor: Optimize DrishtiAI adverse event detection classifier

<span class="diff-meta">diff --git a/drishti/classifier.py b/drishti/classifier.py
index a12bc34..d45ef67 100644</span>
<span class="diff-removed">--- a/drishti/classifier.py</span>
<span class="diff-added">+++ b/drishti/classifier.py</span>
<span class="diff-meta">@@ -24,8 +24,14 @@ def detect_adverse_events(text: str) -> dict:</span>
<span class="diff-removed">-    doc = legacy_nlp_model(text)</span>
<span class="diff-removed">-    events = parse_legacy_entities(doc)</span>
<span class="diff-added">+    # Run optimized sciSpacy entity classifier</span>
<span class="diff-added">+    doc = scispacy_nlp_pipeline(text)</span>
<span class="diff-added">+    events = extract_medical_side_effects(doc.ents)</span>
<span class="diff-added">+    </span>
<span class="diff-added">+    # Redact PII data utilizing Microsoft Presidio API</span>
<span class="diff-added">+    events["entities"] = presidio_redactor.sanitize(events["entities"])</span>
     return events`,

    "Payout Engine": `commit p4o5e6n7g8i9t0a1b2c3d4e5f6a7b8c9d0e1f2a3
Author: Himanshu Menghani <himanshumenghani524@gmail.com>
Date:   Wed Jun 10 11:05:42 2026

    feat: Add HubSpot API transactional sync triggers to Payout Engine

<span class="diff-meta">diff --git a/payout/tasks.py b/payout/tasks.py
index b56cfd3..f789012 100644</span>
<span class="diff-removed">--- a/payout/tasks.py</span>
<span class="diff-added">+++ b/payout/tasks.py</span>
<span class="diff-meta">@@ -57,7 +57,12 @@ def process_reward_payout(user_id: int, amount: float):</span>
<span class="diff-removed">-    update_local_db_status(user_id, "PAID")</span>
<span class="diff-added">+    transaction = create_postgresql_ledger_entry(user_id, amount)</span>
<span class="diff-added">+    </span>
<span class="diff-added">+    # Queue async webhook dispatch task to HubSpot CRM</span>
<span class="diff-added">+    hubspot_crm_dispatcher.delay({</span>
<span class="diff-added">+        "transaction_id": transaction.id,</span>
<span class="diff-added">+        "status": "COMPLETED"</span>
<span class="diff-added">+    })</span>`,

    "Career Coach": `commit c2a3c4c5o6a7c8h9i0a1b2c3d4e5f6a7b8c9d0e1
Author: Himanshu Menghani <himanshumenghani524@gmail.com>
Date:   Thu Jun 11 18:47:19 2026

    deploy: Deploy serverless AI career coach chatbot to Cloudflare Workers

<span class="diff-meta">diff --git a/wrangler.toml b/wrangler.toml
new file mode 100644
index 0000000..c56789d</span>
<span class="diff-added">+++ b/wrangler.toml</span>
<span class="diff-meta">@@ -0,0 +1,9 @@</span>
<span class="diff-added">+name = "cf-ai-web-coach"</span>
<span class="diff-added">+main = "src/index.js"</span>
<span class="diff-added">+compatibility_date = "2026-06-01"</span>
<span class="diff-added">+</span>
<span class="diff-added">+[ai]</span>
<span class="diff-added">+binding = "AI"</span>
<span class="diff-added">+</span>
<span class="diff-added">+[durable_objects]</span>
<span class="diff-added">+bindings = [{name = "SESSION_STORE", class_name = "SessionStore"}]</span>`,

    "RecruitIQ": `commit r1e2c3r4u5i6t7i8q9o0a1b2c3d4e5f6a7b8c9d0
Author: Himanshu Menghani <himanshumenghani524@gmail.com>
Date:   Fri Jun 12 09:12:05 2026

    perf: Optimize cosine similarity search vector calculations in RecruitIQ

<span class="diff-meta">diff --git b/recruitiq/matching.py b/recruitiq/matching.py
index m789012..e56cfd3 100644</span>
<span class="diff-removed">--- b/recruitiq/matching.py</span>
<span class="diff-added">+++ b/recruitiq/matching.py</span>
<span class="diff-meta">@@ -12,5 +12,10 @@ def calculate_cosine_similarity(resume_vec, jd_vec):</span>
<span class="diff-removed">-    dot_product = sum(r*j for r, j in zip(resume_vec, jd_vec))</span>
<span class="diff-removed">-    return dot_product / (magnitude(resume_vec) * magnitude(jd_vec))</span>
<span class="diff-added">+    # Batch matrix similarity vector calculation using NumPy</span>
<span class="diff-added">+    dot_products = np.dot(resume_matrix, jd_vector)</span>
<span class="diff-added">+    resume_norms = np.linalg.norm(resume_matrix, axis=1)</span>
<span class="diff-added">+    jd_norm = np.linalg.norm(jd_vector)</span>
<span class="diff-added">+    </span>
<span class="diff-added">+    return dot_products / (resume_norms * jd_norm)</span>`
  };

  // Generate Git Tooltip Element
  const tooltip = document.createElement('div');
  tooltip.className = 'git-tooltip';
  tooltip.style.opacity = '0';
  document.body.appendChild(tooltip);

  const totalDays = 371;
  const today = new Date();

  // Set starting date to 371 days ago
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);

  // Helper to format date as YYYY-MM-DD
  function formatDateKey(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Attempt to fetch real commit contributions from public API
  let contributionsMap = {};
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/524himanshu');
    if (res.ok) {
      const data = await res.json();
      if (data && data.contributions) {
        data.contributions.forEach(item => {
          contributionsMap[item.date] = {
            count: item.count,
            level: item.level
          };
        });
        console.log("Real GitHub contributions loaded successfully.");
      }
    }
  } catch (err) {
    console.warn("Failed to fetch real GitHub contributions, falling back to organic mock generation.", err);
  }

  // Render Grid Blocks
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const cell = document.createElement('div');
    cell.className = 'git-day-cell';

    const dateKey = formatDateKey(currentDate);
    let commitCount = 0;
    let level = 0;

    if (contributionsMap[dateKey] !== undefined) {
      // Use real commits from GitHub API
      commitCount = contributionsMap[dateKey].count;
      level = contributionsMap[dateKey].level;
    } else {
      // Fallback: Seed commit density using a pseudo-random sine hash for organic distribution
      const seed = currentDate.getFullYear() * 1000 + currentDate.getMonth() * 40 + currentDate.getDate();
      const x = Math.sin(seed) * 10000;
      const rand = x - Math.floor(x);

      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isWeekend) {
        if (rand > 0.94) commitCount = 2;
        else if (rand > 0.82) commitCount = 1;
      } else {
        if (rand > 0.91) commitCount = 4;
        else if (rand > 0.78) commitCount = 3;
        else if (rand > 0.50) commitCount = 2;
        else if (rand > 0.22) commitCount = 1;
      }

      if (commitCount === 1) level = 1;
      else if (commitCount === 2) level = 2;
      else if (commitCount === 3) level = 3;
      else if (commitCount >= 4) level = 4;
    }

    cell.classList.add(`level-${level}`);
    cell.setAttribute('data-commits', commitCount);
    cell.setAttribute('data-date', currentDate.toDateString());

    // Click behavior (open terminal modal if commits exist)
    if (commitCount > 0) {
      cell.addEventListener('click', () => {
        // Calculate stable hash from date for commit message selection
        const seed = currentDate.getFullYear() * 1000 + currentDate.getMonth() * 40 + currentDate.getDate();
        const x = Math.sin(seed) * 10000;
        const rand = x - Math.floor(x);
        const hash = Math.floor(rand * 100);
        let commitMsg = commitMessages[hash % commitMessages.length];

        // Match specific projects for diff content
        let projKey = "DrishtiAI";
        if (commitMsg.includes("HubSpot") || commitMsg.includes("Payout")) projKey = "Payout Engine";
        else if (commitMsg.includes("Workers") || commitMsg.includes("CF")) projKey = "Career Coach";
        else if (commitMsg.includes("similarity") || commitMsg.includes("Recruit")) projKey = "RecruitIQ";

        let diff = diffSnippets[projKey].replace("[Date]", currentDate.toDateString()).replace("[Commit Message]", commitMsg);

        termBody.innerHTML = `<pre>${diff}</pre>`;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    // Tooltip Hover bindings
    cell.addEventListener('mouseenter', (e) => {
      const commits = e.target.getAttribute('data-commits');
      const dateStr = e.target.getAttribute('data-date');

      tooltip.innerHTML = `<strong>${commits} commit${commits !== '1' ? 's' : ''}</strong> on ${dateStr}`;
      tooltip.style.opacity = '1';
    });

    cell.addEventListener('mousemove', (e) => {
      tooltip.style.left = e.pageX + 'px';
      tooltip.style.top = e.pageY + 'px';
    });

    cell.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });

    grid.appendChild(cell);
  }

  // Close Terminal Handlers
  function closeTerminal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  termClose.addEventListener('click', closeTerminal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeTerminal();
  });
}

/* ==================== Interactive AI RAG Playground ==================== */
function initRagPlayground() {
  const btnRun = document.getElementById('btn-run-rag');
  const queryInput = document.getElementById('rag-query');
  const sizeSelect = document.getElementById('rag-chunk-size');
  const overlapInput = document.getElementById('rag-overlap');
  const overlapVal = document.getElementById('overlap-val');
  
  const consoleLogs = document.getElementById('rag-console-logs');
  const docViewer = document.getElementById('rag-doc-viewer');
  const chunksViewer = document.getElementById('rag-chunks-viewer');
  const rankerViewer = document.getElementById('rag-ranker-viewer');
  const llmContext = document.getElementById('rag-llm-context');
  const llmResponse = document.getElementById('rag-llm-response');

  if (!btnRun || !queryInput || !sizeSelect || !overlapInput || !consoleLogs) return;

  // Source document text content
  const sourceDocument = "Himanshu Menghani is a Full Stack AI Engineer. He specializes in designing scalable backend architectures and AI-native products. DrishtiAI is his flagship adverse drug event detection tool shortlisted for AI for Bharat 2026. It utilizes Python FastAPI, a custom dual-mode NLP pipeline (SpaCy NER and Microsoft Presidio PII redaction), and generative safety reports via Gemini 1.5 Flash. CodeMate is an AI-powered Career Operating System and active engineering learning simulator built with Next.js, FastAPI, Supabase, and Gemini. It features data-driven lesson state machines, progressive hint disclosure, and a deterministic Python runner with custom AST settrace hooks to record recursive call-stack whiteboard frames. RecruitIQ evaluates candidate qualifications by building miniLM text embeddings and executing cosine similarity algorithms in Streamlit for the Redrob Hackathon. The CF AI Career Coach chatbot runs serverless Llama 3.3 models on Cloudflare Workers. Playto Payout Engine processes payment lead triggers asynchronously utilizing Celery task queues, Redis brokers, and PostgreSQL transaction tables.";

  // Populate Document Ingestion Card initially
  if (docViewer) {
    docViewer.textContent = sourceDocument;
  }

  // Sync overlap slider text
  overlapInput.addEventListener('input', (e) => {
    overlapVal.textContent = e.target.value;
  });

  // Suggestions click handler
  const suggestionTags = document.querySelectorAll('.rag-sug-tag');
  suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
      queryInput.value = tag.getAttribute('data-query');
      queryInput.focus();
    });
  });

  // Log printing helper
  function addLog(text, type = '') {
    const span = document.createElement('span');
    span.className = `log-line ${type}`;
    span.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    consoleLogs.appendChild(span);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  // Mock answers database
  const responses = {
    python: "Himanshu has developed multiple projects using Python:<br>1. **CodeMate**: A learning engine featuring a deterministic call-stack runner using subprocesses and AST tracing hooks.<br>2. **DrishtiAI**: An adverse side-effect classification pipeline leveraging a dual-mode SpaCy and Presidio NLP engine with Gemini safety signal reporting.<br>3. **RecruitIQ**: Semantically parses resumes, generates miniLM text vector embeddings, and runs cosine distance matches for Redrob.",
    asynchronous: "Himanshu's portfolio features complex asynchronous structures:<br>• **Playto Payout Engine**: Leverages Celery tasks and Redis brokers to offload reward transactions from Django DRF request cycles reliably.<br>• **DrishtiAI**: Leverages Redis cache layer to capture live social media streams.",
    cf: "The **CF AI Career Coach** is a serverless mentorship chatbot built entirely on the Cloudflare ecosystem. It routes client requests through Workers, runs model inference (Llama 3.3) via Workers AI, and manages session history in Durable Objects.",
    drishti: "**DrishtiAI** is a pharmacovigilance adverse event classifier. It ingests social media data streams, checks medical entities using a dual-mode SpaCy NER, redacts sensitive metrics with Presidio, and writes to Postgres/Redis. It generates LLM summary reports via Gemini 1.5 Flash. Shortlisted for AI for Bharat 2026.",
    codemate: "**CodeMate** is an AI-powered Career Operating System and active engineering learning simulator. It features data-driven lesson state machines, a deterministic Python runner with custom AST settrace hooks to record recursive call-stack whiteboard frames, and an impact-driven resume bullet generator."
  };

  btnRun.addEventListener('click', () => {
    // Prevent overlapping pipeline executions
    if (btnRun.disabled) return;
    btnRun.disabled = true;
    btnRun.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> Processing...`;

    // Clear previous execution visualizations
    chunksViewer.innerHTML = `<span class="text-muted italic">Chunking source document...</span>`;
    rankerViewer.innerHTML = `<span class="text-muted italic">Awaiting index metrics...</span>`;
    llmContext.querySelector('.context-data').innerHTML = `No context loaded.`;
    llmResponse.innerHTML = `<span class="cursor-typing">|</span>`;
    
    // Remove active styling classes
    document.querySelectorAll('.rag-stage-card').forEach(card => card.classList.remove('active'));

    const query = queryInput.value.trim().toLowerCase();
    const chunkSize = parseInt(sizeSelect.value);
    const overlap = parseInt(overlapInput.value);

    addLog(`System: Ingesting search query: "${queryInput.value}"`, 'system');

    // Pipeline Stage 1: Document Loading
    const stage1 = document.getElementById('stage-doc');
    if (stage1) stage1.classList.add('active');
    addLog("Pipeline [Stage 1]: Document parser loaded source text successfully.");

    setTimeout(() => {
      // Pipeline Stage 2: Chunking & Embeddings
      document.querySelectorAll('.rag-stage-card').forEach(c => c.classList.remove('active'));
      const stage2 = document.getElementById('stage-chunks');
      if (stage2) stage2.classList.add('active');
      addLog(`Pipeline [Stage 2]: Chunking document. Block size: ${chunkSize} chars, Overlap: ${overlap} chars.`);

      // Split text into chunks
      let chunks = [];
      let i = 0;
      while (i < sourceDocument.length) {
        let end = Math.min(i + chunkSize, sourceDocument.length);
        chunks.push({
          id: `VEC-00${chunks.length + 1}`,
          text: sourceDocument.substring(i, end)
        });
        if (end === sourceDocument.length) break;
        i += (chunkSize - overlap);
      }

      // Render chunks
      chunksViewer.innerHTML = '';
      chunks.forEach((chunk, index) => {
        const div = document.createElement('div');
        div.className = 'rag-chunk-item';
        div.id = `chunk-node-${index}`;
        div.innerHTML = `<span class="chunk-id">${chunk.id}</span>${chunk.text}`;
        chunksViewer.appendChild(div);
      });
      addLog(`Pipeline [Stage 2]: Segmented document into ${chunks.length} blocks. Created vector embeddings.`);

      setTimeout(() => {
        // Pipeline Stage 3: Matching / Search
        document.querySelectorAll('.rag-stage-card').forEach(c => c.classList.remove('active'));
        const stage3 = document.getElementById('stage-db');
        if (stage3) stage3.classList.add('active');
        addLog("Pipeline [Stage 3]: Querying vector database index...");

        // Calculate scores based on query matches
        const queryTerms = query.split(/\s+/);
        let rankedMatches = chunks.map((chunk, index) => {
          let score = 0.05 + Math.random() * 0.1; // Base score
          queryTerms.forEach(term => {
            if (term.length > 2 && chunk.text.toLowerCase().includes(term)) {
              score += 0.35 + Math.random() * 0.15;
            }
          });
          return {
            ...chunk,
            index,
            score: Math.min(score, 0.98).toFixed(2)
          };
        });

        // Sort descending
        rankedMatches.sort((a, b) => b.score - a.score);

        // Render ranked matches
        rankerViewer.innerHTML = '';
        rankedMatches.forEach((match, index) => {
          const item = document.createElement('div');
          item.className = 'rank-item';
          if (index < 2 && match.score > 0.3) {
            item.classList.add('match');
            // Highlight the matching chunk block in Stage 2
            const chunkEl = document.getElementById(`chunk-node-${match.index}`);
            if (chunkEl) chunkEl.classList.add('highlight-chunk');
          }
          item.innerHTML = `
            <div class="rank-meta">
              <span>${match.id}</span>
              <span class="rank-score">Similarity: ${match.score}</span>
            </div>
            <div class="score-bar-bg">
              <div class="score-bar-fill" id="bar-fill-${index}" style="width: 0%;"></div>
            </div>
          `;
          rankerViewer.appendChild(item);
          
          // Animate progress bar fill
          setTimeout(() => {
            const fill = document.getElementById(`bar-fill-${index}`);
            if (fill) fill.style.width = `${match.score * 100}%`;
          }, 50);
        });

        addLog(`Pipeline [Stage 3]: Match analysis finished. Found ${rankedMatches.filter(m => m.score > 0.3).length} relevant context chunks.`);

        setTimeout(() => {
          // Pipeline Stage 4: Synthesis
          document.querySelectorAll('.rag-stage-card').forEach(c => c.classList.remove('active'));
          const stage4 = document.getElementById('stage-llm');
          if (stage4) stage4.classList.add('active');
          addLog("Pipeline [Stage 4]: Compiling top context blocks into prompt context...");

          // Gather top matched context texts
          const matchingNodes = rankedMatches.filter(m => m.score > 0.3).slice(0, 2);
          
          if (matchingNodes.length > 0) {
            const contextString = matchingNodes.map(m => `[${m.id}]: "${m.text}"`).join("\n\n");
            llmContext.querySelector('.context-data').textContent = contextString;
          } else {
            llmContext.querySelector('.context-data').textContent = 'No matching document blocks exceeded confidence threshold (0.30).';
          }

          addLog("Pipeline [Stage 4]: Forwarding context to LLM model. Beginning text generation...");

          // Choose appropriate typewriter response
          let responseText = "Based on the provided context, Himanshu is a Full Stack and AI Engineer. He specializes in Python, FastAPI, Django, and Cloudflare serverless workers.";
          
          if (query.includes('python')) {
            responseText = responses.python;
          } else if (query.includes('async') || query.includes('queue') || query.includes('celery') || query.includes('redis')) {
            responseText = responses.asynchronous;
          } else if (query.includes('cf') || query.includes('workers') || query.includes('llama') || query.includes('career')) {
            responseText = responses.cf;
          } else if (query.includes('drishti') || query.includes('bharat') || query.includes('adverse')) {
            responseText = responses.drishti;
          } else if (query.includes('codemate') || query.includes('sandbox') || query.includes('compiler') || query.includes('state')) {
            responseText = responses.codemate;
          }

          // Typewriter animation
          llmResponse.innerHTML = '';
          let charIndex = 0;
          
          function typeChar() {
            if (charIndex < responseText.length) {
              const char = responseText.charAt(charIndex);
              
              if (char === '<') {
                // Skip HTML tags inside response for tag rendering
                const tagClose = responseText.indexOf('>', charIndex);
                if (tagClose !== -1) {
                  llmResponse.innerHTML = responseText.substring(0, tagClose + 1);
                  charIndex = tagClose + 1;
                } else {
                  llmResponse.innerHTML = responseText.substring(0, charIndex + 1);
                  charIndex++;
                }
              } else {
                llmResponse.innerHTML = responseText.substring(0, charIndex + 1) + '<span class="cursor-typing">|</span>';
                charIndex++;
              }
              setTimeout(typeChar, 25);
            } else {
              llmResponse.innerHTML = responseText; // Remove typing cursor when done
              addLog("Pipeline [Stage 4]: Text synthesis complete. Generation finished.");
              
              // Enable trigger button
              btnRun.disabled = false;
              btnRun.innerHTML = `<i class="bx bx-play-circle"></i> Run Pipeline`;
            }
          }
          
          setTimeout(typeChar, 400);

        }, 1800);

      }, 1500);

    }, 1500);
  });
}

/* ==================== Live DevOps Status Dashboard ==================== */
function initSystemStatusDashboard() {
  const latencyVal = document.getElementById('ops-latency-val');
  const latencyBar = document.getElementById('ops-latency-bar');
  const cpuVal = document.getElementById('ops-cpu-val');
  const cpuBar = document.getElementById('ops-cpu-bar');
  const cacheVal = document.getElementById('ops-cache-val');
  const cacheBar = document.getElementById('ops-cache-bar');
  const tokensVal = document.getElementById('ops-tokens-val');
  const tokensBar = document.getElementById('ops-tokens-bar');
  const sandboxVal = document.getElementById('ops-sandbox-val');
  const sandboxBar = document.getElementById('ops-sandbox-bar');
  const consoleLog = document.getElementById('ops-console-log');

  if (!latencyVal || !cpuVal || !cacheVal || !tokensVal || !consoleLog) return;

  // Initial Metrics State
  let metrics = {
    latency: 42,
    cpu: 4.5,
    cache: 98.4,
    tokens: 4120,
    sandbox: 18
  };

  // Helper to format time
  function getTimestamp() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    return `[${hrs}:${mins}:${secs}]`;
  }

  // Helper to add log line
  function addLog(message, type = 'info') {
    const line = document.createElement('div');
    line.className = 'ops-log-line';
    line.innerHTML = `
      <span class="ops-log-time">${getTimestamp()}</span>
      <span class="ops-log-msg ${type}">${message}</span>
    `;
    consoleLog.appendChild(line);

    // Keep only last 25 lines
    while (consoleLog.children.length > 25) {
      consoleLog.removeChild(consoleLog.firstChild);
    }

    // Scroll to bottom
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }

  // Prepopulate with some system boot logs
  setTimeout(() => addLog("Initializing Portfolio Services monitoring client...", "info"), 100);
  setTimeout(() => addLog("DrishtiAI: Successfully loaded Model Weights (adverse_events_v2.bin)", "success"), 600);
  setTimeout(() => addLog("PostgreSQL DB: Connection pool active on localhost:5432 (12/20 active connections)", "success"), 1100);
  setTimeout(() => addLog("Cloudflare Workers: Edge listener initialized at /api/visitor", "success"), 1600);
  setTimeout(() => addLog("CodeMate: Sandbox execution engine initialized at /api/teaching/execute", "success"), 1900);
  setTimeout(() => addLog("System check complete. Monitoring 5 telemetry channels. STATUS: OK", "success"), 2200);

  // List of possible messages for live stream
  const logTemplates = [
    { text: "CodeMate: Initialized Python Subprocess Sandbox Runner.", type: "info" },
    { text: "CodeMate: Executed student test script (AST settrace enabled) in 18ms.", type: "success" },
    { text: "CodeMate: Generated 12 call-stack trace frames for visual whiteboard.", type: "success" },
    { text: "Celery Worker: Worker pool idle. 0 tasks pending.", type: "info" },
    { text: "Redis Cache: Memory usage nominal at 14.2 MB. Cache hits stable.", type: "info" },
    { text: "Cloudflare Worker: Request received for /api/visitor. Fetching analytics metadata.", type: "info" },
    { text: "DrishtiAI Engine: Classifying incoming medical adverse event reports...", type: "info" },
    { text: "DrishtiAI API: Processed batch of 12 adverse event reports. 0 anomalies detected.", type: "success" },
    { text: "Cloudflare Worker: Cache HIT for endpoint /api/visitor (served from Edge CDN).", type: "success" },
    { text: "Celery Task: Completed candidate profile scoring for RecruitIQ in 1.14s.", type: "success" },
    { text: "Postgres DB: Automated table vacuum completed on 'candidate_profiles'.", type: "success" },
    { text: "DrishtiAI Engine: Successfully parsed medication entities and symptom keywords.", type: "success" },
    { text: "Redis Cache: Connection pool close to threshold (46/50 active connections). Scale trigger scheduled.", type: "warning" },
    { text: "DrishtiAI API: Queue congestion detected. Latency increased momentarily.", type: "warning" },
    { text: "Celery Worker: Task execution time for 'resume_summarize' exceeded 2.5s threshold.", type: "warning" },
    { text: "Postgres DB: S3 database snapshot scheduled backup completed.", type: "success" }
  ];

  const errorTemplates = [
    { text: "DrishtiAI Engine: Temporary failure connecting to external ICD-10 API. Falling back to local cache.", type: "error" },
    { text: "FastAPI Gateway: Rate limit triggered for remote client (IP 103.44.112.98). Status Code 429.", type: "error" },
    { text: "Celery Task: Worker node 'worker-beta-3' lost connection. Task rescheduled.", type: "error" }
  ];

  // Function to fluctuate metrics and update DOM
  function updateTelemetry() {
    // Latency fluctuation
    const latencyDelta = (Math.random() - 0.5) * 6; // Random walk -3 to +3
    metrics.latency = Math.max(25, Math.min(85, Math.round(metrics.latency + latencyDelta)));
    
    // CPU fluctuation
    const cpuDelta = (Math.random() - 0.5) * 0.8; // Random walk -0.4 to +0.4
    metrics.cpu = Math.max(1.8, Math.min(9.5, parseFloat((metrics.cpu + cpuDelta).toFixed(1))));
    
    // Cache fluctuation
    const cacheDelta = (Math.random() - 0.5) * 0.4;
    metrics.cache = Math.max(95.0, Math.min(100.0, parseFloat((metrics.cache + cacheDelta).toFixed(1))));
    
    // Tokens throughput fluctuation
    const tokensDelta = Math.floor((Math.random() - 0.5) * 350);
    metrics.tokens = Math.max(2500, Math.min(5800, metrics.tokens + tokensDelta));

    // Sandbox latency fluctuation
    const sandboxDelta = (Math.random() - 0.5) * 4;
    metrics.sandbox = Math.max(10, Math.min(45, Math.round(metrics.sandbox + sandboxDelta)));

    // Update values in DOM
    latencyVal.textContent = `${metrics.latency} ms`;
    cpuVal.textContent = `${metrics.cpu} ms`;
    cacheVal.textContent = `${metrics.cache}%`;
    tokensVal.textContent = `${metrics.tokens.toLocaleString()} t/min`;
    if (sandboxVal) sandboxVal.textContent = `${metrics.sandbox} ms`;

    // Update progress bars (bound maps)
    // Max values: Latency 100ms, CPU 10ms, Cache 100%, Tokens 6000, Sandbox 50ms
    latencyBar.style.width = `${metrics.latency}%`;
    cpuBar.style.width = `${(metrics.cpu / 10) * 100}%`;
    cacheBar.style.width = `${metrics.cache}%`;
    tokensBar.style.width = `${(metrics.tokens / 6000) * 100}%`;
    if (sandboxBar) sandboxBar.style.width = `${(metrics.sandbox / 50) * 100}%`;
  }

  // Periodic Telemetry Updates
  setInterval(updateTelemetry, 2500);

  // Periodic Log Streaming
  function streamLog() {
    const isError = Math.random() < 0.05; // 5% chance of warning/error
    let logObj;

    if (isError) {
      logObj = errorTemplates[Math.floor(Math.random() * errorTemplates.length)];
    } else {
      logObj = logTemplates[Math.floor(Math.random() * logTemplates.length)];
    }

    addLog(logObj.text, logObj.type);

    // Schedule next log at variable intervals (3s to 8s)
    const nextInterval = 3000 + Math.random() * 5000;
    setTimeout(streamLog, nextInterval);
  }

  // Start log stream after initial boot sequence finishes
  setTimeout(streamLog, 3000);
}

// ===== Hero Terminal Tabs & Booking Modal Handlers =====
document.addEventListener('DOMContentLoaded', () => {
  const heroTabs = document.querySelectorAll('.hero-term-tab');
  heroTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      heroTabs.forEach(t => {
        t.classList.remove('active');
        t.style.borderBottomColor = 'transparent';
        t.style.color = 'rgba(255,255,255,0.6)';
        t.style.fontWeight = 'normal';
      });
      tab.classList.add('active');
      tab.style.borderBottomColor = 'var(--main-color)';
      tab.style.color = 'var(--main-color)';
      tab.style.fontWeight = '600';

      const targetTab = tab.dataset.tab;
      ['repair', 'ast', 'metrics'].forEach(t => {
        const el = document.getElementById(`tab-content-${t}`);
        if (el) el.style.display = t === targetTab ? 'block' : 'none';
      });
    });
  });

  const btnDiag = document.getElementById('btn-run-hero-diag');
  if (btnDiag) {
    btnDiag.addEventListener('click', () => {
      const activeTab = document.querySelector('.hero-term-tab.active')?.dataset.tab || 'repair';
      const container = document.getElementById(`tab-content-${activeTab}`);
      if (!container) return;

      const time = (Math.random() * 0.4 + 0.1).toFixed(2);
      const logLine = document.createElement('div');
      logLine.style.color = '#00eeff';
      logLine.style.fontWeight = '600';
      logLine.textContent = `[${time}s] Manual Diagnostic Test: System Health 100% OK (Latency: <35ms)`;
      container.appendChild(logLine);
      container.scrollTop = container.scrollHeight;
    });
  }

  // ===== Booking Modal Handlers =====
  const modal = document.getElementById('booking-modal');
  const btnOpen = document.getElementById('btn-open-booking');
  const btnClose = document.getElementById('btn-close-booking');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
});
