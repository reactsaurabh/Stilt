import {
  GET_NOTIFICATION_REQUEST,
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
};
const property = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION_REQUEST:
      return {...initialState, isLoading: true};
    case GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case GET_NOTIFICATION_ERROR:
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

export default property;
