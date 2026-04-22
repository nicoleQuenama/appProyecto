import { supabase } from '../lib/supabase'
import { Alert } from '../schemas/alert.types'

// traemos el paciente vinculado con el tutor
export async function getRecentAlerts(): Promise<Alert[]> {
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .single()

  if (patientError || !patient) return [] 

  //alertas vinculadas
  const { data, error } = await supabase
    .from('alerts')
    .select('id, alert_type, message, is_read, created_at')
    .eq('patient_id', patient.id)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) throw error
  return data ?? []
}

export async function markAlertAsRead(alertId: string) {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('id', alertId)

  if (error) throw error
}