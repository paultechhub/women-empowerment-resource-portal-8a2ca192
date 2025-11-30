import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, BookOpen, Award, Users, Star, Settings, MessageCircle } from 'lucide-react';
import { api } from '@/services/api';

interface Profile {
  full_name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
}

interface Enrollment {
  id: string;
  progress: number;
  completed: boolean;
  courses: {
    title: string;
    description: string;
  };
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchProfile();
      fetchEnrollments();
    }
  }, [user, authLoading, navigate]);

  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.request('/users/profile'),
    enabled: !!user
  });

  const { data: enrolledCourses } = useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: () => api.request('/courses/enrolled'),
    enabled: !!user
  });

  const { data: mentorshipData } = useQuery({
    queryKey: ['mentorship-data'],
    queryFn: () => api.request('/mentorship/my-connections'),
    enabled: !!user
  });

  const updateProfile = useMutation({
    mutationFn: (data: any) => api.request('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: () => toast.error('Failed to update profile')
  });

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          progress,
          completed,
          courses (
            title,
            description
          )
        `)
        .eq('user_id', user!.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      console.error('Failed to load enrollments:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
        })
        .eq('id', user!.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

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
            {/* Profile Header */}
            <Card className="glass-card border-none mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileData?.avatar} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">
                      {profileData?.firstName} {profileData?.lastName}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">{profileData?.title || "Member"}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {profileData?.roles?.map((role: string) => (
                        <Badge key={role} variant="secondary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Learning Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {profileData?.skills?.map((skill: any) => (
                        <div key={skill.name}>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{skill.name}</span>
                            <span>{skill.progress}%</span>
                          </div>
                          <Progress value={skill.progress} className="h-2" />
                        </div>
                      )) || (
                        <p className="text-muted-foreground text-center py-4">No skills tracked yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Community Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{profileData?.stats?.mentees || 0}</div>
                          <div className="text-sm text-muted-foreground">Mentees</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-pink-600">{profileData?.stats?.forumPosts || 0}</div>
                          <div className="text-sm text-muted-foreground">Forum Posts</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{profileData?.stats?.coursesCreated || 0}</div>
                          <div className="text-sm text-muted-foreground">Courses Created</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{profileData?.stats?.rating || 0}</div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>Enrolled Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {enrolledCourses?.filter((c: any) => !c.completed).map((course: any) => (
                        <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">Progress: {course.progress}%</p>
                          </div>
                          <Button variant="outline" size="sm">Continue</Button>
                        </div>
                      )) || <p className="text-muted-foreground text-center py-4">No active courses</p>}
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>Completed Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {enrolledCourses?.filter((c: any) => c.completed).map((course: any) => (
                        <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">Completed: {new Date(course.completedAt).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="secondary">Certified</Badge>
                        </div>
                      )) || <p className="text-muted-foreground text-center py-4">No completed courses</p>}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="mentorship">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>My Mentees</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mentorshipData?.mentees?.map((mentee: any) => (
                        <div key={mentee.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar>
                            <AvatarFallback>{mentee.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{mentee.name}</h4>
                            <p className="text-sm text-muted-foreground">{mentee.title}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )) || <p className="text-muted-foreground text-center py-4">No mentees yet</p>}
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>My Mentors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mentorshipData?.mentors?.map((mentor: any) => (
                        <div key={mentor.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar>
                            <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{mentor.name}</h4>
                            <p className="text-sm text-muted-foreground">{mentor.title}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )) || <p className="text-muted-foreground text-center py-4">No mentors yet</p>}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { title: "Top Mentor", desc: "Mentored 20+ women", icon: Award },
                    { title: "Course Creator", desc: "Created 5+ courses", icon: BookOpen },
                    { title: "Community Leader", desc: "500+ forum contributions", icon: Users },
                    { title: "5-Star Rating", desc: "Excellent feedback", icon: Star },
                  ].map((achievement, index) => (
                    <Card key={index} className="glass-card border-none">
                      <CardContent className="p-6 text-center">
                        <achievement.icon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                        <h3 className="font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="max-w-2xl space-y-6">
                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              value={profile?.full_name?.split(' ')[0] || ''}
                              onChange={(e) => setProfile({...profile!, full_name: e.target.value + ' ' + (profile?.full_name?.split(' ')[1] || '')})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              value={profile?.full_name?.split(' ')[1] || ''}
                              onChange={(e) => setProfile({...profile!, full_name: (profile?.full_name?.split(' ')[0] || '') + ' ' + e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea 
                            id="bio" 
                            value={profile?.bio || ''}
                            onChange={(e) => setProfile({...profile!, bio: e.target.value})}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            value={profile?.location || ''}
                            onChange={(e) => setProfile({...profile!, location: e.target.value})}
                          />
                        </div>
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email notifications</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mentorship requests</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Course updates</span>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
