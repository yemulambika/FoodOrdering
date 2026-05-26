export const isSupabaseMissingTableError = (error: unknown): boolean => {
  if (!error) {
    return false;
  }

  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as any).message)
      : String(error);

  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: string }).code)
      : '';

  const normalized = message.toLowerCase();
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    normalized.includes('could not find the table') ||
    normalized.includes('schema cache') ||
    normalized.includes('pgrst205') ||
    (normalized.includes('relation') && normalized.includes('does not exist'))
  );
};
