// Design Tokens
export const colors = {
  // Required tokens from spec
  primary: '#3B82F6',    // blue - active buttons
  disabled: '#9CA3AF',   // gray - disabled buttons

  // Extended tokens for complete UI
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
  },
  error: '#EF4444',
  success: '#10B981',
  border: '#E5E7EB',
  hover: '#2563EB',
} as const;

export type ColorToken = keyof typeof colors;
