import { Route, Routes } from 'react-router-dom'

import IndexPage from '@/pages/index'
import TestingPage from './pages/testing'
import TestPage from './pages/test'
import InvalidPage from './pages/invalid'
import ResultPage from './pages/result'

const routes = [
  { path: '/', element: <IndexPage /> },
  { path: '/testing', element: <TestingPage /> },
  { path: '/invalid', element: <InvalidPage /> },
  { path: '/result', element: <ResultPage /> },
  { path: '/test', element: <TestPage /> }
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
