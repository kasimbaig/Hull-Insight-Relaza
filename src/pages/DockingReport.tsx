import React from 'react';
import DockingReportHTML from '@/components/reports/DockingReportHTML';
import { DockingReport } from '@/types/reports';

const DockingReportPage = () => {
  // Sample data for demonstration - replace with actual data from API
  const sampleReport: DockingReport = {
    id: 1,
    vessel_name: "INS Vikrant",
    vessel_id: 1001,
    docking_purpose: "Routine Maintenance and Hull Inspection",
    docking_version: "v2.1",
    status: "Approved",
    created_date: "2024-01-15",
    approved_date: "2024-01-20",
    refitting_authority: "Mazagon Dock Shipbuilders Limited",
    command_hq: "Western Naval Command",
    vessel_length: 262.5,
    vessel_beam: 62.0,
    vessel_draught: 8.4
  };

  return (
    <div className="space-y-6">
      <DockingReportHTML report={sampleReport} />
    </div>
  );
};

export default DockingReportPage;
