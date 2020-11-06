import {
  GET_ALL_TRANSACTION_DETAILS_REQUEST,
  GET_ALL_TRANSACTION_DETAILS_SUCCESS,
  GET_ALL_TRANSACTION_DETAILS_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
};
const property = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TRANSACTION_DETAILS_REQUEST:
      return {...initialState, isLoading: true};
    case GET_ALL_TRANSACTION_DETAILS_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case GET_ALL_TRANSACTION_DETAILS_ERROR:
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
