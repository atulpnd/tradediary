# Setup Guide: Google Sheets Backend & GitHub Pages Hosting

> **⚠️ IMPORTANT:** Your live website will show an "Action Required" screen until you complete **Part 1, Step 4**. This is the most common setup issue. Please follow the guide carefully.

Follow these steps carefully to connect your Trading Journal application to a Google Sheet and deploy it online for free.

## Part 1: Setting up the Google Sheet and Backend API

This part creates your database (the Google Sheet) and a secure API (Google Apps Script) to let your app talk to it.

### Step 1: Create Your Google Sheet

1.  Go to [sheets.google.com](https://sheets.google.com) and create a **new, blank spreadsheet**.
2.  Give it a name, for example, "TradingJournalData".
3.  The script will automatically create a sheet (tab) named **"Trades"** for you. Inside this sheet, it will also create the necessary headers. **You do not need to create the headers yourself.**

### Step 2: Create the Google Apps Script

1.  In your new Google Sheet, click on **Extensions > Apps Script**. This will open a new tab with the script editor.
2.  Delete any placeholder code in the `Code.gs` file.
3.  Open the `Code.gs.js` file from the application code.
4.  **Copy the entire contents** of `Code.gs.js` and **paste it into the empty script editor** in your browser.
5.  Click the **Save project** icon (looks like a floppy disk). Give the project a name when prompted, like "Trading Journal API".

### Step 3: Deploy the Script as a Web App

This is the most critical step. It turns your script into a live API endpoint (a URL) that your application can call.

1.  In the Apps Script editor, click the blue **Deploy** button in the top right corner.
2.  Select **New deployment**.
3.  Click the gear icon next to "Select type" and choose **Web app**.
4.  In the dialog that appears, configure the following:
    *   **Description:** (Optional) "API for my Trading Journal".
    *   **Execute as:** `Me`.
    *   **Who has access:** `Anyone`. **<-- IMPORTANT!** This does NOT mean anyone can see your data. It means anyone can *visit the API URL*. Your sheet itself remains private. The script only exposes the data you tell it to.
5.  Click **Deploy**.
6.  **Authorize access:** Google will ask you to authorize the script to access your Google Sheets.
    *   Choose your Google account.
    *   You will see a "Google hasn’t verified this app" warning. This is normal for your own scripts. Click **Advanced**, then click **Go to [Your Project Name] (unsafe)**.
    *   On the next screen, review the permissions and click **Allow**.
7.  After authorizing, you will see a **Deployment successfully updated** dialog with a **Web app URL**.
8.  **COPY THIS URL.** This is your unique API endpoint.

### Step 4: ⚠️ Connect The App To Your Backend (CRITICAL STEP)

This is the final and most important step to make your app work. If your live website shows a setup guide, it's because this step was missed or done incorrectly.

1.  Go back to your application code editor.
2.  Find and open the file named `constants.ts`.
3.  You will see the following line:
    ```javascript
    export const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    ```
4.  ➡️ **DELETE** the placeholder text `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'`.
5.  ➡️ **PASTE** the **Web app URL** you copied from the Google Apps Script deployment dialog.
6.  ✅ Save the file. Your `constants.ts` should now look something like this (with your own unique URL):
    ```javascript
    export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfy.../exec';
    ```

---

## Part 2: Deploying the Website

This part will publish your application to your free GitHub Pages URL.

### Step 1: Install Dependencies

If you haven't already, open a terminal in your project's root directory and run this command. This downloads all the necessary tools and libraries.

```bash
npm install
```

### Step 2: Deploy from Your Computer

1.  Make sure you have committed and pushed all your code changes (especially the updated `constants.ts` file) to your GitHub repository.
2.  Run the deploy command from your project's terminal:

    ```bash
    npm run deploy
    ```

This command automatically performs two actions:
1.  **`npm run build`**: Compiles your React and TypeScript code into plain HTML, CSS, and JavaScript and places it in a `dist` folder.
2.  **`gh-pages -d dist`**: Pushes the contents of that `dist` folder to a special branch in your repository named `gh-pages`.

---

## Part 3: **CRITICAL FINAL STEP** - Configure GitHub Repository

You must tell GitHub to use the `gh-pages` branch for your live website.

1.  Go to your repository on GitHub: `https://github.com/atulpnd/tradediary`
2.  Click on the **Settings** tab.
3.  In the left sidebar, click on **Pages**.
4.  Under the "Build and deployment" section, find the **Source** setting.
5.  It will likely say "Deploy from a branch". In the dropdown menus, make the following selections:
    *   **Branch:** Change from `main` (or `master`) to **`gh-pages`**.
    *   **Folder:** Leave this as **`/(root)`**.
6.  Click **Save**.

**That's it!** After a minute or two, GitHub will update your site. Go to your URL (`https://atulpnd.github.io/tradediary/`) and your application should now load correctly.

---

## 🚨 Troubleshooting

**Problem:** My live website shows a full-screen "Action Required" setup guide.

*   **Cause:** You have not updated the `constants.ts` file with your unique API URL from Google Apps Script. The app doesn't know where to load your data from.
*   **Solution:** Follow the on-screen instructions, or go back and carefully follow **Part 1, Step 4** of this guide. You must paste your deployed Web app URL into the `constants.ts` file and then re-deploy the application by running `npm run deploy`.