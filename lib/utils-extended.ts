// Extended utility functions for StrataHQ

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { Priority, RequestStatus, ViolationStatus, TaskStatus } from './types';

// Date formatting utilities
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    return 'Invalid date';
  }
}

export function formatTimeAgo(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

export function formatTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'h:mm a');
  } catch (error) {
    return 'Invalid time';
  }
}

// Currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

// File size formatting
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Priority badge utilities
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-destructive text-destructive-foreground';
    case 'high':
      return 'bg-warning text-warning-foreground';
    case 'medium':
      return 'bg-info text-info-foreground';
    case 'low':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

export function getPriorityLabel(priority: Priority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

// Status badge utilities
export function getRequestStatusColor(status: RequestStatus): string {
  switch (status) {
    case 'submitted':
      return 'bg-info text-info-foreground';
    case 'under_review':
      return 'bg-warning text-warning-foreground';
    case 'approved':
      return 'bg-success text-success-foreground';
    case 'in_progress':
      return 'bg-primary text-primary-foreground';
    case 'completed':
      return 'bg-success text-success-foreground';
    case 'rejected':
    case 'cancelled':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

export function getRequestStatusLabel(status: RequestStatus): string {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function getViolationStatusColor(status: ViolationStatus): string {
  switch (status) {
    case 'reported':
      return 'bg-info text-info-foreground';
    case 'investigating':
      return 'bg-warning text-warning-foreground';
    case 'confirmed':
      return 'bg-destructive text-destructive-foreground';
    case 'warning_issued':
      return 'bg-warning text-warning-foreground';
    case 'resolved':
      return 'bg-success text-success-foreground';
    case 'dismissed':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

export function getViolationStatusLabel(status: ViolationStatus): string {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function getTaskStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return 'bg-muted text-muted-foreground';
    case 'in_progress':
      return 'bg-primary text-primary-foreground';
    case 'review':
      return 'bg-warning text-warning-foreground';
    case 'completed':
      return 'bg-success text-success-foreground';
    case 'blocked':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

export function getTaskStatusLabel(status: TaskStatus): string {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Initials generator for avatars
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Generate color from string (for avatars)
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  return colors[Math.abs(hash) % colors.length];
}

// Role display helpers
export function getRoleLabel(role: string): string {
  return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Phone number formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
}
