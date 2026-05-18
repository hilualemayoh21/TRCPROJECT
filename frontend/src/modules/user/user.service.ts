import { get, patch } from '@/services/http';

export const userService = {
  getMe: async () => {
    return get<any>('/users/me');
  },

  updateMe: async (data: any) => {
    return patch<any>('/users/me', data);
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return patch<any>('/users/me/avatar', formData);
  },
};
