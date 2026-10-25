// --- SEARCH ENGINE & CURATED LINKS (Zero Wikipedia) ---
const defaultSearchLinks = [
  { keyword: 'youtube', title: 'YouTube', url: 'https://www.youtube.com', description: 'Watch videos, music, tutorials, and streams.', icon: 'https://www.youtube.com/s/desktop/f5d13d7d/img/favicon.ico' },
  { keyword: 'tiktok', title: 'TikTok', url: 'https://www.tiktok.com', description: 'Short-form mobile video community.', icon: 'https://sf16-website-default.akamaized.net/obj/tiktok-web-sg/tiktok_favicon.ico' },
  { keyword: 'facebook', title: 'Facebook', url: 'https://www.facebook.com', description: 'Connect with friends, family and people you know.', icon: 'https://static.xx.fbcdn.net/rsrc.php/yT/r/a933f21d.ico' },
  { keyword: 'google', title: 'Google Search', url: 'https://www.google.com', description: 'Search the web instantly.', icon: 'https://www.google.com/favicon.ico' },
  { keyword: 'github', title: 'GitHub', url: 'https://github.com', description: 'Build, ship, and maintain software projects.', icon: 'https://github.githubassets.com/favicons/favicon.png' }
];

// Load custom links from localStorage or use defaults
function getStoredLinks() {
  const saved = localStorage.getItem('matel_custom_links');
  return saved ? JSON.parse(saved) : defaultSearchLinks;
}

// Strict Adult Content Blocker Filter
const adultKeywords = ['porn', 'xxx', 'xvideo', 'adult', 'nude', 'sex', 'strip'];

function isSafe(query) {
  const lower = query.toLowerCase();
  return !adultKeywords.some(badWord => lower.includes(badWord));
}

function handleSearch(event) {
  if (event.key === 'Enter') {
    performSearch();
  }
}

function performSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsGrid = document.getElementById('searchResults');
  const safetyWarning = document.getElementById('safetyWarning');
  
  resultsGrid.innerHTML = '';
  safetyWarning.classList.add('hidden');

  if (!query) return;

  // Check safety filter
  if (!isSafe(query)) {
    safetyWarning.classList.remove('hidden');
    return;
  }

  const links = getStoredLinks();
  
  // Filter links matching keyword, title, or description (Strictly NO Wikipedia)
  const matches = links.filter(item => {
    const isWiki = item.url.toLowerCase().includes('wikipedia.org');
    const matchesQuery = item.keyword.toLowerCase().includes(query) || 
                         item.title.toLowerCase().includes(query) || 
                         item.description.toLowerCase().includes(query);
    return !isWiki && matchesQuery;
  });

  if (matches.length === 0) {
    resultsGrid.innerHTML = `<p style="color: #a0aec0; grid-column: span 2;">No custom direct links found for "${query}". Ask admin to add it!</p>`;
    return;
  }

  // Render direct clickable cards with icons/pictures
  matches.forEach(item => {
    const card = document.createElement('a');
    card.href = item.url;
    card.target = '_blank';
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <img src="${item.icon}" class="card-icon" onerror="this.src='https://via.placeholder.com/32'">
        <span class="card-title">${item.title}</span>
      </div>
      <p style="color: #a0aec0; font-size: 0.9rem;">${item.description}</p>
    `;
    resultsGrid.appendChild(card);
  });
}

// Mode Switcher between Search and Calculator Mode
function toggleMode() {
  const searchSec = document.getElementById('searchSection');
  const calcSec = document.getElementById('calcSection');
  const btn = document.getElementById('modeToggleBtn');

  if (searchSec.classList.contains('active')) {
    searchSec.classList.remove('active');
    calcSec.classList.add('active');
    btn.innerText = 'Switch to Search Mode';
  } else {
    calcSec.classList.remove('active');
    searchSec.classList.add('active');
    btn.innerText = 'Switch to Calculator Mode';
  }
}
