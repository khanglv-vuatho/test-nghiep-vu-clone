import { Test, direction } from '@/types'
import { createStore } from 'redux'

export const ActionTypes = {
  DIRECTION: 'direction',
  CURRENT_STEP: 'currentStep',
  RESULT_TEST: 'resultTest',
  STEP1: 'step1',
  STEP2: 'step2',
  TOKEN: 'token',
  TEST_DETAIL: 'testDetail',
  IS_START_AGAIN: 'isStartAgain',
  SEARCH_VALUE: 'searchValue',
  KYC_STATUS: 'kyc_status'
}

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
  direction: direction
  kyc_status: number | null
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
  step1: {
    title: '',
    thumb: '',
    id: null
  },
  step2: null,
  token: '',
  direction: 'right',
  kyc_status: null
}

function counterReducer(state: TInitState = DefaultValueState, action: { type: string; payload: any }) {
  switch (action.type) {
    case ActionTypes.DIRECTION:
      return { ...state, direction: action.payload }
    case ActionTypes.CURRENT_STEP:
      return { ...state, currentStep: action.payload }
    case ActionTypes.RESULT_TEST:
      return { ...state, resultTest: action.payload }
    case ActionTypes.STEP1:
      return { ...state, step1: action.payload }
    case ActionTypes.STEP2:
      return { ...state, step2: action.payload }
    case ActionTypes.TOKEN:
      return { ...state, token: action.payload }
    case ActionTypes.TEST_DETAIL:
      return { ...state, testDetail: action.payload }
    case ActionTypes.IS_START_AGAIN:
      return { ...state, isStartAgain: action.payload }
    case ActionTypes.SEARCH_VALUE:
      return { ...state, searchValue: action.payload }
    case ActionTypes.KYC_STATUS:
      return { ...state, kyc_status: action.payload }
    default:
      return state
  }
}

let store = createStore(counterReducer)

export default store
