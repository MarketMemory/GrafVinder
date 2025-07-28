/**
 * Formatteert een datum van YYYY-MM-DD naar DD-MM-YYYY
 * @param dateString - Datum in YYYY-MM-DD formaat
 * @returns Datum in DD-MM-YYYY formaat
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ""

  const [year, month, day] = dateString.split("-")
  return `${day}-${month}-${year}`
}

/**
 * Formatteert een datum range voor weergave
 * @param birthDate - Geboortedatum in YYYY-MM-DD formaat
 * @param deathDate - Overlijdensdatum in YYYY-MM-DD formaat
 * @returns Geformatteerde datum range
 */
export function formatDateRange(birthDate: string, deathDate: string): string {
  return `${formatDate(birthDate)} – ${formatDate(deathDate)}`
}
