-- Create function to increment likes count
CREATE OR REPLACE FUNCTION public.increment_likes(post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE community_posts
  SET likes_count = likes_count + 1
  WHERE id = post_id;
$$;

-- Create function to decrement likes count
CREATE OR REPLACE FUNCTION public.decrement_likes(post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE community_posts
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = post_id;
$$;