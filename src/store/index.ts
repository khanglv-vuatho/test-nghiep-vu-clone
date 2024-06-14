import { createStore } from 'redux'
export type TInitState = {
  lang: {
    lang: string
  }
  step1: {
    title: string
    thumb: string
    id: number | null
  }
  step2: number | null
  token: string
}
const DefaultValueState: TInitState = {
  lang: {
    lang: ''
  },
  step1: {
    title: '',
    thumb: '',
    id: null
  },
  step2: null,
  token: ''
}

function counterReducer(state: TInitState = DefaultValueState, action: { type: string; payload: any }) {
  switch (action.type) {
    case 'lang':
      return { ...state, lang: action.payload }
    case 'step1':
      return { ...state, step1: action.payload }
    case 'step2':
      return { ...state, step2: action.payload }
    case 'token':
      return { ...state, token: action.payload }
    default:
      return state
  }
}

let store = createStore(counterReducer)

export default store
