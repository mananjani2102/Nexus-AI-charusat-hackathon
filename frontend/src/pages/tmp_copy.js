const fs = require('fs');

try {
  const data = fs.readFileSync('c:/Users/parsh/OneDrive/Desktop/Nexus-AI-charusat-hackathon/frontend/src/pages/DashboardPage (1).jsx', 'utf8');
  fs.writeFileSync('c:/Users/parsh/OneDrive/Desktop/Nexus-AI-charusat-hackathon/frontend/src/pages/DashboardPage.jsx', data);
  console.log("Successfully copied!");
} catch (err) {
  console.error("Error copy:", err);
}
