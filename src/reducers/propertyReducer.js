import {
  GET_USER_PROPERTY_REQUEST,
  GET_USER_PROPERTY_SUCCESS,
  GET_USER_PROPERTY_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
};
const property = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_PROPERTY_REQUEST:
      return {...initialState, isLoading: true};
    case GET_USER_PROPERTY_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case GET_USER_PROPERTY_ERROR:
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
