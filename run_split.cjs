const fs = require('fs');
const path = require('path');

// 1. Restore AdminDashboard from components to admin/pages
const sourcePath = 'src/components/AdminDashboard.tsx';
const targetPath = 'src/admin/pages/AdminDashboard.tsx';
fs.copyFileSync(sourcePath, targetPath);

// 2. Fix the TAB: string
let code = fs.readFileSync(targetPath, 'utf8');
code = code.replace('{/* ===================== TAB: MONGODB CLOUD DATABASE ===================== */}', '{/* ===================== TAB MONGODB CLOUD DATABASE ===================== */}');
fs.writeFileSync(targetPath, code);

// 3. Fix the depth using the previous fix script logic or just doing it here manually for AdminDashboard
code = fs.readFileSync(targetPath, 'utf8');
code = code.replace(/from '\.\.\//g, "from '../../");
code = code.replace(/from '\.\//g, "from '../");
code = code.replace(/from '\.\.\/\.\.\/services\/api'/g, "from '../../shared/services/api'");
code = code.replace(/from '\.\.\/\.\.\/context\/AuthContext'/g, "from '../../shared/context/AuthContext'");
code = code.replace(/from '\.\.\/\.\.\/types'/g, "from '../../shared/types'");
code = code.replace(/from '\.\.\/\.\.\/utils\/formatters'/g, "from '../../shared/utils/formatters'");
code = code.replace(/from '\.\.\/BdtIcon'/g, "from '../../shared/components/BdtIcon'");
code = code.replace(/from '\.\.\/ImageUploader'/g, "from '../../shared/components/ImageUploader'");
fs.writeFileSync(targetPath, code);

// 4. Run the extraction
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
  'flashMessage', 'loadAllData', 'handleSyncMongo', 'handleSeedDemoData', 'handleSaveMongoUri', 'loadMongoCollectionDocs'
];

const globals = ['apiService', 'toBengaliNumber', 'formatTaka', 'formatDateBengali'];

const chunks = code.split(/\{\/\* ===================== TAB /);
let updatedCode = chunks[0];
const newComponents = {};

for(let i=1; i<chunks.length; i++) {
  let chunk = chunks[i];
  
  let modalsChunk = '';
  const modalSplit = chunk.split(/\{\/\* ===================== MODAL/);
  if (modalSplit.length > 1) {
    chunk = modalSplit[0];
    modalsChunk = modalSplit.slice(1).map(s => '{/* ===================== MODAL' + s).join('');
  }

  const tabMatch = chunk.match(/activeTab === '([^']+)'/);
  if (!tabMatch) {
    updatedCode += '{/* ===================== TAB ' + chunk + modalsChunk;
    continue;
  }
  const tabName = tabMatch[1];
  const componentName = tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Tab';
  
  let tabCodeStart = chunk.indexOf('&&') + 2;
  let codeAfterAnd = chunk.substring(tabCodeStart).trim();
  let tabCode = "";

  if (codeAfterAnd.startsWith('(')) {
    let openCount = 0;
    let endParenIndex = -1;
    for(let j = 0; j < codeAfterAnd.length; j++) {
       if(codeAfterAnd[j] === '(') openCount++;
       if(codeAfterAnd[j] === ')') {
         openCount--;
         if(openCount === 0) {
           endParenIndex = j;
           break;
         }
       }
    }
    tabCode = codeAfterAnd.substring(1, endParenIndex);
  } else {
     let firstAng = codeAfterAnd.indexOf('<');
     let lastAng = codeAfterAnd.lastIndexOf('>');
     tabCode = codeAfterAnd.substring(firstAng, lastAng + 1);
  }

  const usedProps = stateVars.filter(v => new RegExp(`\\b${v}\\b`).test(tabCode));
  const usedGlobals = globals.filter(v => new RegExp(`\\b${v}\\b`).test(tabCode));
  
  let propsInterface = `interface ${componentName}Props {\n`;
  usedProps.forEach(p => { propsInterface += `  ${p}: any;\n`; });
  propsInterface += `}\n`;
  
  let compFile = `import React, { useState } from 'react';\n`;
  if (usedGlobals.includes('apiService')) compFile += `import { apiService } from '../../../shared/services/api';\n`;
  if (usedGlobals.includes('toBengaliNumber') || usedGlobals.includes('formatTaka') || usedGlobals.includes('formatDateBengali')) {
    compFile += `import { toBengaliNumber, formatTaka, formatDateBengali } from '../../../shared/utils/formatters';\n`;
  }
  compFile += `import { GlobalConfig, HeroSlide, TeacherMessage, StatsData, CustomStatItem, Student, FinanceSummary, FinanceTransaction, Notice, ScheduleItem, CulturalItem, Donor, GalleryItem, MagazineArticle, AdminInfo } from '../../../shared/types';\n`;
  compFile += `import { BdtIcon } from '../../../shared/components/BdtIcon';\n`;
  compFile += `import { ImageUploader } from '../../../shared/components/ImageUploader';\n\n`;

  const iconRegex = /<([A-Z][a-zA-Z0-9]+)/g;
  let match;
  let icons = new Set();
  while((match = iconRegex.exec(tabCode)) !== null) {
    if (match[1] !== 'BdtIcon' && match[1] !== 'ImageUploader' && match[1] !== 'Fragment' && !componentName.startsWith(match[1])) {
      icons.add(match[1]);
    }
  }
  if (icons.size > 0) compFile += `import { ${Array.from(icons).join(', ')} } from 'lucide-react';\n`;
  
  compFile += `\n${propsInterface}\n`;
  compFile += `export const ${componentName}: React.FC<${componentName}Props> = ({ ${usedProps.join(', ')} }) => {\n`;
  compFile += `  return (\n    <>\n      ${tabCode}\n    </>\n  );\n};\n`;
  
  newComponents[componentName] = { content: compFile, usedProps };
  
  const headerComment = chunk.substring(0, chunk.indexOf('}') + 1);
  updatedCode += '{/* ===================== TAB ' + headerComment + `\n          {activeTab === '${tabName}' && <${componentName} ${usedProps.map(p => `${p}={${p}}`).join(' ')} />}\n\n`;
  
  if (modalsChunk) {
    updatedCode += modalsChunk;
  }
}

let imports = '';
if (!fs.existsSync('src/admin/components/tabs')) {
  fs.mkdirSync('src/admin/components/tabs', { recursive: true });
}
for (const compName in newComponents) {
  imports += `import { ${compName} } from '../components/tabs/${compName}';\n`;
  fs.writeFileSync(`src/admin/components/tabs/${compName}.tsx`, newComponents[compName].content);
}

updatedCode = imports + updatedCode;
fs.writeFileSync(targetPath, updatedCode);

console.log('Split and extraction successful!');
