// Mock data for Hull Insight application

export interface Unit {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

// API Response types for Units
export interface UnitAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface UnitsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UnitAPIResponse[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalItems: number;
}

// API Response types for Commands
export interface CommandAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface CommandsResponse {
  status: number;
  data: CommandAPIResponse[];
}

export interface CommandsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommandAPIResponse[];
}

// API Response types for Modules
export interface ModuleAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number | null;
  modified_by: number | null;
}

export interface ModulesPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ModuleAPIResponse[];
}

// API Response types for Class of Vessels
export interface ClassOfVesselAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface ClassOfVesselsResponse {
  status: number;
  data: ClassOfVesselAPIResponse[];
}

export interface ClassOfVesselsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClassOfVesselAPIResponse[];
}

// API Response types for Dockyards
export interface DockyardAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface DockyardsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DockyardAPIResponse[];
}

// API Response types for Compartments
export interface CompartmentAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  remark: string;
  ser: string;
  numbers: string;
  location: string;
  equipment: string;
  features: string;
  layout: string;
  special_requirements: string;
  standards: string;
  created_by: number;
  modified_by: number | null;
}

export interface CompartmentsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompartmentAPIResponse[];
}

export interface Compartment {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
  remark?: string;
  ser?: string;
  numbers?: string;
  location?: string;
  equipment?: string;
  features?: string;
  layout?: string;
  special_requirements?: string;
  standards?: string;
}

// API Response types for Systems
export interface SystemAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  remark: string;
  ser: string;
  numbers: string;
  capabilities_feature: string;
  weight_volume_power_consumption: string;
  location: string;
  interface: string;
  procurement_router: string;
  vendor: string;
  cost: string;
  standards: string;
  sustenance: string;
  flag: string;
  sotr_type: string;
  sequence: number;
  created_by: number;
  modified_by: number | null;
}

export interface SystemsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SystemAPIResponse[];
}

export interface System {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
  remark?: string;
  ser?: string;
  numbers?: string;
  capabilities_feature?: string;
  weight_volume_power_consumption?: string;
  location?: string;
  interface?: string;
  procurement_router?: string;
  vendor?: string;
  cost?: string;
  standards?: string;
  sustenance?: string;
  flag?: string;
  sotr_type?: string;
  sequence?: number;
}

// API Response types for Equipments
export interface EquipmentAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  weight_volume_power_consumption: string;
  procurement_router: string;
  remark: string;
  vendor: string;
  cost: string;
  sustenance: string;
  ser: string;
  numbers: string;
  capabilities_feature: string;
  location: string;
  interface: string;
  standards: string;
  flag: string;
  sotr_type: string;
  equipment_type_name: string;
  created_by: number;
  modified_by: number | null;
}

export interface EquipmentsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EquipmentAPIResponse[];
}

export interface Equipment {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
  remark?: string;
  ser?: string;
  numbers?: string;
  capabilities_feature?: string;
  weight_volume_power_consumption?: string;
  location?: string;
  interface?: string;
  procurement_router?: string;
  vendor?: string;
  cost?: string;
  standards?: string;
  sustenance?: string;
  flag?: string;
  sotr_type?: string;
  equipment_type_name?: string;
}

// API Response types for DamageTypes
export interface DamageTypeAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface DamageTypesPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DamageTypeAPIResponse[];
}

export interface DamageType {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

// API Response types for Severities
export interface SeverityAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface SeveritiesPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SeverityAPIResponse[];
}

export interface Severity {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

// API Response types for OperationalStatuses
export interface OperationalStatusAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface OperationalStatusesPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OperationalStatusAPIResponse[];
}

export interface OperationalStatus {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

export interface ClassOfVessel {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

export interface VesselType {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

// API Response types for VesselTypes
export interface VesselTypeAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface VesselTypesPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VesselTypeAPIResponse[];
}

// Vessels API interfaces
export interface VesselAPIResponse {
  id: number;
  classofvessel: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  vesseltype: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  yard: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  command: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  year_of_build: number;
  year_of_delivery: number;
  created_by: number;
  modified_by: number | null;
}

export interface VesselsPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VesselAPIResponse[];
}

// Dockyard API interface
export interface DockyardAPIResponse {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

// Vessel Type API interface (simple array response)
export interface VesselTypeAPIResponseSimple {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

// Class of Vessels API interface (simple array response)
export interface ClassOfVesselAPIResponseSimple {
  id: number;
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number;
  modified_by: number | null;
}

export interface Dockyard {
  id: string;
  name: string;
  location: string;
  capacity: number;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

export interface Command {
  id: string;
  name: string;
  headquarters: string;
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

export interface Vessel {
  id: number;
  classofvessel: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  vesseltype: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  yard: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  command: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number;
    modified_by: number | null;
  };
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  year_of_build: number;
  year_of_delivery: number;
  created_by: number;
  modified_by: number | null;
}

export interface DamageType {
  id: string;
  name: string;
  category: 'Structural' | 'Mechanical' | 'Electrical' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  createdBy: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

export interface DockyardPlan {
  id: string;
  vessel: string;
  vesselName: string;
  command: string;
  dockyard: string;
  reasonForDocking: string;
  plannedStartDate: string;
  plannedEndDate: string;
  estimatedDuration: number;
  status: 'Initiated' | 'Under Review' | 'Approved' | 'Rejected' | 'In Progress' | 'Completed';
  initiator: string;
  reviewer?: string;
  approver?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdOn: string;
  updatedOn: string;
}

export interface QuarterlySurvey {
  id: string;
  vessel: string;
  vesselName: string;
  command: string;
  quarter: string;
  year: number;
  inspector: string;
  inspectionDate: string;
  status: 'Scheduled' | 'In Progress' | 'Under Review' | 'Completed' | 'Overdue';
  totalCheckpoints: number;
  completedCheckpoints: number;
  failedCheckpoints: number;
  criticalIssues: number;
  createdOn: string;
  updatedOn: string;
}

// Mock data instances
export const mockUnits: Unit[] = [
  { id: '1', name: 'Naval Headquarters', createdBy: 'System Admin', createdOn: '2024-01-15', status: 'Active' },
  { id: '2', name: 'INS Vikrant', createdBy: 'Fleet Command', createdOn: '2024-01-20', status: 'Active' },
  { id: '3', name: 'INS Vikramaditya', createdBy: 'Fleet Command', createdOn: '2024-01-25', status: 'Active' },
  { id: '4', name: 'INS Arihant', createdBy: 'Submarine Command', createdOn: '2024-02-01', status: 'Active' },
  { id: '5', name: 'INS Chennai', createdBy: 'Fleet Command', createdOn: '2024-02-05', status: 'Active' }
];

export const mockClassOfVessels: ClassOfVessel[] = [
  { id: '1', name: 'Vikrant Class', description: 'Indigenous Aircraft Carrier', createdBy: 'Design Team', createdOn: '2024-01-10', status: 'Active' },
  { id: '2', name: 'Kolkata Class', description: 'Stealth Guided Missile Destroyer', createdBy: 'Design Team', createdOn: '2024-01-12', status: 'Active' },
  { id: '3', name: 'Shivalik Class', description: 'Multi-role Stealth Frigate', createdBy: 'Design Team', createdOn: '2024-01-14', status: 'Active' },
  { id: '4', name: 'Arihant Class', description: 'Nuclear Powered Ballistic Missile Submarine', createdBy: 'Design Team', createdOn: '2024-01-16', status: 'Active' },
  { id: '5', name: 'Kamorta Class', description: 'Anti-Submarine Warfare Corvette', createdBy: 'Design Team', createdOn: '2024-01-18', status: 'Active' }
];

export const mockVesselTypes: VesselType[] = [
  { id: '1', name: 'Aircraft Carrier', createdBy: 'Classification Team', createdOn: '2024-01-08', status: 'Active' },
  { id: '2', name: 'Destroyer', createdBy: 'Classification Team', createdOn: '2024-01-09', status: 'Active' },
  { id: '3', name: 'Frigate', createdBy: 'Classification Team', createdOn: '2024-01-10', status: 'Active' },
  { id: '4', name: 'Submarine', createdBy: 'Classification Team', createdOn: '2024-01-11', status: 'Active' },
  { id: '5', name: 'Corvette', createdBy: 'Classification Team', createdOn: '2024-01-12', status: 'Active' }
];

export const mockDockyards: Dockyard[] = [
  { id: '1', name: 'Mumbai Naval Dockyard', location: 'Mumbai', capacity: 15, createdBy: 'Dockyard Admin', createdOn: '2024-01-05', status: 'Active' },
  { id: '2', name: 'Cochin Shipyard', location: 'Kochi', capacity: 12, createdBy: 'Dockyard Admin', createdOn: '2024-01-06', status: 'Active' },
  { id: '3', name: 'Mazagon Dock Shipbuilders', location: 'Mumbai', capacity: 18, createdBy: 'Dockyard Admin', createdOn: '2024-01-07', status: 'Active' },
  { id: '4', name: 'Hindustan Shipyard', location: 'Visakhapatnam', capacity: 10, createdBy: 'Dockyard Admin', createdOn: '2024-01-08', status: 'Active' },
  { id: '5', name: 'Goa Shipyard', location: 'Goa', capacity: 8, createdBy: 'Dockyard Admin', createdOn: '2024-01-09', status: 'Active' }
];

export const mockCommands: Command[] = [
  { id: '1', name: 'Western Naval Command', headquarters: 'Mumbai', createdBy: 'Naval HQ', createdOn: '2024-01-01', status: 'Active' },
  { id: '2', name: 'Eastern Naval Command', headquarters: 'Visakhapatnam', createdBy: 'Naval HQ', createdOn: '2024-01-02', status: 'Active' },
  { id: '3', name: 'Southern Naval Command', headquarters: 'Kochi', createdBy: 'Naval HQ', createdOn: '2024-01-03', status: 'Active' },
  { id: '4', name: 'Submarine Command', headquarters: 'Mumbai', createdBy: 'Naval HQ', createdOn: '2024-01-04', status: 'Active' },
  { id: '5', name: 'Naval Aviation Command', headquarters: 'Goa', createdBy: 'Naval HQ', createdOn: '2024-01-05', status: 'Active' }
];

export const mockVessels: Vessel[] = [
  {
    id: '1', name: 'INS Vikrant', classOfVessel: 'Vikrant Class', vesselType: 'Aircraft Carrier',
    dockyard: 'Cochin Shipyard', command: 'Western Naval Command', yearOfBuild: 2013, yearOfDelivery: 2022,
    pennantNumber: 'R11', displacement: 45000, status: 'Active', createdBy: 'Fleet Command', createdOn: '2024-01-20'
  },
  {
    id: '2', name: 'INS Chennai', classOfVessel: 'Kolkata Class', vesselType: 'Destroyer',
    dockyard: 'Mazagon Dock Shipbuilders', command: 'Western Naval Command', yearOfBuild: 2009, yearOfDelivery: 2016,
    pennantNumber: 'D65', displacement: 7500, status: 'Active', createdBy: 'Fleet Command', createdOn: '2024-01-25'
  },
  {
    id: '3', name: 'INS Sahyadri', classOfVessel: 'Shivalik Class', vesselType: 'Frigate',
    dockyard: 'Mazagon Dock Shipbuilders', command: 'Western Naval Command', yearOfBuild: 2009, yearOfDelivery: 2012,
    pennantNumber: 'F49', displacement: 6200, status: 'Under Refit', createdBy: 'Fleet Command', createdOn: '2024-02-01'
  },
  {
    id: '4', name: 'INS Arihant', classOfVessel: 'Arihant Class', vesselType: 'Submarine',
    dockyard: 'Hindustan Shipyard', command: 'Submarine Command', yearOfBuild: 2009, yearOfDelivery: 2016,
    pennantNumber: 'S73', displacement: 6000, status: 'Active', createdBy: 'Submarine Command', createdOn: '2024-02-05'
  },
  {
    id: '5', name: 'INS Kamorta', classOfVessel: 'Kamorta Class', vesselType: 'Corvette',
    dockyard: 'Goa Shipyard', command: 'Western Naval Command', yearOfBuild: 2010, yearOfDelivery: 2014,
    pennantNumber: 'P28', displacement: 3500, status: 'Active', createdBy: 'Fleet Command', createdOn: '2024-02-10'
  }
];

export const mockDamageTypes: DamageType[] = [
  { id: '1', name: 'Hull Crack', category: 'Structural', severity: 'High', createdBy: 'Survey Team', createdOn: '2024-01-10', status: 'Active' },
  { id: '2', name: 'Corrosion - Minor', category: 'Structural', severity: 'Low', createdBy: 'Survey Team', createdOn: '2024-01-11', status: 'Active' },
  { id: '3', name: 'Corrosion - Major', category: 'Structural', severity: 'High', createdBy: 'Survey Team', createdOn: '2024-01-12', status: 'Active' },
  { id: '4', name: 'Paint Deterioration', category: 'Structural', severity: 'Low', createdBy: 'Survey Team', createdOn: '2024-01-13', status: 'Active' },
  { id: '5', name: 'Equipment Malfunction', category: 'Mechanical', severity: 'Medium', createdBy: 'Technical Team', createdOn: '2024-01-14', status: 'Active' }
];

export const mockDockyardPlans: DockyardPlan[] = [
  {
    id: '1', vessel: '3', vesselName: 'INS Sahyadri', command: 'Western Naval Command',
    dockyard: 'Mazagon Dock Shipbuilders', reasonForDocking: 'Scheduled Refit',
    plannedStartDate: '2024-03-15', plannedEndDate: '2024-05-30', estimatedDuration: 75,
    status: 'Under Review', initiator: 'Fleet Command', reviewer: 'Dockyard Engineer',
    priority: 'High', createdOn: '2024-01-20', updatedOn: '2024-02-15'
  },
  {
    id: '2', vessel: '2', vesselName: 'INS Chennai', command: 'Western Naval Command',
    dockyard: 'Mumbai Naval Dockyard', reasonForDocking: 'Hull Survey & Maintenance',
    plannedStartDate: '2024-04-01', plannedEndDate: '2024-04-20', estimatedDuration: 20,
    status: 'Approved', initiator: 'Ship Command', approver: 'Fleet Admiral',
    priority: 'Medium', createdOn: '2024-02-01', updatedOn: '2024-02-20'
  },
  {
    id: '3', vessel: '5', vesselName: 'INS Kamorta', command: 'Western Naval Command',
    dockyard: 'Goa Shipyard', reasonForDocking: 'Weapon System Upgrade',
    plannedStartDate: '2024-05-15', plannedEndDate: '2024-07-15', estimatedDuration: 60,
    status: 'Initiated', initiator: 'Ship Command', priority: 'Medium',
    createdOn: '2024-02-10', updatedOn: '2024-02-10'
  }
];

export const mockQuarterlySurveys: QuarterlySurvey[] = [
  {
    id: '1', vessel: '1', vesselName: 'INS Vikrant', command: 'Western Naval Command',
    quarter: 'Q1', year: 2024, inspector: 'Cdr. Rajesh Kumar', inspectionDate: '2024-03-15',
    status: 'Completed', totalCheckpoints: 150, completedCheckpoints: 150,
    failedCheckpoints: 8, criticalIssues: 2, createdOn: '2024-03-01', updatedOn: '2024-03-20'
  },
  {
    id: '2', vessel: '2', vesselName: 'INS Chennai', command: 'Western Naval Command',
    quarter: 'Q1', year: 2024, inspector: 'Lt. Cdr. Priya Sharma', inspectionDate: '2024-03-20',
    status: 'Under Review', totalCheckpoints: 120, completedCheckpoints: 120,
    failedCheckpoints: 5, criticalIssues: 1, createdOn: '2024-03-05', updatedOn: '2024-03-25'
  },
  {
    id: '3', vessel: '4', vesselName: 'INS Arihant', command: 'Submarine Command',
    quarter: 'Q1', year: 2024, inspector: 'Cdr. Vikram Singh', inspectionDate: '2024-04-01',
    status: 'In Progress', totalCheckpoints: 180, completedCheckpoints: 95,
    failedCheckpoints: 3, criticalIssues: 0, createdOn: '2024-03-25', updatedOn: '2024-04-01'
  }
];

// SubModule API interfaces
export interface SubModuleAPIResponse {
  id: number;
  module: {
    id: number;
    code: string;
    active: number;
    created_on: string;
    created_ip: string;
    modified_on: string;
    modified_ip: string | null;
    name: string;
    created_by: number | null;
    modified_by: number | null;
  };
  code: string;
  active: number;
  created_on: string;
  created_ip: string;
  modified_on: string;
  modified_ip: string | null;
  name: string;
  created_by: number | null;
  modified_by: number | null;
  parent: number | null;
}

export interface SubModulesPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubModuleAPIResponse[];
}

// Helper functions to get related data
export const getVesselById = (id: string): Vessel | undefined => mockVessels.find(v => v.id === id);
export const getCommandById = (id: string): Command | undefined => mockCommands.find(c => c.id === id);
export const getDockyardById = (id: string): Dockyard | undefined => mockDockyards.find(d => d.id === id);
export const getClassOfVesselByName = (name: string): ClassOfVessel | undefined => mockClassOfVessels.find(c => c.name === name);
export const getVesselTypeByName = (name: string): VesselType | undefined => mockVesselTypes.find(v => v.name === name);