import { Test } from '@/types'
import { createStore } from 'redux'

type Answer = {
  label: string
  letter: string
}
export type TInitState = {
  currentStep: number
  resultTest: {
    testId: number
    percent: number
    kyc_status: number
    questions: {
      correct_answer: Answer
      explain_answer: string
      id: number
      is_correct: boolean
      question: string
      your_answer: Answer
    }[]
  }
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
  testDetail: Test | {}
  isStartAgain: boolean
  searchValue: string
}
const DefaultValueState: TInitState = {
  searchValue: '',
  currentStep: 0,
  isStartAgain: false,
  testDetail: {},
  resultTest: {
    testId: 0,
    percent: 0,
    questions: [],
    kyc_status: 0
  },
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
    case 'currentStep':
      return { ...state, currentStep: action.payload }
    case 'resultTest':
      return { ...state, resultTest: action.payload }
    case 'step1':
      return { ...state, step1: action.payload }
    case 'step2':
      return { ...state, step2: action.payload }
    case 'token':
      return { ...state, token: action.payload }
    case 'testDetail':
      return { ...state, testDetail: action.payload }
    case 'isStartAgain':
      return { ...state, isStartAgain: action.payload }
    case 'searchValue':
      return { ...state, searchValue: action.payload }
    default:
      return state
  }
}

let store = createStore(counterReducer)

export default store
