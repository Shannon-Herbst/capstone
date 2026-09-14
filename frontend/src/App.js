import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom'
import Home from './pages/Home';
import AllListings from './pages/AllListings';
import ListingDetail from './pages/ListingDetail';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import MyReservations from './pages/MyReservations';
import MyListings from './pages/MyListings';
import EditListing from './pages/EditListing';
import CreateListing from './pages/CreateListing';


function AppContent() {
  const location = useLocation()
  const hideFooter = location.pathname === '/all-listings'

  const isHome = location.pathname === '/'

  return (
    <div className={isHome ? 'home-page' : ''}>
      <Navbar />
      <div className='pages'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/all-listings' element={<AllListings />}/>
          <Route path='/listings/:id' element={<ListingDetail />}/>
          <Route path='/sign-up' element={<Signup />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/my-reservations' element={<MyReservations />}/>
          <Route path='/my-listings' element={<MyListings />}/>
          <Route path='/my-listings/:id/edit' element={<EditListing />}/>
          <Route path='/create-listing' element={<CreateListing />}/>
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
