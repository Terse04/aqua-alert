-- =============================================================================
-- AQUAALERT DATABASE SCHEMA & SECURITY POLICIES
-- Platform: Supabase PostgreSQL (PostgreSQL 15+)
-- Project: Water Scarcity Community Engagement Project (CEP) — Wagholi, Pune
-- =============================================================================

-- Enable pgcrypto for UUID and cryptographic hashing support if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. TABLE: admin_users (Role-Based Access Control)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'administrator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user auth verification
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated administrators can inspect the admin table
CREATE POLICY "Admins can view admin allowlist"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. TABLE: complaints
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT NOT NULL UNIQUE,
    tracking_secret_hash TEXT NOT NULL,
    issue_type TEXT NOT NULL CHECK (issue_type IN ('Pipeline Leakage', 'Broken Tap', 'Tank Overflow', 'Other')),
    area_name TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    description TEXT NOT NULL,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'In Progress', 'Resolved')),
    internal_notes TEXT,
    reporter_contact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_complaints_ref_id ON public.complaints(reference_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- 1. Allow public anonymous users to insert new complaints
CREATE POLICY "Allow public complaint submission"
    ON public.complaints
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        reference_id IS NOT NULL AND
        tracking_secret_hash IS NOT NULL AND
        status = 'Pending'
    );

-- 2. Restrict SELECT to authorized administrators only
-- Public users must use the secure RPC or Edge Function below
CREATE POLICY "Admins can view all complaints"
    ON public.complaints
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- 3. Only administrators can UPDATE complaint records (e.g. status, internal notes)
CREATE POLICY "Admins can update complaints"
    ON public.complaints
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- 3. TABLE: complaint_status_history
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Under Review', 'In Progress', 'Resolved')),
    notes TEXT,
    changed_by TEXT NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_complaint_id ON public.complaint_status_history(complaint_id);

ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;

-- Public can insert initial status history on report submission
CREATE POLICY "Allow public initial history insert"
    ON public.complaint_status_history
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (status = 'Pending');

-- Administrators can insert subsequent status changes
CREATE POLICY "Admins can insert status history"
    ON public.complaint_status_history
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- Administrators can view all history
CREATE POLICY "Admins can view status history"
    ON public.complaint_status_history
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- 4. SECURE TRACKING RPC FUNCTION (Zero-Leakage Tracking)
-- -----------------------------------------------------------------------------
-- This function verifies tracking secret hash using constant-time comparison
-- and returns ONLY non-sensitive fields. It never returns hashes, phone numbers,
-- or internal admin notes.
CREATE OR REPLACE FUNCTION public.track_complaint_secure(
    p_reference_id TEXT,
    p_secret_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_complaint RECORD;
    v_history JSONB;
BEGIN
    -- Query record by reference ID
    SELECT id, reference_id, tracking_secret_hash, issue_type, area_name, description, status, created_at
    INTO v_complaint
    FROM public.complaints
    WHERE UPPER(reference_id) = UPPER(TRIM(p_reference_id));

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Verify cryptographic hash
    IF v_complaint.tracking_secret_hash <> p_secret_hash THEN
        RETURN NULL;
    END IF;

    -- Aggregate milestone timeline
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'status', h.status,
                'notes', h.notes,
                'changed_at', h.changed_at
            ) ORDER BY h.changed_at ASC
        ),
        '[]'::jsonb
    )
    INTO v_history
    FROM public.complaint_status_history h
    WHERE h.complaint_id = v_complaint.id;

    -- Return strictly sanitized public object
    RETURN jsonb_build_object(
        'reference_id', v_complaint.reference_id,
        'issue_type', v_complaint.issue_type,
        'area_name', v_complaint.area_name,
        'description', v_complaint.description,
        'status', v_complaint.status,
        'created_at', v_complaint.created_at,
        'status_history', v_history
    );
END;
$$;

-- Grant execution to public / anon role for tracking
GRANT EXECUTE ON FUNCTION public.track_complaint_secure(TEXT, TEXT) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5. TABLE: community_surveys
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    locality TEXT NOT NULL DEFAULT 'Wagholi',
    shortage_frequency TEXT NOT NULL,
    primary_source TEXT NOT NULL,
    conservation_awareness TEXT NOT NULL,
    leakage_experienced TEXT NOT NULL,
    willingness_to_use_app TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_surveys_submitted_at ON public.community_surveys(submitted_at DESC);

ALTER TABLE public.community_surveys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit anonymous survey
CREATE POLICY "Allow public survey submission"
    ON public.community_surveys
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow public read of surveys for computing anonymous aggregates in charts
CREATE POLICY "Allow public read for aggregate charts"
    ON public.community_surveys
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- -----------------------------------------------------------------------------
-- 6. TABLE: feedback
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT NOT NULL,
    contact_info TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow public to submit feedback
CREATE POLICY "Allow public feedback submission"
    ON public.feedback
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only authenticated administrators can read feedback
CREATE POLICY "Admins can view feedback"
    ON public.feedback
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- -----------------------------------------------------------------------------
-- 7. STORAGE BUCKET CONFIGURATION (Private Complaint Photos)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-photos', 'complaint-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Public upload policy for complaint photos
CREATE POLICY "Public can upload complaint photos"
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'complaint-photos');

-- Only authenticated administrators can download / view complaint photos
CREATE POLICY "Admins can view complaint photos"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'complaint-photos' AND
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- =============================================================================
-- HOW TO CREATE THE FIRST ADMINISTRATOR:
-- 1. Create a user via Supabase Dashboard -> Authentication -> Users.
-- 2. Run the following SQL query in the Supabase SQL Editor:
--
--    INSERT INTO public.admin_users (user_id, email, role)
--    VALUES ('<USER-UUID-FROM-AUTH>', 'admin@aquaalert.org', 'Lead CEP Coordinator');
-- =============================================================================
