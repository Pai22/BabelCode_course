import { TOGGLE_DARK_MODE, SET_DARK_MODE } from './actions'

const initialState = {
  darkMode: false, //ไม่ให้มีการใช้ darkMode ตั้งแต่ต้น
  flashMessage: null //ไม่ให้มีการใช้ flashMessage ตั้งแต่ต้น
}

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode //สลับค่า darkMode
      }
    case SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload.darkMode //ตั้งค่า darkMode ตามที่ส่งมา
      }
    default:
      return state
  }
}
