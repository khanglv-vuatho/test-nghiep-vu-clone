import { Route, Routes } from 'react-router-dom'

import IndexPage from '@/pages/index'
import TestingPage from './pages/testing'
import InvalidPage from './pages/invalid'
import ResultPage from './pages/result'
import KYC from './pages/kyc'
import RequestNewJob from './pages/request-new-job'
import Test1 from './pages/test1'
import Test2 from './pages/test2'

const routes = [
  { path: '/', element: <IndexPage /> },
  { path: '/testing', element: <TestingPage /> },
  { path: '/invalid', element: <InvalidPage /> },
  { path: '/result', element: <ResultPage /> },
  { path: '/request-new-job', element: <RequestNewJob /> },
  { path: '/test1', element: <Test1 /> },
  { path: '/test2', element: <Test2 /> },
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
