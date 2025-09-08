import { getRequest, postRequest } from './apiservice';

// DamageTypes API functions
export const getDamageTypes = async (page = 1) => {
  try {
    const response = await getRequest(`master/damagetypes/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get DamageTypes Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createDamageType = async (damageTypeData: {
  name: string;
  code: string;
  active: number;
}) => {
  try {
    const response = await postRequest('master/damagetypes/', damageTypeData);
    return response;
  } catch (error) {
    console.error('Create DamageType Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateDamageType = async (damageTypeId: string | number, damageTypeData: {
  name: string;
}) => {
  try {
    const payload = {
      id: parseInt(damageTypeId.toString()),
      name: damageTypeData.name
    };
    const response = await postRequest('master/damagetypes/', payload);
    return response;
  } catch (error) {
    console.error('Update DamageType Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteDamageType = async (damageTypeId: string | number) => {
  try {
    const payload = {
      id: parseInt(damageTypeId.toString()),
      delete: true
    };
    const response = await postRequest('master/damagetypes/', payload);
    return response;
  } catch (error) {
    console.error('Delete DamageType Error:', error.response?.data || error.message);
    throw error;
  }
};
