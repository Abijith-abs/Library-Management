/**
 * Format a date string or Date object to DD/MM/YYYY format
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format a date string to ISO format (YYYY-MM-DD)
 * @param {string} dateStr - The date string in DD/MM/YYYY format
 * @returns {string} The date in YYYY-MM-DD format
 */
export const formatToISODate = (dateStr) => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};
