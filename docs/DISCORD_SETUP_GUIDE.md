# 🎮 Discord Setup Guide for SchoolOS Team

**Copy-paste these messages into Discord to guide your team!**

---

## 📋 Message 1: Welcome & Overview

```
🎉 **Welcome to SchoolOS Development Team!**

We're going to set up our collaboration workspace. This will take about 15 minutes total.

**What we'll set up:**
✅ Discord server for communication
✅ GitHub for code sharing
✅ VS Code Live Share for real-time coding

**You'll need:**
- Discord account (you're already here! ✓)
- GitHub account (free)
- VS Code installed
- Git installed

Let's get started! 👇
```

---

## 📋 Message 2: Discord Server Setup

```
**STEP 1: Discord Server Setup** 🎮

I've created this server for our team. Here's how to use it:

**📢 Text Channels:**
• #general - Team chat & announcements
• #code-help - Ask coding questions
• #daily-standup - Post daily updates
• #bugs - Report bugs you find
• #resources - Share useful links
• #git-notifications - GitHub updates (optional)

**🎙️ Voice Channels:**
• Coding Session - For pair programming
• Quick Help - For quick questions
• Team Meeting - For standups & planning

**How to use:**
1. Turn on notifications for #general and #code-help
2. Post in #daily-standup every morning
3. Join voice when coding together

Ready for Step 2? React with 👍
```

---

## 📋 Message 3: GitHub Account Setup

```
**STEP 2: GitHub Account Setup** 🐙

**If you already have GitHub:** Skip to Step 3!

**If you need to create an account:**

1. Go to: https://github.com/signup
2. Enter your email
3. Create a password
4. Choose a username (use something professional!)
5. Verify your email
6. Choose "Free" plan

**Once done:**
✅ Post your GitHub username here
✅ I'll add you as a collaborator

Example: "My GitHub username is: @johndoe"

Waiting for everyone's usernames... 👇
```

---

## 📋 Message 4: Accept GitHub Invitation

```
**STEP 3: Accept GitHub Invitation** 📧

**I've sent you all invitations!**

**Check your email for:**
Subject: "[GitHub] YOUR_NAME invited you to join the REPO_NAME repository"

**To accept:**
1. Open the email
2. Click "View invitation"
3. Click "Accept invitation"
4. You're in! 🎉

**Verify you have access:**
Go to: https://github.com/YOUR_USERNAME/schoolos
You should see the code!

React with ✅ when you've accepted!
```

---

## 📋 Message 5: Install Git

```
**STEP 4: Install Git** 📦

**Windows Users:**
1. Download: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (just keep clicking Next)
4. Restart VS Code if it's open

**Mac Users:**
1. Open Terminal
2. Type: `git --version`
3. If not installed, it will prompt you to install
4. Follow the prompts

**Linux Users:**
```bash
sudo apt-get update
sudo apt-get install git
```

**Verify installation:**
Open terminal/command prompt and type:
```bash
git --version
```

You should see something like: `git version 2.40.0`

React with 🎯 when Git is installed!
```

---

## 📋 Message 6: Install VS Code

```
**STEP 5: Install VS Code** 💻

**If you already have VS Code:** Skip to Step 6!

**Download & Install:**
1. Go to: https://code.visualstudio.com/
2. Click "Download for [Your OS]"
3. Run the installer
4. Use default settings

**First-time setup:**
1. Open VS Code
2. Install these essential extensions:
   - Live Share (by Microsoft)
   - ESLint
   - Prettier - Code formatter
   - GitLens

**To install extensions:**
1. Click Extensions icon (left sidebar) or press `Ctrl+Shift+X`
2. Search for extension name
3. Click "Install"

React with 💻 when VS Code is ready!
```

---

## 📋 Message 7: Clone the Repository

```
**STEP 6: Clone the Repository** 📥

**This downloads the project to your computer**

**Method 1: Using VS Code (Easier)**
1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type: "Git: Clone"
4. Paste: `https://github.com/YOUR_USERNAME/schoolos.git`
5. Choose where to save (e.g., Documents/Projects)
6. Click "Open" when prompted

**Method 2: Using Terminal**
```bash
# Navigate to where you want the project
cd Documents/Projects

# Clone the repository
git clone https://github.com/YOUR_USERNAME/schoolos.git

# Open in VS Code
cd schoolos
code .
```

**Verify it worked:**
You should see all the project files in VS Code's explorer!

React with 📂 when you have the code!
```

---

## 📋 Message 8: Install Dependencies

```
**STEP 7: Install Project Dependencies** 📦

**This installs all the packages the project needs**

**In VS Code:**
1. Open Terminal: `Ctrl+` ` (backtick key) or View → Terminal
2. Run these commands:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

**This will take 2-5 minutes** ⏳

You'll see lots of text scrolling - that's normal!

**When done, you should see:**
✅ "added XXX packages"
✅ No error messages

**If you see errors:**
Post the error message in #code-help

React with 📦 when installation is complete!
```

---

## 📋 Message 9: Set Up Environment Files

```
**STEP 8: Set Up Environment Files** 🔐

**These files contain configuration settings**

**Create .env file in project root:**
1. In VS Code, create new file: `.env`
2. Copy this content:

```env
VITE_API_URL=http://localhost:8888
VITE_SOCKET_URL=http://localhost:8888
```

**Create .env file in server folder:**
1. Create new file: `server/.env`
2. Copy this content:

```env
PORT=8888
DATABASE_URL=postgresql://postgres:password@localhost:5432/schoolos
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

**Note:** We'll set up the database later. For now, this is fine!

React with 🔐 when .env files are created!
```

---

## 📋 Message 10: Test the Setup

```
**STEP 9: Test Your Setup** 🧪

**Let's make sure everything works!**

**Start the development servers:**

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm run start
```

**What you should see:**

Frontend:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

Backend:
```
🚀 SchoolOS Server active on port 8888
```

**Open your browser:**
Go to: http://localhost:5173

You should see the SchoolOS login page! 🎉

**If something doesn't work:**
1. Take a screenshot
2. Post in #code-help
3. We'll help you fix it!

React with 🎉 when you see the website!
```

---

## 📋 Message 11: Install Live Share

```
**STEP 10: Install VS Code Live Share** 🔴

**This lets us code together in real-time!**

**Install the extension:**
1. In VS Code, press `Ctrl+Shift+X`
2. Search: "Live Share"
3. Install "Live Share" by Microsoft
4. Click "Reload" if prompted

**Sign in:**
1. Click "Live Share" button in status bar (bottom)
2. Choose "Sign in with GitHub"
3. Browser will open - click "Authorize"
4. Return to VS Code

**You should see:**
✅ "Live Share" button in status bar
✅ Your name/icon in bottom left

React with 🔴 when Live Share is ready!
```

---

## 📋 Message 12: First Live Share Session

```
**STEP 11: First Live Share Session** 🎮

**Let's test coding together!**

**I'll host a session right now:**

**For me (Host):**
1. Click "Live Share" button
2. Click "Start collaboration session"
3. Link is copied automatically
4. I'll post the link below 👇

**For you (Join):**
1. Click the link I post
2. VS Code opens automatically
3. You can now see my code!
4. Try editing a file - I can see your changes!

**Let's test it:**
- Everyone open: `README.md`
- Add your name to the team list
- We can all see each other's cursors!

**Live Share Link:**
[I'll post the link when everyone is ready]

Join voice channel "Coding Session" for audio! 🎙️
```

---

## 📋 Message 13: Git Configuration

```
**STEP 12: Configure Git** ⚙️

**Set up your Git identity (one-time setup)**

**Open terminal and run:**
```bash
# Set your name (use your real name)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify it worked
git config --list
```

**You should see:**
```
user.name=Your Name
user.email=your.email@example.com
```

**This is important!** Your commits will be tagged with this info.

React with ⚙️ when configured!
```

---

## 📋 Message 14: First Commit Test

```
**STEP 13: Make Your First Commit** 🎯

**Let's practice the Git workflow!**

**Create a test branch:**
```bash
# Make sure you're on main
git checkout main

# Pull latest changes
git pull origin main

# Create your branch (use your name)
git checkout -b test/your-name
```

**Make a small change:**
1. Open `README.md`
2. Add your name to the "Team" section
3. Save the file

**Commit your change:**
```bash
# See what changed
git status

# Add the file
git add README.md

# Commit with a message
git commit -m "docs: Add [Your Name] to team list"

# Push to GitHub
git push origin test/your-name
```

**Create a Pull Request:**
1. Go to GitHub repository
2. You'll see "Compare & pull request" button
3. Click it
4. Add description: "Adding myself to the team!"
5. Click "Create pull request"

I'll review and merge everyone's PRs! ✅

React with 🎯 when your PR is created!
```

---

## 📋 Message 15: Daily Workflow

```
**STEP 14: Our Daily Workflow** 📅

**Every morning:**
1. Post in #daily-standup:
```
**Daily Standup - [Your Name]**
📅 [Date]

✅ Yesterday: [What you did]
🎯 Today: [What you're doing]
🚧 Blockers: [Any issues]
```

**When starting work:**
```bash
# Pull latest changes
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

**During work:**
```bash
# Commit often (every 30-60 min)
git add .
git commit -m "feat: Description of change"
git push origin feature/your-feature-name
```

**When feature is done:**
1. Push final changes
2. Create Pull Request on GitHub
3. Post in #code-help: "PR ready for review!"
4. Wait for approval
5. Merge!

**Need help?**
- Quick question → #code-help
- Complex issue → Start Live Share session
- Urgent → Ping @everyone

React with 📅 to confirm you understand!
```

---

## 📋 Message 16: Team Rules

```
**STEP 15: Team Rules & Best Practices** 📜

**Code Rules:**
✅ Always work on a branch (never on main)
✅ Commit messages start with: feat/fix/docs/style
✅ Test your code before pushing
✅ No `console.log()` in final code
✅ Format code with Prettier before committing

**Communication Rules:**
✅ Respond to messages within 24 hours
✅ Post daily standups every morning
✅ Ask questions - no question is stupid!
✅ Help others when you can
✅ Be respectful and supportive

**Git Rules:**
✅ Pull before you push
✅ Never force push to main
✅ Review PRs within 48 hours
✅ Merge only after approval
✅ Delete branches after merging

**Live Share Etiquette:**
✅ Ask before editing someone's code
✅ Use voice chat for better communication
✅ Take turns being driver/navigator
✅ Save your work before joining a session

React with 📜 to agree to these rules!
```

---

## 📋 Message 17: Quick Reference

```
**Quick Reference Guide** 📖

**Common Git Commands:**
```bash
# Start new feature
git checkout -b feature/name

# Save changes
git add .
git commit -m "feat: description"
git push

# Update your branch
git pull origin main

# See what changed
git status
git diff
```

**Common npm Commands:**
```bash
# Start frontend
npm run dev

# Start backend
cd server && npm run start

# Install new package
npm install package-name

# Fix issues
npm install
```

**VS Code Shortcuts:**
```
Ctrl+P - Quick file search
Ctrl+Shift+P - Command palette
Ctrl+` - Toggle terminal
Ctrl+/ - Comment line
Ctrl+S - Save
Ctrl+Shift+F - Search in files
```

**Live Share:**
```
Start session: Click "Live Share" button
Join session: Click the link
Share terminal: Terminal → Share
Stop session: Click "Live Share" → Stop
```

**Bookmark this message!** 📌
```

---

## 📋 Message 18: First Team Meeting

```
**FIRST TEAM MEETING** 🎉

**When:** [Set a time - e.g., Today at 6 PM]
**Where:** Voice channel "Team Meeting"
**Duration:** 30 minutes

**Agenda:**
1. Introductions (5 min)
   - Name, experience, what you want to learn

2. Project Overview (10 min)
   - What we're building
   - Tech stack walkthrough
   - Demo of current features

3. Task Assignment (10 min)
   - Review project board
   - Pick first tasks
   - Set deadlines

4. Q&A (5 min)
   - Any questions?
   - Concerns?
   - Suggestions?

**After meeting:**
- I'll create GitHub issues for all tasks
- Everyone picks their first task
- We start coding tomorrow!

**See you there!** 🚀

React with 🎉 if you can make it!
```

---

## 📋 Message 19: Troubleshooting

```
**Common Issues & Solutions** 🔧

**"npm install failed"**
```bash
# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

**"Port already in use"**
```bash
# Kill the process on that port
# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

**"Git push rejected"**
```bash
# Pull first, then push
git pull origin your-branch
git push origin your-branch
```

**"Merge conflict"**
1. Open the file in VS Code
2. Choose which changes to keep
3. Remove conflict markers (<<<<, ====, >>>>)
4. Save and commit

**"Can't join Live Share"**
1. Make sure you're signed in
2. Click the link again
3. Restart VS Code
4. Check firewall settings

**Still stuck?**
Post in #code-help with:
- What you were trying to do
- Error message (screenshot)
- What you've tried

We'll help! 💪
```

---

## 📋 Message 20: Resources & Links

```
**Useful Resources** 📚

**Project Links:**
🔗 GitHub Repo: [YOUR_REPO_URL]
🔗 Project Board: [TRELLO/GITHUB_PROJECTS_URL]
🔗 Documentation: Check `docs/` folder in repo

**Learning Resources:**
📖 React: https://react.dev/learn
📖 Git: https://learngitbranching.js.org/
📖 VS Code: https://code.visualstudio.com/docs
📖 Tailwind CSS: https://tailwindcss.com/docs

**Tools:**
🛠️ VS Code: https://code.visualstudio.com/
🛠️ GitHub Desktop: https://desktop.github.com/
🛠️ Postman: https://www.postman.com/ (for API testing)

**Our Stack:**
⚛️ Frontend: React + Vite + Tailwind CSS
🔧 Backend: Node.js + Express + TypeScript
🗄️ Database: PostgreSQL + Prisma
🔌 Real-time: Socket.IO

**Quick Help:**
❓ Ask in #code-help
🐛 Report bugs in #bugs
💡 Share ideas in #general

Let's build something amazing! 🚀
```

---

## 📋 Message 21: Celebration & Next Steps

```
**🎉 SETUP COMPLETE! 🎉**

**Congratulations team!** You've successfully:
✅ Set up Discord
✅ Created GitHub account
✅ Installed all tools
✅ Cloned the repository
✅ Made your first commit
✅ Tested Live Share

**You're now ready to code!** 💻

**Next Steps:**

**Today:**
- Explore the codebase
- Read the docs in `docs/` folder
- Join the team meeting

**Tomorrow:**
- Post your first daily standup
- Pick a task from the board
- Start coding!

**This Week:**
- Complete your first feature
- Create your first PR
- Review a teammate's code

**Remember:**
- Ask questions in #code-help
- Use Live Share for pair programming
- Commit and push daily
- Have fun! 😊

**Let's make SchoolOS awesome!** 🚀

React with 🎊 if you're excited to start!
```

---

## 🎯 Bonus: Message Templates

### Daily Standup Template
```
**Daily Standup - [Your Name]**
📅 Feb 10, 2026

✅ Yesterday:
- Completed user authentication
- Fixed navbar bug

🎯 Today:
- Working on dashboard
- Adding charts

🚧 Blockers:
- None / Need help with [specific issue]
```

### Code Help Template
```
**Need Help** 🆘

**Issue:** [Brief description]

**What I'm trying to do:**
[Explain your goal]

**What's happening:**
[Describe the problem]

**What I've tried:**
- [Thing 1]
- [Thing 2]

**Error message:**
```
[Paste error or screenshot]
```

**Code:**
```js
[Paste relevant code]
```
```

### PR Description Template
```
**Pull Request: [Feature Name]**

**What this PR does:**
- [Change 1]
- [Change 2]

**Testing:**
✅ Tested locally
✅ No console errors
✅ Responsive on mobile

**Screenshots:**
[Add screenshots if UI changes]

**Ready for review!** @teammate
```

---

**Save this file for reference when onboarding new team members!**
