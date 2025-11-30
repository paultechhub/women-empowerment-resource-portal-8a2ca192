import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { useHybridAuth } from '@/contexts/HybridAuthContext';
import { toast } from 'sonner';
import { Plus, Star } from 'lucide-react';

interface SuccessStory {
  _id: string;
  title: string;
  story: string;
  achievement: string;
  image_url?: string;
  is_featured: boolean;
  user_id: {
    full_name: string;
    avatar_url?: string;
  };
  createdAt: string;
}

const ExpressSuccessStories = () => {
  const { user, expressToken } = useHybridAuth();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    story: '',
    achievement: '',
    image_url: ''
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await api.getSuccessStories();
      setStories(response.data);
    } catch (error) {
      toast.error('Failed to load success stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !expressToken) {
      toast.error('Please sign in to share your story');
      return;
    }

    setCreating(true);
    try {
      await api.createSuccessStory(newStory);
      toast.success('Story submitted for review!');
      setNewStory({ title: '', story: '', achievement: '', image_url: '' });
      fetchStories();
    } catch (error) {
      toast.error('Failed to submit story');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-foreground/80">
              Inspiring journeys from our community members
            </p>
          </div>
          
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Share Your Story
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Share Your Success Story</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateStory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="story-title">Title</Label>
                    <Input
                      id="story-title"
                      value={newStory.title}
                      onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                      placeholder="Your success story title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievement">Achievement</Label>
                    <Input
                      id="achievement"
                      value={newStory.achievement}
                      onChange={(e) => setNewStory({ ...newStory, achievement: e.target.value })}
                      placeholder="What did you achieve?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="story-content">Your Story</Label>
                    <Textarea
                      id="story-content"
                      value={newStory.story}
                      onChange={(e) => setNewStory({ ...newStory, story: e.target.value })}
                      placeholder="Tell us about your journey..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-url">Image URL (optional)</Label>
                    <Input
                      id="image-url"
                      type="url"
                      value={newStory.image_url}
                      onChange={(e) => setNewStory({ ...newStory, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={creating}>
                    {creating ? 'Submitting...' : 'Submit Story'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {stories.length === 0 ? (
          <Card className="glass-card border-none text-center py-20">
            <CardContent>
              <p className="text-xl text-muted-foreground">No success stories yet. Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-card border-none hover:scale-105 transition-transform duration-300 h-full">
                  {story.image_url && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={story.image_url} 
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{story.title}</CardTitle>
                      {story.is_featured && (
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <CardDescription>
                      By {story.user_id?.full_name || 'Anonymous'} • 
                      {new Date(story.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-1">Achievement:</h4>
                        <p className="text-sm">{story.achievement}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-primary mb-1">Story:</h4>
                        <p className="text-sm text-foreground/80 line-clamp-4">{story.story}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExpressSuccessStories;