import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import SignUpPage from "./pages/SignUpPage"
import DashboardPage from "./pages/DashboardPage"
import Projects from "./pages/Projects"
import Header from "./components/Header"
import SignInPage from "./pages/SignInPage"
import FooterComp from "./components/FooterComp"
import PrivateRoute from "./components/PrivateRoute"
import NotFoundPage from "./pages/NotFoundPage"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import ScrollToTop from "./components/ScrollToTop"
import Search from "./pages/Search"





function App() {

  return (

    <BrowserRouter>

      <ScrollToTop />

      <Header />

      <Routes>


        <Route path='/' element={<HomePage />} />

        <Route path='/post/:postSlug' element={<PostPage />} />

        <Route path='/about' element={<AboutPage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/search' element={<Search />} />

        <Route element={<PrivateRoute />}>

          <Route path='/dashboard' element={<DashboardPage />} />

        </Route>

        <Route path='/projects' element={<Projects />} />

        <Route element={<OnlyAdminPrivateRoute />}>

          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />

        </Route>


        <Route path="*" element={<NotFoundPage />} />




      </Routes>

      <FooterComp />

    </BrowserRouter>
  )
}

export default App
