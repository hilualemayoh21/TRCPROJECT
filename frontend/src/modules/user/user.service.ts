import { axiosInstance } from '@/shared/services/axios';

export const userService = {
  getMe: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },

  updateMe: async (data: any) => {
    const response = await axiosInstance.patch('/users/me', data);
    return response.data;
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.patch('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
