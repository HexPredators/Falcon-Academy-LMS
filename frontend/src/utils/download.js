export const downloadFile = (data, filename, mimeType = 'application/octet-stream') => {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  export const downloadCSV = (data, filename) => {
    const csvContent = typeof data === 'string' ? data : convertToCSV(data);
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  };
  
  export const downloadJSON = (data, filename) => {
    const jsonContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
  };
  
  export const downloadPDF = (data, filename) => {
    downloadFile(data, filename, 'application/pdf');
  };
  
  export const downloadImage = (data, filename, imageType = 'image/png') => {
    downloadFile(data, filename, imageType);
  };
  
  export const downloadExcel = (data, filename) => {
    downloadFile(data, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  };
  
  export const convertToCSV = (data) => {
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };
  
  export const convertToExcel = async (data, sheetName = 'Sheet1') => {
    if (typeof XLSX === 'undefined') {
      throw new Error('XLSX library not loaded');
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return excelBuffer;
  };
  
  export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  export const downloadURL = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const downloadBase64 = (base64Data, filename, mimeType) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    downloadBlob(blob, filename);
  };
  
  export const downloadCanvas = (canvas, filename, imageType = 'image/png') => {
    const dataUrl = canvas.toDataURL(imageType);
    downloadURL(dataUrl, filename);
  };
  
  export const downloadMultipleFiles = async (files, zipFilename = 'download.zip') => {
    if (typeof JSZip === 'undefined') {
      throw new Error('JSZip library not loaded');
    }
    
    const zip = new JSZip();
    
    for (const file of files) {
      if (file.data instanceof Blob) {
        zip.file(file.filename, file.data);
      } else if (typeof file.data === 'string') {
        zip.file(file.filename, file.data);
      } else {
        const blob = new Blob([file.data], { type: file.mimeType });
        zip.file(file.filename, blob);
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    downloadBlob(content, zipFilename);
  };
  
  export const generateExportData = (data, format = 'csv', options = {}) => {
    const defaultOptions = {
      includeHeaders: true,
      delimiter: ',',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: '0.00',
      escapeQuotes: true
    };
    
    const opts = { ...defaultOptions, ...options };
    
    if (format === 'csv') {
      return convertToCSV(data);
    } else if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (format === 'excel') {
      return convertToExcel(data, opts.sheetName);
    }
    
    throw new Error(`Unsupported format: ${format}`);
  };
  
  export const exportTable = (tableId, filename, format = 'csv') => {
    const table = document.getElementById(tableId);
    if (!table) {
      console.error(`Table with id ${tableId} not found`);
      return;
    }
    
    const rows = Array.from(table.querySelectorAll('tr'));
    const data = [];
    
    const headers = Array.from(rows[0].querySelectorAll('th, td'))
      .map(cell => cell.textContent.trim());
    
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td'));
      const rowData = {};
      
      cells.forEach((cell, index) => {
        const header = headers[index] || `Column ${index + 1}`;
        rowData[header] = cell.textContent.trim();
      });
      
      data.push(rowData);
    }
    
    if (format === 'csv') {
      downloadCSV(data, filename);
    } else if (format === 'json') {
      downloadJSON(data, filename);
    }
  };
  
  export const downloadReport = async (reportData, filename, format = 'pdf') => {
    const formats = {
      pdf: { mime: 'application/pdf', extension: 'pdf' },
      csv: { mime: 'text/csv', extension: 'csv' },
      excel: { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extension: 'xlsx' },
      json: { mime: 'application/json', extension: 'json' }
    };
    
    const formatInfo = formats[format];
    if (!formatInfo) {
      throw new Error(`Unsupported report format: ${format}`);
    }
    
    const fullFilename = filename.endsWith(`.${formatInfo.extension}`) 
      ? filename 
      : `${filename}.${formatInfo.extension}`;
    
    if (format === 'pdf') {
      downloadPDF(reportData, fullFilename);
    } else if (format === 'csv') {
      downloadCSV(reportData, fullFilename);
    } else if (format === 'excel') {
      downloadExcel(reportData, fullFilename);
    } else if (format === 'json') {
      downloadJSON(reportData, fullFilename);
    }
  };
  
  export const createDownloadLink = (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    return {
      url,
      filename,
      revoke: () => URL.revokeObjectURL(url)
    };
  };
  
  export const downloadStudentReport = async (studentId, reportType, format = 'pdf') => {
    try {
      const response = await fetch(`/api/reports/student/${studentId}/${reportType}?format=${format}`);
      if (!response.ok) throw new Error('Failed to fetch report');
      
      const blob = await response.blob();
      const filename = `student_report_${studentId}_${new Date().toISOString().split('T')[0]}.${format}`;
      
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  };
  
  export const downloadGradebook = async (params = {}, format = 'excel') => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/gradebook/export?${queryString}&format=${format}`);
      if (!response.ok) throw new Error('Failed to fetch gradebook');
      
      const blob = await response.blob();
      const filename = `gradebook_${new Date().toISOString().split('T')[0]}.${format}`;
      
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Error downloading gradebook:', error);
      throw error;
    }
  };
  
  export const downloadCertificate = async (certificateId, format = 'pdf') => {
    try {
      const response = await fetch(`/api/certificates/${certificateId}/download?format=${format}`);
      if (!response.ok) throw new Error('Failed to fetch certificate');
      
      const blob = await response.blob();
      const filename = `certificate_${certificateId}.${format}`;
      
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      throw error;
    }
  };
  
  export const downloadTranscript = async (studentId, format = 'pdf') => {
    try {
      const response = await fetch(`/api/transcripts/${studentId}/download?format=${format}`);
      if (!response.ok) throw new Error('Failed to fetch transcript');
      
      const blob = await response.blob();
      const filename = `transcript_${studentId}_${new Date().getFullYear()}.${format}`;
      
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Error downloading transcript:', error);
      throw error;
    }
  };
  
  export const generateAndDownload = async (generatorFn, filename, format = 'pdf') => {
    try {
      const data = await generatorFn();
      downloadReport(data, filename, format);
    } catch (error) {
      console.error('Error generating download:', error);
      throw error;
    }
  };
  
  export const downloadWithProgress = async (url, filename, onProgress) => {
    const response = await fetch(url);
    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      received += value.length;
      
      if (onProgress && total) {
        const percent = Math.round((received / total) * 100);
        onProgress(percent, received, total);
      }
    }
    
    const blob = new Blob(chunks);
    downloadBlob(blob, filename);
  };
  
  export const saveAs = (data, filename, mimeType) => {
    downloadFile(data, filename, mimeType);
  };
  
  export const downloadDataURI = (dataURI, filename) => {
    const link = document.createElement('a');
    link.href = dataURI;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const printContent = (content) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            @media print {
              @page { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  export const exportToClipboard = async (data, format = 'text') => {
    try {
      let text;
      
      if (format === 'csv') {
        text = convertToCSV(data);
      } else if (format === 'json') {
        text = JSON.stringify(data, null, 2);
      } else {
        text = String(data);
      }
      
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };