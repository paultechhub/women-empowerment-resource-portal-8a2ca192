import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Heart, MessageCircle, Send, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: '',
  });

  useEffect(() => {
    fetchPosts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('community_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create posts');
      return;
    }

    setCreating(true);
    try {
      const tags = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: newPost.title,
          content: newPost.content,
          tags,
        });

      if (error) throw error;

      toast.success('Post created successfully!');
      setNewPost({ title: '', content: '', tags: '' });
    } catch (error: any) {
      toast.error('Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
          
        await supabase.rpc('decrement_likes', { post_id: postId });
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });
          
        await supabase.rpc('increment_likes', { post_id: postId });
      }

      fetchPosts();
    } catch (error: any) {
      console.error('Like error:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold">Community</h1>
              
              {user && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card">
                    <DialogHeader>
                      <DialogTitle>Create a New Post</DialogTitle>
                      <DialogDescription>
                        Share your thoughts with the community
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="post-title">Title</Label>
                        <Input
                          id="post-title"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          placeholder="What's on your mind?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-content">Content</Label>
                        <Textarea
                          id="post-content"
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          placeholder="Share your story, ask a question, or start a discussion..."
                          rows={6}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post-tags">Tags (comma-separated)</Label>
                        <Input
                          id="post-tags"
                          value={newPost.tags}
                          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                          placeholder="tech, career, business"
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={creating}>
                        <Send className="w-4 h-4 mr-2" />
                        {creating ? 'Posting...' : 'Post'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : posts.length === 0 ? (
              <Card className="glass-card border-none text-center py-20">
                <CardContent>
                  <p className="text-xl text-muted-foreground mb-4">No posts yet. Be the first to share!</p>
                  {!user && <p className="text-sm">Sign in to create posts and engage with the community.</p>}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="glass-card border-none hover:scale-[1.02] transition-transform duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                            <CardDescription>
                              By {post.profiles?.full_name || 'Anonymous'} • 
                              {new Date(post.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {post.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/90 whitespace-pre-wrap mb-4">{post.content}</p>
                        
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            disabled={!user}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes_count}
                          </Button>
                          
                          <Button variant="ghost" size="sm" disabled>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments_count}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;
