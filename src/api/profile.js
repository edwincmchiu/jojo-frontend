import axios from 'axios';

const API_URL = '/api';

const getAvatar = (sex) => {
  if (!sex) return '😎';
  return sex === 'Female' ? '👩‍🎓' : '👨‍🎓';
};

const formatDate = (isoString) => {
  if (!isoString) return '未定';
  try {
    const d = new Date(isoString);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
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
      interests,
      hostedEvents: (data.hostedEvents || []).map(e => ({
        id: e.Event_id ?? e.id,
        title: e.Title ?? e.title,
        startTime: formatDate(e.Start_time ?? e.startTime),
        capacity: e.Capacity ?? e.capacity,
        currentPeople: e.Current_people ?? e.currentPeople ?? 0,
      })),
      joinedEvents: (data.joinedEvents || []).map(e => ({
        id: e.Event_id ?? e.id,
        title: e.Title ?? e.title,
        startTime: formatDate(e.Start_time ?? e.startTime),
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