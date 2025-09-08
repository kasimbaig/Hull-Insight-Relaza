import { getRequest, postRequest } from './apiservice';

// Systems API functions
export const getSystems = async (page = 1) => {
  try {
    const response = await getRequest(`master/systems/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Systems Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createSystem = async (systemData: {
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
  sequence: number;
  active: number;
}) => {
  try {
    const response = await postRequest('master/systems/', systemData);
    return response;
  } catch (error) {
    console.error('Create System Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateSystem = async (systemId: string | number, systemData: {
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
}) => {
  try {
    const payload = {
      id: parseInt(systemId.toString()),
      name: systemData.name,
      remark: systemData.remark,
      ser: systemData.ser,
      numbers: systemData.numbers,
      capabilities_feature: systemData.capabilities_feature,
      weight_volume_power_consumption: systemData.weight_volume_power_consumption,
      location: systemData.location,
      interface: systemData.interface,
      procurement_router: systemData.procurement_router,
      vendor: systemData.vendor,
      cost: systemData.cost,
      standards: systemData.standards,
      sustenance: systemData.sustenance,
      flag: systemData.flag,
      sotr_type: systemData.sotr_type,
      sequence: systemData.sequence
    };
    const response = await postRequest('master/systems/', payload);
    return response;
  } catch (error) {
    console.error('Update System Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteSystem = async (systemId: string | number) => {
  try {
    const payload = {
      id: parseInt(systemId.toString()),
      delete: true
    };
    const response = await postRequest('master/systems/', payload);
    return response;
  } catch (error) {
    console.error('Delete System Error:', error.response?.data || error.message);
    throw error;
  }
};
