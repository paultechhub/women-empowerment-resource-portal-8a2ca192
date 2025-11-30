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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, BookOpen, Users, FileText, CheckCircle, XCircle, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { api } from '@/services/api';

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.getAnalytics(),
    enabled: !!user && isAdmin
  });

  const { data: allUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.getUsers(),
    enabled: !!user && isAdmin
  });

  const { data: allCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => api.request('/admin/courses'),
    enabled: !!user && isAdmin
  });

  const updateUserStatus = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      api.request(`/admin/users/${userId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    }
  });

  // Course form
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration_hours: 1,
    thumbnail_url: '',
  });

  // Resource form
  const [resourceData, setResourceData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'article',
    url: '',
  });

  // Pending approvals
  const [pendingMentors, setPendingMentors] = useState<any[]>([]);
  const [pendingStories, setPendingStories] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
      toast.error('Admin access required');
    } else if (isAdmin) {
      fetchPendingApprovals();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchPendingApprovals = async () => {
    try {
      const [mentorsRes, storiesRes] = await Promise.all([
        supabase.from('mentors').select('*, profiles(full_name)').eq('is_approved', false),
        supabase.from('success_stories').select('*, profiles(full_name)').eq('is_approved', false),
      ]);

      setPendingMentors(mentorsRes.data || []);
      setPendingStories(storiesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('courses').insert({
        ...courseData,
        instructor_id: user!.id,
        is_published: true,
      });

      if (error) throw error;

      toast.success('Course created successfully!');
      setCourseData({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        duration_hours: 1,
        thumbnail_url: '',
      });
    } catch (error: any) {
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('resources').insert({
        ...resourceData,
        created_by: user!.id,
        is_featured: false,
      });

      if (error) throw error;

      toast.success('Resource created successfully!');
      setResourceData({
        title: '',
        description: '',
        category: '',
        type: 'article',
        url: '',
      });
    } catch (error: any) {
      toast.error('Failed to create resource');
    } finally {
      setLoading(false);
    }
  };

  const approveMentor = async (mentorId: string) => {
    try {
      const { error } = await supabase
        .from('mentors')
        .update({ is_approved: true })
        .eq('id', mentorId);

      if (error) throw error;
      toast.success('Mentor approved!');
      fetchPendingApprovals();
    } catch (error) {
      toast.error('Failed to approve mentor');
    }
  };

  const approveStory = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('success_stories')
        .update({ is_approved: true })
        .eq('id', storyId);

      if (error) throw error;
      toast.success('Story approved!');
      fetchPendingApprovals();
    } catch (error) {
      toast.error('Failed to approve story');
    }
  };

  const rejectItem = async (table: 'mentors' | 'success_stories', id: string) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Item rejected');
      fetchPendingApprovals();
    } catch (error) {
      toast.error('Failed to reject item');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-8 h-8 text-accent" />
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold">{analytics?.totalUsers || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-3xl font-bold">{analytics?.activeUsers || 0}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Courses</p>
                      <p className="text-3xl font-bold">{analytics?.totalCourses || 0}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Enrollments</p>
                      <p className="text-3xl font-bold">{analytics?.totalEnrollments || 0}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="mentors">
                  Mentors {pendingMentors.length > 0 && `(${pendingMentors.length})`}
                </TabsTrigger>
                <TabsTrigger value="stories">
                  Stories {pendingStories.length > 0 && `(${pendingStories.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analytics">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="glass-card border-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          User Growth
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analytics?.userGrowth?.map((data: any) => (
                            <div key={data.month} className="flex justify-between">
                              <span>{data.month}</span>
                              <span className="font-medium">{data.users}</span>
                            </div>
                          )) || <p className="text-muted-foreground">No data available</p>}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border-none">
                      <CardHeader>
                        <CardTitle>Course Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analytics?.courseCompletions?.map((data: any) => (
                            <div key={data.course} className="flex justify-between">
                              <span className="truncate">{data.course}</span>
                              <span className="font-medium">{data.completions}</span>
                            </div>
                          )) || <p className="text-muted-foreground">No data available</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>Platform Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-500">{analytics?.forumPosts || 0}</div>
                          <div className="text-sm text-muted-foreground">Forum Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-500">{analytics?.mentorshipConnections || 0}</div>
                          <div className="text-sm text-muted-foreground">Mentorship Connections</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-500">87%</div>
                          <div className="text-sm text-muted-foreground">User Satisfaction</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-500">24</div>
                          <div className="text-sm text-muted-foreground">Success Stories</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users">
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers?.slice(0, 10).map((user: any) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.full_name || 'Unnamed User'}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role || 'user'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status || 'active'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateUserStatus.mutate({ 
                                  userId: user.id, 
                                  status: user.status === 'active' ? 'suspended' : 'active' 
                                })}
                              >
                                {user.status === 'active' ? 'Suspend' : 'Activate'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses">
                <div className="grid gap-6">
                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle>Course Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Enrollments</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allCourses?.slice(0, 10).map((course: any) => (
                            <TableRow key={course.id}>
                              <TableCell>{course.title}</TableCell>
                              <TableCell>{course.category}</TableCell>
                              <TableCell>{course.enrolled_count || 0}</TableCell>
                              <TableCell>
                                <Badge variant={course.is_published ? 'default' : 'secondary'}>
                                  {course.is_published ? 'Published' : 'Draft'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Create New Course
                      </CardTitle>
                      <CardDescription>Add a new course to the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Course Title</Label>
                          <Input
                            id="title"
                            value={courseData.title}
                            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={courseData.description}
                            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                            required
                            rows={4}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={courseData.category}
                              onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                              placeholder="e.g., Web Development"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="level">Level</Label>
                            <Select
                              value={courseData.level}
                              onValueChange={(value) => setCourseData({ ...courseData, level: value as 'beginner' | 'intermediate' | 'advanced' })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration (hours)</Label>
                            <Input
                              id="duration"
                              type="number"
                              min="1"
                              value={courseData.duration_hours}
                              onChange={(e) => setCourseData({ ...courseData, duration_hours: parseInt(e.target.value) })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="thumbnail">Thumbnail URL</Label>
                          <Input
                            id="thumbnail"
                            type="url"
                            value={courseData.thumbnail_url}
                            onChange={(e) => setCourseData({ ...courseData, thumbnail_url: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        <Button type="submit" disabled={loading}>
                          {loading ? 'Creating...' : 'Create Course'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="resources">
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Add New Resource
                    </CardTitle>
                    <CardDescription>Add a resource to the library</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateResource} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="res-title">Title</Label>
                        <Input
                          id="res-title"
                          value={resourceData.title}
                          onChange={(e) => setResourceData({ ...resourceData, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="res-description">Description</Label>
                        <Textarea
                          id="res-description"
                          value={resourceData.description}
                          onChange={(e) => setResourceData({ ...resourceData, description: e.target.value })}
                          required
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="res-category">Category</Label>
                          <Input
                            id="res-category"
                            value={resourceData.category}
                            onChange={(e) => setResourceData({ ...resourceData, category: e.target.value })}
                            placeholder="e.g., Digital Marketing"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="res-type">Type</Label>
                          <Select
                            value={resourceData.type}
                            onValueChange={(value) => setResourceData({ ...resourceData, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="ebook">E-book</SelectItem>
                              <SelectItem value="tool">Tool</SelectItem>
                              <SelectItem value="guide">Guide</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="res-url">URL</Label>
                        <Input
                          id="res-url"
                          type="url"
                          value={resourceData.url}
                          onChange={(e) => setResourceData({ ...resourceData, url: e.target.value })}
                          placeholder="https://example.com/resource"
                        />
                      </div>

                      <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Resource'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mentors">
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Pending Mentor Approvals
                    </CardTitle>
                    <CardDescription>Review and approve mentor applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingMentors.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No pending mentor approvals
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {pendingMentors.map((mentor) => (
                          <div key={mentor.id} className="p-4 rounded-lg bg-secondary/20 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{mentor.profiles?.full_name || 'Unknown'}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {mentor.experience_years} years experience
                                </p>
                                <p className="text-sm mt-1">
                                  Expertise: {mentor.expertise?.join(', ') || 'Not specified'}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => approveMentor(mentor.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectItem('mentors', mentor.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stories">
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle>Pending Success Stories</CardTitle>
                    <CardDescription>Review and approve success stories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pendingStories.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No pending story approvals
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {pendingStories.map((story) => (
                          <div key={story.id} className="p-4 rounded-lg bg-secondary/20 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{story.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  By: {story.profiles?.full_name || 'Unknown'}
                                </p>
                                <p className="text-sm mt-1 line-clamp-2">{story.story}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => approveStory(story.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectItem('success_stories', story.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
