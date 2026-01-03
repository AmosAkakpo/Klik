-- ============================================
-- SCRIPT DE POPULATION DES DONNÉES (CORRIGÉ & CONSOLIDÉ)
-- ============================================
-- Ce script utilise une SEULE requête INSERT pour éviter les erreurs de portée variables.
-- Instructions: Remplacez les UUIDs ci-dessous.

WITH 
  -- 1. CONFIGURATION UTILISATEURS (Remplacez les UUIDs ici !)
  config_users AS (
      SELECT 
          'ID_MANAGER_1'::uuid as u1_id, -- <--- MANAGER 1
          'ID_MANAGER_2'::uuid as u2_id  -- <--- MANAGER 2
  ),

  -- 2. RECUPERATION DES IDs (Ne pas toucher)
  refs AS (
      SELECT 
          (SELECT id FROM plans WHERE slug = 'basic') as p_basic,
          (SELECT id FROM plans WHERE slug = 'pro') as p_pro,
          (SELECT id FROM plans WHERE slug = 'premium') as p_premium,
          (SELECT id FROM categories WHERE slug = 'evenements') as c_event,
          (SELECT id FROM categories WHERE slug = 'restaurants') as c_resto,
          (SELECT id FROM categories WHERE slug = 'immobilier') as c_immo,
          (SELECT id FROM categories WHERE slug = 'auto-moto') as c_auto,
          (SELECT id FROM categories WHERE slug = 'mode') as c_mode
  )

-- 3. INSERTION MASSIVE
INSERT INTO listings (
    title, description, price, location_city, images, 
    status, current_priority, tier, plan_id,
    contact_name, contact_phone, whatsapp_number,
    expires_at,
    view_count, click_count, 
    created_by, category_id, created_at
)
-- BATCH 1: PREMIUM EVENTS (Manager 1)
SELECT 
    'Concert VIP - ' || n, 
    'Un événement inoubliable avec des artistes de renom.',
    25000 + (n * 1000),
    CASE WHEN n % 2 = 0 THEN 'Cotonou' ELSE 'Porto-Novo' END,
    '["https://images.unsplash.com/photo-1501281668745-f7f57925c3b4", "https://images.unsplash.com/photo-1459749411177-0473ef7161a8"]'::jsonb,
    'active', 20, 'premium', refs.p_premium,
    'Manager Un', '+229 97000001', '+229 97000001',
    NOW() + interval '30 days',
    (random() * 500)::int, (random() * 50)::int,
    config_users.u1_id, refs.c_event,
    NOW() - (n || ' days')::interval
FROM generate_series(1, 15) as n, config_users, refs

UNION ALL

-- BATCH 2: PRO REAL ESTATE (Manager 1)
SELECT 
    'Appartement Moderne - ' || n, 
    'Superbe appartement au centre ville.',
    150000 + (n * 5000),
    'Cotonou',
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"]'::jsonb,
    'active', 10, 'pro', refs.p_pro,
    'Manager Un', '+229 97000001', '+229 97000001',
    NOW() + interval '30 days',
    (random() * 200)::int, (random() * 20)::int,
    config_users.u1_id, refs.c_immo,
    NOW() - (n || ' days')::interval
FROM generate_series(1, 20) as n, config_users, refs

UNION ALL

-- BATCH 3: BASIC RESTAURANTS (Manager 2)
SELECT 
    'Délice Local - ' || n, 
    'Le meilleur de la cuisine béninoise.',
    2500 + (n * 100),
    CASE WHEN n % 3 = 0 THEN 'Parakou' ELSE 'Cotonou' END,
    '["https://images.unsplash.com/photo-1555396273-367ea4eb4db5"]'::jsonb,
    'active', 1, 'basic', refs.p_basic,
    'Manager Deux', '+229 96000002', '+229 96000002',
    NOW() + interval '30 days',
    (random() * 50)::int, (random() * 5)::int,
    config_users.u2_id, refs.c_resto,
    NOW() - (n || ' days')::interval
FROM generate_series(1, 30) as n, config_users, refs

UNION ALL

-- BATCH 4: BASIC FASHION (Manager 2)
SELECT 
    'Mode Fashion - Item ' || n, 
    'Vêtements tendance.',
    10000 + (n * 500),
    'Cotonou',
    '["https://images.unsplash.com/photo-1483985988355-763728e1935b"]'::jsonb,
    'active', 1, 'basic', refs.p_basic,
    'Manager Deux', '+229 96000002', '+229 96000002',
    NOW() + interval '30 days',
    (random() * 150)::int, (random() * 15)::int,
    config_users.u2_id, refs.c_mode,
    NOW() - (n || ' days')::interval
FROM generate_series(1, 15) as n, config_users, refs;


-- 4. INSERTION BOOSTS (Séparé car dépend des insertions précédentes)
-- Exécuté séparément, donc on ne peut pas utiliser la CTE 'listing_refs' ici.
-- On refait une logique simple.

UPDATE listings 
SET current_priority = 100, last_boosted_at = NOW(), tier = 'premium'
WHERE id IN (
    SELECT id FROM listings ORDER BY random() LIMIT 5
);

INSERT INTO listing_boosts (listing_id, end_date, is_active, created_by)
SELECT id, NOW() + interval '2 days', true, created_by 
FROM listings 
WHERE current_priority = 100;
