import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Image,
  Linking
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../../constants/colors'

export default function EjerciciosScreen() {
  const router = useRouter()

  const video = {
    title: "Ejercicios pie plano parte 1 en casa",
    url: "https://youtu.be/AEKkF0TYENc",
    thumbnail: "https://i.ytimg.com/vi/AEKkF0TYENc/maxresdefault.jpg",
    duration: "2:29"
  };

  return (
    <View style={styles.mainWrapper}>
      {/* CABECERA: Igual que en image_4fd59f.jpg */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={Colors.cardBg} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ejercicios en Casa</Text>
        <Text style={styles.slogan}>Guías recomendadas</Text>
      </View>

      {/* CONTENEDOR PRINCIPAL: Con borde superior redondeado */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.bottomSection}>
          <Text style={styles.sectionTitle}>Recomendado para ti</Text>

          <TouchableOpacity 
            style={styles.videoCard} 
            activeOpacity={0.9}
            onPress={() => Linking.openURL(video.url)}
          >
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
              <View style={styles.playOverlay}>
                <Ionicons name="play" size={40} color="white" />
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{video.duration}</Text>
              </View>
            </View>
            
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <View style={styles.row}>
                <Ionicons name="logo-youtube" size={16} color={Colors.primary} />
                <Text style={styles.channelText}>Ver en YouTube</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* 
         El menú inferior (Tabs) se mantiene automáticamente porque 
         Expo Router detecta esta vista como parte del stack principal.
      */}
    </View>
  )
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: Colors.primary },
  topSection: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 40, 
    paddingHorizontal: 24, 
    backgroundColor: Colors.primary 
  },
  backButton: { marginBottom: 12 }, 
  headerTitle: { fontSize: 28, fontWeight: '900', color: Colors.cardBg },
  slogan: { fontSize: 16, color: Colors.primaryLight },
  
  scrollContent: { flexGrow: 1 },
  bottomSection: { 
    flex: 1, 
    backgroundColor: Colors.cardBg, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    padding: 24 
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: Colors.primaryDark, 
    marginBottom: 16, 
    textTransform: 'uppercase' 
  },
  videoCard: { 
    borderRadius: 20, 
    backgroundColor: Colors.background, 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: Colors.border, 
    marginBottom: 20
  },
  thumbnailContainer: { position: 'relative', width: '100%', height: 200 },
  thumbnail: { width: '100%', height: '100%' },
  playOverlay: { 
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  durationBadge: { 
    position: 'absolute', bottom: 8, right: 8, backgroundColor: 'black', 
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 
  },
  durationText: { color: 'white', fontSize: 12, fontWeight: '700' },
  videoInfo: { padding: 16 },
  videoTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  channelText: { color: Colors.primary, fontWeight: '600', fontSize: 13 }
})