export type RegisterForm = {
    fullName: string
    username: string
    email:string
    password:string
    phone:string //opcional
    birthDate: string
    gender?: 'masculino'| 'femenino' | 'otro'
}

export type LoginForm={
    emailOrUsername: string //para que esntre con correo o usuario
    password:string
}