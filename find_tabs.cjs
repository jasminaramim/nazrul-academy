const fs = require('fs');
const code = fs.readFileSync('src/admin/pages/AdminDashboard.tsx', 'utf8');

const tabs = ['overview', 'hero', 'teachers', 'stats', 'students', 'finance', 'notices', 'schedule', 'cultural', 'donors', 'gallery', 'magazine', 'mongodb', 'settings'];

tabs.forEach(tab => {
  const query = `{activeTab === '${tab}' && (`;
  const idx = code.indexOf(query);
  if (idx !== -1) {
    console.log(`Tab ${tab} found at index ${idx}`);
  } else {
    const query2 = `activeTab === '${tab}' &&`;
    const idx2 = code.indexOf(query2);
    if (idx2 !== -1) {
      console.log(`Tab ${tab} found (no parenthesis) at index ${idx2}`);
    } else {
      console.log(`Tab ${tab} NOT found`);
    }
  }
});
