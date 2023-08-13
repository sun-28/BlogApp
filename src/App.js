import './App.css';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import Blogs from './components/Blogs';
import SignUp from './components/SignUp';
import BlogState from './context/BlogState'
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import UpdatePost from './components/UpdatePost';
import SetAvatar from './components/SetAvatar';
import UserPost from './components/UserPost';
import YourProfile from './components/YourProfile';
function App() {
  return (
    <BlogState>
    <Router>
      <Routes>
          <Route path='/' element={<Blogs/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/setAvatar' element={<SetAvatar/>}/>
          <Route path='/post' element={<CreatePost/>}/>
          <Route path='/profile' element={<YourProfile/>}/>
          <Route path='/post/:id' element={<Post/>}/>
          <Route path='/updatepost/:id' element={<UpdatePost/>}/>
      </Routes>
    </Router>
    </BlogState>
  );
}

export default App;
