"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Save, FileText, AlertTriangle, CheckCircle, Clock, Ship, Wrench, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
// API imports removed - using static data

// Types
interface DockingCheckoffList {
  id: number;
  vessel_name: string;
  vessel_id: number;
  docking_purpose: string;
  docking_version: string;
  vessel_length: number;
  vessel_beam: number;
  vessel_draught: number;
  stability_list: number;
  stability_trim: number;
  metacentric_height: number;
  weight_changes: number;
  entry_direction: "Bow First" | "Stern First";
  overhang_flight_deck: number;
  overhang_sponsons: number;
  overhang_walkways: number;
  overhang_platforms: number;
  underwater_projections: string[];
  dock_blocks_height: number;
  interference_objects: string[];
  clearance_requirements: string[];
  clearance_above_vessel: string[];
  ship_lift_depth: number;
  water_depth_blocks: number;
  water_depth_basin: number;
  tidal_constraints: string;
  floating_dock_depth: number;
  shape_blocks_matching: boolean;
  working_envelope: string;
  refitting_authority: string;
  command_hq: string;
  status: "Draft" | "Command Review" | "IHQ Review" | "Approved" | "Archived";
  created_at: string;
  updated_at: string;
  archived_until?: string;
}

interface Vessel {
  id: number;
  name: string;
}

// Constants
const DOCKING_PURPOSES = [
  "Routine Maintenance",
  "Major Overhaul", 
  "Emergency Repair",
  "Inspection",
  "Modification",
  "Refit"
];

const UNDERWATER_PROJECTIONS = [
  "Sonar Domes/Transducers",
  "Anodes/Electrodes (Cathodic Protection)",
  "Propellers",
  "Water Jet Ducts",
  "Voith Schneider Units",
  "Stabilizers",
  "Bilge Keels",
  "Skegs",
  "Bulbous Bow",
  "Hydroplanes",
  "Submarine Lower Rudder",
  "Speed Distance Probes"
];

const INTERFERENCE_OBJECTS = [
  "High Cradle Blocks",
  "Docking Towers",
  "Trestles",
  "Dock Bottom Obstructions",
  "Other Vessels"
];

const CLEARANCE_REQUIREMENTS = [
  "Propeller Removal",
  "Shaft Removal", 
  "Rudder Removal",
  "Sonar Removal",
  "Stabilizer Removal",
  "Submarine Hydroplanes/Fins Removal",
  "Staging and Scaffolding Erection",
  "Mast Removal",
  "Periscope Removal"
];

const COMMAND_HQS = [
  "Western Naval Command",
  "Eastern Naval Command", 
  "Southern Naval Command",
  "Northern Naval Command",
  "Andaman & Nicobar Command"
];

const REFITTING_AUTHORITIES = [
  "Mazagon Dock Shipbuilders Limited",
  "Garden Reach Shipbuilders & Engineers",
  "Cochin Shipyard Limited",
  "Hindustan Shipyard Limited",
  "Goa Shipyard Limited",
  "Larsen & Toubro Shipyard"
];

const DockingPlan = () => {
  const { toast } = useToast();
  
  // State management
  const [checkoffLists, setCheckoffLists] = useState<DockingCheckoffList[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCheckoff, setEditingCheckoff] = useState<DockingCheckoffList | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [checkoffForm, setCheckoffForm] = useState({
    vessel_id: "",
    docking_purpose: "",
    docking_version: "",
    vessel_length: "",
    vessel_beam: "",
    vessel_draught: "",
    stability_list: "",
    stability_trim: "",
    metacentric_height: "",
    weight_changes: "",
    entry_direction: "Bow First" as "Bow First" | "Stern First",
    overhang_flight_deck: "",
    overhang_sponsons: "",
    overhang_walkways: "",
    overhang_platforms: "",
    underwater_projections: [] as string[],
    dock_blocks_height: "",
    interference_objects: [] as string[],
    clearance_requirements: [] as string[],
    clearance_above_vessel: [] as string[],
    ship_lift_depth: "",
    water_depth_blocks: "",
    water_depth_basin: "",
    tidal_constraints: "",
    floating_dock_depth: "",
    shape_blocks_matching: false,
    working_envelope: "",
    refitting_authority: "",
    command_hq: "",
    status: "Draft" as "Draft" | "Command Review" | "IHQ Review" | "Approved" | "Archived"
  });

  // Static data initialization
  useEffect(() => {
    // Mock vessels data
    const mockVessels: Vessel[] = [
      { id: 1, name: "INS Vikrant" },
      { id: 2, name: "INS Vikramaditya" },
      { id: 3, name: "INS Delhi" },
      { id: 4, name: "INS Mumbai" },
      { id: 5, name: "INS Kolkata" },
      { id: 6, name: "INS Chennai" },
      { id: 7, name: "INS Kochi" },
      { id: 8, name: "INS Visakhapatnam" },
      { id: 9, name: "INS Mormugao" },
      { id: 10, name: "INS Imphal" }
    ];

    // Mock checkoff lists data
    const mockCheckoffLists: DockingCheckoffList[] = [
      {
        id: 1,
        vessel_name: "INS Vikrant",
        vessel_id: 1,
        docking_purpose: "Major Overhaul",
        docking_version: "v2.1",
        vessel_length: 262.5,
        vessel_beam: 60.0,
        vessel_draught: 8.4,
        stability_list: 0.5,
        stability_trim: 0.2,
        metacentric_height: 1.8,
        weight_changes: 150,
        entry_direction: "Bow First",
        overhang_flight_deck: 12.5,
        overhang_sponsons: 8.0,
        overhang_walkways: 3.2,
        overhang_platforms: 2.1,
        underwater_projections: ["Sonar Domes/Transducers", "Propellers"],
        dock_blocks_height: 2.5,
        interference_objects: ["High Cradle Blocks"],
        clearance_requirements: ["Propeller Removal", "Shaft Removal"],
        clearance_above_vessel: ["Mast Removal"],
        ship_lift_depth: 15.0,
        water_depth_blocks: 12.0,
        water_depth_basin: 14.5,
        tidal_constraints: "High tide required for entry",
        floating_dock_depth: 16.0,
        shape_blocks_matching: true,
        working_envelope: "Single vessel docking",
        refitting_authority: "Mazagon Dock Shipbuilders Limited",
        command_hq: "Western Naval Command",
        status: "Draft",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        vessel_name: "INS Vikramaditya",
        vessel_id: 2,
        docking_purpose: "Routine Maintenance",
        docking_version: "v1.8",
        vessel_length: 284.0,
        vessel_beam: 60.0,
        vessel_draught: 9.2,
        stability_list: 0.3,
        stability_trim: 0.1,
        metacentric_height: 2.1,
        weight_changes: 75,
        entry_direction: "Stern First",
        overhang_flight_deck: 15.0,
        overhang_sponsons: 10.0,
        overhang_walkways: 4.0,
        overhang_platforms: 2.5,
        underwater_projections: ["Anodes/Electrodes (Cathodic Protection)", "Stabilizers"],
        dock_blocks_height: 3.0,
        interference_objects: ["Docking Towers"],
        clearance_requirements: ["Rudder Removal"],
        clearance_above_vessel: ["Periscope Removal"],
        ship_lift_depth: 18.0,
        water_depth_blocks: 15.0,
        water_depth_basin: 17.0,
        tidal_constraints: "No tidal constraints",
        floating_dock_depth: 19.0,
        shape_blocks_matching: true,
        working_envelope: "Single vessel docking",
        refitting_authority: "Cochin Shipyard Limited",
        command_hq: "Eastern Naval Command",
        status: "Command Review",
        created_at: "2024-01-20T14:15:00Z",
        updated_at: "2024-01-22T09:30:00Z"
      },
      {
        id: 3,
        vessel_name: "INS Delhi",
        vessel_id: 3,
        docking_purpose: "Emergency Repair",
        docking_version: "v3.0",
        vessel_length: 163.0,
        vessel_beam: 17.0,
        vessel_draught: 6.5,
        stability_list: 0.8,
        stability_trim: 0.4,
        metacentric_height: 1.5,
        weight_changes: 200,
        entry_direction: "Bow First",
        overhang_flight_deck: 8.0,
        overhang_sponsons: 5.0,
        overhang_walkways: 2.0,
        overhang_platforms: 1.5,
        underwater_projections: ["Bilge Keels", "Skegs"],
        dock_blocks_height: 2.0,
        interference_objects: ["Trestles"],
        clearance_requirements: ["Sonar Removal"],
        clearance_above_vessel: ["Staging and Scaffolding Erection"],
        ship_lift_depth: 12.0,
        water_depth_blocks: 10.0,
        water_depth_basin: 11.5,
        tidal_constraints: "Low tide preferred",
        floating_dock_depth: 13.0,
        shape_blocks_matching: false,
        working_envelope: "Multi-vessel docking",
        refitting_authority: "Garden Reach Shipbuilders & Engineers",
        command_hq: "Southern Naval Command",
        status: "IHQ Review",
        created_at: "2024-01-25T11:45:00Z",
        updated_at: "2024-01-28T16:20:00Z"
      },
      {
        id: 4,
        vessel_name: "INS Mumbai",
        vessel_id: 4,
        docking_purpose: "Inspection",
        docking_version: "v1.5",
        vessel_length: 163.0,
        vessel_beam: 17.0,
        vessel_draught: 6.5,
        stability_list: 0.2,
        stability_trim: 0.1,
        metacentric_height: 1.9,
        weight_changes: 50,
        entry_direction: "Stern First",
        overhang_flight_deck: 8.0,
        overhang_sponsons: 5.0,
        overhang_walkways: 2.0,
        overhang_platforms: 1.5,
        underwater_projections: ["Bulbous Bow"],
        dock_blocks_height: 2.0,
        interference_objects: ["Dock Bottom Obstructions"],
        clearance_requirements: ["Stabilizer Removal"],
        clearance_above_vessel: [],
        ship_lift_depth: 12.0,
        water_depth_blocks: 10.0,
        water_depth_basin: 11.5,
        tidal_constraints: "No constraints",
        floating_dock_depth: 13.0,
        shape_blocks_matching: true,
        working_envelope: "Single vessel docking",
        refitting_authority: "Hindustan Shipyard Limited",
        command_hq: "Western Naval Command",
        status: "Approved",
        created_at: "2024-02-01T08:30:00Z",
        updated_at: "2024-02-05T14:45:00Z"
      },
      {
        id: 5,
        vessel_name: "INS Kolkata",
        vessel_id: 5,
        docking_purpose: "Modification",
        docking_version: "v2.3",
        vessel_length: 163.0,
        vessel_beam: 17.0,
        vessel_draught: 6.5,
        stability_list: 0.6,
        stability_trim: 0.3,
        metacentric_height: 1.7,
        weight_changes: 300,
        entry_direction: "Bow First",
        overhang_flight_deck: 8.0,
        overhang_sponsons: 5.0,
        overhang_walkways: 2.0,
        overhang_platforms: 1.5,
        underwater_projections: ["Hydroplanes", "Speed Distance Probes"],
        dock_blocks_height: 2.0,
        interference_objects: ["Other Vessels"],
        clearance_requirements: ["Submarine Hydroplanes/Fins Removal"],
        clearance_above_vessel: ["Mast Removal"],
        ship_lift_depth: 12.0,
        water_depth_blocks: 10.0,
        water_depth_basin: 11.5,
        tidal_constraints: "High tide required",
        floating_dock_depth: 13.0,
        shape_blocks_matching: true,
        working_envelope: "Single vessel docking",
        refitting_authority: "Goa Shipyard Limited",
        command_hq: "Eastern Naval Command",
        status: "Archived",
        created_at: "2023-12-15T13:20:00Z",
        updated_at: "2024-01-10T10:15:00Z",
        archived_until: "2024-06-15T00:00:00Z"
      }
    ];

    setVessels(mockVessels);
    setCheckoffLists(mockCheckoffLists);
  }, []);

  // Event handlers
  const handleOpenNewCheckoff = () => {
    setEditingCheckoff(null);
    setCheckoffForm({
      vessel_id: "",
      docking_purpose: "",
      docking_version: "",
      vessel_length: "",
      vessel_beam: "",
      vessel_draught: "",
      stability_list: "",
      stability_trim: "",
      metacentric_height: "",
      weight_changes: "",
      entry_direction: "Bow First",
      overhang_flight_deck: "",
      overhang_sponsons: "",
      overhang_walkways: "",
      overhang_platforms: "",
      underwater_projections: [],
      dock_blocks_height: "",
      interference_objects: [],
      clearance_requirements: [],
      clearance_above_vessel: [],
      ship_lift_depth: "",
      water_depth_blocks: "",
      water_depth_basin: "",
      tidal_constraints: "",
      floating_dock_depth: "",
      shape_blocks_matching: false,
      working_envelope: "",
      refitting_authority: "",
      command_hq: "",
      status: "Draft"
    });
    setIsDialogOpen(true);
  };

  const handleCheckoffSave = () => {
    const vessel = vessels.find(v => v.id === parseInt(checkoffForm.vessel_id));
    const checkoffData: DockingCheckoffList = {
      id: editingCheckoff?.id || Date.now(),
      vessel_name: vessel?.name || `Vessel ${checkoffForm.vessel_id}`,
      vessel_id: parseInt(checkoffForm.vessel_id) || 0,
      docking_purpose: checkoffForm.docking_purpose,
      docking_version: checkoffForm.docking_version,
      vessel_length: parseFloat(checkoffForm.vessel_length) || 0,
      vessel_beam: parseFloat(checkoffForm.vessel_beam) || 0,
      vessel_draught: parseFloat(checkoffForm.vessel_draught) || 0,
      stability_list: parseFloat(checkoffForm.stability_list) || 0,
      stability_trim: parseFloat(checkoffForm.stability_trim) || 0,
      metacentric_height: parseFloat(checkoffForm.metacentric_height) || 0,
      weight_changes: parseFloat(checkoffForm.weight_changes) || 0,
      entry_direction: checkoffForm.entry_direction,
      overhang_flight_deck: parseFloat(checkoffForm.overhang_flight_deck) || 0,
      overhang_sponsons: parseFloat(checkoffForm.overhang_sponsons) || 0,
      overhang_walkways: parseFloat(checkoffForm.overhang_walkways) || 0,
      overhang_platforms: parseFloat(checkoffForm.overhang_platforms) || 0,
      underwater_projections: checkoffForm.underwater_projections,
      dock_blocks_height: parseFloat(checkoffForm.dock_blocks_height) || 0,
      interference_objects: checkoffForm.interference_objects,
      clearance_requirements: checkoffForm.clearance_requirements,
      clearance_above_vessel: checkoffForm.clearance_above_vessel,
      ship_lift_depth: parseFloat(checkoffForm.ship_lift_depth) || 0,
      water_depth_blocks: parseFloat(checkoffForm.water_depth_blocks) || 0,
      water_depth_basin: parseFloat(checkoffForm.water_depth_basin) || 0,
      tidal_constraints: checkoffForm.tidal_constraints,
      floating_dock_depth: parseFloat(checkoffForm.floating_dock_depth) || 0,
      shape_blocks_matching: checkoffForm.shape_blocks_matching,
      working_envelope: checkoffForm.working_envelope,
      refitting_authority: checkoffForm.refitting_authority,
      command_hq: checkoffForm.command_hq,
      status: checkoffForm.status,
      created_at: editingCheckoff?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived_until: editingCheckoff?.archived_until
    };
    
    if (editingCheckoff) {
      setCheckoffLists(prev => prev.map(c => c.id === editingCheckoff.id ? checkoffData : c));
      toast({
        title: "Check-off List Updated",
        description: "Check-off list has been successfully updated",
        duration: 3000,
      });
    } else {
      setCheckoffLists(prev => [...prev, checkoffData]);
      toast({
        title: "Check-off List Created",
        description: "New check-off list has been created successfully",
        duration: 3000,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteCheckoff = (checkoffId: number) => {
    if (!confirm("Are you sure you want to delete this checkoff list?")) return;
    
    setCheckoffLists(prev => prev.filter(c => c.id !== checkoffId));
    toast({
      title: "Check-off List Deleted",
      description: "Check-off list has been successfully deleted",
      duration: 3000,
    });
  };

  const handleStatusChange = (checkoffId: number, newStatus: DockingCheckoffList['status']) => {
    setCheckoffLists(prev => prev.map(c => 
      c.id === checkoffId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
    ));
    toast({
      title: "Status Updated",
      description: `Check-off list status changed to ${newStatus}`,
      duration: 3000,
    });
  };

  // Table body templates
  const vesselBodyTemplate = (rowData: DockingCheckoffList) => {
    const vessel = vessels.find(v => v.id === rowData.vessel_id);
    return vessel?.name || rowData.vessel_name || "";
  };

  const statusBodyTemplate = (rowData: DockingCheckoffList) => {
    const statusConfig = {
      "Draft": { variant: "outline" as const, icon: FileText, color: "text-gray-600" },
      "Command Review": { variant: "secondary" as const, icon: Clock, color: "text-blue-600" },
      "IHQ Review": { variant: "secondary" as const, icon: AlertTriangle, color: "text-orange-600" },
      "Approved": { variant: "default" as const, icon: CheckCircle, color: "text-white bg-green-500 hover:bg-green-500/90" },
      "Archived": { variant: "outline" as const, icon: FileText, color: "text-gray-500" }
    };
    
    const config = statusConfig[rowData.status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {rowData.status}
      </Badge>
    );
  };

  const actionsBodyTemplate = (rowData: DockingCheckoffList) => (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        title="Edit Checkoff List"
        onClick={() => {
          setEditingCheckoff(rowData);
          setCheckoffForm({
            vessel_id: rowData.vessel_id.toString(),
            docking_purpose: rowData.docking_purpose,
            docking_version: rowData.docking_version,
            vessel_length: rowData.vessel_length.toString(),
            vessel_beam: rowData.vessel_beam.toString(),
            vessel_draught: rowData.vessel_draught.toString(),
            stability_list: rowData.stability_list.toString(),
            stability_trim: rowData.stability_trim.toString(),
            metacentric_height: rowData.metacentric_height.toString(),
            weight_changes: rowData.weight_changes.toString(),
            entry_direction: rowData.entry_direction,
            overhang_flight_deck: rowData.overhang_flight_deck.toString(),
            overhang_sponsons: rowData.overhang_sponsons.toString(),
            overhang_walkways: rowData.overhang_walkways.toString(),
            overhang_platforms: rowData.overhang_platforms.toString(),
            underwater_projections: rowData.underwater_projections,
            dock_blocks_height: rowData.dock_blocks_height.toString(),
            interference_objects: rowData.interference_objects,
            clearance_requirements: rowData.clearance_requirements,
            clearance_above_vessel: rowData.clearance_above_vessel,
            ship_lift_depth: rowData.ship_lift_depth.toString(),
            water_depth_blocks: rowData.water_depth_blocks.toString(),
            water_depth_basin: rowData.water_depth_basin.toString(),
            tidal_constraints: rowData.tidal_constraints,
            floating_dock_depth: rowData.floating_dock_depth.toString(),
            shape_blocks_matching: rowData.shape_blocks_matching,
            working_envelope: rowData.working_envelope,
            refitting_authority: rowData.refitting_authority,
            command_hq: rowData.command_hq,
            status: rowData.status
          });
          setIsDialogOpen(true);
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {rowData.status === "Draft" && (
        <Button
          size="sm"
          variant="secondary"
          title="Submit for Review"
          onClick={() => handleStatusChange(rowData.id, "Command Review")}
        >
          <Clock className="h-4 w-4" />
        </Button>
      )}
      {rowData.status === "Command Review" && (
        <Button
          size="sm"
          variant="secondary"
          title="Forward to IHQ"
          onClick={() => handleStatusChange(rowData.id, "IHQ Review")}
        >
          <AlertTriangle className="h-4 w-4" />
        </Button>
      )}
      {rowData.status === "IHQ Review" && (
        <Button
          size="sm"
          className="bg-[#00809D] hover:bg-[#00809D]/90 text-white"
          title="Approve Checkoff List"
          onClick={() => handleStatusChange(rowData.id, "Approved")}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
      <Button
        size="sm"
        variant="destructive"
        title="Delete Checkoff List"
        onClick={() => handleDeleteCheckoff(rowData.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // Filter data
  const filtered = (Array.isArray(checkoffLists) ? checkoffLists : []).filter((c) => {
    const vessel = vessels.find((v) => v.id === c.vessel_id);
    const vesselName = vessel?.name || c.vessel_name || "";
    return vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.docking_purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.refitting_authority.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Docking Plan Approval</h1>
        <Button
          onClick={handleOpenNewCheckoff}
          className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
        >
          <Plus className="mr-2 h-4 w-4" /> New Check-off List
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search checkoff lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Checkoff Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-[#00809D]" />
            Docking Check-off Lists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            value={Array.isArray(filtered) ? filtered : []}
            paginator
            rows={10}
            emptyMessage="No checkoff lists found"
            className="vessel-datatable"
          >
            <Column 
              field="vessel_name" 
              header="Vessel" 
              body={vesselBodyTemplate}
              className="min-w-[200px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="docking_purpose" 
              header="Purpose" 
              className="min-w-[180px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="docking_version" 
              header="Version" 
              className="min-w-[120px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="refitting_authority" 
              header="Refitting Authority" 
              className="min-w-[250px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="status" 
              header="Status" 
              body={statusBodyTemplate}
              className="min-w-[150px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="actions" 
              header="Actions" 
              body={actionsBodyTemplate}
              className="w-[200px] text-center"
              headerClassName="master-table-header-no-border"
            />
          </DataTable>
        </CardContent>
      </Card>

      {/* Check-off List Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-[#00809D] p-6 text-white rounded-t-lg">
            <DialogTitle className="text-xl font-bold">
              {editingCheckoff ? "Edit Check-off List" : "New Check-off List"}
            </DialogTitle>
            <p className="text-white/80 mt-1">
              Enter vessel details and docking requirements
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="bg-[#00809D]/10">
                <CardTitle className="text-lg text-[#00809D] flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#00809D] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">1</span>
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="vessel_id" className="text-sm font-medium">Vessel *</Label>
                  <Select value={checkoffForm.vessel_id} onValueChange={(val) => setCheckoffForm(f => ({ ...f, vessel_id: val }))}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Vessel" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {vessels.map(vessel => (
                        <SelectItem key={vessel.id} value={vessel.id.toString()}>
                          {vessel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docking_purpose" className="text-sm font-medium">Docking Purpose *</Label>
                  <Select value={checkoffForm.docking_purpose} onValueChange={(val) => setCheckoffForm(f => ({ ...f, docking_purpose: val }))}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Purpose" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {DOCKING_PURPOSES.map(purpose => (
                        <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="docking_version" className="text-sm font-medium">Docking Version</Label>
                  <Input 
                    value={checkoffForm.docking_version} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, docking_version: e.target.value }))} 
                    placeholder="e.g., v2.1" 
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry_direction" className="text-sm font-medium">Entry Direction</Label>
                  <Select value={checkoffForm.entry_direction} onValueChange={(val) => setCheckoffForm(f => ({ ...f, entry_direction: val as "Bow First" | "Stern First" }))}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Direction" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="Bow First">Bow First</SelectItem>
                      <SelectItem value="Stern First">Stern First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Vessel Dimensions */}
            <Card>
              <CardHeader className="bg-[#00809D]/10">
                <CardTitle className="text-lg text-[#00809D] flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#00809D] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">2</span>
                  </div>
                  Vessel Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="vessel_length" className="text-sm font-medium">Length (m)</Label>
                  <Input 
                    type="number"
                    value={checkoffForm.vessel_length} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, vessel_length: e.target.value }))} 
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vessel_beam" className="text-sm font-medium">Beam (m)</Label>
                  <Input 
                    type="number"
                    value={checkoffForm.vessel_beam} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, vessel_beam: e.target.value }))} 
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vessel_draught" className="text-sm font-medium">Draught (m)</Label>
                  <Input 
                    type="number"
                    value={checkoffForm.vessel_draught} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, vessel_draught: e.target.value }))} 
                    className="h-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stability Parameters */}
            <Card>
              <CardHeader className="bg-[#00809D]/10">
                <CardTitle className="text-lg text-[#00809D] flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#00809D] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">3</span>
                  </div>
                  Stability Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="stability_list" className="text-sm font-medium">List (degrees)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={checkoffForm.stability_list} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, stability_list: e.target.value }))} 
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stability_trim" className="text-sm font-medium">Trim (degrees)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={checkoffForm.stability_trim} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, stability_trim: e.target.value }))} 
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metacentric_height" className="text-sm font-medium">Metacentric Height (m)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={checkoffForm.metacentric_height} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, metacentric_height: e.target.value }))} 
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight_changes" className="text-sm font-medium">Weight Changes (tons)</Label>
                  <Input 
                    type="number"
                    value={checkoffForm.weight_changes} 
                    onChange={(e) => setCheckoffForm(f => ({ ...f, weight_changes: e.target.value }))} 
                    className="h-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Authorities */}
            <Card>
              <CardHeader className="bg-[#00809D]/10">
                <CardTitle className="text-lg text-[#00809D] flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#00809D] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">4</span>
                  </div>
                  Authorities
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="refitting_authority" className="text-sm font-medium">Refitting Authority</Label>
                  <Select value={checkoffForm.refitting_authority} onValueChange={(val) => setCheckoffForm(f => ({ ...f, refitting_authority: val }))}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Refitting Authority" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {REFITTING_AUTHORITIES.map(authority => (
                        <SelectItem key={authority} value={authority}>{authority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="command_hq" className="text-sm font-medium">Command HQ</Label>
                  <Select value={checkoffForm.command_hq} onValueChange={(val) => setCheckoffForm(f => ({ ...f, command_hq: val }))}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Command HQ" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      {COMMAND_HQS.map(hq => (
                        <SelectItem key={hq} value={hq}>{hq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex justify-between p-6 bg-gray-50">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-2 rounded-md font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCheckoffSave}
                className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Check-off List
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DockingPlan;
