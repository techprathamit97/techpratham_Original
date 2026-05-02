import React from 'react';

export default function TestGoogleConfig() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Google OAuth Configuration Test</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">GOOGLE_CLIENT_ID:</p>
                <p className="font-mono text-sm bg-gray-700 p-2 rounded break-all">
                  {clientId || '❌ NOT SET'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">GOOGLE_CLIENT_SECRET:</p>
                <p className="font-mono text-sm bg-gray-700 p-2 rounded">
                  {clientSecret ? '✅ SET (hidden for security)' : '❌ NOT SET'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">NEXTAUTH_URL:</p>
                <p className="font-mono text-sm bg-gray-700 p-2 rounded">
                  {process.env.NEXTAUTH_URL || '❌ NOT SET'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded">
            <h3 className="font-semibold mb-2">⚠️ Important Checks:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Client ID should end with .apps.googleusercontent.com</li>
              <li>Client Secret should start with GOCSPX-</li>
              <li>NEXTAUTH_URL should be http://localhost:3000</li>
              <li>After updating .env.local, restart your dev server</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded">
            <h3 className="font-semibold mb-2">📋 Steps to Fix:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to Google Cloud Console</li>
              <li>Click on "TechPratham" OAuth client (the blue link)</li>
              <li>Copy the FULL Client ID (click the copy icon)</li>
              <li>Copy the Client Secret</li>
              <li>Update your .env.local file</li>
              <li>Restart dev server (Ctrl+C then npm run dev)</li>
            </ol>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Expected Format:</h3>
            <pre className="bg-gray-700 p-3 rounded text-xs overflow-x-auto">
{`GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
