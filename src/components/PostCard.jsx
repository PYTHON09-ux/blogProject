import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Heart, MessageCircle, ArrowRight } from 'lucide-react'


function PostCard({$id, title, featuredimage,$createdAt, likes, likedBy}) {
    const [isLiked, setIsLiked] = useState(false)
    const [isAlreadyLiked, setisAlreadyLiked]= useState();
    const [comments, setComments] = useState(0)
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData);


    useEffect(()=>{

                    if(likedBy.includes(userData.$id)){
                        setIsLiked(true);
                    }
    },[])

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-800  rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1'>
                <div className='relative'>
                    <img 
                        src={appwriteService.getFilePreview(featuredimage)} 
                        alt={title}
                        className='w-full h-48 object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 right-0 p-6'>
                        <h2 className='text-xl font-bold text-white line-clamp-2'>{title}</h2>
                    </div>
                    <p> <i><span className=' text-white//text-slate-400'> Created At - {$createdAt}</span></i></p>
                </div>
                
                <div className='p-4 flex items-center justify-between border-t border-gray-700'>
                    <div className='flex items-center space-x-4'>
                        <button 
                            className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
                        >
                            <Heart 
                                className="w-5 h-5" 
                                fill={isLiked ? "currentColor" : "none"} 
                            />
                            <span className="text-sm">{likes}</span>
                        </button>
                        <div className='flex items-center space-x-1 text-gray-400'>
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{comments}</span>
                        </div>
                    </div>
                    <div className='text-sm text-gray-400 flex items-center space-x-1 group'>
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard