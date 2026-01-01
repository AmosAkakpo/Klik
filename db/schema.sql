-- ============================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE - VERSION DEFINITIVE
-- Plateforme Événementielle Bénin (KLik)
-- ============================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLE MANAGERS (Gestionnaires)
-- Automatisation: Un trigger crée automatiquement le manager
-- lors de l'inscription via Supabase Auth
-- ============================================
CREATE TABLE managers (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150),
    role VARCHAR(20) NOT NULL DEFAULT 'manager' CHECK (role IN ('super_admin', 'manager')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_managers_role ON managers(role);

-- TRIGGER POUR CRÉATION AUTOMATIQUE DU MANAGER
-- Ce code s'exécute automatiquement quand un utilisateur est créé dans Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.managers (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name',
        -- Le premier utilisateur sera super_admin, les suivants managers
        CASE 
            WHEN (SELECT count(*) FROM public.managers) = 0 THEN 'super_admin'
            ELSE 'manager'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- S'assurer que le trigger n'existe pas déjà avant de le créer
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. TABLE CATEGORIES
-- Les slugs sont conservés pour des URLs propres (SEO)
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE, -- Ex: 'restaurants-et-bars'
    description TEXT,
    icon_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TABLE TAGS (Mots-clés)
-- ============================================
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. TABLE LISTINGS (Annonces)
-- Prix unique et gestion des statuts
-- ============================================
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Infos de base
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    
    -- Niveau d'abonnement
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'pro', 'premium')),
    
    -- Contact
    contact_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    contact_email VARCHAR(150),
    whatsapp_number VARCHAR(50) NOT NULL,
    
    -- Localisation
    location_city VARCHAR(100) NOT NULL, -- Cotonou, etc.
    location_district VARCHAR(100), -- Quartier
    location_address TEXT,
    
    -- Prix (Unique)
    price DECIMAL(12, 2), -- 12 chiffres dont 2 décimales (suffisant pour le CFA)
    currency VARCHAR(10) DEFAULT 'XOF',
    
    -- Médias
    images JSONB DEFAULT '[]',
    video_url TEXT,
    
    -- Cycle de vie
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Auto: +30 jours
    archived_at TIMESTAMP WITH TIME ZONE,
    
    -- Option Boost
    boost_active BOOLEAN DEFAULT false,
    boost_duration_hours INT CHECK (boost_duration_hours IN (24, 48)),
    boost_started_at TIMESTAMP WITH TIME ZONE,
    boost_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Statistiques simples
    view_count INT DEFAULT 0,
    contact_click_count INT DEFAULT 0,
    whatsapp_click_count INT DEFAULT 0,
    
    -- Traçabilité
    created_by UUID REFERENCES managers(id), -- Optionnel car peut être créé par le système
    updated_by UUID REFERENCES managers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la performance
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_tier ON listings(tier);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_city ON listings(location_city);

-- ============================================
-- 5. TABLE LISTING_TAGS (Liaison)
-- ============================================
CREATE TABLE listing_tags (
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, tag_id)
);

-- ============================================
-- 6. TABLE SUBSCRIPTIONS (Abonnements/Paiements)
-- ============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    
    -- Détails paiement
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'pro', 'premium', 'boost')),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50), -- 'MTN Mobile Money', 'Moov Money', 'Espèces'
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Dates
    payment_date TIMESTAMP WITH TIME ZONE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Notes manuelles
    transaction_reference VARCHAR(150),
    notes TEXT,
    
    created_by UUID REFERENCES managers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FONCTIONS AUTOMATIQUES (TRIGGERS)
-- ============================================

-- 1. Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_managers_updated_at BEFORE UPDATE ON managers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Expiration automatique (30 jours)
CREATE OR REPLACE FUNCTION set_listing_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.published_at IS NOT NULL THEN
        NEW.expires_at = NEW.published_at + INTERVAL '30 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_listing_expiry_trigger BEFORE INSERT ON listings
    FOR EACH ROW EXECUTE FUNCTION set_listing_expiry();

-- ============================================
-- DONNÉES PAR DÉFAUT (EN FRANÇAIS)
-- ============================================

-- Catégories
INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Restauration & Bars', 'restauration-bars', 'Restaurants, maquis, bars, cafés et lounges', 1),
    ('Événements', 'evenements', 'Concerts, festivals, soirées et spectacles', 2),
    ('Mode & Beauté', 'mode-beaute', 'Vêtements, coiffure, esthétique et soins', 3),
    ('Services', 'services', 'Prestations professionnelles et services divers', 4),
    ('Loisirs & Détente', 'loisirs-detente', 'Plages, piscines, parcs et activités', 5);

-- Tags (Mots-clés)
INSERT INTO tags (name, slug) VALUES
    ('Concert', 'concert'),
    ('Restaurant chic', 'restaurant-chic'),
    ('Maquis', 'maquis'),
    ('Ambiance', 'ambiance'),
    ('Live Music', 'live-music'),
    ('Fast Food', 'fast-food'),
    ('Luxe', 'luxe'),
    ('Détente', 'detente'),
    ('Cuisine Locale', 'cuisine-locale'),
    ('Afterwork', 'afterwork');

-- ============================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- ============================================
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour le site
CREATE POLICY "Lecture publique annonces actives" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "Lecture publique categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Lecture publique tags" ON tags FOR SELECT USING (is_active = true);

-- Accès complet pour les managers connectés
CREATE POLICY "Accès complet managers" ON listings FOR ALL USING (auth.uid() IN (SELECT id FROM managers WHERE is_active = true));
CREATE POLICY "Accès complet categories" ON categories FOR ALL USING (auth.uid() IN (SELECT id FROM managers WHERE is_active = true));
CREATE POLICY "Accès complet tags" ON tags FOR ALL USING (auth.uid() IN (SELECT id FROM managers WHERE is_active = true));

-- Les managers ne voient que leur propre profil, les super_admin voient tout
CREATE POLICY "Voir profils managers" ON managers FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM managers WHERE id = auth.uid() AND role = 'super_admin')
);
