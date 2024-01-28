// rutas que no necesitan autenticacion
export const protectedRoutes = ["/profile", "/checkout", "/admin"];

//ruta que necesitan autenticacion y rol de "ADMIN"
export const adminRoutes = ["/admin"];

//rutas para realizar la autenticacion
export const authRoutes = ["/auth/login", "/auth/new-account"];

//ruta a la API para procesos de autenticacion
export const apiAuthPrefix = "/api/auth";

//ruta por defecto a la que se redirecciona luego de hacer un login
export const DEFAULT_LOGIN_REDIRECT = "/";
