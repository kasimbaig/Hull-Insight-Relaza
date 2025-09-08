import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { SurveyReport } from '@/types/reports';
import { ReportContainer, ReportHeader } from './ReportStyles';

interface SurveyReportHTMLProps {
  report: SurveyReport;
  onClose?: () => void;
}

const SurveyReportHTML: React.FC<SurveyReportHTMLProps> = ({ report, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      // Temporarily enable scrolling for PDF capture
      const tableContainers = reportRef.current.querySelectorAll('.table-container');
      tableContainers.forEach(container => {
        (container as HTMLElement).style.overflowX = 'auto';
      });

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
      });

      // Restore original styling
      tableContainers.forEach(container => {
        (container as HTMLElement).style.overflowX = 'hidden';
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape mode
      
      const imgWidth = 297; // A4 landscape width
      const pageHeight = 210; // A4 landscape height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Hull_Survey_${report.ship_name}_${report.quarter}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // const downloadWord = async () => {
  //   if (!reportRef.current) return;

  //   try {
  //     // Create Word document
  //     const doc = new Document({
  //       sections: [{
  //         properties: {},
  //         children: [
  //           // Title
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: "REPORT",
  //                 bold: true,
  //                 size: 48,
  //               }),
  //             ],
  //             alignment: AlignmentType.CENTER,
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: "QUARTERLY HULL SURVEY",
  //                 bold: true,
  //                 size: 36,
  //               }),
  //             ],
  //             alignment: AlignmentType.CENTER,
  //           }),
  //           new Paragraph({ text: "" }), // Empty line

  //           // Ship Information
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Ship Name - ${report.ship_name}`,
  //                 bold: true,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Quarter - ${report.quarter}`,
  //                 bold: true,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Survey Date - ${report.survey_date}`,
  //                 bold: true,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Reporting Officer - ${report.reporting_officer}`,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Status - ${report.status}`,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({ text: "" }), // Empty line

  //           // Defects Summary Table
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: "DEFECTS SUMMARY",
  //                 bold: true,
  //                 size: 20,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({ text: "" }), // Empty line

  //           // Defects table
  //           new Table({
  //             width: {
  //               size: 100,
  //               type: WidthType.PERCENTAGE,
  //             },
  //             rows: [
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Defect Type" })],
  //                     width: { size: 50, type: WidthType.PERCENTAGE },
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Count" })],
  //                     width: { size: 50, type: WidthType.PERCENTAGE },
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Total Defects" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.total_defects.toString() })],
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Critical Defects" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.critical_defects.toString() })],
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Minor Defects" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.minor_defects.toString() })],
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Resolved Defects" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.resolved_defects.toString() })],
  //                   }),
  //                 ],
  //               }),
  //             ],
  //           }),
  //         ],
  //       }],
  //     });

  //     const buffer = await Packer.toBuffer(doc);
  //     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  //     saveAs(blob, `Hull_Survey_${report.ship_name}_${report.quarter}.docx`);
  //   } catch (error) {
  //     console.error('Error generating Word document:', error);
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResolutionRate = () => {
    return report.total_defects > 0 ? Math.round((report.resolved_defects / report.total_defects) * 100) : 0;
  };

  return (
    <ReportContainer reportRef={reportRef}>
      <ReportHeader
        title="REPORT"
        subtitle="QUARTERLY HULL SURVEY"
        onDownloadPDF={downloadPDF}
        onDownloadWord={() => {}}
        onClose={onClose}
      />

        {/* Report Content */}
        <div ref={reportRef} className="report-content">
          {/* Ship Information Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-lg">Ship Name: {report.ship_name}</p>
                <p className="font-semibold text-lg">Quarter: {report.quarter}</p>
                <p className="font-semibold text-lg">Survey Date: {report.survey_date}</p>
              </div>
              <div>
                <p className="font-semibold text-lg">Reporting Officer: {report.reporting_officer}</p>
                <p className="font-semibold text-lg">Status: 
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </p>
                <p className="font-semibold text-lg">Resolution Rate: {getResolutionRate()}%</p>
              </div>
            </div>
          </div>

          {/* Defects Summary Table */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">DEFECTS SUMMARY</h3>
            
            <div className="w-full table-container">
              <table className="w-full text-sm" style={{ border: '1px solid #d1d5db' }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider" style={{ borderRight: '1px solid #d1d5db' }}>Defect Type</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Total Defects</td>
                    <td className="px-3 py-3 text-sm text-gray-900">{report.total_defects}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Critical Defects</td>
                    <td className="px-3 py-3 text-sm text-red-600 font-semibold">{report.critical_defects}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Minor Defects</td>
                    <td className="px-3 py-3 text-sm text-gray-900">{report.minor_defects}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Resolved Defects</td>
                    <td className="px-3 py-3 text-sm text-green-600 font-semibold">{report.resolved_defects}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Survey Status Information */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-bold mb-3">Survey Status Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-semibold">Report ID:</span> {report.id}</p>
                <p><span className="font-semibold">Ship ID:</span> {report.ship_id}</p>
                <p><span className="font-semibold">Return Delayed:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    report.return_delayed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {report.return_delayed ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
              <div>
                <p><span className="font-semibold">Entire Ship Surveyed:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    report.entire_ship_surveyed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.entire_ship_surveyed ? 'Yes' : 'No'}
                  </span>
                </p>
                <p><span className="font-semibold">Pending Defects:</span> {report.total_defects - report.resolved_defects}</p>
                <p><span className="font-semibold">Critical Issues:</span> 
                  <span className={`ml-2 ${report.critical_defects > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}`}>
                    {report.critical_defects > 0 ? `${report.critical_defects} Critical Defects Found` : 'No Critical Defects'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-6">
            <h3 className="text-lg font-bold mb-3">Defect Resolution Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-[#00809D] h-4 rounded-full transition-all duration-300" 
                style={{ width: `${getResolutionRate()}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {report.resolved_defects} of {report.total_defects} defects resolved ({getResolutionRate()}%)
            </p>
          </div>
        </div>
    </ReportContainer>
  );
};

export default SurveyReportHTML;
