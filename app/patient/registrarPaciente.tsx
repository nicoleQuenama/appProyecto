import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { Colors } from '../../constants/colors'
import { Infante } from '../../schemas/pacient_inf.types'

export default function RegistrarPacienteScreen() {
  const { user } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState<Partial<Infante>>({
    nombre: '', edad: 0, genero: '', peso: 0, estatura: 0,
    nomtuto: '', problemas_salud: '', codigo_vinculacion: null
  })

  const update = (field: keyof Infante, value: any) => 
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleGuardar() {
    console.log("Guardando paciente:", form)
    router.replace('/tabs/home')
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Datos del Paciente</Text>
        <Text style={styles.subtitle}>Registra la información del infante.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre del Niño/a *</Text>
          <TextInput style={styles.input} onChangeText={(v) => update('nombre', v)} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Edad *</Text>
              <TextInput style={styles.input} keyboardType="numeric" onChangeText={(v) => update('edad', parseInt(v) || 0)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Género *</Text>
              <TextInput style={styles.input} onChangeText={(v) => update('genero', v)} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Peso (kg) *</Text>
              <TextInput style={styles.input} keyboardType="decimal-pad" onChangeText={(v) => update('peso', parseFloat(v) || 0)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Estatura (cm) *</Text>
              <TextInput style={styles.input} keyboardType="numeric" onChangeText={(v) => update('estatura', parseInt(v) || 0)} />
            </View>
          </View>

          <Text style={styles.label}>Nombre del Tutor responsable *</Text>
          <TextInput style={styles.input} onChangeText={(v) => update('nomtuto', v)} />

          <Text style={styles.label}>Problemas de salud</Text>
          <TextInput style={[styles.input, { height: 80 }]} multiline onChangeText={(v) => update('problemas_salud', v)} />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleGuardar}>
          <Text style={styles.btnText}>Finalizar Registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  label: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark, marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: Colors.inputBg, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { backgroundColor: Colors.primary, borderRadius: 15, padding: 18, alignItems: 'center', marginTop: 25 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
})