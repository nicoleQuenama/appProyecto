import { DrawerPosition } from "react-native";

export type RegisterForm = {
    id: string;
    fullName: string
    username: string
    email:string
    password:string
    phone:string //opcional
    gender?: 'masculino'| 'femenino' | 'otro'
    relation_pacien: string
    fecha_nacimiento: Date
    address: string
    token_not: string | null
}

export type LoginForm={
    emailOrUsername: string //para que esntre con correo o usuario
    password:string
}