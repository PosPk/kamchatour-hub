-- =====================================================
-- KAMCHATOUR HUB - Схема базы данных PostgreSQL
-- =====================================================

-- Создание базы данных
CREATE DATABASE kamchatour_hub;
\c kamchatour_hub;

-- Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ПОЛЬЗОВАТЕЛИ И АУТЕНТИФИКАЦИЯ
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    blood_type VARCHAR(5),
    allergies TEXT[],
    medical_conditions TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    interests TEXT[],
    languages TEXT[],
    experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    fitness_level VARCHAR(20) CHECK (fitness_level IN ('low', 'medium', 'high', 'athlete')),
    preferred_activities TEXT[],
    budget_range VARCHAR(20) CHECK (budget_range IN ('budget', 'moderate', 'luxury', 'ultra_luxury')),
    travel_style VARCHAR(20) CHECK (travel_style IN ('adventure', 'relaxation', 'culture', 'nature', 'mixed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    max_group_size INTEGER DEFAULT 10,
    preferred_duration_min INTEGER DEFAULT 1,
    preferred_duration_max INTEGER DEFAULT 14,
    preferred_seasons TEXT[],
    accessibility_requirements TEXT[],
    dietary_restrictions TEXT[],
    accommodation_preferences TEXT[],
    transportation_preferences TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- МАРШРУТЫ И ДОСТОПРИМЕЧАТЕЛЬНОСТИ
-- =====================================================

CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location GEOMETRY(POINT, 4326) NOT NULL,
    address TEXT,
    region VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Russia',
    elevation INTEGER,
    category VARCHAR(50) CHECK (category IN ('volcano', 'lake', 'mountain', 'beach', 'forest', 'city', 'hot_spring', 'waterfall', 'wildlife', 'cultural')),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'moderate', 'difficult', 'expert')),
    best_season TEXT[],
    access_type VARCHAR(50) CHECK (access_type IN ('road', 'helicopter', 'hiking', 'boat', 'mixed')),
    estimated_duration_hours INTEGER,
    max_participants INTEGER,
    min_age INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_point GEOMETRY(POINT, 4326) NOT NULL,
    end_point GEOMETRY(POINT, 4326) NOT NULL,
    path GEOMETRY(LINESTRING, 4326),
    total_distance_km DECIMAL(8,2),
    total_elevation_gain_m INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'moderate', 'difficult', 'expert')),
    estimated_duration_hours INTEGER,
    best_season TEXT[],
    max_participants INTEGER,
    min_age INTEGER,
    is_circular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    estimated_duration_hours INTEGER,
    is_optional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ТУРЫ И БРОНИРОВАНИЯ
-- =====================================================

CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    route_id UUID REFERENCES routes(id),
    duration_days INTEGER NOT NULL,
    max_participants INTEGER NOT NULL,
    min_participants INTEGER DEFAULT 1,
    price_rub DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tour_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    guide_id UUID REFERENCES users(id),
    status VARCHAR(20) CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tour_date_id UUID REFERENCES tour_dates(id) ON DELETE CASCADE,
    participants_count INTEGER NOT NULL DEFAULT 1,
    total_price_rub DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled', 'refunded')),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    special_requests TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- СТРАХОВАНИЕ
-- =====================================================

CREATE TABLE insurance_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    reliability DECIMAL(3,2) CHECK (reliability >= 0 AND reliability <= 1),
    response_time_hours DECIMAL(5,2),
    coverage_types TEXT[],
    exclusions TEXT[],
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    emergency_phone VARCHAR(20),
    website VARCHAR(500),
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES insurance_providers(id) ON DELETE CASCADE,
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) CHECK (type IN ('medical', 'trip_cancellation', 'baggage', 'liability', 'evacuation', 'comprehensive')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    premium_rub DECIMAL(10,2) NOT NULL,
    deductible_rub DECIMAL(10,2) NOT NULL,
    max_coverage_rub DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'expired', 'cancelled', 'claimed')),
    coverage_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES insurance_policies(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('medical', 'trip_cancellation', 'baggage_loss', 'evacuation', 'liability')),
    description TEXT NOT NULL,
    amount_rub DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'paid')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    notes TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- БУСТЫ И ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ
-- =====================================================

CREATE TABLE boost_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('company', 'individual', 'government')),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    verified BOOLEAN DEFAULT FALSE,
    experience_years INTEGER,
    licenses TEXT[],
    has_insurance BOOLEAN DEFAULT FALSE,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    whatsapp VARCHAR(20),
    telegram VARCHAR(100),
    website VARCHAR(500),
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boosts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES boost_providers(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('experience', 'convenience', 'safety', 'luxury', 'exclusive', 'group')),
    category VARCHAR(50) CHECK (category IN ('helicopter', 'guide', 'transport', 'accommodation', 'activities', 'food', 'equipment')),
    description TEXT,
    price_rub DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER,
    max_participants INTEGER,
    availability VARCHAR(50) CHECK (availability IN ('available', 'limited', 'unavailable', 'seasonal', 'weather_dependent')),
    location GEOMETRY(POINT, 4326),
    requirements TEXT[],
    included_services TEXT[],
    excluded_services TEXT[],
    images TEXT[],
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boost_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    boost_id UUID REFERENCES boosts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    participants_count INTEGER NOT NULL DEFAULT 1,
    total_price_rub DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')),
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial')),
    special_requests TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ФОТООТЧЕТЫ И КОНТЕНТ
-- =====================================================

CREATE TABLE photo_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location GEOMETRY(POINT, 4326),
    location_name VARCHAR(200),
    trip_id UUID,
    tags TEXT[],
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    weather_info JSONB,
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    ai_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES photo_reports(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    original_url VARCHAR(500),
    filename VARCHAR(255) NOT NULL,
    size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    exif_data JSONB,
    ai_tags TEXT[],
    location GEOMETRY(POINT, 4326),
    is_main BOOLEAN DEFAULT FALSE,
    filters JSONB,
    edits JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES photo_reports(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    filename VARCHAR(255) NOT NULL,
    size_bytes BIGINT,
    duration_seconds INTEGER,
    width INTEGER,
    height INTEGER,
    format VARCHAR(20),
    ai_tags TEXT[],
    location GEOMETRY(POINT, 4326),
    is_main BOOLEAN DEFAULT FALSE,
    subtitles TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE report_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES photo_reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    parent_comment_id UUID REFERENCES report_comments(id),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ГЕЙМИФИКАЦИЯ
-- =====================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    points INTEGER DEFAULT 0,
    category VARCHAR(50),
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    requirements JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('daily', 'weekly', 'monthly', 'seasonal', 'special')),
    requirements JSONB,
    rewards JSONB,
    start_date DATE,
    end_date DATE,
    max_participants INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('joined', 'in_progress', 'completed', 'failed')),
    progress JSONB,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- =====================================================
-- ЭКО-РЕЙТИНГИ И УГЛЕРОДНЫЕ КРЕДИТЫ
-- =====================================================

CREATE TABLE eco_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    overall_score DECIMAL(3,2) CHECK (overall_score >= 0 AND overall_score <= 10),
    biodiversity_score DECIMAL(3,2),
    carbon_footprint_score DECIMAL(3,2),
    waste_management_score DECIMAL(3,2),
    local_community_score DECIMAL(3,2),
    cultural_preservation_score DECIMAL(3,2),
    sustainable_transport_score DECIMAL(3,2),
    accommodation_score DECIMAL(3,2),
    food_score DECIMAL(3,2),
    certification_status VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carbon_offset_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    location GEOMETRY(POINT, 4326),
    project_type VARCHAR(100),
    carbon_offset_potential_tonnes DECIMAL(10,2),
    price_per_tonne_rub DECIMAL(8,2),
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'suspended')),
    verification_agency VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_carbon_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES carbon_offset_projects(id) ON DELETE CASCADE,
    tonnes_purchased DECIMAL(8,4),
    total_cost_rub DECIMAL(10,2),
    purchase_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(20) CHECK (status IN ('active', 'used', 'expired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AI И МАШИННОЕ ОБУЧЕНИЕ
-- =====================================================

CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('recommendation', 'prediction', 'classification', 'optimization')),
    version VARCHAR(50),
    model_file_path VARCHAR(500),
    accuracy DECIMAL(5,4),
    training_data_size INTEGER,
    last_trained_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50),
    content JSONB,
    confidence_score DECIMAL(3,2),
    is_clicked BOOLEAN DEFAULT FALSE,
    is_followed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- КВАНТОВЫЕ ВЫЧИСЛЕНИЯ
-- =====================================================

CREATE TABLE quantum_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_point GEOMETRY(POINT, 4326) NOT NULL,
    end_point GEOMETRY(POINT, 4326) NOT NULL,
    quantum_state JSONB,
    superposition_data JSONB,
    entanglement_data JSONB,
    optimization_result JSONB,
    probability DECIMAL(5,4),
    confidence DECIMAL(5,4),
    algorithm_used VARCHAR(100),
    execution_time_ms INTEGER,
    qubits_used INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- =====================================================

-- Пространственные индексы
CREATE INDEX idx_destinations_location ON destinations USING GIST (location);
CREATE INDEX idx_routes_start_point ON routes USING GIST (start_point);
CREATE INDEX idx_routes_end_point ON routes USING GIST (end_point);
CREATE INDEX idx_boosts_location ON boosts USING GIST (location);
CREATE INDEX idx_photo_reports_location ON photo_reports USING GIST (location);

-- Индексы для поиска
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_phone ON users (phone);
CREATE INDEX idx_destinations_name ON destinations USING GIN (to_tsvector('russian', name));
CREATE INDEX idx_routes_name ON routes USING GIN (to_tsvector('russian', name));
CREATE INDEX idx_boosts_name ON boosts USING GIN (to_tsvector('russian', name));
CREATE INDEX idx_photo_reports_title ON photo_reports USING GIN (to_tsvector('russian', title));

-- Индексы для связей
CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_tour_date_id ON bookings (tour_date_id);
CREATE INDEX idx_insurance_policies_user_id ON insurance_policies (user_id);
CREATE INDEX idx_boost_bookings_user_id ON boost_bookings (user_id);
CREATE INDEX idx_boost_bookings_boost_id ON boost_bookings (boost_id);
CREATE INDEX idx_photos_report_id ON photos (report_id);
CREATE INDEX idx_videos_report_id ON videos (report_id);

-- Составные индексы
CREATE INDEX idx_tour_dates_tour_start ON tour_dates (tour_id, start_date);
CREATE INDEX idx_bookings_user_status ON bookings (user_id, status);
CREATE INDEX idx_insurance_policies_user_status ON insurance_policies (user_id, status);

-- =====================================================
-- ТРИГГЕРЫ ДЛЯ ОБНОВЛЕНИЯ ВРЕМЕНИ
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применение триггеров ко всем таблицам с updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_dates_updated_at BEFORE UPDATE ON tour_dates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_providers_updated_at BEFORE UPDATE ON insurance_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON insurance_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_boost_providers_updated_at BEFORE UPDATE ON boost_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_boosts_updated_at BEFORE UPDATE ON boosts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_boost_bookings_updated_at BEFORE UPDATE ON boost_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photo_reports_updated_at BEFORE UPDATE ON photo_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eco_ratings_updated_at BEFORE UPDATE ON eco_ratings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carbon_offset_projects_updated_at BEFORE UPDATE ON carbon_offset_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- НАЧАЛЬНЫЕ ДАННЫЕ
-- =====================================================

-- Вставка тестовых данных для страховых компаний
INSERT INTO insurance_providers (name, rating, reliability, response_time_hours, coverage_types, contact_phone, contact_email, emergency_phone, website) VALUES
('Ингосстрах', 4.5, 0.95, 2.0, ARRAY['medical', 'evacuation', 'baggage', 'liability'], '+7-800-100-7777', 'kamchatka@ingosstrakh.ru', '+7-800-100-7778', 'https://ingosstrakh.ru'),
('Росгосстрах', 4.2, 0.92, 3.0, ARRAY['medical', 'trip_cancellation', 'baggage'], '+7-800-200-0920', 'kamchatka@rgs.ru', '+7-800-200-0921', 'https://rgs.ru'),
('СОГАЗ', 4.7, 0.97, 1.5, ARRAY['comprehensive', 'adventure_sports', 'volcanic_activity'], '+7-800-333-0800', 'kamchatka@sogaz.ru', '+7-800-333-0801', 'https://sogaz.ru'),
('Камчатка-Страх', 4.8, 0.98, 1.0, ARRAY['kamchatka_specific', 'bear_watching', 'helicopter_tours'], '+7-415-200-0000', 'info@kamchatka-strah.ru', '+7-415-200-0001', 'https://kamchatka-strah.ru');

-- Вставка основных достопримечательностей Камчатки
INSERT INTO destinations (name, description, location, region, category, difficulty_level, best_season, access_type, estimated_duration_hours, max_participants, min_age) VALUES
('Ключевская сопка', 'Самый высокий активный вулкан Евразии', ST_GeomFromText('POINT(56.1327 158.3803)', 4326), 'Ключевской район', 'volcano', 'expert', ARRAY['summer', 'autumn'], 'helicopter', 12, 8, 18),
('Долина гейзеров', 'Уникальная долина с гейзерами и термальными источниками', ST_GeomFromText('POINT(54.4305 160.1397)', 4326), 'Кроноцкий заповедник', 'hot_spring', 'moderate', ARRAY['summer'], 'helicopter', 6, 15, 12),
('Курильское озеро', 'Озеро с крупнейшей популяцией медведей', ST_GeomFromText('POINT(51.4567 157.1234)', 4326), 'Южно-Камчатский заказник', 'lake', 'moderate', ARRAY['summer', 'autumn'], 'helicopter', 8, 10, 16),
('Паратунка', 'Курорт с термальными источниками', ST_GeomFromText('POINT(52.9876 158.5678)', 4326), 'Елизовский район', 'hot_spring', 'easy', ARRAY['all'], 'road', 3, 50, 0),
('Авачинская бухта', 'Живописная бухта с видом на вулканы', ST_GeomFromText('POINT(52.9833 158.5167)', 4326), 'Петропавловск-Камчатский', 'beach', 'easy', ARRAY['summer', 'autumn'], 'road', 2, 100, 0);

-- Вставка достижений
INSERT INTO achievements (name, description, points, category, rarity, requirements) VALUES
('Первопроходец', 'Первый маршрут на Камчатке', 100, 'exploration', 'common', '{"routes_completed": 1}'),
('Вулканолог', 'Восхождение на вулкан', 500, 'adventure', 'rare', '{"volcano_climbs": 1}'),
('Медвежий патруль', 'Наблюдение за медведями', 300, 'wildlife', 'rare', '{"bear_sightings": 1}'),
('Термальный мастер', 'Посещение термальных источников', 200, 'wellness', 'common', '{"hot_springs_visited": 3}'),
('Камчатский эксперт', 'Завершение 10 маршрутов', 1000, 'mastery', 'epic', '{"routes_completed": 10}');

-- Вставка челленджей
INSERT INTO challenges (name, description, type, requirements, rewards, start_date, end_date, max_participants) VALUES
('Летний исследователь', 'Посетить 5 достопримечательностей за лето', 'seasonal', '{"destinations_visited": 5, "season": "summer"}', '{"points": 500, "badge": "summer_explorer"}', '2024-06-01', '2024-08-31', 1000),
('Вулканический триумф', 'Восхождение на 3 вулкана', 'special', '{"volcano_climbs": 3}', '{"points": 1000, "badge": "volcano_master"}', '2024-01-01', '2024-12-31', 100),
('Медвежий сезон', 'Фотосессия с медведями', 'seasonal', '{"bear_photos": 1}', '{"points": 300, "badge": "bear_photographer"}', '2024-07-01', '2024-09-30', 500);

COMMIT;