import { DrawerPosition } from "react-native";

export type RegisterForm = {
    id: string;
    fullName: string
    username: string
    email:string
    password:string
    phone:string //opcional
    gender?: 'masculino'| 'femenino' | 'otro'
    relation_pacien: String
    fecha_nacimiento: Date
    address: string
}

export type LoginForm={
    emailOrUsername: string //para que esntre con correo o usuario
    password:string
}