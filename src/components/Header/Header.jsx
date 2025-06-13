import React, { useState } from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  return (
   <header className='py-4 bg-gray-900/50 backdrop-blur-md border-b border-gray-700 z-50 relative'>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className='md:hidden text-white p-2'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <ul className='hidden md:flex items-center space-x-4'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition duration-200'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className='md:hidden z-50 absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-700'>
              <ul className='flex flex-col p-4 space-y-2'>
                {navItems.map((item) => 
                  item.active ? (
                    <li key={item.name}>
                      <button
                        onClick={() => {
                          navigate(item.slug)
                          setIsMenuOpen(false)
                        }}
                        className='w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition duration-200'
                      >
                        {item.name}
                      </button>
                    </li>
                  ) : null
                )}
                {authStatus && (
                  <li>
                    <LogoutBtn />
                  </li>
                )}
              </ul>
            </div>
          )}
        </nav>
      </Container>
    </header>
  )
}

export default Header