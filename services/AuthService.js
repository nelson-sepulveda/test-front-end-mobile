
import * as Google from 'expo-google-app-auth';
import { AsyncStorage, Platform } from 'react-native';
import axios from 'axios';
import * as Facebook from 'expo-facebook';
import ApiService from './ApiService';
import config from '../config';
import { askForNotificationsPermission } from '../services/PermissionsService';
// import notificationService from './NotificationService';
import { OS_TYPES } from '../constants';

const { ANDROID_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } = config;

const { CLIENT_ID } = config;

const ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGN_UP: '/auth/register',
  LOGOUT: '/auth/logout',
  FACEBOOK: '/auth/social/facebook',
  GOOGLE: '/auth/social/google',
  FORGOT_PASSWORD: '/user/forgot-password',
  RESET_PASSWORD: '/user/reset-password'
};

class AuthService extends ApiService {
  constructor() {
    super();
    this.init();
  }

  init = async () => {
    // await AsyncStorage.clear();
    const token = await this.getToken();
    const user = await this.getUser();

    console.log(token );

    if (token && user) {
      await this.setAuthorizationHeader();
      this.api.setUnauthorizedCallback(this.destroySession.bind(this));
    }
  };

  setAuthorizationHeader = async () => {
    const token = await this.getToken();
    if (token) {
      this.api.attachHeaders({
        Authorization: `Bearer ${token}`
      });
    }

    this.api.attachHeaders({
      clientId: CLIENT_ID
    });
  };

  createSession = async user => {
    console.log(user);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await this.setAuthorizationHeader();
    const expoPushToken = await askForNotificationsPermission();
    if (expoPushToken) {
      await AsyncStorage.setItem('expoPushToken', expoPushToken);
    }
  };

  destroySession = async () => {
    await AsyncStorage.clear();
    this.api.removeHeaders(['Authorization']);
  };

  login = async loginData => {
    // const { data } = await this.apiClient.post(ENDPOINTS.LOGIN, loginData);
    try {
      const url = `https://dev.tuten.cl:443/TutenREST/rest/user/${loginData.email}`;
      let headers = {
        'password':loginData.password,
        'app':'APP_BCK',
        'Accept':'application/json'
      };
      const { data } = await axios({url:url, method:'PUT',headers:headers});
      this.createSession(data);
      return data;
    } catch (error) {
      return error;
    }
  };

  googleLogin = async loginPromise => {
    const result = await loginPromise;
    if (result.type !== 'success') {
      throw new Error(result.type);
    }
    const { data } = await this.apiClient.post(ENDPOINTS.GOOGLE, {
      accessToken: result.accessToken
    });
    await this.createSession(data);

    return data;
  };

  loginWithGoogle = async () => {
    return await this.googleLogin(
      Google.logInAsync({
        clientId: Platform.OS == OS_TYPES.IOS ? IOS_GOOGLE_CLIENT_ID : ANDROID_GOOGLE_CLIENT_ID,
        scopes: ['profile', 'email']
      })
    );
  };

  facebookLogin = async loginPromise => {
    const result = await loginPromise;
    if (result.type !== 'success') {
      throw new Error(result.type);
    }
    const { data } = await this.apiClient.post(ENDPOINTS.FACEBOOK, { accessToken: result.token });
    await this.createSession(data);

    return data;
  };

  loginWithFacebook = async () => {
    return await this.facebookLogin(
      Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
        permissions: ['public_profile', 'email']
      })
    );
  };

  logout = async () => {
    await AsyncStorage.clear();
    await this.destroySession();
    return { ok: true };
  };

  forgotPassword = data => {
    return this.apiClient.post(ENDPOINTS.FORGOT_PASSWORD, data);
  };

  resetPassword = data => {
    return this.apiClient.post(ENDPOINTS.RESET_PASSWORD, data);
  };

  signup = async signupData => {
    await this.apiClient.post(ENDPOINTS.SIGN_UP, signupData);
    const { email, password } = signupData;
    return this.login({ email, password });
  };

  getToken = async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user).sessionTokenBck : undefined;
  };
  
  getUser = async () => {
    const user = await AsyncStorage.getItem('user');
    return JSON.parse(user);
  };

  updateUserInStorage = async property => {
    const user = await AsyncStorage.getItem('user');
    let jsonUser = JSON.parse(user);
    jsonUser = { ...jsonUser, ...property };
    AsyncStorage.setItem('user', JSON.stringify(jsonUser));
  };
}

const authService = new AuthService();
export default authService;
