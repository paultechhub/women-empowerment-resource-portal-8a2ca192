import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, DollarSign, Briefcase, Search, Plus } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  applicationDeadline: string;
}

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '', company: '', location: '', type: '', salary: '', description: '', requirements: ''
  });
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', searchTerm, locationFilter, typeFilter],
    queryFn: () => api.request(`/jobs?search=${searchTerm}&location=${locationFilter}&type=${typeFilter}`)
  });

  const postJob = useMutation({
    mutationFn: (jobData: any) => api.request('/jobs', { method: 'POST', body: JSON.stringify(jobData) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsPostingJob(false);
      setNewJob({ title: '', company: '', location: '', type: '', salary: '', description: '', requirements: '' });
      toast({ title: 'Job posted successfully!' });
    },
    onError: () => toast({ title: 'Failed to post job', variant: 'destructive' })
  });

  const applyToJob = useMutation({
    mutationFn: (jobId: string) => api.request(`/jobs/${jobId}/apply`, { method: 'POST' }),
    onSuccess: () => toast({ title: 'Application submitted successfully!' }),
    onError: () => toast({ title: 'Failed to submit application', variant: 'destructive' })
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    postJob.mutate({
      ...newJob,
      requirements: newJob.requirements.split(',').map(r => r.trim())
    });
  };

  const filteredJobs = jobs?.filter((job: Job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

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
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Job Board</h1>
              <p className="text-xl text-muted-foreground">
                Discover opportunities that empower women in the workplace
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="glass-card border-none mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs or companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="new-york">New York</SelectItem>
                      <SelectItem value="san-francisco">San Francisco</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {filteredJobs?.length || 0} jobs found
                  </p>
                  <Dialog open={isPostingJob} onOpenChange={setIsPostingJob}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Post Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Post a New Job</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handlePostJob} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                              id="title"
                              value={newJob.title}
                              onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={newJob.company}
                              onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={newJob.location}
                              onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Job Type</Label>
                            <Select value={newJob.type} onValueChange={(value) => setNewJob({...newJob, type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-time">Full Time</SelectItem>
                                <SelectItem value="part-time">Part Time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="salary">Salary Range</Label>
                            <Input
                              id="salary"
                              value={newJob.salary}
                              onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                              placeholder="e.g., $80k - $120k"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Job Description</Label>
                          <Textarea
                            id="description"
                            value={newJob.description}
                            onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                          <Textarea
                            id="requirements"
                            value={newJob.requirements}
                            onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                            placeholder="React, TypeScript, 3+ years experience"
                            rows={3}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsPostingJob(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={postJob.isPending}>
                            {postJob.isPending ? 'Posting...' : 'Post Job'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : filteredJobs?.length === 0 ? (
                <Card className="glass-card border-none">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria</p>
                  </CardContent>
                </Card>
              ) : (
                filteredJobs?.map((job: Job) => (
                  <Card key={job.id} className="glass-card border-none">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                              <p className="text-lg text-muted-foreground">{job.company}</p>
                            </div>
                            <Badge variant={job.type === 'remote' ? 'default' : 'secondary'}>
                              {job.type.replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {job.description}
                          </p>

                          {job.requirements && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.requirements.slice(0, 5).map((req, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                              {job.requirements.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.requirements.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 md:ml-6">
                          <Button onClick={() => applyToJob.mutate(job.id)}>
                            Apply Now
                          </Button>
                          <Button variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobBoard;