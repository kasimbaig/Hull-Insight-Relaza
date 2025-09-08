import React from 'react';

// Shared styles for all report components
export const ReportStyles = () => (
  <style>{`
    .report-content {
      width: 100%;
    }
    .report-content table {
      table-layout: fixed;
      width: 100%;
    }
    .report-content th,
    .report-content td {
      word-wrap: break-word;
      overflow-wrap: break-word;
      padding: 8px 12px;
      font-size: 12px;
      line-height: 1.4;
      border-bottom: 1px solid #d1d5db;
    }
    .report-content th {
      padding-bottom: 10px;
      font-weight: 600;
    }
    .report-content td {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .report-content .table-container {
      overflow-x: hidden;
    }
    .report-content th:nth-child(1),
    .report-content td:nth-child(1) { width: 4%; }
    .report-content th:nth-child(2),
    .report-content td:nth-child(2) { width: 12%; }
    .report-content th:nth-child(3),
    .report-content td:nth-child(3) { width: 10%; }
    .report-content th:nth-child(4),
    .report-content td:nth-child(4) { width: 6%; }
    .report-content th:nth-child(5),
    .report-content td:nth-child(5) { width: 8%; }
    .report-content th:nth-child(6),
    .report-content td:nth-child(6) { width: 8%; }
    .report-content th:nth-child(7),
    .report-content td:nth-child(7) { width: 10%; }
    .report-content th:nth-child(8),
    .report-content td:nth-child(8) { width: 8%; }
    .report-content th:nth-child(9),
    .report-content td:nth-child(9) { width: 8%; }
    .report-content th:nth-child(10),
    .report-content td:nth-child(10) { width: 8%; }
    .report-content th:nth-child(11),
    .report-content td:nth-child(11) { width: 6%; }
  `}</style>
);

// Common header component for all reports
export const ReportHeader = ({ 
  title, 
  subtitle, 
  onDownloadPDF, 
  onDownloadWord, 
  onClose 
}: {
  title: string;
  subtitle: string;
  onDownloadPDF: () => void;
  onDownloadWord: () => void;
  onClose?: () => void;
}) => (
  <div className="bg-blue-800 text-white p-8">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-center mb-4" style={{ fontSize: '36px', fontWeight: 'bold' }}>
          {title}
        </h1>
        <h2 className="text-2xl font-semibold text-center" style={{ fontSize: '24px', fontWeight: '600' }}>
          {subtitle}
        </h2>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          onClick={onDownloadPDF}
          className="bg-white text-blue-800 hover:bg-gray-100 px-4 py-2 rounded border border-white text-sm font-medium"
        >
          Download PDF
        </button>
        {/* <button
          onClick={onDownloadWord}
          className="bg-white text-blue-800 hover:bg-gray-100 px-4 py-2 rounded border border-white text-sm font-medium"
        >
          Download Word
        </button> */}
        {onClose && (
          <button
            onClick={onClose}
            className="bg-white text-blue-800 hover:bg-gray-100 px-4 py-2 rounded border border-white text-sm font-medium"
          >
            Close
          </button>
        )}
      </div>
    </div>
  </div>
);

// Common report container component
export const ReportContainer = ({ 
  children, 
  reportRef 
}: { 
  children: React.ReactNode; 
  reportRef: React.RefObject<HTMLDivElement>; 
}) => (
  <div className="bg-gray-100 p-4">
    <div className="max-w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <ReportStyles />
      {children}
    </div>
  </div>
);
