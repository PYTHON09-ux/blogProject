import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        setLoading(true)
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }
  
    if (posts.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Container>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4 text-white">
                            Welcome to Our Blog
                        </h1>
                        <p className="text-gray-400 mb-8 text-lg">
                            Join our community to read and share amazing stories
                        </p>
                        {!userData && (
                            <div className="space-x-4">
                                <Link 
                                    to="/login"
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup"
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='min-h-screen'>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 mb-12">
                <Container>
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white mb-4">
                            Discover Amazing Stories
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                            Explore our collection of thought-provoking articles and share your own experiences with our community.
                        </p>
                        {userData && (
                            <Link 
                                to="/add-post"
                                className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Write a Post
                            </Link>
                        )}
                    </div>
                </Container>
            </div>

            {/* Posts Grid */}
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post.$id} className="transform transition duration-300 hover:scale-105">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home