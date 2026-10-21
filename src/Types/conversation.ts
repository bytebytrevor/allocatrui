export type ConversationMember = {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  isOwner: boolean;
};
export type ConversationFile = {
  id: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
};
export type ConversationMessage = {
  id: string;
  sequence: number;
  senderId: string;
  senderName: string;
  avatarUrl?: string | null;
  body: string;
  createdAt: string;
  attachments: ConversationFile[];
  editedAt?: string | null;
  deletedAt?: string | null;
  version: number;
  actionExpiresAt: string;
  canEdit: boolean;
  canDelete: boolean;
  canModerate: boolean;
  forwardedFromName?: string | null;
  forwardedCreatedAt?: string | null;
  forwardNote?: string | null;
};
export type ConversationSummary = {
  id: string;
  subject: string;
  isProjectWide: boolean;
  updatedAt: string;
  preview: string;
  hasAttachments: boolean;
  unreadCount: number;
  lastSequence: number;
  isArchived: boolean;
  isPinned: boolean;
  taskId?: string | null;
  taskTitle?: string | null;
};
export type ConversationList = {
  items: ConversationSummary[];
  page: number;
  totalCount: number;
  unreadCount: number;
};
export type ConversationDetail = {
  id: string;
  subject: string;
  isProjectWide: boolean;
  isArchived: boolean;
  isPinned: boolean;
  taskId?: string | null;
  taskTitle?: string | null;
  participants: ConversationMember[];
  messages: ConversationMessage[];
  hasOlder: boolean;
  lastSequence: number;
};
export type MessageDraft = {
  body: string;
  files: File[];
  subject?: string;
  isProjectWide?: boolean;
  recipientIds?: string[];
  taskId?: string;
};
export type SendResult = {
  conversationId: string;
  messageId: string;
};
export type ForwardDraft = {
  clientRequestId: string;
  version: number;
  subject: string;
  isProjectWide: boolean;
  recipientIds: string[];
  note: string;
};
