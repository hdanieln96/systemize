# Systemize - GitHub Pages Setup

This directory contains all the policy pages and documentation for the Systemize app, ready to be hosted on GitHub Pages.

## 📁 Files Included

### HTML Pages (for web hosting)
- `index.html` - Main landing page
- `privacy-policy.html` - Privacy Policy
- `terms-of-service.html` - Terms of Service
- `support.html` - Support and FAQ page

### Markdown Files (for reference)
- `privacy-policy.md` - Privacy Policy (markdown)
- `terms-of-service.md` - Terms of Service (markdown)
- `support.md` - Support documentation (markdown)

## 🚀 How to Deploy to GitHub Pages

### Option 1: Deploy from this repo

1. **Push to GitHub:**
   ```bash
   cd /Users/daniel/Coding/lifeplanner/lifeplanner-app
   git add docs/
   git commit -m "Add policy pages for GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** > **Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose branch: `main`
   - Choose folder: `/docs`
   - Click **Save**

3. **Wait 1-2 minutes** for deployment

4. **Your site will be live at:**
   ```
   https://hdanieln96.github.io/systemize/
   ```

### Option 2: Create a dedicated repo

1. **Create new repo:** `systemize-website` or `systemize.github.io`

2. **Copy files:**
   ```bash
   cp -r docs/* /path/to/systemize-website/
   ```

3. **Push and enable Pages** (same as Option 1)

## 🔗 URLs for App Store Submission

Once deployed, use these URLs in App Store Connect:

**Privacy Policy URL:**
```
https://hdanieln96.github.io/systemize/privacy-policy.html
```

**Terms of Service URL:**
```
https://hdanieln96.github.io/systemize/terms-of-service.html
```

**Support URL:**
```
https://hdanieln96.github.io/systemize/support.html
```

**Marketing URL (optional):**
```
https://hdanieln96.github.io/systemize/
```

## ✏️ Customization Required

Before deploying, replace the following placeholders in ALL files:

### Email Address
Replace `dlitelxs@gmail.com` with your actual support email.

### GitHub Username
Replace `hdanieln96` with your actual GitHub username.

### Optional Updates
- **Jurisdiction** (in terms-of-service): Replace `[Your State/Country]` with your location
- **Social Media** (in index.html/support.html): Add Twitter handle if you create one

### Quick Find & Replace

```bash
# From the docs directory
cd docs/

# Replace email
find . -name "*.html" -exec sed -i '' 's/\[your-email@example.com\]/yourname@example.com/g' {} +
find . -name "*.md" -exec sed -i '' 's/\[your-email@example.com\]/yourname@example.com/g' {} +

# Replace GitHub username
find . -name "*.html" -exec sed -i '' 's/\[your-username\]/yourusername/g' {} +
find . -name "*.md" -exec sed -i '' 's/\[your-username\]/yourusername/g' {} +
```

## 🧪 Testing Locally

Before deploying, test the pages locally:

```bash
# Using Python (built-in on macOS)
cd docs/
python3 -m http.server 8000

# Or using Node.js
npx http-server docs/ -p 8000
```

Then visit: `http://localhost:8000`

## 📝 Updating Policies

To update policies after deployment:

1. Edit the HTML files in `docs/`
2. Commit and push changes
3. GitHub Pages will auto-update within 1-2 minutes
4. No need to update the App Store submission (URLs stay the same)

## 🎨 Styling

All pages use:
- **Primary color:** #4A90E2 (Deep Ocean Blue)
- **Dark accent:** #2E5C8A
- **Font:** Apple system fonts (-apple-system)
- **Responsive design:** Mobile-friendly

To change colors, update the `<style>` sections in each HTML file.

## ✅ Checklist Before Deployment

- [ ] Replace `dlitelxs@gmail.com` with real email
- [ ] Replace `hdanieln96` with GitHub username
- [ ] Update jurisdiction in Terms of Service
- [ ] Test all pages locally
- [ ] Check all internal links work
- [ ] Verify responsive design on mobile
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Verify live URLs work
- [ ] Copy URLs to App Store Connect

## 📱 App Store Connect Integration

When filling out App Store Connect:

1. **App Privacy section:**
   - Choose "No" for data collection
   - Link to Privacy Policy URL

2. **App Information:**
   - Privacy Policy URL: `https://[username].github.io/systemize/privacy-policy.html`
   - Support URL: `https://[username].github.io/systemize/support.html`
   - Marketing URL (optional): `https://[username].github.io/systemize/`

3. **App Review Information:**
   - In the notes, you can reference the Terms of Service URL

## 🆘 Support

If you encounter issues:
- Check GitHub Pages is enabled in repo settings
- Verify branch and folder are correctly selected
- Wait 2-3 minutes after enabling for first deployment
- Check repository visibility (public repos work best)

---

**Ready to deploy!** Follow the steps above and your policy pages will be live.
