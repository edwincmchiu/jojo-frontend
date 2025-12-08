import axios from 'axios';

const API_URL = '/api';

const getAvatar = (sex) => {
  if (!sex) return '😎';
  return sex === 'Female' ? '👩‍🎓' : '👨‍🎓';
};

const formatDateTime = (isoString) => {
  if (!isoString) return '未定';
  try {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}`;
  } catch (e) {
    return isoString;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    console.log(`[API] Fetching profile for User ${userId}...`);
    const response = await axios.get(`${API_URL}/users/${userId}/profile`);
    const data = response.data;

    // normalize interests to strings
    const interests = (data.preferences || data.interests || []).map(i =>
      typeof i === 'string' ? i : (i?.type_name ?? i?.Type_name ?? i?.name ?? String(i))
    );

    return {
      id: data.user_id ?? data.id,
      name: data.name ?? data.full_name,
      sex: data.sex,
      avatar: getAvatar(data.sex),
      email: data.email,
      interests,
      hostedEvents: (data.hostedEvents || []).map(e => ({
        id: e.event_id ?? e.id,
        title: e.title,
        startTime: formatDateTime(e.start_time),
        endTime: formatDateTime(e.end_time),
        typeName: e.type_name || '一般',
        groupName: e.group_name || '公開活動',
        capacity: e.capacity,
        currentPeople: e.current_people ?? 0,
      })),
      joinedEvents: (data.joinedEvents || []).map(e => ({
        id: e.event_id ?? e.id,
        title: e.title,
        startTime: formatDateTime(e.start_time),
        endTime: formatDateTime(e.end_time),
        typeName: e.type_name || '一般',
        groupName: e.group_name || '公開活動',
      })),
      groups: data.groups || [],
    };
  } catch (error) {
    console.error('fetchUserProfile error', error);
    throw error;
  }
};

export const addPreference = (userId, typeName) =>
  axios.post(`${API_URL}/users/${userId}/preferences`, { type_name: typeName });

export const removePreference = (userId, typeName) =>
  axios.delete(`${API_URL}/users/${userId}/preferences/${encodeURIComponent(typeName)}`);

export const addGroup = (userId, groupId) =>
  axios.post(`${API_URL}/users/${userId}/groups`, { groupId });

export const removeGroup = (userId, groupId) =>
  axios.delete(`${API_URL}/users/${userId}/groups/${groupId}`);

export const fetchAvailableGroups = async () => {
  try {
    const response = await axios.get(`${API_URL}/groups`);
    return response.data;
  } catch (error) {
    console.error('fetchAvailableGroups error', error);
    throw error;
  }
};

export const fetchAvailableTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/preferences/list`);
    return response.data;
  } catch (error) {
    console.error('fetchAvailableTypes error', error);
    throw error;
  }
};