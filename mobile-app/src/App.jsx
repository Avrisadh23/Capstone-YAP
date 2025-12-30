import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Homepage from './pages/Homepage'
import Profile from './pages/Profile'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import EventCreate from './pages/EventCreate'
import EventEdit from './pages/EventEdit'
import EventsManage from './pages/EventsManage'
import Communities from './pages/Communities'
import CommunityDetail from './pages/CommunityDetail'
import CommunityCreate from './pages/CommunityCreate'
import CommunityEdit from './pages/CommunityEdit'
import CommunitiesManage from './pages/CommunitiesManage'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/create" element={<EventCreate />} />
          <Route path="/events/:id/edit" element={<EventEdit />} />
          <Route path="/events/manage/list" element={<EventsManage />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityDetail />} />
          <Route path="/communities/create" element={<CommunityCreate />} />
          <Route path="/communities/:id/edit" element={<CommunityEdit />} />
          <Route path="/communities/manage/list" element={<CommunitiesManage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

