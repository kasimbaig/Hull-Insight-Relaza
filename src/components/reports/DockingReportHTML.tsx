import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { DockingReport } from '@/types/reports';
import { ReportContainer, ReportHeader } from './ReportStyles';

interface DockingReportHTMLProps {
  report: DockingReport;
  onClose?: () => void;
}

const DockingReportHTML: React.FC<DockingReportHTMLProps> = ({ report, onClose }) => {
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

      pdf.save(`Docking_Plan_${report.vessel_name}_${report.created_date}.pdf`);
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
  //                 text: "DOCKING PLAN",
  //                 bold: true,
  //                 size: 36,
  //               }),
  //             ],
  //             alignment: AlignmentType.CENTER,
  //           }),
  //           new Paragraph({ text: "" }), // Empty line

  //           // Vessel Information
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Vessel Name - ${report.vessel_name}`,
  //                 bold: true,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Docking Purpose - ${report.docking_purpose}`,
  //                 bold: true,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Status - ${report.status}`,
  //                 bold: true,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Created Date - ${report.created_date}`,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Refitting Authority - ${report.refitting_authority}`,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: `Command HQ - ${report.command_hq}`,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({ text: "" }), // Empty line

  //           // Vessel Specifications Table
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: "VESSEL SPECIFICATIONS",
  //                 bold: true,
  //                 size: 20,
  //               }),
  //             ],
  //           }),
  //           new Paragraph({ text: "" }), // Empty line

  //           // Specifications table
  //           new Table({
  //             width: {
  //               size: 100,
  //               type: WidthType.PERCENTAGE,
  //             },
  //             rows: [
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Specification" })],
  //                     width: { size: 50, type: WidthType.PERCENTAGE },
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Value" })],
  //                     width: { size: 50, type: WidthType.PERCENTAGE },
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Vessel Length (m)" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.vessel_length.toString() })],
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Vessel Beam (m)" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.vessel_beam.toString() })],
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Vessel Draught (m)" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.vessel_draught.toString() })],
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({
  //                     children: [new Paragraph({ text: "Docking Version" })],
  //                   }),
  //                   new TableCell({
  //                     children: [new Paragraph({ text: report.docking_version || 'N/A' })],
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
  //     saveAs(blob, `Docking_Plan_${report.vessel_name}_${report.created_date}.docx`);
  //   } catch (error) {
  //     console.error('Error generating Word document:', error);
  //   }
  // };

  return (
    <ReportContainer reportRef={reportRef}>
      <ReportHeader
        title="REPORT"
        subtitle="DOCKING PLAN"
        onDownloadPDF={downloadPDF}
        onDownloadWord={() => {}}
        onClose={onClose}
      />

        {/* Report Content */}
        <div ref={reportRef} className="report-content">
          {/* Vessel Information Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-lg">Vessel Name: {report.vessel_name}</p>
                <p className="font-semibold text-lg">Docking Purpose: {report.docking_purpose}</p>
                <p className="font-semibold text-lg">Status: {report.status}</p>
              </div>
              <div>
                <p className="font-semibold text-lg">Created Date: {report.created_date}</p>
                <p className="font-semibold text-lg">Refitting Authority: {report.refitting_authority}</p>
                <p className="font-semibold text-lg">Command HQ: {report.command_hq}</p>
              </div>
            </div>
          </div>

          {/* Vessel Specifications Table */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">VESSEL SPECIFICATIONS</h3>
            
            <div className="w-full table-container">
              <table className="w-full text-sm" style={{ border: '1px solid #d1d5db' }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider" style={{ borderRight: '1px solid #d1d5db' }}>Specification</th>
                    <th className="px-3 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Vessel Length (m)</td>
                    <td className="px-3 py-3 text-sm text-gray-900">{report.vessel_length}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Vessel Beam (m)</td>
                    <td className="px-3 py-3 text-sm text-gray-900">{report.vessel_beam}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Vessel Draught (m)</td>
                    <td className="px-3 py-3 text-sm text-gray-900">{report.vessel_draught}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900" style={{ borderRight: '1px solid #d1d5db' }}>Docking Version</td>
                    <td className="px-3 py-3 text-sm text-gray-900">{report.docking_version || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-bold mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-semibold">Report ID:</span> {report.id}</p>
                <p><span className="font-semibold">Vessel ID:</span> {report.vessel_id}</p>
              </div>
              <div>
                <p><span className="font-semibold">Approved Date:</span> {report.approved_date || 'Pending'}</p>
                <p><span className="font-semibold">Report Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    report.status === 'Command Review' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'IHQ Review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
    </ReportContainer>
  );
};

export default DockingReportHTML;
