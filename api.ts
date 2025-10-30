import { Trade } from './types';
import { APPS_SCRIPT_URL } from './constants';

const checkUrl = () => {
    if (APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        throw new Error("Please replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' in constants.ts with your actual Google Apps Script URL.");
    }
}

// Helper function to handle the POST request structure for Apps Script
async function postToAction(action: string, payload: object) {
    checkUrl();
    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        // The weird headers and body format are a common workaround for Google Apps Script web apps
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, ...payload }),
        mode: 'cors',
    });

    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.status !== 'success') {
        throw new Error(`API Error: ${result.message || 'Unknown error'}`);
    }
    return result;
}

export async function getTrades(): Promise<Trade[]> {
    checkUrl();
    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'GET',
        mode: 'cors',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch trades: ${response.statusText}`);
    }

    const data = await response.json();
    // The data comes from the sheet as an array of arrays, we need to convert it to objects
    return data.trades;
}

export async function addTrade(trade: Trade): Promise<any> {
    return postToAction('add', { trade });
}

export async function updateTrade(trade: Trade): Promise<any> {
    return postToAction('update', { trade });
}

export async function deleteTrade(id: number): Promise<any> {
    return postToAction('delete', { id });
}
