export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  userInfo: UserInfo;
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
  is_seller: boolean;
  store_name: string | null;
}
