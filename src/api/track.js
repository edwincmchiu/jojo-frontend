const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010/api';

export async function trackClick(payload) {
    const { userId } = payload;
    const response = await fetch(`${API_URL}/track/click`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to track click');
    }

    return response.json();
}
