-- ============================================
-- SCRIPT DE POPULATION DES DONNÉES (VERSION FINALE - NON-DESTRUCTIVE)
-- ============================================
-- Ce script utilise les catégories EXISTANTES et insère 50 annonces par manager.

DO $$
DECLARE
    -- CONFIGURATION: REMPLACER PAR VOS VRAIS IDs
    user_1_id UUID := 'YOUR_SUPERADMIN_ID_HERE'; -- Super Admin
    user_2_id UUID := 'YOUR_MANAGER_ID_HERE';    -- Manager
    
    -- IDs des Catégories (Basés sur votre liste actuelle)
    cat_resto UUID := '15b4a54d-a806-4743-b04f-f9fd2a92ff31'; -- Restauration & Bars
    cat_mode UUID := '33a0ca4b-fd56-498d-ab8f-dc43d5860a3c';  -- Mode & Beauté
    cat_loisir UUID := 'e93bb1b9-0ab5-4013-9ce2-eb0e8a7845a6'; -- Loisirs & Détente
    cat_event UUID := 'f5ab5f58-8201-42da-96b8-4fa95cd643b1';  -- Événements
    cat_service UUID := 'fb2e0f85-c6cd-4138-8eeb-6434896b28d4'; -- Services
    
    -- Plan IDs (Récupérés dynamiquement pour plus de sécurité)
    plan_basic UUID;
    plan_pro UUID;
    plan_premium UUID;
    
    -- Temp variables
    temp_listing_id UUID;
    temp_transaction_id UUID;
    temp_created_at TIMESTAMP WITH TIME ZONE;
    temp_expires_at TIMESTAMP WITH TIME ZONE;
    i INTEGER;
    manager_idx INTEGER;
    manager_id UUID;
    listing_count INTEGER := 0;
    
BEGIN
    -- 1. RECUPERER LES IDs DES PLANS
    SELECT id INTO plan_basic FROM public.plans WHERE slug = 'basic';
    SELECT id INTO plan_pro FROM public.plans WHERE slug = 'pro';
    SELECT id INTO plan_premium FROM public.plans WHERE slug = 'premium';

    -- Vérification si les plans existent
    IF plan_basic IS NULL OR plan_premium IS NULL THEN
        RAISE EXCEPTION 'Plans non trouvés dans la table public.plans. Assurez-vous que les plans (basic, pro, premium) existent.';
    END IF;

    -- 2. INSERTION LISTINGS (50 par manager)
    FOR manager_idx IN 1..2 LOOP
        IF manager_idx = 1 THEN
            manager_id := user_1_id;
        ELSE
            manager_id := user_2_id;
        END IF;
        
        FOR i IN 1..50 LOOP
            listing_count := listing_count + 1;
            
            -- Date aléatoire entre Nov 2025 et maintenant
            temp_created_at := NOW() - (RANDOM() * 60)::INTEGER * INTERVAL '1 day' 
                              - (RANDOM() * 23)::INTEGER * INTERVAL '1 hour';
            
            temp_expires_at := temp_created_at + INTERVAL '30 days';
            
            DECLARE
                rand_tier NUMERIC := RANDOM();
                selected_tier VARCHAR;
                selected_plan UUID;
                selected_price NUMERIC;
                max_imgs INTEGER;
                prio_lvl INTEGER;
                is_boosted BOOLEAN := false;
                boost_start TIMESTAMP WITH TIME ZONE;
                boost_end TIMESTAMP WITH TIME ZONE;
                selected_category UUID;
                listing_title TEXT;
                listing_desc TEXT;
                listing_price NUMERIC;
                city TEXT;
            BEGIN
                -- Distribution: 40% basic, 35% pro, 25% premium
                IF rand_tier < 0.40 THEN
                    selected_tier := 'basic';
                    selected_plan := plan_basic;
                    selected_price := 0;
                    prio_lvl := 1;
                ELSIF rand_tier < 0.75 THEN
                    selected_tier := 'pro';
                    selected_plan := plan_pro;
                    selected_price := 2500;
                    prio_lvl := 10;
                ELSE
                    selected_tier := 'premium';
                    selected_plan := plan_premium;
                    selected_price := 15000;
                    prio_lvl := 20;
                    
                    -- 30% des premium sont boostés
                    IF RANDOM() < 0.30 THEN
                        is_boosted := true;
                        boost_start := temp_created_at + (RANDOM() * 5)::INTEGER * INTERVAL '1 day';
                        boost_end := boost_start + INTERVAL '48 hours';
                        prio_lvl := 100;
                    END IF;
                END IF;
                
                -- Sélection Category aléatoire
                CASE (RANDOM() * 4)::INTEGER
                    WHEN 0 THEN selected_category := cat_resto;
                    WHEN 1 THEN selected_category := cat_mode;
                    WHEN 2 THEN selected_category := cat_loisir;
                    WHEN 3 THEN selected_category := cat_event;
                    ELSE selected_category := cat_service;
                END CASE;

                -- Titres et prix par catégorie
                IF selected_category = cat_resto THEN
                    listing_title := (ARRAY['Maquis Chez Mme Rose', 'Pizza Cotonou', 'Bar Lounge VIP', 'Café du Port', 'Saveurs du Bénin'])[1 + (RANDOM() * 4)::INTEGER] || ' #' || i;
                    listing_desc := 'Le meilleur restaurant pour vos repas en famille ou entre amis.';
                    listing_price := 2500 + (RANDOM() * 10000)::INTEGER;
                ELSIF selected_category = cat_event THEN
                    listing_title := (ARRAY['Concert Live Sèmè', 'Festival de Danse', 'Soirée Salsa', 'Exposition Photo', 'Workshop Tech'])[1 + (RANDOM() * 4)::INTEGER] || ' #' || i;
                    listing_desc := 'Ne ratez pas cet événement exceptionnel à ne pas manquer !';
                    listing_price := 0 + (RANDOM() * 50000)::INTEGER;
                ELSE
                    listing_title := 'Service/Produit ' || selected_tier || ' #' || listing_count;
                    listing_desc := 'Description détaillée de l''offre. Contactez-nous pour en savoir plus.';
                    listing_price := 5000 + (RANDOM() * 100000)::INTEGER;
                END IF;

                city := (ARRAY['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Ouidah'])[1 + (RANDOM() * 4)::INTEGER];
                
                -- Création Transaction pour les plans payants
                IF selected_price > 0 THEN
                    INSERT INTO public.transactions (amount, type, payment_method, payment_reference, manager_id, status, description, created_at)
                    VALUES (selected_price, 'listing_fee', 'mobile_money', 'SEED-' || listing_count, manager_id, 'completed', 'Paiement ' || selected_tier, temp_created_at)
                    RETURNING id INTO temp_transaction_id;
                ELSE
                    temp_transaction_id := NULL;
                END IF;
                
                -- Insertion Listing
                INSERT INTO public.listings (
                    title, description, category_id, tier, contact_name, contact_phone, 
                    whatsapp_number, location_city, price, images, status, 
                    published_at, expires_at, boost_active, boost_duration_hours, 
                    boost_started_at, boost_expires_at, view_count, contact_click_count, 
                    whatsapp_click_count, created_by, created_at, updated_at,
                    plan_id, transaction_id, current_priority, last_boosted_at
                )
                VALUES (
                    listing_title, listing_desc, selected_category, selected_tier,
                    'Contact ' || manager_idx, '+229 9700000' || manager_idx, 
                    '+229 9700000' || manager_idx, city, listing_price,
                    jsonb_build_array(
                        jsonb_build_object('url', 'https://picsum.photos/800/600?random=' || listing_count, 'order', 0)
                    ),
                    CASE WHEN temp_expires_at < NOW() THEN 'expired' ELSE 'active' END,
                    temp_created_at, temp_expires_at,
                    is_boosted AND (boost_end > NOW()),
                    CASE WHEN is_boosted THEN 48 ELSE NULL END,
                    CASE WHEN is_boosted THEN boost_start ELSE NULL END,
                    CASE WHEN is_boosted THEN boost_end ELSE NULL END,
                    (RANDOM() * 500)::INTEGER, (RANDOM() * 50)::INTEGER, (RANDOM() * 30)::INTEGER,
                    manager_id, temp_created_at, temp_created_at,
                    selected_plan, temp_transaction_id, prio_lvl,
                    CASE WHEN is_boosted THEN boost_start ELSE NULL END
                )
                RETURNING id INTO temp_listing_id;
                
                -- Insertion record Boost si applicable
                IF is_boosted THEN
                    INSERT INTO public.listing_boosts (listing_id, start_date, end_date, is_active, created_by, created_at)
                    VALUES (temp_listing_id, boost_start, boost_end, boost_end > NOW(), manager_id, boost_start);
                END IF;
            END;
        END LOOP;
        
        RAISE NOTICE 'Inséré 50 annonces pour le manager %', manager_idx;
    END LOOP;
    
    RAISE NOTICE 'Population terminée ! Total : % annonces.', listing_count;
END $$;
