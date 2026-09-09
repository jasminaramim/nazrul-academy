const fs = require('fs');
const path = require('path');

const codePath = 'src/admin/pages/AdminDashboard.tsx';
let code = fs.readFileSync(codePath, 'utf8');

const tabs = ['overview', 'hero', 'teachers', 'stats', 'students', 'finance', 'notices', 'schedule', 'cultural', 'donors', 'gallery', 'magazine', 'mongodb', 'settings'];

// State variables available in AdminDashboard
const stateVars = [
  'globalConfig', 'setGlobalConfig', 'heroSlides', 'setHeroSlides', 'teacherMessages', 'setTeacherMessages',
  'statsData', 'setStatsData', 'students', 'setStudents', 'finance', 'setFinance', 'notices', 'setNotices',
  'schedule', 'setSchedule', 'culturalSchedule', 'setCulturalSchedule', 'donors', 'setDonors', 'gallery', 'setGallery',
  'magazineArticles', 'setMagazineArticles', 'adminInfo', 'setAdminInfo', 'mongoStatus', 'setMongoStatus',
  'selectedMongoCollection', 'setSelectedMongoCollection', 'collectionDocs', 'setCollectionDocs', 'collectionLoading', 'setCollectionLoading',
  'syncingMongo', 'setSyncingMongo', 'seedingDemo', 'setSeedingDemo', 'mongoUriInput', 'setMongoUriInput',
  'editingSlide', 'setEditingSlide', 'editingTeacher', 'setEditingTeacher', 'editingCustomStat', 'setEditingCustomStat',
  'editingTransaction', 'setEditingTransaction', 'transactionFilter', 'setTransactionFilter', 'transactionSearch', 'setTransactionSearch',
  'editingNotice', 'setEditingNotice', 'editingStudent', 'setEditingStudent', 'editingDonor', 'setEditingDonor',
  'editingGallery', 'setEditingGallery', 'editingSchedule', 'setEditingSchedule', 'editingCultural', 'setEditingCultural',
  'editingArticle', 'setEditingArticle', 'studentSearch', 'setStudentSearch', 'studentBatchFilter', 'setStudentBatchFilter',
  'activeTab', 'setActiveTab', 'loading', 'setLoading', 'successMsg', 'setSuccessMsg', 'errorMsg', 'setErrorMsg',
  'adminUsername', 'setAdminUsername', 'adminPassword', 'setAdminPassword', 'adminLoginLoading', 'setAdminLoginLoading',
  'adminLoginError', 'setAdminLoginError', 'copiedCreds', 'setCopiedCreds',
  'flashMessage', 'loadAllData'
];

// Context/utils/api
const globals = [
  'apiService', 'toBengaliNumber', 'formatTaka', 'formatDateBengali'
];

function extractBlock(startIndex) {
  let openBraces = 0;
  let inJSX = false;
  let openTags = 0; // rough heuristic
  
  // Actually, we can just look for the next `{activeTab === ` or `</main>` or `<main`
  // Since they are top-level siblings inside <main className="flex-1 p-6 overflow-auto">
  // A simple regex might not work, but we know the order of tabs.
}

// We will use a split approach.
// The tabs are rendered sequentially inside <main>
// We can split by `{activeTab === '`
const mainChunks = code.split(/\{activeTab === '/);
const newComponents = {};

let updatedCode = mainChunks[0]; // everything before the first tab

for (let i = 1; i < mainChunks.length; i++) {
  let chunk = mainChunks[i];
  const tabNameMatch = chunk.match(/^([^']+)'/);
  if (!tabNameMatch) {
    updatedCode += `{activeTab === '` + chunk;
    continue;
  }
  const tab = tabNameMatch[1];
  
  // Where does this tab block end? It ends right before the next `}` that matches the opening `{activeTab ===`
  // Actually we split by `{activeTab === '`, so the end of the chunk is just before the next split.
  // Wait, chunk might have trailing `}` that closed the `{activeTab === 'hero' && (...)}`
  // But wait, some tabs don't use `&& (`, they use `&& <div...`
  // Let's find the closing brace of the JSX expression if it was wrapped.
  
  let endIdx = chunk.length;
  // If the chunk ends with `}`, it's likely closing the tab condition.
  // Let's just use the whole chunk minus the trailing `}` if it was wrapped in `{ ... }`
  let tabCode = chunk.substring(chunk.indexOf('&&') + 2).trim();
  let remainingCode = '';
  
  // check if it starts with `(`
  if (tabCode.startsWith('(')) {
    // find matching closing parenthesis
    let depth = 0;
    let matchIdx = -1;
    for(let j=0; j<tabCode.length; j++) {
      if (tabCode[j] === '(') depth++;
      else if (tabCode[j] === ')') {
        depth--;
        if (depth === 0) {
          matchIdx = j;
          break;
        }
      }
    }
    if (matchIdx !== -1) {
      remainingCode = tabCode.substring(matchIdx + 1);
      tabCode = tabCode.substring(1, matchIdx); // inside parens
    }
  } else {
    // It's just a top-level JSX element like `<div ... > ... </div>}`
    // Let's find the matching closing tag or just use rough extraction.
    // It's easier: tabCode is everything up to the last `}` before remainingCode.
    let lastBrace = tabCode.lastIndexOf('}');
    if (lastBrace !== -1) {
      remainingCode = tabCode.substring(lastBrace + 1);
      tabCode = tabCode.substring(0, lastBrace).trim();
    }
  }

  // Determine props
  const usedProps = stateVars.filter(v => new RegExp(`\\b${v}\\b`).test(tabCode));
  const usedGlobals = globals.filter(v => new RegExp(`\\b${v}\\b`).test(tabCode));
  
  const componentName = tab.charAt(0).toUpperCase() + tab.slice(1) + 'Tab';
  
  // Build props interface
  let propsInterface = `interface ${componentName}Props {\n`;
  usedProps.forEach(p => {
    propsInterface += `  ${p}: any;\n`; // We will use 'any' for simplicity, or we can import types
  });
  propsInterface += `}\n`;
  
  // Build component file
  let compFile = `import React, { useState } from 'react';\n`;
  // Add icon imports
  compFile += `import * as Icons from 'lucide-react';\n`; // simplified
  compFile += `import { BdtIcon } from '../../shared/components/BdtIcon';\n`;
  compFile += `import { ImageUploader } from '../../shared/components/ImageUploader';\n`;
  if (usedGlobals.includes('apiService')) compFile += `import { apiService } from '../../shared/services/api';\n`;
  if (usedGlobals.includes('toBengaliNumber') || usedGlobals.includes('formatTaka') || usedGlobals.includes('formatDateBengali')) {
    compFile += `import { toBengaliNumber, formatTaka, formatDateBengali } from '../../shared/utils/formatters';\n`;
  }
  compFile += `import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../shared/types';\n\n`;
  
  compFile += propsInterface + `\n`;
  compFile += `export const ${componentName}: React.FC<${componentName}Props> = ({ ${usedProps.join(', ')} }) => {\n`;
  // we might need to extract `lucide-react` icons specifically.
  // for now, we'll replace `<IconName ` with `<Icons.IconName ` or just keep it and add all used icons.
  const iconRegex = /<([A-Z][a-zA-Z0-9]+)/g;
  let match;
  let icons = new Set();
  while((match = iconRegex.exec(tabCode)) !== null) {
    if (match[1] !== 'BdtIcon' && match[1] !== 'ImageUploader' && match[1] !== 'Fragment') {
      icons.add(match[1]);
    }
  }
  
  let iconImport = '';
  if (icons.size > 0) {
    iconImport = `import { ${Array.from(icons).join(', ')} } from 'lucide-react';\n`;
  }
  compFile = compFile.replace(`import * as Icons from 'lucide-react';\n`, iconImport);
  
  compFile += `  return (\n    <>\n      ${tabCode}\n    </>\n  );\n};\n`;
  
  newComponents[componentName] = {
    name: componentName,
    content: compFile,
    usedProps: usedProps
  };
  
  // replace in updatedCode
  updatedCode += `{activeTab === '${tab}' && <${componentName} ${usedProps.map(p => `${p}={${p}}`).join(' ')} />}\n${remainingCode}`;
}

// Add imports for new components at the top of AdminDashboard
let imports = '';
for (const compName in newComponents) {
  imports += `import { ${compName} } from '../components/tabs/${compName}';\n`;
  fs.writeFileSync(`src/admin/components/tabs/${compName}.tsx`, newComponents[compName].content);
}
updatedCode = imports + updatedCode;

fs.writeFileSync('src/admin/pages/AdminDashboard.tsx', updatedCode);
console.log('Refactoring complete. 14 tabs extracted.');
