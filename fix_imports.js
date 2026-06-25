import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appDir = path.join(__dirname, 'app');
const srcPagesDir = path.join(__dirname, 'src', 'pages');

const routes = {
  'app/page.jsx': 'src/pages/Home.jsx',
  'app/login/page.jsx': 'src/pages/Login.jsx',
  'app/register/page.jsx': 'src/pages/Register.jsx',
  'app/startups/page.jsx': 'src/pages/BrowseStartups.jsx',
  'app/startups/[id]/page.jsx': 'src/pages/StartupDetails.jsx',
  'app/opportunities/page.jsx': 'src/pages/BrowseOpportunities.jsx',
  'app/opportunities/[id]/page.jsx': 'src/pages/OpportunityDetails.jsx',
  'app/payment-success/page.jsx': 'src/pages/PaymentSuccess.jsx',
  'app/dashboard/page.jsx': 'src/pages/dashboard/DashboardHome.jsx',
  'app/dashboard/profile/page.jsx': 'src/pages/dashboard/Profile.jsx',
  'app/dashboard/founder/my-startup/page.jsx': 'src/pages/dashboard/founder/MyStartup.jsx',
  'app/dashboard/founder/add-opportunity/page.jsx': 'src/pages/dashboard/founder/AddOpportunity.jsx',
  'app/dashboard/founder/manage-opportunities/page.jsx': 'src/pages/dashboard/founder/ManageOpportunities.jsx',
  'app/dashboard/founder/applications/page.jsx': 'src/pages/dashboard/founder/FounderApplications.jsx',
  'app/dashboard/collaborator/my-applications/page.jsx': 'src/pages/dashboard/collaborator/MyApplications.jsx',
  'app/dashboard/admin/manage-users/page.jsx': 'src/pages/dashboard/admin/ManageUsers.jsx',
  'app/dashboard/admin/manage-startups/page.jsx': 'src/pages/dashboard/admin/ManageStartups.jsx',
  'app/dashboard/admin/transactions/page.jsx': 'src/pages/dashboard/admin/Transactions.jsx',
  'app/not-found.jsx': 'src/pages/NotFound.jsx'
};

function fixImports(newFilePath, oldFilePath) {
  let content = fs.readFileSync(newFilePath, 'utf-8');
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    if (importPath.startsWith('.')) {
      // Resolve absolute path of the imported file based on its old location
      const oldAbsoluteImportPath = path.resolve(path.dirname(oldFilePath), importPath);
      // Calculate new relative path from the new location
      let newRelativeImportPath = path.relative(path.dirname(newFilePath), oldAbsoluteImportPath);
      
      // Ensure it starts with ./ or ../
      if (!newRelativeImportPath.startsWith('.')) {
        newRelativeImportPath = './' + newRelativeImportPath;
      }
      
      // Replace backslashes with forward slashes
      newRelativeImportPath = newRelativeImportPath.replace(/\\/g, '/');
      return `from '${newRelativeImportPath}'`;
    }
    return match;
  });

  fs.writeFileSync(newFilePath, content);
}

for (const [newRel, oldRel] of Object.entries(routes)) {
  const newFilePath = path.join(__dirname, newRel);
  const oldFilePath = path.join(__dirname, oldRel);
  if (fs.existsSync(newFilePath)) {
    fixImports(newFilePath, oldFilePath);
  }
}

console.log('Fixed imports in app directory.');
