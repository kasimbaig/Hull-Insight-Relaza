import React from 'react';
import SurveyReportHTML from '@/components/reports/SurveyReportHTML';
import { SurveyReport } from '@/types/reports';

const SurveyReportPage = () => {
  // Sample data for demonstration - replace with actual data from API
  const sampleReport: SurveyReport = {
    id: 1,
    ship_name: "INS Rajput",
    ship_id: 2001,
    quarter: "Q1 2024",
    survey_date: "2024-03-15",
    reporting_officer: "Lt. Commander John Smith",
    total_defects: 15,
    critical_defects: 2,
    minor_defects: 13,
    resolved_defects: 12,
    status: "Completed",
    return_delayed: false,
    entire_ship_surveyed: true
  };

  return (
    <div className="space-y-6">
      <SurveyReportHTML report={sampleReport} />
    </div>
  );
};

export default SurveyReportPage;
