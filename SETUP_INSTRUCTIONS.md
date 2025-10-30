# Setup Guide: Google Sheets Backend & GitHub Pages Hosting

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

### Step 4: Connect the Frontend to Your New Backend

1.  Go back to your application code.
2.  Open the `constants.ts` file.
3.  Replace the placeholder `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with the **Web app URL you just copied**.
4.  Save the file.

Your application is now configured to use Google Sheets as its database! When you run the app locally, it should fetch and save data to your sheet.

---

## Part 2: Deploying to GitHub Pages

This part will publish your application to a free, public URL.

### Step 1: Create a GitHub Repository

1.  Go to [github.com](https://github.com) and create a new repository.
2.  Initialize the repository and push all your application code to it.

### Step 2: Install Deployment Package

In your project's terminal, run this command to install the `gh-pages` package, which simplifies deployment:

```bash
npm install gh-pages --save-dev
```

### Step 3: Configure `package.json`

You need to add three lines to your `package.json` file. (This file is not provided, so you'll need to create it if it doesn't exist by running `npm init -y` and then add your dependencies).

1.  **`homepage`**: At the top level of the JSON object, add a `homepage` key. The value should be `https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>`.
    *   Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPOSITORY_NAME>` accordingly.

2.  **`scripts`**: Inside the existing `scripts` object, add two new scripts: `predeploy` and `deploy`.

Your final `package.json` should look something like this (your dependencies might be different):

```json
{
  "name": "trading-journal",
  "version": "1.0.0",
  "homepage": "https://johndoe.github.io/trading-journal-app",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.3.0"
  },
  "devDependencies": {
    "gh-pages": "^6.1.1",
    "vite": "^5.0.0" 
  }
}
```
*Note: This app uses Vite for its build process. Ensure you have `vite` as a dev dependency (`npm install vite --save-dev`).*

### Step 4: Deploy!

1.  Commit and push the changes you made to `package.json`.
2.  Run the deploy command from your project's terminal:

    ```bash
    npm run deploy
    ```

3.  This will build your application and push the final static files to a special `gh-pages` branch in your repository.

4.  Go to your repository's settings on GitHub, navigate to the "Pages" section, and ensure that the source is set to deploy from the `gh-pages` branch.

**Done!** After a minute or two, your Trading Journal will be live at the URL you specified in the `homepage` field.
