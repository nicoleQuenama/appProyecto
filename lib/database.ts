import * as SQLite from 'expo-sqlite';
export const db = SQLite.openDatabaseSync('equilibra.db');

export async function initDatabase() {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      -- Tabla de Usuarios
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY NOT NULL,
        fullname TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        fecha_nacimiento TEXT,
        gender TEXT,
        relation_pacien TEXT,
        address TEXT,
        token_not TEXT
      );

      -- Tabla de Pacientes (Infantes)
      CREATE TABLE IF NOT EXISTS paciente_inf (
        id TEXT PRIMARY KEY NOT NULL,
        usuario_id TEXT NOT NULL,
        codigo_vinculacion TEXT,
        nombre TEXT NOT NULL,
        edad INTEGER,
        genero TEXT,
        peso REAL,
        estatura REAL,
        nomtuto TEXT,
        problemas_salud TEXT
      );

      -- Tabla de Citas
      CREATE TABLE IF NOT EXISTS citas (
        id TEXT PRIMARY KEY NOT NULL,
        paciente_id TEXT NOT NULL,
        especialista TEXT,
        especialidad TEXT,
        lugar TEXT,
        fecha_hora TEXT,
        estado TEXT,
        created_at TEXT
      );

      -- Tabla de Reportes
      CREATE TABLE IF NOT EXISTS reportes (
        id TEXT PRIMARY KEY NOT NULL,
        paciente_id TEXT NOT NULL,
        fecha_Sesion TEXT,
        notas_doctor TEXT,
        indicador_progreso TEXT,
        lecturas TEXT,
        created_at TEXT
      );
    `);

  
  
    console.log("Base de datos SQLite inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}