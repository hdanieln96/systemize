# App Store Deployment Guide for LifePlanner

## Prerequisites Checklist

### 1. Apple Developer Account
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Account has "App Manager" or "Admin" role
- [ ] Two-factor authentication enabled
- [ ] Payment information set up

### 2. App Store Connect Setup
- [ ] Log in to [App Store Connect](https://appstoreconnect.apple.com)
- [ ] Create a new app listing:
  - Platform: iOS
  - Name: LifePlanner
  - Primary Language: English
  - Bundle ID: com.danieln96.lifeplannerapp
  - SKU: lifeplannerapp (or your preferred unique identifier)

### 3. Required Information for App Store Listing

#### App Information
- **App Name**: LifePlanner
- **Subtitle**: (50 characters max) e.g., "Plan Your Life with Ease"
- **Category**: Primary: Productivity, Secondary: Lifestyle
- **Privacy Policy URL**: Required - you need to create and host one
- **Support URL**: Your support page/email

#### App Description
Write a compelling description (up to 4000 characters) that includes:
- What the app does
- Key features (tasks, habits, timeline view, etc.)
- Benefits to users
- Any unique selling points

#### Screenshots Required
You'll need screenshots in these sizes:
- **iPhone 6.7" Display** (1290 x 2796 pixels) - Required
- **iPhone 6.5" Display** (1242 x 2688 pixels) - Optional but recommended
- **iPad Pro 12.9" Display** (2048 x 2732 pixels) - If supporting iPad

**Tip**: You can take screenshots from simulators:
```bash
# Start simulator and navigate to different screens
xcrun simctl io booted screenshot screenshot-1.png
```

#### App Preview (Optional)
- 15-30 second videos showing app functionality
- Same device sizes as screenshots

#### Keywords
- 100 characters max
- Separated by commas
- Example: "productivity,planner,habits,tasks,todo,timeline,goals,organize"

#### Promotional Text
- 170 characters
- Can be updated without new submission
- Example: "Take control of your day with LifePlanner - the ultimate productivity companion"

---

## Deployment Steps

### Step 1: Configure Your Apple Developer Credentials

1. **Get your Apple Team ID**:
   - Log in to [Apple Developer](https://developer.apple.com/account)
   - Go to "Membership" section
   - Copy your Team ID (10-character string)

2. **Get your App Store Connect App ID**:
   - Log in to [App Store Connect](https://appstoreconnect.apple.com)
   - Go to "My Apps"
   - Click on your app (or create it if not exists)
   - The App ID is in the URL: `https://appstoreconnect.apple.com/apps/{YOUR_APP_ID}/appstore`

3. **Update eas.json** with your information:
   ```json
   "submit": {
     "production": {
       "ios": {
         "appleId": "your-apple-id@example.com",
         "ascAppId": "YOUR_APP_STORE_CONNECT_APP_ID",
         "appleTeamId": "YOUR_TEAM_ID"
       }
     }
   }
   ```

### Step 2: Authenticate with EAS

```bash
# Login to your Expo account (create one if needed)
npx eas login

# Configure your project (if not already done)
npx eas build:configure
```

### Step 3: Build for Production

```bash
# Create a production build for iOS
npx eas build --platform ios --profile production

# This will:
# - Create a production-ready IPA file
# - Upload it to EAS servers
# - Provide you with a build URL
```

**Note**: The first build will prompt you to:
- Generate or provide Apple Distribution Certificate
- Generate or provide Provisioning Profile
- EAS can handle this automatically (recommended for first-time users)

### Step 4: Submit to App Store

Once the build completes successfully:

```bash
# Submit to App Store Connect
npx eas submit --platform ios --latest

# Or manually download the IPA and upload via Transporter app
```

### Step 5: Complete App Store Connect Listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app
3. Select the build that was just uploaded
4. Complete all required fields:
   - Screenshots
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL
   - Age Rating questionnaire
   - Review information (demo account if needed)
   - Contact information

### Step 6: Submit for Review

1. Click "Submit for Review"
2. Answer App Review questions
3. Submit

**Review Time**: Typically 24-48 hours, but can take up to a week.

---

## Common Issues & Solutions

### Issue: "Missing Compliance"
If your app uses encryption (most apps do for HTTPS):
1. In App Store Connect, go to your build
2. Select "Provide Export Compliance Documentation"
3. Answer "No" if you only use standard HTTPS encryption

### Issue: "Missing Privacy Policy"
- You must provide a privacy policy URL
- Free options: Use a privacy policy generator online
- Host it on GitHub Pages or your website

### Issue: "Rejected for Guideline X"
- Read the rejection reason carefully
- Common issues:
  - Missing functionality (app crashes)
  - Incomplete information
  - Privacy issues
  - Design issues
- Fix the issue, create a new build, and resubmit

---

## After Approval

### Release Options
1. **Manual Release**: You control when the app goes live
2. **Automatic Release**: Goes live immediately after approval
3. **Scheduled Release**: Choose a specific date/time

### Post-Launch
- Monitor App Store Connect for reviews and ratings
- Check crash reports in App Store Connect
- Respond to user reviews (increases engagement)

---

## Updating Your App

When you need to release an update:

1. Update version in [app.json](app.json):
   ```json
   "version": "1.0.1",  // or "1.1.0" for minor updates, "2.0.0" for major
   ```

2. Build and submit:
   ```bash
   npx eas build --platform ios --profile production
   npx eas submit --platform ios --latest
   ```

3. Update "What's New" in App Store Connect
4. Submit for review

---

## Useful Commands

```bash
# Check build status
npx eas build:list

# View build logs
npx eas build:view [BUILD_ID]

# Run a local build (for testing)
npx eas build --platform ios --profile preview --local

# Check credentials
npx eas credentials
```

---

## Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://developer.apple.com/support/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

## Quick Reference: Complete Deployment Flow

```bash
# 1. Ensure you're logged in
npx eas login

# 2. Build for production
npx eas build --platform ios --profile production

# 3. Wait for build to complete (check status)
npx eas build:list

# 4. Submit to App Store
npx eas submit --platform ios --latest

# 5. Complete listing in App Store Connect
# 6. Submit for review
# 7. Wait for approval (24-48 hours typically)
# 8. Release to the App Store!
```

---

## Need Help?

- **EAS Support**: https://expo.dev/support
- **App Store Connect Support**: https://developer.apple.com/contact/
- **Community**: https://forums.expo.dev/
