
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Comment } from '../types';

const AdminComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      setComments(await storageService.getComments());
    };
    loadComments();
  }, []);

  const handleStatusChange = async (id: string, isApproved: boolean) => {
    await storageService.updateCommentStatus(id, isApproved);
    setComments(await storageService.getComments());
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this comment permanently?')) {
      await storageService.deleteComment(id);
      setComments(await storageService.getComments());
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Comment Moderation</h2>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Author</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Comment</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Post ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comments.map(comment => (
              <tr key={comment.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{comment.authorName}</p>
                    <p className="text-xs text-slate-400">{comment.authorEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-600 max-w-xs line-clamp-2">{comment.content}</p>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  #{comment.postId}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${comment.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {comment.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {!comment.isApproved && (
                    <button onClick={() => handleStatusChange(comment.id, true)} className="p-2 text-green-500 hover:text-green-700"><i className="fas fa-check-circle"></i></button>
                  )}
                  {comment.isApproved && (
                    <button onClick={() => handleStatusChange(comment.id, false)} className="p-2 text-orange-500 hover:text-orange-700"><i className="fas fa-undo"></i></button>
                  )}
                  <button onClick={() => handleDelete(comment.id)} className="p-2 text-slate-400 hover:text-red-600"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {comments.length === 0 && (
          <div className="py-20 text-center text-slate-400 italic">No comments to moderate.</div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
