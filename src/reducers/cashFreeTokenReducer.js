import {
  GET_CASHFREE_USER_TOKEN_REQUEST,
  GET_CASHFREE_USER_TOKEN_SUCCESS,
  GET_CASHFREE_USER_TOKEN_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
};
const property = (state = initialState, action) => {
  switch (action.type) {
    case GET_CASHFREE_USER_TOKEN_REQUEST:
      return {...initialState, isLoading: true};
    case GET_CASHFREE_USER_TOKEN_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case GET_CASHFREE_USER_TOKEN_ERROR:
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
