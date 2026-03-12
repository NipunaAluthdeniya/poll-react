import axiosInstance from '../../environment/axiosInstance';

export const postPoll = async (pollDTO) => {
    try {
        const response = await axiosInstance.post('api/user/poll', pollDTO);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllPolls = async () => {
    try {
        const response = await axiosInstance.get('api/user/polls');
        return response;
    } catch (error) {
        throw error;
    }
};

export const getMyPolls = async () => {
    try {
        const response = await axiosInstance.get('api/user/my-polls');
        return response;
    } catch (error) {
        throw error;
    }
};

export const deletePollById = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/user/poll/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};