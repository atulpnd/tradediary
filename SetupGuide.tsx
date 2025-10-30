import React from 'react';

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-brand-bg border border-brand-border rounded-md p-4 mt-2 mb-4 overflow-x-auto">
        <code className="font-mono text-sm text-yellow-300">
            {children}
        </code>
    </pre>
);

const SetupGuide: React.FC = () => {
    return (
        <div className="min-h-screen bg-brand-bg flex justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl bg-brand-surface border border-yellow-500 rounded-lg shadow-2xl p-6 sm:p-8">
                <div className="flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-300">Action Required: Connect Your Backend</h1>
                        <p className="text-md text-brand-text-secondary mt-1">Your app isn't connected to your Google Sheet. Please follow these steps.</p>
                    </div>
                </div>

                <div className="space-y-6 text-brand-text-primary">
                    <div>
                        <h2 className="text-lg font-semibold">Step 1: Get Your Google Apps Script URL</h2>
                        <p className="text-sm text-brand-text-secondary">If you don't have it, go to your Google Sheet, click <span className="font-mono text-yellow-400">Extensions &gt; Apps Script</span>, then click <span className="font-mono text-yellow-400">Deploy &gt; Manage deployments</span>. Copy the <span className="font-semibold">Web app URL</span>.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">Step 2: Open `constants.ts`</h2>
                        <p className="text-sm text-brand-text-secondary">In your code editor, find and open the file named <span className="font-mono bg-brand-bg p-1 rounded">constants.ts</span>.</p>
                    </div>
                    
                    <div>
                        <h2 className="text-lg font-semibold">Step 3: Paste Your URL</h2>
                        <p className="text-sm text-brand-text-secondary">Replace the placeholder text with the URL you copied. </p>
                        <p className="text-sm text-brand-text-secondary mt-1">It should change from this:</p>
                        <CodeBlock>
                            {`export const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`}
                        </CodeBlock>
                        <p className="text-sm text-brand-text-secondary">To something like this (your URL will be unique):</p>
                         <CodeBlock>
                            {`export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AK.../exec';`}
                        </CodeBlock>
                    </div>
                    
                    <div>
                        <h2 className="text-lg font-semibold">Step 4: Re-Deploy Your App</h2>
                        <p className="text-sm text-brand-text-secondary">Save the `constants.ts` file, then run the following command in your terminal to publish the changes:</p>
                        <CodeBlock>
                            {`npm run deploy`}
                        </CodeBlock>
                    </div>
                </div>
                 <p className="mt-8 text-center text-sm text-brand-text-secondary">Once you re-deploy, refresh your live website. This message will disappear and your trading data will load.</p>
            </div>
        </div>
    );
};

export default SetupGuide;