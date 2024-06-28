import { Route, Routes } from 'react-router-dom'

import IndexPage from '@/pages/index'
import TestingPage from './pages/testing'
import InvalidPage from './pages/invalid'
import ResultPage from './pages/result'
import KYC from './pages/kyc'
import RequestNewJob from './pages/request-new-job'
import Test from './pages/test'

const routes = [
  { path: '/', element: <IndexPage /> },
  { path: '/testing', element: <TestingPage /> },
  { path: '/invalid', element: <InvalidPage /> },
  { path: '/result', element: <ResultPage /> },
  { path: '/request-new-job', element: <RequestNewJob /> },
  { path: '/test', element: <Test /> },
  { path: '/kyc', element: <KYC /> }
]

function App() {
  return (
    <Routes>
      {routes.map(({ path, element }, index) => (
        <Route key={index} path={path} element={element} />
      ))}
    </Routes>
  )
}

export default App
