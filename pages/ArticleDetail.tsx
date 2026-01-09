
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, Comment } from '../types';
import { storageService } from '../services/storageService';

const AdPlaceholder: React.FC<{ size: string; label?: string }> = ({ size, label = "Advertisement" }) => (
  <div className="bg-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 mb-8 transition-all hover:bg-slate-200/50 group">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{label}</span>
    <div className={`w-full ${size} bg-slate-200 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300 group-hover:border-slate-400 transition-colors`}>
      <i className="fas fa-rectangle-ad text-slate-400 text-3xl"></i>
    </div>
    <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Space Available</p>
  </div>
);

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const allPosts = await storageService.getPosts();
        const foundPost = allPosts.find(p => p.id === id);
        if (foundPost) {
          setPost(foundPost);

          // Get 5 recent posts excluding current
          const recent = allPosts
            .filter(p => p.id !== id && p.status === 'published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
          setRecentPosts(recent);

          const allComments = await storageService.getComments();
          setComments(allComments.filter(c => c.postId === id && c.isApproved));
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    loadData();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId: id,
      authorName: newComment.name,
      authorEmail: newComment.email,
      content: newComment.content,
      date: new Date().toISOString(),
      isApproved: false
    };

    await storageService.addComment(comment);
    setNewComment({ name: '', email: '', content: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const renderContent = (content: string) => {
    return content.split('\n').filter(p => p.trim() !== '').map((line, i) => {
      if (line.startsWith('>')) {
        return (
          <blockquote key={i} className="pl-8 border-l-4 border-red-600 italic text-2xl md:text-3xl font-medium text-slate-800 my-12 py-2">
            {line.substring(1).trim()}
          </blockquote>
        );
      }
      if (line.length < 60 && !line.endsWith('.') && !line.endsWith('?') && !line.endsWith('!')) {
        return (
          <h3 key={i} className="text-2xl md:text-3xl font-black text-slate-900 mt-16 mb-6 uppercase tracking-tight">
            {line}
          </h3>
        );
      }
      return (
        <p key={i} className="mb-8 text-lg md:text-xl text-slate-700 leading-relaxed font-light">
          {line}
        </p>
      );
    });
  };

  if (!post) return (
    <div className="p-40 text-center animate-pulse">
      <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4"></div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Opening Archives...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 xl:gap-20">

        {/* Main Content Column (75%) */}
        <div className="lg:col-span-3">
          <article className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="mb-16">
              <Link to="/" className="inline-flex items-center px-4 py-1.5 bg-red-600 text-white font-black hover:bg-slate-900 transition-all mb-8 rounded-full uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-red-100 no-underline">
                <i className="fas fa-arrow-left mr-2"></i> {post.category}
              </Link>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] mb-10 leading-[1.1] text-slate-900 tracking-tighter uppercase">
                {post.title}
              </h1>
              <div className="flex items-center space-x-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <div className="flex items-center">
                  <img src={`https://ui-avatars.com/api/?name=${post.author}&background=000&color=fff&bold=true`} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-100 shadow-sm" alt={post.author} />
                  <div className="text-left">
                    <p className="text-slate-900 text-sm font-black">{post.author}</p>
                    <p>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                <span className="flex items-center"><i className="far fa-clock mr-2 text-red-600"></i> {post.readTime} READ</span>
              </div>
            </header>

            <div className="relative mb-16 group">
              <img src={post.imageUrl} className="w-full h-auto min-h-[400px] object-cover rounded-[3rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]" alt={post.title} />
              <div className="absolute inset-0 rounded-[3rem] ring-1 ring-inset ring-black/10"></div>
            </div>

            <div className="prose prose-xl max-w-none mb-24">
              {renderContent(post.content)}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-24"></div>

            {/* Comment Section */}
            <section className="bg-slate-50 p-8 md:p-16 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-3xl font-[900] mb-12 uppercase tracking-tighter">Voices ({comments.length})</h3>

              <div className="space-y-10 mb-16">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs mr-4">
                          {comment.authorName.charAt(0)}
                        </div>
                        <span className="font-black text-slate-900 uppercase tracking-widest text-sm">{comment.authorName}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg font-light italic">"{comment.content}"</p>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-slate-400 italic text-center text-lg font-light">The floor is yours. No voices yet.</p>}
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-6 pt-12 border-t border-slate-200">
                <h4 className="text-xl font-black uppercase tracking-widest mb-8">Join the Conversation</h4>
                {submitted && (
                  <div className="p-6 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 animate-in zoom-in-95 duration-300">
                    Voice received. Awaiting moderation.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    required
                    type="text"
                    placeholder="YOUR NAME"
                    value={newComment.name}
                    onChange={e => setNewComment({ ...newComment, name: e.target.value })}
                    className="p-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-xs uppercase tracking-widest"
                  />
                  <input
                    required
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={newComment.email}
                    onChange={e => setNewComment({ ...newComment, email: e.target.value })}
                    className="p-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-xs uppercase tracking-widest"
                  />
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder="WHAT'S ON YOUR MIND?"
                  value={newComment.content}
                  onChange={e => setNewComment({ ...newComment, content: e.target.value })}
                  className="w-full p-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-xs uppercase tracking-widest resize-none"
                ></textarea>
                <button type="submit" className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600 transition-all shadow-xl hover:shadow-red-200 active:scale-95">
                  Submit Voice
                </button>
              </form>
            </section>
          </article>
        </div>

        {/* Sidebar Column (25%) */}
        <aside className="lg:col-span-1 space-y-12">

          {/* Ad Slot 1 */}
          <AdPlaceholder size="h-64" />

          {/* Recent Posts Section */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-8 pb-4 border-b-2 border-red-600 inline-block">
              Recent Stories
            </h3>
            <div className="space-y-8">
              {recentPosts.map(rPost => (
                <Link key={rPost.id} to={`/post/${rPost.id}`} className="group block no-underline">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                      <img src={rPost.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={rPost.title} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-black leading-tight text-slate-800 group-hover:text-red-600 transition-colors uppercase line-clamp-2">
                        {rPost.title}
                      </h4>
                      <div className="mt-2 flex items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <i className="far fa-calendar mr-1.5 text-red-600"></i>
                        {new Date(rPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {recentPosts.length === 0 && (
                <p className="text-slate-400 text-xs italic">More stories coming soon...</p>
              )}
            </div>
          </div>

          {/* Ad Slot 2 */}
          <AdPlaceholder size="h-[400px]" label="Sponsored Content" />

          {/* Newsletter / Meta Information */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center text-white shadow-2xl shadow-slate-200">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/40">
              <i className="fas fa-paper-plane text-sm"></i>
            </div>
            <h4 className="text-lg font-black uppercase tracking-tighter mb-4">Stay Informed</h4>
            <p className="text-slate-400 text-xs font-light leading-relaxed mb-8">Join our circle of readers and get the latest editorials delivered.</p>
            <div className="space-y-4">
              <input type="email" placeholder="YOUR EMAIL" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-red-600 transition-all" />
              <button className="w-full bg-red-600 text-white p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-red-600 transition-all">Subscribe</button>
            </div>
          </div>

          {/* Ad Slot 3 - Sticky potentially */}
          <div className="sticky top-12">
            <AdPlaceholder size="h-32" label="Premium Slot" />
          </div>

        </aside>

      </div>
    </div>
  );
};

export default ArticleDetail;
