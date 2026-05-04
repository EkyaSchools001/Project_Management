const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend/src/pages/edu-hub/culture-practices');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let hasModifications = false;

  // Fix the broken react-router-dom import and double import {
  // Pattern: import { ... } from 'react-router-dom';, \n import {
  const brokenRouterRegex = /import\s*{\s*useNavigate\s*}\s*from\s*'react-router-dom';,\s*import\s*{/g;
  if (brokenRouterRegex.test(content)) {
    content = content.replace(brokenRouterRegex, "import { useNavigate } from 'react-router-dom';\nimport {");
    hasModifications = true;
  }

  // Also catch variations with newlines
  const brokenRouterRegex2 = /import\s*{\s*useNavigate\s*}\s*from\s*'react-router-dom';\s*,\s*import\s*{/g;
  if (brokenRouterRegex2.test(content)) {
    content = content.replace(brokenRouterRegex2, "import { useNavigate } from 'react-router-dom';\nimport {");
    hasModifications = true;
  }

  if (hasModifications) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax error in ${file}`);
  }
}
