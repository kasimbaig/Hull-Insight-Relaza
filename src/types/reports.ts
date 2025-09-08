// Report Types
export interface AirFlowMeasurement {
  id: number;
  ship_name: string;
  compartment_name_display: string;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  no_of_ducts: number;
  duct_area: string;
  air_flow: string;
  flow_rate_at_duct: string;
  design_air_flow_rate: string;
  measured_air_flow_rate: string;
  observations: string;
  remarks: string;
  served_by: string;
  created_by: number;
  modified_by: number | null;
  hvac_trial: number;
  compartment: number;
}

export interface MachineryAirFlowMeasurement {
  id: number;
  ship_name: string;
  compartment_name_display: string;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  no_of_ducts: number;
  duct_area: string;
  air_flow: string;
  flow_rate_at_duct: string;
  design_air_flow_rate: string;
  measured_air_flow_rate: string;
  observations: string;
  remarks: string;
  served_by: string;
  created_by: number;
  modified_by: number | null;
  hvac_trial: number;
  compartment: number;
}

export interface HvacTrial {
  id: number;
  airflow_measurements: AirFlowMeasurement[];
  machinery_airflow_measurements: MachineryAirFlowMeasurement[];
  ship_name: string;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  date_of_trials: string;
  place_of_trials: string;
  document_no: string;
  occasion_of_trials: string;
  authority_for_trials: string;
  created_by: number;
  modified_by: number | null;
  ship: number;
}

export interface HvacReport {
  ship_id: number;
  trials: HvacTrial[];
}

export interface DockingReport {
  id: number;
  vessel_name: string;
  vessel_id: number;
  docking_purpose: string;
  docking_version?: string;
  status: "Draft" | "Command Review" | "IHQ Review" | "Approved" | "Archived";
  created_date: string;
  approved_date?: string;
  refitting_authority: string;
  command_hq: string;
  vessel_length: number;
  vessel_beam: number;
  vessel_draught: number;
}

export interface SurveyReport {
  id: number;
  ship_name: string;
  ship_id: number;
  quarter: string;
  survey_date: string;
  reporting_officer: string;
  total_defects: number;
  critical_defects: number;
  minor_defects: number;
  resolved_defects: number;
  status: "In Progress" | "Completed" | "Overdue";
  return_delayed: boolean;
  entire_ship_surveyed: boolean;
}

export interface Vessel {
  id: number;
  name: string;
}

export interface LoadingStates {
  hvac: boolean;
  vessels: boolean;
  totalTrials: boolean;
}

export interface ReportFilters {
  selectedReportType: string;
  selectedVessel: string;
  searchTerm: string;
}

export interface ReportData {
  hvacReport: HvacReport | null;
  dockingReports: DockingReport[];
  surveyReports: SurveyReport[];
  vessels: Vessel[];
  totalHvacTrials: number;
}
