import {
  LOAD_PRODUCES_REQUEST,
  LOAD_PRODUCES_SUCCESS,
  LOAD_PRODUCES_FAILURE
} from './actions'

const initialState = {
  isLoading: false,
  items: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_PRODUCES_REQUEST:
      return { ...state, isLoading: true, items: [] }
    case LOAD_PRODUCES_SUCCESS:
      return { ...state, isLoading: false, items: action.payload.products }
    case LOAD_PRODUCES_FAILURE:
      return { ...state, isLoading: false }
    default:
      return state
  }
}
