import {
  GET_BENE_ID_REQUEST,
  GET_BENE_ID_SUCCESS,
  GET_BENE_ID_ERROR,
  RESET_BENE_ID,
} from '../actions/types';

const initialState = {
  data: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
};
const beneId = (state = initialState, action) => {
  switch (action.type) {
    case GET_BENE_ID_REQUEST:
      return {...initialState, isLoading: true};
    case GET_BENE_ID_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isSuccess: true,
        isLoading: false,
      };
    case GET_BENE_ID_ERROR:
      return {
        ...state,
        data: {...action.payload},
        isError: true,
        isLoading: false,
      };
    case RESET_BENE_ID:
      return {...initialState};

    default:
      return state;
  }
};

export default beneId;
