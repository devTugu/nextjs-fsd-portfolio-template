export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

export interface ContactMessageOutput {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactMessageStatus;
  ipAddress: string | null;
  createdAt: string;
}

export interface UpdateContactMessageInput {
  status: ContactMessageStatus;
}

export interface ListContactMessagesParams {
  page?: number;
  limit?: number;
  status?: ContactMessageStatus;
}
