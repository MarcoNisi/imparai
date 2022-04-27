import { lazy } from 'solid-js'
import { Routes, Route } from 'solid-app-router'

const Home = lazy(() => import('./pages/home'))
const Detail = lazy(() => import('./pages/detail'))
const NotFound = lazy(() => import('./pages/notFound'))
const Settings = lazy(() => import('./pages/settings'))

const App = () => {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/details/:id" element={<Detail />} />
      <Route path="/*all" element={<NotFound />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
