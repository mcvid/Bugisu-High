-- Enable full access for students table for now to allow Admin management
-- In production, you would restrict this to authenticated admin users only using TO authenticated USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public insert to students"
    ON public.students FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update to students"
    ON public.students FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete from students"
    ON public.students FOR DELETE
    USING (true);
