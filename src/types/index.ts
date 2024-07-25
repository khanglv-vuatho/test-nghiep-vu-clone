import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type Topic = {
  times: number
  time: string
  type: number
  guide: string
  title: string
  description: string
  questions_length: number
  start_generate: string
}

export type Result = {
  score: number
  times: number
  percent: number
  end_time: string
  start_time: string
  finish_time: string
  correct_answer: number
  total_question: number
  can_retake?: string
}

export type Meta = {
  times: number
  end_time: string
  can_retake: string
  start_time: string
  finish_time: string
}

export type Test = {
  id: number
  type: number
  status: number
  topic: Topic
  results: Result[]
  meta: Meta
}

export type LanguageCode =
  | 'ar'
  | 'bg'
  | 'bn'
  | 'cs'
  | 'de'
  | 'el'
  | 'en'
  | 'es'
  | 'fr'
  | 'hi'
  | 'id'
  | 'it'
  | 'ja'
  | 'km'
  | 'kr'
  | 'lo'
  | 'lv'
  | 'ms'
  | 'my'
  | 'pl'
  | 'ro'
  | 'ru'
  | 'sk'
  | 'sl'
  | 'sv'
  | 'th'
  | 'tl'
  | 'tr'
  | 'uk'
  | 'ur'
  | 'vi'
  | 'zh'
  | 'fil'
  | 'fr-AF'
  | 'pt-BR'
  | 'pt-PT'
  | 'zh-TW'

export type JobType = {
  id: number
  name: Partial<Record<LanguageCode, string>>
  icon: string | null
  is_added: boolean
  description: string
}
export type TPostMessage = { message: string; data?: any }

export type direction = 'left' | 'right' | 'up' | 'down'
