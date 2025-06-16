import React, { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import appwriteService from "../appwrite/config";
import { ID } from 'appwrite';

function Comments({ slug, isAuthor, userData, comments, setComments }) {
    const [newComment, setNewComment] = useState(""); 
    const [editIndex, setEditIndex] = useState(null); 
    const [editText, setEditText] = useState("");     

    const handleComment = (e) => {
        e.preventDefault();
        if (newComment.trim() && userData) {
            let date = new Date().toISOString().split('T')[0];
            const comment = `${userData.name} ${date}   ${newComment} `;

            const updated = [comment, ...(comments || [])];
            setComments(updated);
            console.log(comment, comments)

            appwriteService.updateComments(slug, updated);
            console.log(comments.length, comments)
            setNewComment("");
        }
    };

    const handleEdit = (index) => {          
        setEditIndex(index);
        setEditText(comments[index]);
    };

    const handleUpdate = (index) => {       
        const updated = [comments];
        updated[index] = editText;
        setComments(updated);
        appwriteService.updateComments(slug, updated,true);
        setEditIndex(null);
        setEditText("");
    };

    const handleDelete = (index) => {       
        const updated = comments.filter((_, i) => i !== index);
        setComments(updated);
        console.log(updated)
        appwriteService.updateComments(slug, updated,true);
    };


    return (
        <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>

            {userData && (
                <form onSubmit={handleComment} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white"
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

            <div className="space-y-6">
                {comments.length==0 ? <div> No Comments yet </div>:
                comments.map((comment, index) => (
                    <div key={ID.unique()} className="bg-gray-800 rounded-lg p-6">
                        {editIndex === index ? ( // ✅ CHANGED HERE
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                />
                                <button
                                    onClick={() => handleUpdate(index)}
                                    className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Update
                                </button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={comment}
                                    readOnly
                                    disabled={!isAuthor}
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                />
                                {isAuthor && (
                                    <div className="mt-2 flex gap-4">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className="text-yellow-400 hover:text-yellow-500 flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="text-red-500 hover:text-red-600 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))
                
                }
            </div>
        </div>
    );
}

export default Comments;
