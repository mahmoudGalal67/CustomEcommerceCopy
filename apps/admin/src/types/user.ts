export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  userInfo: any;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
