import {
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_ERROR,
  UPDATE_USER_INFO_REQUEST,
  UPDATE_USER_INFO_SUCCESS,
  UPDATE_USER_INFO_ERROR,
} from '../actions/types';
const initialState = {
  data: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
};
const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFO_REQUEST:
      return {...initialState, isLoading: true};
    case GET_USER_INFO_SUCCESS:
      return {
        ...state,
        data: {...action.payload},
        isSuccess: true,
        isLoading: false,
      };
    case GET_USER_INFO_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case UPDATE_USER_INFO_REQUEST:
      return {...initialState, isLoading: true};
    case UPDATE_USER_INFO_SUCCESS:
      return {
        ...state,
        data: {...action.payload},
        isSuccess: true,
        isLoading: false,
      };
    case UPDATE_USER_INFO_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default userInfo;
