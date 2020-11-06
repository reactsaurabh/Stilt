import {
  ADD_VENDOR_REQUEST,
  ADD_VENDOR_SUCCESS,
  ADD_VENDOR_ERROR,
  GET_VENDOR_REQUEST,
  GET_VENDOR_SUCCESS,
  GET_VENDOR_ERROR,
  GET_CATEGORY_VENDOR_REQUEST,
  GET_CATEGORY_VENDOR_SUCCESS,
  GET_CATEGORY_VENDOR_ERROR,
  SET_NAVIGATION_TITLE,
  GET_SELECTED_VENDOR_REQUEST,
  GET_SELECTED_VENDOR_SUCCESS,
  GET_SELECTED_VENDOR_ERROR,
  DELETE_VENDOR_REQUEST,
  DELETE_VENDOR_SUCCESS,
  DELETE_VENDOR_ERROR,
} from '../actions/types';

const initialState = {
  data: null,
  categoryVendor: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
  navigationTitle: '',
  selectedVendor: null,
  isDeleted: false,
};
const ServiceInfo = (state = initialState, action) => {
  switch (action.type) {
    case ADD_VENDOR_REQUEST:
      return {...initialState, isLoading: true};
    case ADD_VENDOR_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case ADD_VENDOR_ERROR:
      return {
        ...state,
        data: action.payload,
        isError: true,
        isLoading: false,
      };
    case GET_VENDOR_REQUEST:
      return {...initialState, isLoading: true};
    case GET_VENDOR_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case GET_VENDOR_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case GET_CATEGORY_VENDOR_REQUEST:
      return {...initialState, isLoading: true};
    case GET_CATEGORY_VENDOR_SUCCESS:
      return {
        ...state,
        categoryVendor: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case GET_CATEGORY_VENDOR_ERROR:
      return {
        ...state,
        categoryVendor: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case SET_NAVIGATION_TITLE:
      return {
        ...state,
        navigationTitle: action.payload,
      };
    case GET_SELECTED_VENDOR_REQUEST:
      return {...initialState, isLoading: true};
    case GET_SELECTED_VENDOR_SUCCESS:
      return {
        ...state,
        selectedVendor: {...action.payload},
        isSuccess: true,
        isLoading: false,
      };
    case GET_SELECTED_VENDOR_ERROR:
      return {
        ...state,
        selectedVendor: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case DELETE_VENDOR_REQUEST:
      return {...initialState, isLoading: true};
    case DELETE_VENDOR_SUCCESS:
      return {
        ...state,
        isDeleted: true,
        isSuccess: true,
        isLoading: false,
      };
    case DELETE_VENDOR_ERROR:
      return {
        ...state,
        isDeleted: false,
        isError: true,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default ServiceInfo;
