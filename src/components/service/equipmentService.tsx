import { getRequest, postRequest } from './apiservice';

// Equipments API functions
export const getEquipments = async (page = 1) => {
  try {
    const response = await getRequest(`master/equipments/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Equipments Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createEquipment = async (equipmentData: {
  name: string;
  code: string;
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
  equipment_type_name: string;
  active: number;
}) => {
  try {
    const response = await postRequest('master/equipments/', equipmentData);
    return response;
  } catch (error) {
    console.error('Create Equipment Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEquipment = async (equipmentId: string | number, equipmentData: {
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
  equipment_type_name: string;
}) => {
  try {
    const payload = {
      id: parseInt(equipmentId.toString()),
      name: equipmentData.name,
      remark: equipmentData.remark,
      ser: equipmentData.ser,
      numbers: equipmentData.numbers,
      capabilities_feature: equipmentData.capabilities_feature,
      weight_volume_power_consumption: equipmentData.weight_volume_power_consumption,
      location: equipmentData.location,
      interface: equipmentData.interface,
      procurement_router: equipmentData.procurement_router,
      vendor: equipmentData.vendor,
      cost: equipmentData.cost,
      standards: equipmentData.standards,
      sustenance: equipmentData.sustenance,
      flag: equipmentData.flag,
      sotr_type: equipmentData.sotr_type,
      equipment_type_name: equipmentData.equipment_type_name
    };
    const response = await postRequest('master/equipments/', payload);
    return response;
  } catch (error) {
    console.error('Update Equipment Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteEquipment = async (equipmentId: string | number) => {
  try {
    const payload = {
      id: parseInt(equipmentId.toString()),
      delete: true
    };
    const response = await postRequest('master/equipments/', payload);
    return response;
  } catch (error) {
    console.error('Delete Equipment Error:', error.response?.data || error.message);
    throw error;
  }
};
