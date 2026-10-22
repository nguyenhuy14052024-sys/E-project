import api from './api';

export const submitOnboarding = async (data) => {
    const response = await api.post('/onboarding', data);
    return response.data;
};

export const getOnboardingStatus = async () => {
    const response = await api.get('/onboarding/status');
    return response.data;
};