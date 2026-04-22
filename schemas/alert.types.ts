export type Alert = {
  id: string
  alert_type: 'low_battery' | 'abnormal_pressure' | 'specialist_message' | 'inactivity'
  message: string
  is_read: boolean
  created_at: string
}