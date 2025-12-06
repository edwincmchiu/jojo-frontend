const API_BASE = '/api/admin';

// ==========================================
// 1. 管理者登入
// ==========================================
export const adminLogin = async (username, password) => {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('[API] Admin login failed:', error);
    throw error;
  }
};

// ==========================================
// 2. 活動類型管理
// ==========================================

export const fetchEventTypes = async () => {
  try {
    const response = await fetch(`${API_BASE}/event-types`);
    if (!response.ok) throw new Error('Failed to fetch event types');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch event types failed:', error);
    return [];
  }
};

export const addEventType = async (typeName) => {
  try {
    const response = await fetch(`${API_BASE}/event-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ typeName })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add event type');
    }

    return data;
  } catch (error) {
    console.error('[API] Add event type failed:', error);
    throw error;
  }
};

export const deleteEventType = async (typeName) => {
  try {
    const response = await fetch(`${API_BASE}/event-types/${encodeURIComponent(typeName)}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete event type');
    }

    return data;
  } catch (error) {
    console.error('[API] Delete event type failed:', error);
    throw error;
  }
};

// ==========================================
// 3. 群組管理
// ==========================================

export const fetchGroups = async () => {
  try {
    const response = await fetch(`${API_BASE}/groups`);
    if (!response.ok) throw new Error('Failed to fetch groups');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch groups failed:', error);
    return [];
  }
};

export const addGroup = async (groupName, description) => {
  try {
    const response = await fetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupName, description })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add group');
    }

    return data;
  } catch (error) {
    console.error('[API] Add group failed:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const response = await fetch(`${API_BASE}/groups/${groupId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete group');
    }

    return data;
  } catch (error) {
    console.error('[API] Delete group failed:', error);
    throw error;
  }
};

// ==========================================
// 4. 使用者管理
// ==========================================

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch users failed:', error);
    return [];
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete user');
    }

    return data;
  } catch (error) {
    console.error('[API] Delete user failed:', error);
    throw error;
  }
};

// ==========================================
// 5. 活動管理
// ==========================================

export const fetchAllEvents = async () => {
  try {
    const response = await fetch(`${API_BASE}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch events failed:', error);
    return [];
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE}/events/${eventId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete event');
    }

    return data;
  } catch (error) {
    console.error('[API] Delete event failed:', error);
    throw error;
  }
};

// ==========================================
// 6. 數據分析
// ==========================================

export const fetchOverview = async () => {
  try {
    const response = await fetch(`${API_BASE}/analytics/overview`);
    if (!response.ok) throw new Error('Failed to fetch overview');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch overview failed:', error);
    return null;
  }
};

export const fetchEventsByType = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${API_BASE}/analytics/events-by-type?${params}`);
    if (!response.ok) throw new Error('Failed to fetch events by type');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch events by type failed:', error);
    return [];
  }
};

export const fetchGroupParticipation = async () => {
  try {
    const response = await fetch(`${API_BASE}/analytics/group-participation`);
    if (!response.ok) throw new Error('Failed to fetch group participation');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch group participation failed:', error);
    return [];
  }
};

export const fetchUserActivity = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE}/analytics/user-activity?days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch user activity');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch user activity failed:', error);
    return [];
  }
};

export const fetchCapacityStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/analytics/capacity-stats`);
    if (!response.ok) throw new Error('Failed to fetch capacity stats');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch capacity stats failed:', error);
    return [];
  }
};

export const fetchTopHosts = async () => {
  try {
    const response = await fetch(`${API_BASE}/analytics/top-hosts`);
    if (!response.ok) throw new Error('Failed to fetch top hosts');
    return await response.json();
  } catch (error) {
    console.error('[API] Fetch top hosts failed:', error);
    return [];
  }
};
