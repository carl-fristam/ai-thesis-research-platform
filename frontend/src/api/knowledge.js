import client from './client';

export const searchExa = async (query) => {
    const response = await client.get('/knowledge/exa-search', { params: { query } });
    return response.data;
};

export const getSavedResults = async () => {
    const response = await client.get('/knowledge/saved-results');
    return response.data;
};

export const saveResult = async (result) => {
    const response = await client.post('/knowledge/saved-results', result);
    return response.data;
};

export const updateResult = async (id, updates) => {
    const response = await client.put(`/knowledge/saved-results/${id}`, updates);
    return response.data;
};

export const deleteResult = async (id) => {
    const response = await client.delete(`/knowledge/saved-results/${id}`);
    return response.data;
};
