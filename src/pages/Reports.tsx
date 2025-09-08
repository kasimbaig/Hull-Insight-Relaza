import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import HvacReport from './HvacReport';

const Reports = () => {
  const handleDownloadReport = () => {
    // Create a new window for landscape printing/downloading
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Get the current report content
      const reportElement = document.querySelector('.max-w-7xl');
      if (reportElement) {
        const reportHTML = reportElement.outerHTML;
        
        // Create landscape-optimized HTML
        const landscapeHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HVAC Report - Landscape</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: A4 landscape;
                margin: 0.5in;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .table-container {
                  overflow: visible !important;
                }
                table {
                  width: 100% !important;
                  min-width: auto !important;
                  font-size: 10px;
                }
                th, td {
                  padding: 4px 6px !important;
                  white-space: nowrap;
                }
                .max-w-7xl {
                  max-width: none !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                .p-6 {
                  padding: 8px !important;
                }
                .text-3xl {
                  font-size: 1.5rem !important;
                }
                .text-xl {
                  font-size: 1rem !important;
                }
              }
            </style>
          </head>
          <body class="bg-white">
            ${reportHTML}
            <script>
              // Auto-print when loaded
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            </script>
          </body>
          </html>
        `;
        
        printWindow.document.write(landscapeHTML);
        printWindow.document.close();
      }
    }
  };

  const handlePrintReport = () => {
    // Create a new window for landscape printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Get the current report content
      const reportElement = document.querySelector('.max-w-7xl');
      if (reportElement) {
        const reportHTML = reportElement.outerHTML;
        
        // Create landscape-optimized HTML for printing
        const landscapeHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HVAC Report - Print</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page {
                size: A4 landscape;
                margin: 0.5in;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .table-container {
                  overflow: visible !important;
                }
                table {
                  width: 100% !important;
                  min-width: auto !important;
                  font-size: 10px;
                }
                th, td {
                  padding: 4px 6px !important;
                  white-space: nowrap;
                }
                .max-w-7xl {
                  max-width: none !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                .p-6 {
                  padding: 8px !important;
                }
                .text-3xl {
                  font-size: 1.5rem !important;
                }
                .text-xl {
                  font-size: 1rem !important;
                }
              }
            </style>
          </head>
          <body class="bg-white">
            ${reportHTML}
            <script>
              // Auto-print when loaded
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              };
            </script>
          </body>
          </html>
        `;
        
        printWindow.document.write(landscapeHTML);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="space-y-6">
     
      <HvacReport />
    </div>
  );
};

export default Reports;
