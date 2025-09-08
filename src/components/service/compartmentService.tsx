import { getRequest, postRequest } from './apiservice';

// Compartments API functions
export const getCompartments = async (page = 1) => {
  try {
    const response = await getRequest(`master/compartments/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Compartments Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createCompartment = async (compartmentData: {
  name: string;
  code: string;
  remark: string;
  ser: string;
  numbers: string;
  location: string;
  equipment: string;
  features: string;
  layout: string;
  special_requirements: string;
  standards: string;
  active: number;
}) => {
  try {
    const response = await postRequest('master/compartments/', compartmentData);
    return response;
  } catch (error) {
    console.error('Create Compartment Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateCompartment = async (compartmentId: string | number, compartmentData: {
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
}) => {
  try {
    const payload = {
      id: parseInt(compartmentId.toString()),
      name: compartmentData.name,
      remark: compartmentData.remark,
      ser: compartmentData.ser,
      numbers: compartmentData.numbers,
      location: compartmentData.location,
      equipment: compartmentData.equipment,
      features: compartmentData.features,
      layout: compartmentData.layout,
      special_requirements: compartmentData.special_requirements,
      standards: compartmentData.standards
    };
    const response = await postRequest('master/compartments/', payload);
    return response;
  } catch (error) {
    console.error('Update Compartment Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteCompartment = async (compartmentId: string | number) => {
  try {
    const payload = {
      id: parseInt(compartmentId.toString()),
      delete: true
    };
    const response = await postRequest('master/compartments/', payload);
    return response;
  } catch (error) {
    console.error('Delete Compartment Error:', error.response?.data || error.message);
    throw error;
  }
};
