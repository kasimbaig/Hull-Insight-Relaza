import { getRequest, postRequest } from './apiservice';

// Severities API functions
export const getSeverities = async (page = 1) => {
  try {
    const response = await getRequest(`master/severities/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Severities Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createSeverity = async (severityData: {
  name: string;
  code: string;
  active: number;
}) => {
  try {
    const response = await postRequest('master/severities/', severityData);
    return response;
  } catch (error) {
    console.error('Create Severity Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateSeverity = async (severityId: string | number, severityData: {
  name: string;
}) => {
  try {
    const payload = {
      id: parseInt(severityId.toString()),
      name: severityData.name
    };
    const response = await postRequest('master/severities/', payload);
    return response;
  } catch (error) {
    console.error('Update Severity Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteSeverity = async (severityId: string | number) => {
  try {
    const payload = {
      id: parseInt(severityId.toString()),
      delete: true
    };
    const response = await postRequest('master/severities/', payload);
    return response;
  } catch (error) {
    console.error('Delete Severity Error:', error.response?.data || error.message);
    throw error;
  }
};
