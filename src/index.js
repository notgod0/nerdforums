// Animated Background
function createAnimatedBackground() {
  const container = document.getElementById('animated-background');
  
  function createCircle() {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    
    // Random size between 50px and 200px
    const size = Math.random() * 150 + 50;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    
    // Random position
    circle.style.left = `${Math.random() * 100}%`;
    circle.style.top = `${Math.random() * 100}%`;
    
    // Random animation delay
    circle.style.animationDelay = `${Math.random() * 5}s`;
    
    container.appendChild(circle);
    
    // Remove circle after animation
    setTimeout(() => {
      circle.remove();
    }, 10000);
  }

  // Create initial circles
  for (let i = 0; i < 10; i++) {
    createCircle();
  }

  // Create new circles periodically
  setInterval(createCircle, 2000);
}

// Mock data for forums (replace with actual data from Supabase later)
const mockForums = [
  {
    id: 1,
    title: "How to get started with web development?",
    author: "newbie123",
    tags: ["webdev", "beginners"],
    status: "open",
    replies: 5,
    createdAt: "2024-02-20"
  },
  {
    id: 2,
    title: "Best practices for CSS Grid",
    author: "cssmaster",
    tags: ["css", "layout"],
    status: "solved",
    replies: 12,
    createdAt: "2024-02-19"
  }
];

// Render forums
function renderForums(forums) {
  const forumsList = document.getElementById('forumsList');
  forumsList.innerHTML = forums.map(forum => `
    <div class="forum-card" data-forum-id="${forum.id}">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-semibold">${forum.title}</h3>
        <span class="forum-status status-${forum.status}">${forum.status}</span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          ${forum.tags.map(tag => `<span class="forum-tag">${tag}</span>`).join('')}
        </div>
        <div class="text-sm text-gray-400">
          by ${forum.author} · ${forum.replies} replies
        </div>
      </div>
    </div>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.forum-card').forEach(card => {
    card.addEventListener('click', () => {
      const forumId = card.dataset.forumId;
      // Navigate to forum detail page (implement later)
      console.log(`Navigate to forum ${forumId}`);
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createAnimatedBackground();
  renderForums(mockForums);

  // Show "New Forum" button if user is logged in (implement login check later)
  const newForumBtn = document.getElementById('newForumBtn');
  // Temporarily show button for demo
  newForumBtn.classList.remove('hidden');
});