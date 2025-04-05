import { format } from 'date-fns'

export function testDate() {
  return format(new Date(), 'yyyy-MM-dd')
} 