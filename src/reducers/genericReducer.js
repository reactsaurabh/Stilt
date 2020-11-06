import {
  TRANSACTION_ERROR,
  TRANSACTION_REQUEST,
  TRANSACTION_SUCCESS,
  UPDATE_PARTY_ERROR,
  UPDATE_PARTY_REQUEST,
  UPDATE_PARTY_SUCCESS,
  UPDATE_PROPERTY_INFO_ERROR,
  UPDATE_PROPERTY_INFO_REQUEST,
  UPDATE_PROPERTY_INFO_SUCCESS,
  ADD_BENEFICIARY_REQUEST,
  ADD_BENEFICIARY_ERROR,
  ADD_BENEFICIARY_SUCCESS,
  RESET_GENERIC,
} from '../actions/types';

const initialState = {
  data: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
};
const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PROPERTY_INFO_REQUEST:
      return {...initialState, isLoading: true};
    case UPDATE_PROPERTY_INFO_SUCCESS:
      return {
        ...state,
        data: {...action.payload},
        isSuccess: true,
        isLoading: false,
      };
    case UPDATE_PROPERTY_INFO_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case TRANSACTION_REQUEST:
      return {...initialState, isLoading: true};
    case TRANSACTION_SUCCESS:
      return {
        ...state,
        data: {...action.payload},
        isSuccess: true,
        isLoading: false,
      };
    case TRANSACTION_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case UPDATE_PARTY_REQUEST:
      return {...initialState, isLoading: true};
    case UPDATE_PARTY_SUCCESS:
      return {
        ...state,
        data: {...action.payload},
        isSuccess: true,
        isLoading: false,
      };
    case UPDATE_PARTY_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };

    case ADD_BENEFICIARY_REQUEST:
      return {...initialState, isLoading: true};
    case ADD_BENEFICIARY_SUCCESS:
      return {
        ...state,
        data: {...action.payload},
        isSuccess: true,
        isLoading: false,
      };
    case ADD_BENEFICIARY_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case RESET_GENERIC:
      return {...initialState};

    default:
      return state;
  }
};

export default userInfo;
