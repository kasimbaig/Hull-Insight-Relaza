import { getRequest, postRequest } from './apiservice';

// OperationalStatuses API functions
export const getOperationalStatuses = async (page = 1) => {
  try {
    const response = await getRequest(`master/operationalstatuses/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get OperationalStatuses Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createOperationalStatus = async (operationalStatusData: {
  name: string;
  code: string;
  active: number;
}) => {
  try {
    const response = await postRequest('master/operationalstatuses/', operationalStatusData);
    return response;
  } catch (error) {
    console.error('Create OperationalStatus Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateOperationalStatus = async (operationalStatusId: string | number, operationalStatusData: {
  name: string;
}) => {
  try {
    const payload = {
      id: parseInt(operationalStatusId.toString()),
      name: operationalStatusData.name
    };
    const response = await postRequest('master/operationalstatuses/', payload);
    return response;
  } catch (error) {
    console.error('Update OperationalStatus Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteOperationalStatus = async (operationalStatusId: string | number) => {
  try {
    const payload = {
      id: parseInt(operationalStatusId.toString()),
      delete: true
    };
    const response = await postRequest('master/operationalstatuses/', payload);
    return response;
  } catch (error) {
    console.error('Delete OperationalStatus Error:', error.response?.data || error.message);
    throw error;
  }
};
