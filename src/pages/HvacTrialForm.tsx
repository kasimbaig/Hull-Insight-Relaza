import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Save, Search, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FormConfig } from "@/types";
import { Column } from "primereact/column";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../src/components/service/apiservice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CalculateAverageModal from "../pages/CalculateAverageModal";

interface HvacTrial {
  id: number;
  ship: string;
  ship_name?: string;
  date_of_trials: string;
  place_of_trials: string;
  document_no: string;
  occasion_of_trials: string;
  authority_for_trials: string;
}

interface AirFlow {
  id: number;
  compartment: string;
  served_by: string;
  no_of_ducts: number;
  duct_area?: number;
  air_flow?: number;
  flow_rate_at_duct?: number;
  design_air_flow_rate?: number;
  measured_air_flow_rate?: number;
  observations?: string;
  remarks?: string;
  isEditing?: boolean;
  hvac_trial?: number;
}

// Machinery Air Flow extends Air Flow with same structure
type MachineryAirFlow = AirFlow;

const PLACE_CHOICES = [
  "Mumbai",
  "Visakhapatnam",
  "Kochi",
  "Karwar",
  "Sri Vijayapuram",
  "Porbandar",
  "Okha",
];

const OCCASION_CHOICES = [
  { value: "Pre-Refit", label: "Pre-Refit Trials" },
  { value: "End-Refit", label: "End of Refit Trials" },
  { value: "Surprise", label: "Surprise Checks" },
  { value: "Audit", label: "HVAC Audit" },
];

const OBSERVATIONS_CHOICES = [
  "Sub-optimal air flow",
  "Non-ops",
  "Nil",
  "Others",
];

const REMARKS_CHOICES = ["SAT", "SAT with observations", "UNSAT"];

const HvacTrialForm = () => {
  const { toast } = useToast();

  // main state
  const [trials, setTrials] = useState<HvacTrial[]>([]);
  const [airFlows, setAirFlows] = useState<AirFlow[]>([]);
  const [machineryFlows, setMachineryFlows] = useState<MachineryAirFlow[]>([]);
  const [ships, setShips] = useState<{ id: number; name: string }[]>([]);
  const [compartments, setCompartments] = useState<
    { id: number; name: string }[]
  >([]);

  const [isTrialDialogOpen, setIsTrialDialogOpen] = useState(false);
  const [editingTrial, setEditingTrial] = useState<HvacTrial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate Average Modal states
  const [isCalculateAverageOpen, setIsCalculateAverageOpen] = useState(false);
  const [currentRowForAverage, setCurrentRowForAverage] = useState<{
    id: number;
    noOfDucts: number;
    type: 'airFlow' | 'machinery';
  } | null>(null);

  const [trialForm, setTrialForm] = useState({
    ship: "",
    date_of_trials: "",
    place_of_trials: "",
    document_no: "",
    occasion_of_trials: "",
    authority_for_trials: "",
  });

  const [airFlowForm, setAirFlowForm] = useState<AirFlow>({
    id: -1,
    compartment: "",
    served_by: "",
    no_of_ducts: 0,
    observations: "",
    remarks: "",
  });

  const [machineryForm, setMachineryForm] = useState<MachineryAirFlow>({
    id: -1,
    compartment: "",
    served_by: "",
    no_of_ducts: 0,
    observations: "",
    remarks: "",
  });

  // ---------------- API calls ----------------
  const fetchTrials = useCallback(async () => {
    try {
      const res = await getRequest("/shipmodule/trials/?page=1");
      // Handle different response structures
      const trialsData = res?.data || res?.results || res || [];
      setTrials(Array.isArray(trialsData) ? trialsData : []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load trials",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchShips = async () => {
    try {
      const res = await getRequest("/master/vessels/");
      // earlier responses used res.results — adapt if needed
      const shipsData = res?.results || res?.data || res || [];
      setShips(Array.isArray(shipsData) ? shipsData : []);
    } catch {
      /* ignore */
    }
  };

  const fetchCompartments = async () => {
    try {
      const res = await getRequest("/master/compartments/");
      const compartmentsData = res?.results || res?.data || res || [];
      setCompartments(Array.isArray(compartmentsData) ? compartmentsData : []);
    } catch {
      /* ignore */
    }
  };

  const fetchMeasurements = async (trialId: number) => {
    try {
      console.log("Fetching measurements for trial ID:", trialId);
      const air = await getRequest(
        `/shipmodule/ac-measurements/?hvac_trial_id=${trialId}`
      );
      const mach = await getRequest(
        `/shipmodule/machinery-measurements/?hvac_trial_id=${trialId}`
      );
      console.log("Air flow response:", air);
      console.log("Machinery response:", mach);
      
      // Handle different response structures
      const airData = air?.data || air?.results || air || [];
      const machData = mach?.data || mach?.results || mach || [];
      
      console.log("Processed air data:", airData);
      console.log("Processed machinery data:", machData);
      
      setAirFlows(Array.isArray(airData) ? airData : []);
      setMachineryFlows(Array.isArray(machData) ? machData : []);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      toast({
        title: "Error",
        description: "Failed to load measurements",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTrials();
    fetchShips();
    fetchCompartments();
  }, [fetchTrials]);

  // ---------------- Trial handlers ----------------
  const handleTrialSave = async () => {
    try {
      let trial: HvacTrial;
      if (editingTrial) {
        const response = await putRequest(
          `/shipmodule/trials/${editingTrial.id}/`,
          trialForm
        );
        trial = response.data || response;
        setTrials((prev) =>
          prev.map((t) => (t.id === editingTrial.id ? trial : t))
        );
        setEditingTrial(trial);
      } else {
        const response = await postRequest("/shipmodule/trials/", trialForm);
        trial = response.data || response;
        setTrials((prev) => [...prev, trial]);
        setEditingTrial(trial);
      }
      await fetchMeasurements(trial.id);
      toast({
        title: "Success",
        description: "Trial saved. You can now add measurements.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Save failed",
        variant: "destructive",
      });
    }
  };

  // ---------------- Air Flow handlers ----------------
  const handleAirFlowChange = (
    id: number,
    field: keyof AirFlow,
    value: string | number | boolean
  ) => {
    setAirFlows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveAirFlowRow = async (row: AirFlow) => {
    try {
      if (row.id && row.id > 0) {
        // Existing row → PUT
        const response = await putRequest(
          `/shipmodule/ac-measurements/${row.id}/`,
          row
        );
        const updated = response.data || response;
        setAirFlows((prev) => prev.map((r) => (r.id === row.id ? updated : r)));
        toast({ title: "Saved", description: "Air Flow updated" });
      } else {
        // New row → POST
        const payload = { ...row };
        delete payload.isEditing;
        delete payload.id; // remove temporary -1 ID
        const response = await postRequest(
          "/shipmodule/ac-measurements/",
          payload
        );
        const created = response.data || response;
        // Replace the temporary row with the created one
        setAirFlows((prev) => [
          ...prev.filter((r) => r.id !== -1), // remove the temporary row
          { ...created, isEditing: false },
        ]);
        toast({ title: "Added", description: "Air Flow added" });
      }
    } catch {
      toast({
        title: "Error",
        description: "Save failed",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteAirFlow = async (id: number) => {
    if (!confirm("Delete this air flow measurement?")) return;
    try {
      await deleteRequest(`/shipmodule/ac-measurements/${id}/`);
      setAirFlows((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Air Flow removed" });
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const handleAirFlowSaveNew = async () => {
    try {
      const newRow: AirFlow = {
        id: -1,
        compartment: "",
        served_by: "",
        no_of_ducts: 0,
        observations: "",
        remarks: "",
        isEditing: true,
        hvac_trial: editingTrial!.id,
      };
      setAirFlows((prev) => [...prev, newRow]);
      toast({ title: "New row added - click Save to persist" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add new row",
        variant: "destructive",
      });
    }
  };

  // ---------------- Machinery handlers ----------------
  const handleMachineryChange = (
    id: number,
    field: keyof MachineryAirFlow,
    value: string | number | boolean
  ) => {
    setMachineryFlows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveMachineryRow = async (row: MachineryAirFlow) => {
    try {
      if (row.id && row.id > 0) {
        // Existing row → PUT
        const response = await putRequest(
          `/shipmodule/machinery-measurements/${row.id}/`,
          row
        );
        const updated = response.data || response;
        setMachineryFlows((prev) =>
          prev.map((r) => (r.id === row.id ? updated : r))
        );
        toast({ title: "Saved", description: "Machinery updated" });
      } else {
        // New row → POST
        const payload = { ...row };
        delete payload.isEditing;
        delete payload.id; // remove temporary -1 ID
        const response = await postRequest(
          "/shipmodule/machinery-measurements/",
          payload
        );
        const created = response.data || response;
        setMachineryFlows((prev) => [
          ...prev.filter((r) => r.id !== -1), // remove temporary row
          { ...created, isEditing: false },
        ]);
        toast({ title: "Added", description: "Machinery added" });
      }
    } catch {
      toast({
        title: "Error",
        description: "Save failed",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMachinery = async (id: number) => {
    if (!confirm("Delete this machinery measurement?")) return;
    try {
      await deleteRequest(`/shipmodule/machinery-measurements/${id}/`);
      setMachineryFlows((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Machinery removed" });
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const handleMachinerySaveNew = async () => {
    try {
      const newRow: MachineryAirFlow = {
        id: -1,
        compartment: "",
        served_by: "",
        no_of_ducts: 0,
        observations: "",
        remarks: "",
        isEditing: true,
        hvac_trial: editingTrial!.id,
      };
      setMachineryFlows((prev) => [...prev, newRow]);
      toast({ title: "New row added - click Save to persist" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add new row",
        variant: "destructive",
      });
    }
  };

  // ---------------- Calculate Average handlers ----------------
  const handleCalculateAverage = (row: AirFlow | MachineryAirFlow, type: 'airFlow' | 'machinery') => {
    if (!row.no_of_ducts || row.no_of_ducts <= 0) {
      toast({
        title: "Error",
        description: "No of Ducts must be greater than 0 to calculate averages",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentRowForAverage({
      id: row.id,
      noOfDucts: row.no_of_ducts,
      type: type
    });
    setIsCalculateAverageOpen(true);
  };

  const handleSaveAverages = (averages: {
    airFlow: number;
    flowRate: number;
    designValue: number;
    measuredValue: number;
  }) => {
    if (!currentRowForAverage) return;

    if (currentRowForAverage.type === 'airFlow') {
      setAirFlows((prev) =>
        prev.map((row) =>
          row.id === currentRowForAverage.id
            ? {
                ...row,
                air_flow: averages.airFlow,
                flow_rate_at_duct: averages.flowRate,
                design_air_flow_rate: averages.designValue,
                measured_air_flow_rate: averages.measuredValue,
              }
            : row
        )
      );
    } else {
      setMachineryFlows((prev) =>
        prev.map((row) =>
          row.id === currentRowForAverage.id
            ? {
                ...row,
                air_flow: averages.airFlow,
                flow_rate_at_duct: averages.flowRate,
                design_air_flow_rate: averages.designValue,
                measured_air_flow_rate: averages.measuredValue,
              }
            : row
        )
      );
    }

    toast({
      title: "Success",
      description: "Averages calculated and applied successfully",
    });
  };

  // ---------------- Edit trial ----------------
  const handleEdit = (trial: HvacTrial) => {
    console.log("handleEdit called with trial:", trial);
    setEditingTrial(trial);
    // populate trial form
    setTrialForm({
      ship: trial.ship?.toString() || "",
      date_of_trials: trial.date_of_trials,
      place_of_trials: trial.place_of_trials,
      document_no: trial.document_no,
      occasion_of_trials: trial.occasion_of_trials,
      authority_for_trials: trial.authority_for_trials,
    });
    console.log("About to fetch measurements for trial ID:", trial.id);
    fetchMeasurements(trial.id);
    setIsTrialDialogOpen(true);
  };

  const handleOpenNewTrial = () => {
    setEditingTrial(null);
    setTrialForm({
      ship: "",
      date_of_trials: "",
      place_of_trials: "",
      document_no: "",
      occasion_of_trials: "",
      authority_for_trials: "",
    });
    setAirFlows([]);
    setMachineryFlows([]);
    setIsTrialDialogOpen(true);
  };

  // ---------------- Trial table body templates ----------------
  const shipBodyTemplate = (rowData: HvacTrial) => {
    const ship = (Array.isArray(ships) ? ships : []).find(
      (s) => s.id.toString() === rowData.ship?.toString()
    );
    return ship?.name || rowData.ship_name || rowData.ship || "";
  };

  const trialActionsBodyTemplate = (rowData: HvacTrial) => (
    <div className="flex gap-2 justify-center">
      <Button 
        variant="outline" 
        size="icon" 
        title="Edit Trial"
        onClick={() => handleEdit(rowData)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        title="Delete Trial"
        onClick={async () => {
          if (!confirm("Delete this trial?")) return;
          try {
            await deleteRequest(`/shipmodule/trials/${rowData.id}/`);
            setTrials((p) => p.filter((t) => t.id !== rowData.id));
            toast({ title: "Deleted", description: "Trial removed" });
          } catch {
            toast({
              title: "Error",
              description: "Delete failed",
              variant: "destructive",
            });
          }
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // ---------------- Air Flow table body templates ----------------
  const airFlowSerialBodyTemplate = (rowData: AirFlow) => (
        <div className="w-16 text-center">
      {airFlows.findIndex((r) => r.id === rowData.id) + 1}
        </div>
  );

  const airFlowServedByBodyTemplate = (rowData: AirFlow) => (
        <Input
          className="w-40"
      value={rowData.served_by || ""}
          onChange={(e) =>
        handleAirFlowChange(rowData.id, "served_by", e.target.value)
      }
    />
  );

  const airFlowCompartmentBodyTemplate = (rowData: AirFlow) => {
    const selectedCompartment = (Array.isArray(compartments) ? compartments : []).find(
      (c) => c.id.toString() === rowData.compartment?.toString()
    );
        return (
          <Select
        value={rowData.compartment || ""}
            onValueChange={(val) =>
          handleAirFlowChange(rowData.id, "compartment", val)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Compartment">
                {selectedCompartment?.name || "Select Compartment"}
              </SelectValue>
            </SelectTrigger>
        <SelectContent className="z-[9999]">
              {compartments.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
  };

  const airFlowNoOfDuctsBodyTemplate = (rowData: AirFlow) => (
        <Input
          className="w-24"
          type="number"
      value={String(rowData.no_of_ducts ?? "")}
          onChange={(e) =>
        handleAirFlowChange(rowData.id, "no_of_ducts", Number(e.target.value))
      }
    />
  );

  const airFlowDuctAreaBodyTemplate = (rowData: AirFlow) => (
        <Input
          className="w-28"
          type="number"
      value={String(rowData.duct_area ?? "")}
          onChange={(e) =>
        handleAirFlowChange(rowData.id, "duct_area", Number(e.target.value))
      }
    />
  );

  const airFlowAirFlowBodyTemplate = (rowData: AirFlow) => (
        <Input
          className="w-28"
          type="number"
          value={String(rowData.air_flow ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const airFlowFlowRateBodyTemplate = (rowData: AirFlow) => (
        <Input
          className="w-36"
          type="number"
          value={String(rowData.flow_rate_at_duct ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const airFlowDesignValueBodyTemplate = (rowData: AirFlow) => (
        <Input
          className="w-28"
          type="number"
          value={String(rowData.design_air_flow_rate ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const airFlowMeasuredValueBodyTemplate = (rowData: AirFlow) => (
        <Input
          className="w-28"
          type="number"
          value={String(rowData.measured_air_flow_rate ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const airFlowObservationsBodyTemplate = (rowData: AirFlow) => (
        <Select
      value={rowData.observations || ""}
          onValueChange={(val) =>
        handleAirFlowChange(rowData.id, "observations", val)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Observation" />
          </SelectTrigger>
          <SelectContent>
            {OBSERVATIONS_CHOICES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  );

  const airFlowRemarksBodyTemplate = (rowData: AirFlow) => (
        <Select
      value={rowData.remarks || ""}
      onValueChange={(val) => handleAirFlowChange(rowData.id, "remarks", val)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Remark" />
          </SelectTrigger>
          <SelectContent>
            {REMARKS_CHOICES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  );

  const airFlowActionsBodyTemplate = (rowData: AirFlow) => (
    <div className="flex gap-1 w-40">
      <Button
        size="sm"
        variant={rowData.isEditing ? "default" : "outline"}
        title={rowData.isEditing ? "Save Air Flow" : "Edit Air Flow"}
        onClick={() => {
          if (rowData.isEditing) {
            saveAirFlowRow(rowData);
            handleAirFlowChange(rowData.id, "isEditing", false);
          } else {
            handleAirFlowChange(rowData.id, "isEditing", true);
          }
        }}
      >
        {rowData.isEditing ? (
          <Save className="h-4 w-4" />
        ) : (
          <Edit className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        title="Calculate Average"
        onClick={() => handleCalculateAverage(rowData, 'airFlow')}
        className="text-blue-600 hover:text-blue-700"
      >
        <Calculator className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        title="Delete Air Flow"
        onClick={() => handleDeleteAirFlow(rowData.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // ---------------- Machinery table body templates ----------------
  const machinerySerialBodyTemplate = (rowData: MachineryAirFlow) => (
        <div className="w-16 text-center">
      {machineryFlows.findIndex((r) => r.id === rowData.id) + 1}
        </div>
  );

  const machineryServedByBodyTemplate = (rowData: MachineryAirFlow) => (
        <Input
          className="w-40"
      value={rowData.served_by || ""}
          onChange={(e) =>
        handleMachineryChange(rowData.id, "served_by", e.target.value)
      }
    />
  );

  const machineryCompartmentBodyTemplate = (rowData: MachineryAirFlow) => {
    const selectedCompartment = (Array.isArray(compartments) ? compartments : []).find(
      (c) => c.id.toString() === rowData.compartment?.toString()
    );
        return (
          <Select
        value={rowData.compartment || ""}
            onValueChange={(val) =>
          handleMachineryChange(rowData.id, "compartment", val)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Compartment">
                {selectedCompartment?.name || "Select Compartment"}
              </SelectValue>
            </SelectTrigger>
        <SelectContent className="z-[9999]">
              {compartments.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
  };

  const machineryNoOfDuctsBodyTemplate = (rowData: MachineryAirFlow) => (
        <Input
          className="w-24"
          type="number"
      value={String(rowData.no_of_ducts ?? "")}
          onChange={(e) =>
        handleMachineryChange(rowData.id, "no_of_ducts", Number(e.target.value))
      }
    />
  );

  const machineryDuctAreaBodyTemplate = (rowData: MachineryAirFlow) => (
        <Input
          className="w-28"
          type="number"
      value={String(rowData.duct_area ?? "")}
          onChange={(e) =>
        handleMachineryChange(rowData.id, "duct_area", Number(e.target.value))
      }
    />
  );

  const machineryAirFlowBodyTemplate = (rowData: MachineryAirFlow) => (
        <Input
          className="w-28"
          type="number"
          value={String(rowData.air_flow ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const machineryFlowRateBodyTemplate = (rowData: MachineryAirFlow) => (
        <Input
          className="w-36"
          type="number"
          value={String(rowData.flow_rate_at_duct ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const machineryDesignValueBodyTemplate = (rowData: MachineryAirFlow) => (
        <Input
          className="w-28"
          type="number"
          value={String(rowData.design_air_flow_rate ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const machineryMeasuredValueBodyTemplate = (rowData: MachineryAirFlow) => (
        <Input
          className="w-28"
          type="number"
          value={String(rowData.measured_air_flow_rate ?? "")}
          disabled
          readOnly
          style={{ 
            backgroundColor: '#f5f5f5', 
            cursor: 'not-allowed',
            color: '#000000',
            opacity: 1
          }}
        />
  );

  const machineryObservationsBodyTemplate = (rowData: MachineryAirFlow) => (
        <Select
      value={rowData.observations || ""}
          onValueChange={(val) =>
        handleMachineryChange(rowData.id, "observations", val)
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Observation" />
          </SelectTrigger>
          <SelectContent>
            {OBSERVATIONS_CHOICES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  );

  const machineryRemarksBodyTemplate = (rowData: MachineryAirFlow) => (
        <Select
      value={rowData.remarks || ""}
      onValueChange={(val) => handleMachineryChange(rowData.id, "remarks", val)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Remark" />
          </SelectTrigger>
          <SelectContent>
            {REMARKS_CHOICES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  );

  const machineryActionsBodyTemplate = (rowData: MachineryAirFlow) => (
    <div className="flex gap-1 w-40">
      <Button
        size="sm"
        variant={rowData.isEditing ? "default" : "outline"}
        title={rowData.isEditing ? "Save Machinery" : "Edit Machinery"}
        onClick={() => {
          if (rowData.isEditing) {
            saveMachineryRow(rowData);
            handleMachineryChange(rowData.id, "isEditing", false);
          } else {
            handleMachineryChange(rowData.id, "isEditing", true);
          }
        }}
      >
        {rowData.isEditing ? (
          <Save className="h-4 w-4" />
        ) : (
          <Edit className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        title="Calculate Average"
        onClick={() => handleCalculateAverage(rowData, 'machinery')}
        className="text-blue-600 hover:text-blue-700"
      >
        <Calculator className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        title="Delete Machinery"
        onClick={() => handleDeleteMachinery(rowData.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // ---------------- UI ----------------
  const filtered = (Array.isArray(trials) ? trials : []).filter((t) => {
    const ship = (Array.isArray(ships) ? ships : []).find((s) => s.id.toString() === t.ship?.toString());
    const shipName = ship?.name || t.ship_name || "";
    return shipName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">HVAC Trials</h1>

        <Button
          onClick={handleOpenNewTrial}
          className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
        >
              <Plus className="mr-2 h-4 w-4" /> Add Trial
            </Button>

        <Dialog
          visible={isTrialDialogOpen}
          onHide={() => setIsTrialDialogOpen(false)}
          headerClassName="p-1 m-5 bg-[#00809D] rounded-t-2xl text-white w-8xl max-w-8xl "
          header={
            <div className="bg-[#00809D] p-6 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {editingTrial ? "Edit HVAC Trial" : "Add HVAC Trial"}
                    </h2>
                    <p className="text-white/80 mt-1">
                Enter trial details and add measurements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
          style={{
            width: "90vw",
            maxWidth: "1400px",
            minWidth: "800px",
            height: "90vh",
            maxHeight: "90vh",
            zIndex: 1000,
          }}
          className="border-0 shadow-2xl"
          modal
          draggable={true}
          resizable={true}
          maximizable={true}
          contentStyle={{ padding: 2, overflow: 'hidden' }}
          headerStyle={{ padding: 0, margin: 0 }}
        > 

            {/* Scrollable body */}
            <div className="p-6 space-y-6 bg-white overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#00809D] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      1
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ship <span className="text-red-500">*</span>
                    </label>
                  <Select
                    value={trialForm.ship}
                    onValueChange={(val) =>
                      setTrialForm({ ...trialForm, ship: val })
                    }
                  >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="e.g., INS Vikrant" />
                    </SelectTrigger>
                      <SelectContent className="z-[9999]">
                      {ships.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Date of Trials <span className="text-red-500">*</span>
                    </label>
                  <Input
                    type="date"
                      className="h-10"
                    value={trialForm.date_of_trials}
                    onChange={(e) =>
                      setTrialForm({
                        ...trialForm,
                        date_of_trials: e.target.value,
                      })
                    }
                  />
                </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Place <span className="text-red-500">*</span>
                    </label>
                  <Select
                    value={trialForm.place_of_trials}
                    onValueChange={(val) =>
                      setTrialForm({ ...trialForm, place_of_trials: val })
                    }
                  >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="e.g., Mumbai" />
                    </SelectTrigger>
                      <SelectContent className="z-[9999]">
                      {PLACE_CHOICES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Document No
                    </label>
                  <Input
                      className="h-10"
                      placeholder="e.g., DOC-2024-001"
                    value={trialForm.document_no}
                    onChange={(e) =>
                      setTrialForm({
                        ...trialForm,
                        document_no: e.target.value,
                      })
                    }
                  />
                </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Occasion
                    </label>
                  <Select
                    value={trialForm.occasion_of_trials}
                    onValueChange={(val) =>
                      setTrialForm({ ...trialForm, occasion_of_trials: val })
                    }
                  >
                      <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Occasion" />
                    </SelectTrigger>
                      <SelectContent className="z-[9999]">
                      {OCCASION_CHOICES.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Authority
                    </label>
                  <Input
                      className="h-10"
                      placeholder="e.g., Naval Command"
                    value={trialForm.authority_for_trials}
                    onChange={(e) =>
                      setTrialForm({
                        ...trialForm,
                        authority_for_trials: e.target.value,
                      })
                    }
                  />
                  </div>
                </div>
              </div>

              {/* Save Trial Button */}
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleTrialSave}
                  disabled={
                    !trialForm.ship ||
                    !trialForm.date_of_trials ||
                    !trialForm.place_of_trials
                  }
                  className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Save Trial
                </Button>
              </div>

              {/* Section 2: Air Flow Measurements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00809D] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Air Flow Measurements
                    </h3>
                  </div>
                    <Button 
                      onClick={handleAirFlowSaveNew} 
                      disabled={!editingTrial}
                    className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-4 py-2 rounded-md font-medium"
                    >
                    <Plus className="mr-2 h-4 w-4" /> Add Measurement
                    </Button>
                  </div>
                  {!editingTrial && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      Please save the trial first before adding measurements
                    </p>
                  </div>
                  )}
                <CardContent className="px-4 py-2">
                  <DataTable
                    value={Array.isArray(airFlows) ? airFlows : []}
                    paginator
                    rows={5}
                    emptyMessage="No air flow measurements found"
                    className="vessel-datatable min-w-[1200px]"
                  >
                    <Column
                      field="id"
                      header="Ser No"
                      body={airFlowSerialBodyTemplate}
                    />
                    <Column
                      field="served_by"
                      header="Served by ATU/ HE/ AHU/ FCU"
                      body={airFlowServedByBodyTemplate}
                    />
                    <Column
                      field="compartment"
                      header="Compartment Name"
                      body={airFlowCompartmentBodyTemplate}
                    />
                    <Column
                      field="no_of_ducts"
                      header="No of Ducts"
                      body={airFlowNoOfDuctsBodyTemplate}
                    />
                    <Column
                      field="duct_area"
                      header="Duct Area (m²)"
                      body={airFlowDuctAreaBodyTemplate}
                    />
                    <Column
                      field="air_flow"
                      header="Air Flow (m/s)"
                      body={airFlowAirFlowBodyTemplate}
                    />
                    <Column
                      field="flow_rate_at_duct"
                      header="Flow Rate at Duct (m³/hr)"
                      body={airFlowFlowRateBodyTemplate}
                    />
                    <Column
                      field="design_air_flow_rate"
                      header="Design Value"
                      body={airFlowDesignValueBodyTemplate}
                    />
                    <Column
                      field="measured_air_flow_rate"
                      header="Measured Value"
                      body={airFlowMeasuredValueBodyTemplate}
                    />
                    <Column
                      field="observations"
                      header="Observations"
                      body={airFlowObservationsBodyTemplate}
                    />
                    <Column
                      field="remarks"
                      header="Remarks"
                      body={airFlowRemarksBodyTemplate}
                    />
                    <Column
                      field="actions"
                      header="Actions"
                      body={airFlowActionsBodyTemplate}
                    />
                  </DataTable>
                  {/* Add new Air Flow Row - Hidden form */}
                  <div className="hidden">
                    <div>
                      <label className="text-sm mb-1 block">Compartment</label>
                      <Select
                        value={airFlowForm.compartment}
                        onValueChange={(val) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            compartment: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Compartment" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          {compartments.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Served By</label>
                      <Input
                        value={airFlowForm.served_by}
                        onChange={(e) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            served_by: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">No. of Ducts</label>
                      <Input
                        type="number"
                        value={String(airFlowForm.no_of_ducts)}
                        onChange={(e) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            no_of_ducts: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Duct Area</label>
                      <Input
                        type="number"
                        value={airFlowForm.duct_area || ""}
                        onChange={(e) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            duct_area: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Air Flow</label>
                      <Input
                        type="number"
                        value={airFlowForm.air_flow || ""}
                        onChange={(e) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            air_flow: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">
                        Flow Rate at Duct
                      </label>
                      <Input
                        type="number"
                        value={airFlowForm.flow_rate_at_duct || ""}
                        onChange={(e) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            flow_rate_at_duct: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">
                        Design Air Flow
                      </label>
                      <Input
                        type="number"
                        value={airFlowForm.design_air_flow_rate || ""}
                        onChange={(e) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            design_air_flow_rate: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">
                        Measured Air Flow
                      </label>
                      <Input
                        type="number"
                        value={airFlowForm.measured_air_flow_rate || ""}
                        onChange={(e) =>
                          setAirFlowForm({
                            ...airFlowForm,
                            measured_air_flow_rate: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-2 ml-auto col-span-full">
                      <Button onClick={handleAirFlowSaveNew}>
                        <Plus className="mr-2" /> Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Section 3: Machinery Air Flow Measurements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00809D] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Machinery Air Flow Measurements
                    </h3>
                  </div>
                    <Button 
                      onClick={handleMachinerySaveNew} 
                      disabled={!editingTrial}
                    className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-4 py-2 rounded-md font-medium"
                    >
                    <Plus className="mr-2 h-4 w-4" /> Add Measurement
                    </Button>
                  </div>
                  {!editingTrial && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-800">
                      Please save the trial first before adding measurements
                    </p>
                  </div>
                  )}
                <CardContent className="px-4 py-2">
                  <DataTable
                    value={Array.isArray(machineryFlows) ? machineryFlows : []}
                    paginator
                    rows={5}
                    emptyMessage="No machinery measurements found"
                    className="vessel-datatable min-w-[1200px]"
                  >
                    <Column
                      field="id"
                      header="Ser No"
                      body={machinerySerialBodyTemplate}
                    />
                    <Column
                      field="served_by"
                      header="Served by ATU/ HE/ AHU/ FCU"
                      body={machineryServedByBodyTemplate}
                    />
                    <Column
                      field="compartment"
                      header="Compartment Name"
                      body={machineryCompartmentBodyTemplate}
                    />
                    <Column
                      field="no_of_ducts"
                      header="No of Ducts"
                      body={machineryNoOfDuctsBodyTemplate}
                    />
                    <Column
                      field="duct_area"
                      header="Duct Area (m²)"
                      body={machineryDuctAreaBodyTemplate}
                    />
                    <Column
                      field="air_flow"
                      header="Air Flow (m/s)"
                      body={machineryAirFlowBodyTemplate}
                    />
                    <Column
                      field="flow_rate_at_duct"
                      header="Flow Rate at Duct (m³/hr)"
                      body={machineryFlowRateBodyTemplate}
                    />
                    <Column
                      field="design_air_flow_rate"
                      header="Design Value"
                      body={machineryDesignValueBodyTemplate}
                    />
                    <Column
                      field="measured_air_flow_rate"
                      header="Measured Value"
                      body={machineryMeasuredValueBodyTemplate}
                    />
                    <Column
                      field="observations"
                      header="Observations"
                      body={machineryObservationsBodyTemplate}
                    />
                    <Column
                      field="remarks"
                      header="Remarks"
                      body={machineryRemarksBodyTemplate}
                    />
                    <Column
                      field="actions"
                      header="Actions"
                      body={machineryActionsBodyTemplate}
                    />
                  </DataTable>

                  {/* Add new Machinery Row - Hidden form */}
                  <div className="hidden">
                    <div>
                      <label className="text-sm mb-1 block">Compartment</label>
                      <Select
                        value={machineryForm.compartment}
                        onValueChange={(val) =>
                          setMachineryForm({
                            ...machineryForm,
                            compartment: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Compartment" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          {compartments.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Served By</label>
                      <Input
                        value={machineryForm.served_by}
                        onChange={(e) =>
                          setMachineryForm({
                            ...machineryForm,
                            served_by: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">No. of Ducts</label>
                      <Input
                        type="number"
                        value={String(machineryForm.no_of_ducts)}
                        onChange={(e) =>
                          setMachineryForm({
                            ...machineryForm,
                            no_of_ducts: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Duct Area</label>
                      <Input
                        type="number"
                        value={machineryForm.duct_area || ""}
                        onChange={(e) =>
                          setMachineryForm({
                            ...machineryForm,
                            duct_area: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">Air Flow</label>
                      <Input
                        type="number"
                        value={machineryForm.air_flow || ""}
                        onChange={(e) =>
                          setMachineryForm({
                            ...machineryForm,
                            air_flow: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">
                        Flow Rate at Duct
                      </label>
                      <Input
                        type="number"
                        value={machineryForm.flow_rate_at_duct || ""}
                        onChange={(e) =>
                          setMachineryForm({
                            ...machineryForm,
                            flow_rate_at_duct: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">
                        Design Air Flow
                      </label>
                      <Input
                        type="number"
                        value={machineryForm.design_air_flow_rate || ""}
                        onChange={(e) =>
                          setMachineryForm({
                            ...machineryForm,
                            design_air_flow_rate: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm mb-1 block">
                        Measured Air Flow
                      </label>
                      <Input
                        type="number"
                        value={machineryForm.measured_air_flow_rate || ""}
                        onChange={(e) =>
                          setMachineryForm({
                            ...machineryForm,
                            measured_air_flow_rate: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-2 ml-auto col-span-full">
                      <Button onClick={handleMachinerySaveNew}>
                        <Plus className="mr-2" /> Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button 
                  onClick={() => {
                    setIsTrialDialogOpen(false);
                    setEditingTrial(null);
                    setTrialForm({
                      ship: "",
                      date_of_trials: "",
                      place_of_trials: "",
                      document_no: "",
                      occasion_of_trials: "",
                      authority_for_trials: "",
                    });
                    setAirFlows([]);
                    setMachineryFlows([]);
                  }}
                  variant="outline"
                  className="px-6 py-2 rounded-md font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {/* <Button 
                  onClick={handleTrialSave}
                  disabled={!trialForm.ship || !trialForm.date_of_trials || !trialForm.place_of_trials}
                  className="bg-[#00809D] hover:bg-[#00809D]/90 text-white px-6 py-2 rounded-md font-medium"
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {editingTrial ? "Update Trial" : "Create Trial"}
                </Button> */}
              </div>
            </div>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Trials table */}
      <Card>
        <CardHeader>
          <CardTitle>Trials</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            value={Array.isArray(filtered) ? filtered : []}
            paginator
            rows={10}
            emptyMessage="No trials found"
            className="vessel-datatable"
          >
            <Column 
              field="ship_name" 
              header="Ship" 
              body={shipBodyTemplate}
              className="min-w-[200px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="date_of_trials" 
              header="Date" 
              className="min-w-[150px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="place_of_trials" 
              header="Place" 
              className="min-w-[150px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="document_no" 
              header="Document No" 
              className="min-w-[150px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="occasion_of_trials" 
              header="Occasion" 
              className="min-w-[180px]"
              headerClassName="master-table-header"
            />
            <Column 
              field="authority_for_trials" 
              header="Authority" 
              className="min-w-[150px]"
              headerClassName="master-table-header"
            />
            <Column
              field="actions"
              header="Actions"
              body={trialActionsBodyTemplate}
              className="w-[140px] text-center"
              headerClassName="master-table-header-no-border"
            />
          </DataTable>
        </CardContent>
      </Card>

      {/* Calculate Average Modal */}
      <CalculateAverageModal
        visible={isCalculateAverageOpen}
        onHide={() => {
          setIsCalculateAverageOpen(false);
          setCurrentRowForAverage(null);
        }}
        noOfDucts={currentRowForAverage?.noOfDucts || 0}
        onSave={handleSaveAverages}
        currentValues={currentRowForAverage ? {
          airFlow: currentRowForAverage.type === 'airFlow' 
            ? airFlows.find(r => r.id === currentRowForAverage.id)?.air_flow || 0
            : machineryFlows.find(r => r.id === currentRowForAverage.id)?.air_flow || 0,
          flowRate: currentRowForAverage.type === 'airFlow'
            ? airFlows.find(r => r.id === currentRowForAverage.id)?.flow_rate_at_duct || 0
            : machineryFlows.find(r => r.id === currentRowForAverage.id)?.flow_rate_at_duct || 0,
          designValue: currentRowForAverage.type === 'airFlow'
            ? airFlows.find(r => r.id === currentRowForAverage.id)?.design_air_flow_rate || 0
            : machineryFlows.find(r => r.id === currentRowForAverage.id)?.design_air_flow_rate || 0,
          measuredValue: currentRowForAverage.type === 'airFlow'
            ? airFlows.find(r => r.id === currentRowForAverage.id)?.measured_air_flow_rate || 0
            : machineryFlows.find(r => r.id === currentRowForAverage.id)?.measured_air_flow_rate || 0,
        } : {}}
      />
    </div>
  );
};

export default HvacTrialForm;
