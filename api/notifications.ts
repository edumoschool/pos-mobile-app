import api from './client';
import type { RegisterTokenPayload, SendNotificationPayload, MessageResponse } from '@/types';

export const notificationsApi = {
  /** POST /notifications/register-token — register Expo push token */
  registerToken: async (token: string): Promise<MessageResponse> => {
    const res = await api.post<MessageResponse>('/notifications/register-token', { token } satisfies RegisterTokenPayload);
    return res.data;
  },

  /** DELETE /notifications/remove-token — remove push token */
  removeToken: async (): Promise<MessageResponse> => {
    const res = await api.delete<MessageResponse>('/notifications/remove-token');
    return res.data;
  },

  /** POST /notifications/send — send push to specific tokens */
  send: async (data: SendNotificationPayload): Promise<any> => {
    const res = await api.post('/notifications/send', data);
    return res.data;
  },

  /** POST /notifications/send/user/:userId — send push to a user */
  sendToUser: async (userId: string, data: SendNotificationPayload): Promise<any> => {
    const res = await api.post(`/notifications/send/user/${userId}`, data);
    return res.data;
  },

  /** POST /notifications/send/tenant — send push to all users in tenant */
  sendToTenant: async (data: SendNotificationPayload): Promise<any> => {
    const res = await api.post('/notifications/send/tenant', data);
    return res.data;
  },

  /** POST /notifications/receipts — check push notification delivery status */
  getReceipts: async (ticketIds: string[]): Promise<any> => {
    const res = await api.post('/notifications/receipts', { ticketIds });
    return res.data;
  },
};
