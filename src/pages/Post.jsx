import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';

export default function Post() {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [isAlreadyLiked, setisAlreadyLiked]= useState();
    

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.useid === userData.$id : false;

    useEffect(() => {
        if (slug) {

            appwriteService.getPost(slug).then((post) => {

                if (post) {

                    setPost(post);
                    // In a real app, you would fetch comments and likes from your backend
                    setComments([
                        { id: 1, text: "Great post!", author: "John Doe", date: "2024-03-20" },
                        { id: 2, text: "Very informative!", author: "Jane Smith", date: "2024-03-19" },
                    ]);

                    if(post.likedBy.includes(userData.$id)){
                        setIsLiked(true);
                    }
                } else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);



    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };





    const handleLike = async () => {
        if (!userData || !post) return;

        const newIsLiked = !isLiked;

        setIsLiked(newIsLiked); 

        try {
            console.log(userData.$id)
            const updatedPost = await appwriteService.updateLikes(
                post.$id,
                userData.$id,
                newIsLiked,
                post.likedBy, 
            );

            if (updatedPost) {
                setLikes(updatedPost.likes); 
                setPost(updatedPost);        
            }
        } catch (error) {
            console.error("Failed to update like:", error);
        }
    };



    const handleComment = (e) => {
        e.preventDefault();
        if (newComment.trim() && userData) {
            const comment = {
                id: Date.now(),
                text: newComment,
                author: userData.name || "Anonymous",
                date: new Date().toISOString().split('T')[0]
            };
            setComments([comment, ...comments]);
            setNewComment("");
        }
    };

    return post ? (
        <div className="py-8">
            {/* {console.log(userData)} */}
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-xl overflow-hidden mb-8">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
                            <div className="flex items-center space-x-4 text-white">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-white'} hover:text-red-500 transition-colors`}
                                >
                                    <Heart
                                        className="w-6 h-6"
                                        fill={isLiked ? "currentColor" : "none"}
                                    />
                                    <span>{post.likes}</span>
                                </button>
                                <div className="flex items-center space-x-1">
                                    <MessageCircle className="w-6 h-6" />
                                    <span>{comments.length}</span>
                                </div>
                            </div>
                        </div>

                        {isAuthor && (
                            <div className="absolute top-6 right-6 flex space-x-2">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-500" className="hover:bg-green-600 flex items-center space-x-1">
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Button>
                                </Link>
                                <Button
                                    bgColor="bg-red-500"
                                    onClick={deletePost}
                                    className="hover:bg-red-600 flex items-center space-x-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-lg max-w-none mb-12 prose-invert">
                        {parse(post.content)}
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold mb-6">Comments</h2>

                        {/* Comment Form */}
                        {userData && (
                            <form onSubmit={handleComment} className="mb-8">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    rows="3"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Post Comment
                                </button>
                            </form>
                        )}

                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-800 rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-medium text-white">{comment.author}</div>
                                        <div className="text-sm text-gray-400">{comment.date}</div>
                                    </div>
                                    <p className="text-gray-300">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}
