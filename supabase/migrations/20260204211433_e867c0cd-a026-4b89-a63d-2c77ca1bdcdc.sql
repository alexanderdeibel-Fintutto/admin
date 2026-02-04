-- RLS policies for subscriptions table
CREATE POLICY "Authenticated users can view subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (true);