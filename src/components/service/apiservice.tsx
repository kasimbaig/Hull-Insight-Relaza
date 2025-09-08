import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL;

// Check localStorage for existing auth data and extract token
const storedAuthData = localStorage.getItem('authData');
const parsedAuthData = storedAuthData ? JSON.parse(storedAuthData) : null;
const token = parsedAuthData?.access;

// Create an Axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout to prevent hanging requests
});

// If token exists, set the Authorization header
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Check if the error is due to token expiration (401 Unauthorized)
      if (error.response.status === 401) {
        // Clear auth data from localStorage
        localStorage.removeItem('authData');
        // Remove auth header
        delete apiClient.defaults.headers.common['Authorization'];
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Function to update the token later (for example, after login)
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Common GET request (with token if set)
export const getRequest = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data || response;
  } catch (error) {
    console.error('GET Request Error:', error.response?.data || error.message);
    throw error;
  }
};

// Common POST request (with token if set)
// Common POST request (with token if set)
export const postRequest = async (endpoint, data, isMultipart = false) => {
  try {
    const config = {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      }
    };

    const response = await apiClient.post(endpoint, data, config);
    return response; // Return full response to handle blobs, headers, etc.
  } catch (error) {
    console.error('POST Request Error:', error.response?.data || error.message);
    throw error;
  }
};


// Common PUT request
export const putRequest = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('PUT Request Error:', error.response?.data || error.message);
    throw error;
  }
};

// Login API Call using axios directly to return the full response (including status code)
export const loginUser = async (loginData) => {
  try {
    // Transform the data to match API expected format
    const apiPayload = {
      loginname: loginData.username,
      password: loginData.password
    };
    
    const res = await axios.post(`${BASE_URL}api/auth/token/`, apiPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Use the access token from the response to set the auth header
    setAuthToken(res.data.access);
    // Save the full response (tokens and user details) to localStorage
    localStorage.setItem('authData', JSON.stringify(res.data));
    return res; // Return the full response including status code
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};

// Logout API Call
export const logoutUser = async (userId = 1) => {
  try {
    const payload = {
      user_id: userId
    };
    
    const response = await postRequest('api/auth/logout/', payload);
    return response;
  } catch (error) {
    console.error('Logout Error:', error.response?.data || error.message);
    throw error;
  }
};

// User Roles API functions
export const getUserRoles = async () => {
  try {
    const response = await getRequest('access/user-roles/');
    return response;
  } catch (error) {
    console.error('Get User Roles Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createUserRole = async (userRoleData) => {
  try {
    const response = await postRequest('access/user-roles/', userRoleData);
    return response;
  } catch (error) {
    console.error('Create User Role Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserRole = async (userRoleId, userRoleData) => {
  try {
    const response = await putRequest(`access/user-roles/${userRoleId}/`, userRoleData);
    return response;
  } catch (error) {
    console.error('Update User Role Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteUserRole = async (userRoleId) => {
  try {
    const response = await deleteRequest(`access/user-roles/${userRoleId}/`);
    return response;
  } catch (error) {
    console.error('Delete User Role Error:', error.response?.data || error.message);
    throw error;
  }
};

// Common GET request without token (No Auth)
export const getRequestNoAuth = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('GET (No Auth) Request Error:', error.response?.data || error.message);
    throw error;
  }
};

// Common POST request without token (No Auth)
export const postRequestNoAuth = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('POST (No Auth) Request Error:', error.response?.data || error.message);
    throw error;
  }
};

// utils/number-format.ts
export const formatINRCrore = (val) =>
  Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

// Common DELETE request (with token if set)
export const deleteRequest = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('DELETE Request Error:', error.response?.data || error.message);
    throw error;
  }
};

// Units API functions
export const getUnits = async (page: number = 1) => {
  try {
    const response = await getRequest(`master/units/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Units Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUnitsList = async () => {
  try {
    const response = await getRequest('master/units/');
    return response;
  } catch (error) {
    console.error('Get Units List Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createUnit = async (unitData) => {
  try {
    const response = await postRequest('master/units/', unitData);
    return response;
  } catch (error) {
    console.error('Create Unit Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUnit = async (unitId, unitData) => {
  try {
    const payload = {
      id: parseInt(unitId),
      name: unitData.name
    };
    const response = await postRequest('master/units/', payload);
    return response;
  } catch (error) {
    console.error('Update Unit Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteUnit = async (unitId) => {
  try {
    const payload = {
      id: parseInt(unitId),
      delete: true
    };
    const response = await postRequest('master/units/', payload);
    return response;
  } catch (error) {
    console.error('Delete Unit Error:', error.response?.data || error.message);
    throw error;
  }
};

// Commands API functions
export const getCommands = async (page: number = 1) => {
  try {
    const response = await getRequest(`master/commands/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Commands Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createCommand = async (commandData) => {
  try {
    const response = await postRequest('master/commands/', commandData);
    return response;
  } catch (error) {
    console.error('Create Command Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateCommand = async (commandId, commandData) => {
  try {
    const payload = {
      id: parseInt(commandId),
      name: commandData.name
    };
    const response = await postRequest('master/commands/', payload);
    return response;
  } catch (error) {
    console.error('Update Command Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteCommand = async (commandId) => {
  try {
    const payload = {
      id: parseInt(commandId),
      delete: true
    };
    const response = await postRequest('master/commands/', payload);
    return response;
  } catch (error) {
    console.error('Delete Command Error:', error.response?.data || error.message);
    throw error;
  }
};

// Class of Vessels API functions
export const getClassOfVessels = async (page: number = 1) => {
  try {
    const response = await getRequest(`master/classofvessels/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Class of Vessels Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createClassOfVessel = async (classOfVesselData) => {
  try {
    const response = await postRequest('master/classofvessels/', classOfVesselData);
    return response;
  } catch (error) {
    console.error('Create Class of Vessel Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateClassOfVessel = async (classOfVesselId, classOfVesselData) => {
  try {
    const payload = {
      id: parseInt(classOfVesselId),
      name: classOfVesselData.name
    };
    const response = await postRequest('master/classofvessels/', payload);
    return response;
  } catch (error) {
    console.error('Update Class of Vessel Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteClassOfVessel = async (classOfVesselId) => {
  try {
    const payload = {
      id: parseInt(classOfVesselId),
      delete: true
    };
    const response = await postRequest('master/classofvessels/', payload);
    return response;
  } catch (error) {
    console.error('Delete Class of Vessel Error:', error.response?.data || error.message);
    throw error;
  }
};


export const createDockyard = async (dockyardData) => {
  try {
    const response = await postRequest('master/dockyards/', dockyardData);
    return response;
  } catch (error) {
    console.error('Create Dockyard Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateDockyard = async (dockyardId, dockyardData) => {
  try {
    const payload = {
      id: parseInt(dockyardId),
      name: dockyardData.name
    };
    const response = await postRequest('master/dockyards/', payload);
    return response;
  } catch (error) {
    console.error('Update Dockyard Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteDockyard = async (dockyardId) => {
  try {
    const payload = {
      id: parseInt(dockyardId),
      delete: true
    };
    const response = await postRequest('master/dockyards/', payload);
    return response;
  } catch (error) {
    console.error('Delete Dockyard Error:', error.response?.data || error.message);
    throw error;
  }
};

// Users API functions
export const getUsers = async (page = 1) => {
  try {
    const response = await getRequest(`api/auth/users/?page=${page}`);
    // Return the full response for pagination handling
    return response;
  } catch (error) {
    console.error('Get Users Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await postRequest('api/auth/users/', userData);
    return response;
  } catch (error) {
    console.error('Create User Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await putRequest(`api/auth/users/${userId}/`, userData);
    return response;
  } catch (error) {
    console.error('Update User Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await deleteRequest(`api/auth/users/${userId}/`);
    return response;
  } catch (error) {
    console.error('Delete User Error:', error.response?.data || error.message);
    throw error;
  }
};

// Modules API functions
export const getModules = async (page: number = 1) => {
  try {
    const response = await getRequest(`master/modules/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Modules Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createModule = async (moduleData) => {
  try {
    const response = await postRequest('master/modules/', moduleData);
    return response;
  } catch (error) {
    console.error('Create Module Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateModule = async (moduleId, moduleData) => {
  try {
    const payload = {
      id: parseInt(moduleId),
      ...moduleData
    };
    const response = await postRequest('master/modules/', payload);
    return response;
  } catch (error) {
    console.error('Update Module Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteModule = async (moduleId) => {
  try {
    const payload = {
      id: parseInt(moduleId),
      delete: true
    };
    const response = await postRequest('master/modules/', payload);
    return response;
  } catch (error) {
    console.error('Delete Module Error:', error.response?.data || error.message);
    throw error;
  }
};

// SubModules API functions
export const getSubModules = async (page: number = 1) => {
  try {
    const response = await getRequest(`master/submodules/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get SubModules Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createSubModule = async (subModuleData) => {
  try {
    const response = await postRequest('master/submodules/', subModuleData);
    return response;
  } catch (error) {
    console.error('Create SubModule Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateSubModule = async (subModuleId, subModuleData) => {
  try {
    const payload = {
      id: parseInt(subModuleId),
      ...subModuleData
    };
    const response = await postRequest('master/submodules/', payload);
    return response;
  } catch (error) {
    console.error('Update SubModule Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteSubModule = async (subModuleId) => {
  try {
    const payload = {
      id: parseInt(subModuleId),
      delete: true
    };
    const response = await postRequest('master/submodules/', payload);
    return response;
  } catch (error) {
    console.error('Delete SubModule Error:', error.response?.data || error.message);
    throw error;
  }
};


export const getProcesses = async () => {
  try {
    const response = await getRequest('access/processes/?is_dropdown=true');
    return response;
  } catch (error) {
    console.error('Get Processes Error:', error.response?.data || error.message);
    throw error;
  }
};

// VesselTypes API functions
export const getVesselTypes = async (page = 1) => {
  try {
    const response = await getRequest(`master/vesseltypes/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get VesselTypes Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createVesselType = async (vesselTypeData) => {
  try {
    const response = await postRequest('master/vesseltypes/', vesselTypeData);
    return response;
  } catch (error) {
    console.error('Create VesselType Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateVesselType = async (vesselTypeId, vesselTypeData) => {
  try {
    const payload = {
      id: parseInt(vesselTypeId),
      name: vesselTypeData.name,
      code: vesselTypeData.code
    };
    const response = await postRequest('master/vesseltypes/', payload);
    return response;
  } catch (error) {
    console.error('Update VesselType Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteVesselType = async (vesselTypeId) => {
  try {
    const payload = {
      id: parseInt(vesselTypeId),
      delete: true
    };
    const response = await postRequest('master/vesseltypes/', payload);
    return response;
  } catch (error) {
    console.error('Delete VesselType Error:', error.response?.data || error.message);
    throw error;
  }
};

// Vessels API functions
export const getVessels = async (page = 1) => {
  try {
    const response = await getRequest(`master/vessels/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Vessels Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createVessel = async (vesselData) => {
  try {
    const response = await postRequest('master/vessels/', vesselData);
    return response;
  } catch (error) {
    console.error('Create Vessel Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateVessel = async (vesselId, vesselData) => {
  try {
    const payload = {
      id: vesselId,
      ...vesselData
    };
    const response = await postRequest('master/vessels/', payload);
    return response;
  } catch (error) {
    console.error('Update Vessel Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteVessel = async (vesselId) => {
  try {
    const payload = {
      id: vesselId,
      delete: true
    };
    const response = await postRequest('master/vessels/', payload);
    return response;
  } catch (error) {
    console.error('Delete Vessel Error:', error.response?.data || error.message);
    throw error;
  }
};

// Dockyards API functions
export const getDockyards = async (page: number = 1) => {
  try {
    const response = await getRequest(`master/dockyards/?page=${page}`);
    return response;
  } catch (error) {
    console.error('Get Dockyards Error:', error.response?.data || error.message);
    throw error;
  }
};

// Vessel Types API functions (simple array response)
export const getVesselTypesList = async () => {
  try {
    const response = await getRequest('master/vesseltypes/');
    return response;
  } catch (error) {
    console.error('Get Vessel Types List Error:', error.response?.data || error.message);
    throw error;
  }
};

// Class of Vessels API functions (simple array response)
export const getClassOfVesselsList = async () => {
  try {
    const response = await getRequest('master/classofvessels/');
    return response;
  } catch (error) {
    console.error('Get Class of Vessels List Error:', error.response?.data || error.message);
    throw error;
  }
};

// Vessels API functions (simple array response)
export const getVesselsList = async () => {
  try {
    const response = await getRequest('master/vessels/');
    return response;
  } catch (error) {
    console.error('Get Vessels List Error:', error.response?.data || error.message);
    throw error;
  }
};

// Role-Process Mappings API function
export const getRoleProcessMappings = async (processId: number) => {
  try {
    const response = await getRequest(`access/role-process-mappings/?process_id=${processId}`);
    return response;
  } catch (error) {
    console.error('Get Role Process Mappings Error:', error.response?.data || error.message);
    throw error;
  }
};

export default apiClient;
