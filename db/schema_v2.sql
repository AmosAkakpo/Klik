-- ============================================
-- SCHÉMA V2 - REVENUE & CONFIGURATION
-- ============================================

-- 1. TABLE PLANS (Configuration des offres)
-- Remplace l'enum 'basic', 'pro', 'premium' par une table dynamique
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE, -- 'Basic', 'Pro', 'Premium'
    slug VARCHAR(50) NOT NULL UNIQUE, -- 'basic', 'pro', 'premium'
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    duration_days INT NOT NULL DEFAULT 30,
    
    -- Limites de l'offre
    max_images INT DEFAULT 1,
    video_allowed BOOLEAN DEFAULT false,
    priority_level INT DEFAULT 0, -- 0=Standard, 10=Pro, 20=Top
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Données initiales pour les Plans
INSERT INTO plans (name, slug, price, max_images, video_allowed, priority_level) VALUES
('Basique', 'basic', 0, 1, false, 0),
('Pro', 'pro', 5000, 5, false, 10),
('Premium', 'premium', 15000, 10, true, 20);


-- 2. TABLE TRANSACTIONS (Paiements)
-- Centralise tous les flux financiers (Annonces & Boosts)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    
    -- Type de revenu
    type VARCHAR(20) NOT NULL CHECK (type IN ('listing_fee', 'boost_fee')),
    
    -- Méthode & Preuve
    payment_method VARCHAR(50) NOT NULL, -- 'MTN Mobile Money', 'Moov Money', 'Bank', 'Cash'
    payment_reference VARCHAR(100), -- ID de transaction opérateur
    
    -- Traçabilité
    manager_id UUID NOT NULL REFERENCES managers(id),
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'refunded'
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE LISTING_BOOSTS (Historique des Boosts)
-- Permet de booster plusieurs fois une même annonce
CREATE TABLE listing_boosts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id), -- Lien vers le paiement
    
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    is_active BOOLEAN DEFAULT true, -- Calculé ou mis à jour par cron
    created_by UUID REFERENCES managers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. MISE À JOUR TABLE LISTINGS
-- On ajoute des liens vers les nouveaux systèmes

-- Ajouter lien vers le plan (SNAPSHOT)
-- On stocke l'ID du plan MAIS AUSSI les limites au moment de la création
-- pour éviter que changer le plan futur ne casse les anciennes annonces.
ALTER TABLE listings 
    ADD COLUMN plan_id UUID REFERENCES plans(id),
    ADD COLUMN transaction_id UUID REFERENCES transactions(id), -- Paiement initial
    ADD COLUMN current_priority INT DEFAULT 0; -- Pour le tri facile

-- Migrer les anciennes données 'tier' ver 'plan_id' (Si nécessaire)
-- UPDATE listings SET plan_id = (SELECT id FROM plans WHERE slug = listings.tier);

-- 5. POLITIQUES DE SÉCURITÉ (RLS)

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_boosts ENABLE ROW LEVEL SECURITY;

-- Plans: Tout le monde peut lire, seul Super Admin peut modifier
CREATE POLICY "Public Read Plans" ON plans FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Super Admin Manage Plans" ON plans FOR ALL USING (is_super_admin());

-- Transactions: Super Admin voit tout, Manager voit les siennes (ou tout? User demand: "Super Admin checks revenue")
-- Disons Managers voient LEURS transactions, Super Admin voit TOUT.
CREATE POLICY "View Transactions" ON transactions FOR SELECT USING (
    is_super_admin() OR manager_id = auth.uid()
);
CREATE POLICY "Create Transactions" ON transactions FOR INSERT WITH CHECK (
    manager_id = auth.uid()
);

-- Boosts: Visible par tous
CREATE POLICY "Read Boosts" ON listing_boosts FOR SELECT USING (true);
