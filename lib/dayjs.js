import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export function prepareDayjs (timezone) {
  if (timezone) {
    dayjs.tz.setDefault(timezone)
  }
}

export default dayjs
