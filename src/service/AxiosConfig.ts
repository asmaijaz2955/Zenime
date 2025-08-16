import axios, { AxiosError } from 'axios';

import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import { PROD_URL} from '../assets/constants/env';

import {useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { compose } from '@reduxjs/toolkit';


export const navigationRef = createNavigationContainerRef();

const UseAccessToken = async () => {
  const accessToken = await AsyncStorage.getItem('userToken');
  // console.log("//////", accessToken)
  return accessToken;
};

// function navigate() {
//     AsyncStorage.clear();
//     if (navigationRef.isReady()) {
//         navigationRef.dispatch(
//             CommonActions.reset({
//                 index: 1,
//                 routes: [{ name: 'Login' }],
//             }),
//         );
//     }
// }

const dataServer = axios.create({
  baseURL: PROD_URL,
  timeout: 10000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});
// const accessToken = useSelector((state:any) => state?.auth?.acessToken);
dataServer.interceptors.request.use(config => {
  return new Promise((resolve, reject) => {
    NetInfo.addEventListener(async (state: {isConnected: any}) => {
      // UseAccessToken()
      const accessToken = await UseAccessToken();
      // console.warn(accessToken,"????")
      if (!state.isConnected) {
        return reject({message: 'No internet connection'});
      }
      if (config.data && config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }

      if (accessToken) {
        console.log('gggggggggggg', accessToken);
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        // navigate();
      }
      console.log(JSON.stringify(config), 'config in inteceptor');
      return resolve(config);
    });
  });
});


dataServer.interceptors.response.use(
  response => response,
  async error => {
    console.log(
      error.response,
      'Sessions issue',
      error.response?.data?.message,
    );

    const originalRequest = error.config;


    if (
      error.response &&
      error.response.status === 401 &&
      error.response?.data?.message == 'Token has expired'
    ) {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('Inside other if');

      // if (refreshToken) {
      //   try {

      //     const refreshResponse = await axios.post(
      //       `${PROD_URL}/Account/refresh-token`,
      //       {
      //         refreshToken,
      //       },
      //     );

      //     const newAccessToken = refreshResponse.data.token;

      //     await AsyncStorage.setItem('userToken', newAccessToken);

      //     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

      //     return dataServer(originalRequest);
      //   } catch (refreshError) {
      //     console.error('Failed to refresh token:', refreshError);


      //     await AsyncStorage.clear();

      //     if (navigationRef.isReady()) {
      //       navigationRef.dispatch(
      //         CommonActions.reset({
      //           index: 0,
      //           routes: [{name: 'Login'}],
      //         }),
      //       );
      //     }
      //     return Promise.reject(refreshError);
      //   }
      // } else {
      //   console.error('No refresh token available, logging out.');

      //   await AsyncStorage.clear();

      //   if (navigationRef.isReady()) {
      //     navigationRef.dispatch(
      //       CommonActions.reset({
      //         index: 0,
      //         routes: [{name: 'Login'}],
      //       }),
      //     );
      //   }
      //   return Promise.reject(error);
      // }
    }


    return Promise.reject(error);
  },
);

const GetStream = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}stream?id=naruto-shippuden-355?ep=7882&server=hd-1&type=sub`, {
     
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Stream failed',
    };
  }
};
const GetCharacter = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}character/list/one-piece-100`, {
     
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Character failed',
    };
  }
};
const GetProducer = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}producer/ufotable?page=1`, {
     
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'producer failed',
    };
  }
};
const Gettopairing = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}top-airing?page=1`, {
     
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'top-airing failed',
    };
  }
};
const Getrandom = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}random`, {
     
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'random failed',
    };
  }
};
const GetInfo = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}info?id=yami-shibai-9-17879`, {
     
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Info failed',
    };
  }
};
const GetSchedule = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}schedule?date=2024-09-23`, {
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Schedule failed',
    };
  }
};
const GetSearchSuggest = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}search/suggest?keyword=demon`, {
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Search failed',
    };
  }
};
const GetSearch = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}search?keyword=one-punch-man`, {
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Search failed',
    };
  }
};
const GetEpisodes = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}episodes/one-piece-100`, {
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Epsiodes failed',
    };
  }
};
const GetServers = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}servers/demon-slayer-kimetsu-no-yaiba-hashira-training-arc-19107?ep=124260`, {
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'GetServers failed',
    };
  }
};
const GetTopTen = async () => {
  try {
    const response = await dataServer.get(`${PROD_URL}top-ten`, {
    });
    return response.data;
  } catch (error: any) {
    return {
      error:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'TOp ten failed',
    };
  }
};
export {
  dataServer,
  GetStream,
  GetCharacter,
  GetProducer,
  Gettopairing,
  Getrandom,
  GetInfo,
  GetSchedule,
  GetSearchSuggest,
  GetSearch,
  GetEpisodes,
  GetServers,
  GetTopTen
};

