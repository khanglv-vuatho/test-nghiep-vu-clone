import { Route, Routes } from 'react-router-dom'

import './style.css'
import { lazy, Suspense } from 'react'
import Fallback from './components/Fallback'

const IndexPage = lazy(() => import('./pages/Home'))
const InvalidPage = lazy(() => import('./pages/invalid'))
const ResultPage = lazy(() => import('./pages/result'))
const RequestNewJob = lazy(() => import('./pages/request-new-job'))
const TestingPage = lazy(() => import('./pages/Testing'))
const KYC = lazy(() => import('./pages/kyc'))

const routes = [
  { path: '/', element: <IndexPage /> },
  { path: '/testing', element: <TestingPage /> },
  { path: '/invalid', element: <InvalidPage /> },
  { path: '/result', element: <ResultPage /> },
  { path: '/request-new-job', element: <RequestNewJob /> },
  { path: '/kyc', element: <KYC /> }
]

function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
    </Suspense>
  )
}

export default App
