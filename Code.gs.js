// --- CONFIGURATION ---
// Set the name of the sheet in your Google Sheet file where trades are stored.
const SHEET_NAME = "Trades";

// --- DO NOT EDIT BELOW THIS LINE ---

// Define the exact order of columns. This MUST match the order in your Google Sheet.
const HEADERS = [
  'id', 'tradeDate', 'strike', 'type', 'quantity', 
  'ceEntryPrice', 'ceExitPrice', 'peEntryPrice', 'peExitPrice', 
  'ceEntryTime', 'ceExitTime', 'peEntryTime', 'peExitTime', 'notes'
];

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    Logger.log(`Created sheet: "${SHEET_NAME}"`);
  }
  return sheet;
}

function handleResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Converts a 2D array from sheet data to an array of objects
function sheetDataToObjects(data) {
  const headers = data[0];
  const objects = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    objects.push(obj);
  }
  return objects;
}

// Converts a trade object to an array for a sheet row
function tradeObjectToRowArray(trade) {
    return HEADERS.map(header => trade[header] !== undefined ? trade[header] : "");
}


// Main function to handle GET requests
function doGet(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) { // Only header exists
      return handleResponse({ trades: [] });
    }
    const trades = sheetDataToObjects(data);
    return handleResponse({ trades: trades });
  } catch (error) {
    Logger.log(error);
    return handleResponse({ status: 'error', message: error.message });
  }
}

// Main function to handle POST requests
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // Wait up to 30 seconds for lock

  try {
    const sheet = getSheet();
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    switch (action) {
      case 'add': {
        const newTrade = payload.trade;
        const rowData = tradeObjectToRowArray(newTrade);
        sheet.appendRow(rowData);
        return handleResponse({ status: 'success', message: 'Trade added successfully', trade: newTrade });
      }

      case 'update': {
        const updatedTrade = payload.trade;
        const data = sheet.getDataRange().getValues();
        const idIndex = HEADERS.indexOf('id');
        
        for (let i = 1; i < data.length; i++) {
          // Compare as numbers to avoid type issues
          if (Number(data[i][idIndex]) === Number(updatedTrade.id)) {
            const rowData = tradeObjectToRowArray(updatedTrade);
            sheet.getRange(i + 1, 1, 1, HEADERS.length).setValues([rowData]);
            return handleResponse({ status: 'success', message: 'Trade updated successfully', trade: updatedTrade });
          }
        }
        return handleResponse({ status: 'error', message: 'Trade not found for update' });
      }

      case 'delete': {
        const idToDelete = payload.id;
        const data = sheet.getDataRange().getValues();
        const idIndex = HEADERS.indexOf('id');

        for (let i = data.length - 1; i > 0; i--) {
           // Compare as numbers
          if (Number(data[i][idIndex]) === Number(idToDelete)) {
            sheet.deleteRow(i + 1);
            return handleResponse({ status: 'success', message: 'Trade deleted successfully' });
          }
        }
        return handleResponse({ status: 'error', message: 'Trade not found for deletion' });
      }

      default:
        return handleResponse({ status: 'error', message: 'Invalid action' });
    }
  } catch (error) {
    Logger.log(error);
    return handleResponse({ status: 'error', message: error.message, stack: error.stack });
  } finally {
    lock.releaseLock();
  }
}
