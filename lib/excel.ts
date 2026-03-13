import * as XLSX from 'xlsx';
import * as fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'invoice_logs.xlsx');

export interface LogEntry {
    'Invoice ID': string;
    'Merchant': string;
    'Date': string;
    'Amount': number | string;
    'Currency': string;
    'Status': string;
    'Risk Score': number;
    'Processed At': string;
    'Details': string; // Stringified JSON of full analysis
}

function cleanAmount(val: any): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    // Remove commas and other non-numeric characters except decimal point
    const cleaned = String(val).replace(/,/g, '').match(/[0-9.]+/);
    const parsed = cleaned ? parseFloat(cleaned[0]) : 0;
    return isNaN(parsed) ? 0 : parsed;
}

export async function logInvoiceAction(data: any) {
    let workbook: XLSX.WorkBook;
    let worksheet: XLSX.WorkSheet;
    const headers = ['Invoice ID', 'Merchant', 'Date', 'Amount', 'Currency', 'Status', 'Risk Score', 'Processed At', 'Details'];

    const rawAmount = data.validation?.extracted_fields?.amount;
    const amount = cleanAmount(rawAmount);

    const rowData: LogEntry = {
        'Invoice ID': data.invoice_id,
        'Merchant': data.validation?.extracted_fields?.merchant_name || 'Unknown',
        'Date': data.validation?.extracted_fields?.invoice_date || 'Unknown',
        'Amount': amount,
        'Currency': data.validation?.extracted_fields?.currency || '',
        'Status': data.status,
        'Risk Score': data.overall_risk_score,
        'Processed At': data.processed_at,
        'Details': JSON.stringify(data)
    };

    try {
        if (fs.existsSync(FILE_PATH)) {
            const fileBuffer = fs.readFileSync(FILE_PATH);
            workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            worksheet = workbook.Sheets[sheetName];
            const existingData = XLSX.utils.sheet_to_json(worksheet) as LogEntry[];
            existingData.push(rowData);
            const newWorksheet = XLSX.utils.json_to_sheet(existingData, { header: headers });
            workbook.Sheets[sheetName] = newWorksheet;
        } else {
            workbook = XLSX.utils.book_new();
            worksheet = XLSX.utils.json_to_sheet([rowData], { header: headers });
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
        }

        const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        fs.writeFileSync(FILE_PATH, buf);
        console.log('📊 Logged to Excel successfully');
    } catch (error) {
        console.error('❌ Failed to log to Excel:', error);
    }
}

export async function getInvoiceLogs(): Promise<LogEntry[]> {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            return [];
        }
        const fileBuffer = fs.readFileSync(FILE_PATH);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet) as LogEntry[];
    } catch (error) {
        console.error('❌ Failed to read Excel logs:', error);
        return [];
    }
}
