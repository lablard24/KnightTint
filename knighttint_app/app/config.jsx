
export const WEBSOCKET_IP = 'ws://192.168.0.197:81/';
//export const SERVER_PROTOCOL = 'https'; 
//export const SERVER_DOMAIN = 'knighttint-0ea6e634bb48.herokuapp.com'
export const SERVER_PORT = process.env.PORT || '3001'; 
export const SERVER_DOMAIN = '192.168.0.194:3001'
export const SERVER_PROTOCOL = 'http'; 

// Endpoints
export const REGISTER_ENDPOINT = '/auth/register';
export const LOGIN_ENDPOINT = '/auth/login';
export const CHECKEMAIL_ENDPOINT = '/auth/checkEmail';
export const RESET_PASSWORD_ENDPOINT = '/auth/resetPassword';


