/**
 * Type definitions for Kerio Connect API
 * Supports comprehensive Kerio Connect functionality:
 * - Mail (FMail)
 * - Calendar (FCalendar)
 * - Contacts (FContact)
 * - Tasks (FTask)
 * - Notes (FNote)
 *
 * Based on JSON-RPC 2.0 protocol
 */

// JSON-RPC 2.0 base types
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: any;
  id: number;
}

export interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0';
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: number;
}

// Session types
export interface SessionLoginParams {
  userName: string;
  password: string;
  application: {
    name: string;
    vendor: string;
    version: string;
  };
}

export interface SessionLoginResult {
  token: string;
  userId: string;
  [key: string]: any;
}

/**
 * Folder types supported by Kerio Connect
 * - FNote: Notes folders
 * - FMail: Mail folders
 * - FTask: Tasks folders
 * - FContact: Contacts folders
 * - FCalendar: Calendar folders
 *
 * Currently, Notes module is fully implemented.
 * Mail, Calendar, Contacts, and Tasks modules will be implemented
 * based on JSON-RPC API specifications.
 */
export type FolderType = 'FNote' | 'FMail' | 'FTask' | 'FContact' | 'FCalendar';

export interface KerioFolder {
  id: string; // Format: keriostorage://folder/{domain}/{username}/{uuid}
  name: string;
  type: FolderType;
  parentId?: string;
  isSystemFolder?: boolean;
  [key: string]: any;
}

export interface FoldersGetParams {
  folderIds?: string[];
}

export interface FoldersGetResult {
  list: KerioFolder[];
  totalItems?: number;
}

export interface FoldersCreateParams {
  folders: Array<{
    name: string;
    type: FolderType;
    parentId?: string;
  }>;
}

// Note types
export interface KerioNote {
  id: string; // Format: keriostorage://note/{domain}/{username}/{folder_uuid}/{note_uuid}
  folderId: string;
  subject: string;
  text: string;
  color?: string;
  createDate?: string; // ISO 8601 format
  modifyDate?: string; // ISO 8601 format
  [key: string]: any;
}

// Query structure for sorting and pagination
export interface QueryOrder {
  columnName: string;
  direction: 'Asc' | 'Desc';
  caseSensitive?: boolean;
}

export interface Query {
  start?: number;
  limit?: number; // -1 for all
  orderBy?: QueryOrder[];
  conditions?: QueryCondition[];
  combining?: 'And' | 'Or';
}

export interface NotesGetParams {
  query: Query;
  folderIds: string[];
}

export interface NotesGetResult {
  list: KerioNote[];
  totalItems: number;
}

export interface NotesCreateParams {
  notes: Array<{
    folderId: string;
    subject: string;
    text: string;
    color?: string;
  }>;
}

export interface NotesSetParams {
  notes: Array<{
    id: string;
    folderId?: string;
    subject?: string;
    text?: string;
    color?: string;
  }>;
}

// Configuration types
export interface KerioConfig {
  server: string;
  username: string;
  password: string;
  verifySsl?: boolean;
}

// Search types
export interface SearchResult {
  notes: KerioNote[];
  totalFound: number;
  searchedFolders: string[];
}

// Folder information
export interface FolderInfo {
  id: string;
  name: string;
  noteCount: number;
  type: FolderType;
}

// MCP Tool parameter types
export interface ListNotesParams {
  folder?: string;
  limit?: number;
  orderBy?: string;
  direction?: 'Asc' | 'Desc';
}

export interface SearchNotesParams {
  query: string;
  folders?: string[];
  searchIn?: 'text' | 'subject' | 'both';
  limit?: number;
}

export interface GetNoteCountParams {
  folder?: string;
}

export interface CreateNoteParams {
  subject: string;
  text: string;
  folder?: string;
  color?: string;
}

export interface MoveNoteParams {
  noteId: string;
  targetFolder: string;
}

export interface CreateFolderParams {
  name: string;
  parentId?: string;
}

// ============================================================================
// FUTURE MODULE TYPES (To be implemented with JSON-RPC specs)
// ============================================================================

// ============================================================================
// TASKS MODULE TYPES
// ============================================================================

export interface KerioTask {
  id: string; // Format: keriostorage://task/{domain}/{username}/{folder_uuid}/{task_id}
  folderId: string;
  summary: string;
  description?: string;
  due?: string; // ISO date format: YYYYMMDDTHHmmss+ZZZZ
  done: number; // 0-100 (percentage complete)
  reminder?: TaskReminder;
  sortOrder?: number;
  watermark?: number;
  [key: string]: any;
}

export interface TaskReminder {
  isSet: boolean;
  type: 'ReminderAbsolute' | 'ReminderRelative';
  date?: string; // For ReminderAbsolute: YYYYMMDDTHHmmss+ZZZZ
  minutesBeforeStart?: number; // For ReminderRelative
}

export interface TasksGetParams {
  folderIds: string[];
  query: Query;
}

export interface TasksGetResult {
  list: KerioTask[];
  totalItems: number;
}

export interface TasksCreateParams {
  tasks: Array<{
    folderId: string;
    summary: string;
    description?: string;
    due?: string;
    done?: number;
    reminder?: TaskReminder;
  }>;
}

export interface TasksSetParams {
  tasks: Array<{
    id: string;
    summary?: string;
    description?: string;
    due?: string;
    done?: number;
    reminder?: TaskReminder;
  }>;
}

// ============================================================================
// MAIL MODULE TYPES
// ============================================================================

export interface EmailAddress {
  address: string;
  name: string;
  contactId?: string;
}

export interface MailDisplayablePart {
  contentType: 'ctTextPlain' | 'ctTextHtml';
  content: string;
}

export interface KerioMail {
  id: string; // Format: keriostorage://mail/{domain}/{username}/{folder_uuid}/{mail_id}
  folderId: string;
  from: EmailAddress;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  replyTo?: EmailAddress[];
  subject: string;
  displayableParts?: MailDisplayablePart[];
  receiveDate?: string; // ISO 8601 format
  sendDate?: string; // ISO 8601 format
  modifiedDate?: string; // ISO 8601 format
  isSeen?: boolean;
  isJunk?: boolean;
  isAnswered?: boolean;
  isForwarded?: boolean;
  isFlagged?: boolean;
  isReadOnly?: boolean;
  isDraft?: boolean;
  hasAttachment?: boolean;
  priority?: 'Low' | 'Normal' | 'High';
  size?: number; // in bytes
  attachments?: any[]; // Attachment structure TBD
  [key: string]: any;
}

export interface MailsGetParams {
  query: {
    fields: string[];
    start?: number;
    limit?: number;
    orderBy?: QueryOrder[];
  };
  folderIds: string[];
}

export interface MailsGetResult {
  list: KerioMail[];
  totalItems: number;
}

export interface MailsCreateParams {
  mails: Array<{
    send: boolean; // true = send immediately, false = save as draft
    subject: string;
    from: EmailAddress;
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    replyTo?: EmailAddress[];
    displayableParts: MailDisplayablePart[];
    priority?: 'Low' | 'Normal' | 'High';
    attachments?: any[];
    encrypt?: boolean;
    sign?: boolean;
    requestDSN?: boolean; // Delivery Status Notification
  }>;
}

export interface MailsMoveParams {
  ids: string[]; // Mail IDs to move
  folder: string; // Target folder ID
}

export interface MailsSetParams {
  mails: Array<{
    id: string;
    isSeen?: boolean;
    isFlagged?: boolean;
    isJunk?: boolean;
    [key: string]: any;
  }>;
}

// ============================================================================
// CONTACTS MODULE TYPES
// ============================================================================

export type PhoneNumberType = 'TypeWork' | 'TypeHome' | 'TypeMobile' | 'TypeFax' | 'TypePager' | 'TypeOther';
export type EmailAddressType = 'EmailWork' | 'EmailHome' | 'EmailOther';
export type PostalAddressType = 'AddressWork' | 'AddressHome' | 'AddressOther';
export type UrlType = 'UrlWork' | 'UrlHome' | 'UrlOther';

export interface PhoneNumber {
  type: PhoneNumberType;
  number: string;
  extension?: {
    label?: string;
    groupId?: string;
  };
}

export interface ContactEmailAddress {
  type: EmailAddressType;
  address: string;
  extension?: {
    label?: string;
    groupId?: string;
  };
}

export interface PostalAddress {
  type: PostalAddressType;
  pobox?: string;
  street?: string;
  extendedAddress?: string;
  locality?: string; // city
  state?: string; // region
  zip?: string;
  country?: string;
  extension?: {
    label?: string;
    groupId?: string;
  };
}

export interface ContactUrl {
  type: UrlType;
  url: string;
  extension?: {
    label?: string;
    groupId?: string;
  };
}

export interface KerioContact {
  id: string; // Format: keriostorage://contact/{domain}/{username}/{folder_uuid}/{contact_id}
  folderId: string;
  watermark?: number;
  commonName: string; // Full name (typically "firstName middleName surName")
  firstName?: string;
  middleName?: string;
  surName?: string; // Last name
  phoneNumbers?: PhoneNumber[];
  emailAddresses?: ContactEmailAddress[];
  postalAddresses?: PostalAddress[];
  urls?: ContactUrl[];
  companyName?: string;
  comment?: string; // Notes
  photo?: any; // Photo structure TBD
  [key: string]: any;
}

export interface ContactsGetParams {
  query: {
    start?: number;
    limit?: number;
    orderBy?: QueryOrder[];
  };
  folderIds: string[];
}

export interface ContactsGetResult {
  list: KerioContact[];
  totalItems: number;
}

export interface ContactsCreateParams {
  contacts: Array<{
    folderId: string;
    watermark?: number;
    commonName: string;
    firstName?: string;
    middleName?: string;
    surName?: string;
    phoneNumbers?: PhoneNumber[];
    emailAddresses?: ContactEmailAddress[];
    postalAddresses?: PostalAddress[];
    urls?: ContactUrl[];
    companyName?: string;
    comment?: string;
    photo?: any;
  }>;
}

export interface ContactsSetParams {
  contacts: Array<{
    id: string;
    watermark?: number;
    commonName?: string;
    firstName?: string;
    middleName?: string;
    surName?: string;
    phoneNumbers?: PhoneNumber[];
    emailAddresses?: ContactEmailAddress[];
    postalAddresses?: PostalAddress[];
    urls?: ContactUrl[];
    companyName?: string;
    comment?: string;
    photo?: any;
  }>;
}

// ============================================================================
// CALENDAR MODULE TYPES
// ============================================================================

export type FreeBusyStatus = 'Free' | 'Busy' | 'Tentative' | 'OutOfOffice';
export type AttendeeRole = 'RoleOrganizer' | 'RoleRequired' | 'RoleOptional' | 'RoleNonParticipant';
export type EventPriority = 'Low' | 'Normal' | 'High';
export type EventLabel = 'None' | 'Important' | 'Business' | 'Personal' | 'Vacation' | 'MustAttend' | 'TravelRequired' | 'NeedsPreparation' | 'Birthday' | 'Anniversary' | 'PhoneCall';
export type EventAccess = 'EAccessCreator' | 'EAccessRead' | 'EAccessWrite';

export interface EventAttendee {
  displayName: string;
  emailAddress: string;
  role: AttendeeRole;
  isNotified?: boolean;
  status?: string; // AcceptanceStatusType
}

export interface EventReminder {
  isSet: boolean;
  type: 'ReminderAbsolute' | 'ReminderRelative';
  date?: string; // For ReminderAbsolute: YYYYMMDDTHHmmss+ZZZZ
  minutesBeforeStart?: number; // For ReminderRelative
}

export interface EventRule {
  isSet: boolean;
  // Recurrence rule structure - complex, leaving as TBD
  [key: string]: any;
}

export interface QueryCondition {
  fieldName: string;
  comparator: 'Eq' | 'NotEq' | 'LessThan' | 'GreaterThan' | 'LessEq' | 'GreaterEq' | 'Like';
  value: string;
}

export interface KerioOccurrence {
  id: string; // Format: keriostorage://occurrence/{domain}/{username}/{folder_uuid}/{event_id}/
  eventId: string; // Format: keriostorage://event/{domain}/{username}/{folder_uuid}/{event_id}
  folderId: string;
  watermark?: number;
  access?: EventAccess;
  summary: string; // Event title
  location?: string;
  description?: string;
  label?: EventLabel;
  categories?: string[];
  start: string; // YYYYMMDDTHHmmss+ZZZZ format
  end: string; // YYYYMMDDTHHmmss+ZZZZ format
  travelMinutes?: number;
  freeBusy?: FreeBusyStatus;
  isPrivate?: boolean;
  isAllDay?: boolean;
  priority?: EventPriority;
  rule?: EventRule; // For recurring events
  attendees?: EventAttendee[];
  reminder?: EventReminder;
  isException?: boolean;
  hasReminder?: boolean;
  isRecurrent?: boolean;
  isCancelled?: boolean;
  seqNumber?: number;
  modification?: 'modifyThis' | 'modifyAll' | 'modifyFuture';
  [key: string]: any;
}

export interface OccurrencesGetParams {
  query: {
    fields: string[];
    start?: number;
    limit?: number;
    combining?: 'And' | 'Or';
    conditions?: QueryCondition[];
  };
  folderIds: string[];
}

export interface OccurrencesGetResult {
  list: KerioOccurrence[];
  totalItems: number;
}

export interface EventsCreateParams {
  events: Array<{
    folderId: string;
    summary: string;
    location?: string;
    description?: string;
    label?: EventLabel;
    access?: EventAccess;
    attendees?: EventAttendee[];
    freeBusy?: FreeBusyStatus;
    isPrivate?: boolean;
    isAllDay?: boolean;
    priority?: EventPriority;
    start: string; // YYYYMMDDTHHmmss+ZZZZ
    end: string; // YYYYMMDDTHHmmss+ZZZZ
    isCancelled?: boolean;
    travelMinutes?: number;
    watermark?: number;
    reminder?: EventReminder;
    rule?: EventRule;
  }>;
}

export interface OccurrencesSetParams {
  occurrences: Array<{
    id: string;
    eventId: string;
    folderId: string;
    summary?: string;
    location?: string;
    description?: string;
    label?: EventLabel;
    attendees?: EventAttendee[];
    freeBusy?: FreeBusyStatus;
    isPrivate?: boolean;
    isAllDay?: boolean;
    priority?: EventPriority;
    start?: string;
    end?: string;
    modification?: 'modifyThis' | 'modifyAll' | 'modifyFuture';
    reminder?: EventReminder;
  }>;
}
