-- Seed data for admin system development and testing
-- This file seeds the database with initial data from existing static files

-- Insert sample admin user (for development only)
INSERT INTO admin_users (email, name, role, is_active) VALUES
('admin@naranhi.com', '관리자', 'super_admin', true);

-- Migrate existing staff data from /src/app/about-hospital/staffs.ts

-- First, get category IDs
DO $$
DECLARE
    medical_category_id UUID;
    treatment_category_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO medical_category_id FROM staff_categories WHERE name = 'medical';
    SELECT id INTO treatment_category_id FROM staff_categories WHERE name = 'treatment';

    -- Insert medical staff (김채리 원장)
    INSERT INTO staff_members (
        category_id, name, position, specialty, profile_image_url,
        educations, certifications, experiences, display_order
    ) VALUES (
        medical_category_id,
        '김채리',
        '대표원장',
        '정신건강의학과 전문의',
        '/imgs/staffs/staff-kimchaeri.png',
        '["순천향대학교 의과대학 졸업", "순천향대학교 서울병원 수련의 수료", "순천향대학교 서울병원 정신건강의학과 전공의 수료"]'::jsonb,
        '["대한신경정신의학회 정회원", "대한정신건강의학과의사회 정회원", "미국 정신의학회(APA) 회원", "대한명상의학회 평생회원", "대한노인정신의학회 정회원", "대한정서인지행동의학회 정회원", "대한청소년정신의학회 회원", "대한비만연구의사회 정회원", "교육부 심리지원단 전문의"]'::jsonb,
        '["전) 새샘병원 정신건강의학과 진료부장", "전) 금천키다리정신건강의학과 원장"]'::jsonb,
        0
    );

    -- Insert treatment staff
    INSERT INTO staff_members (
        category_id, name, position, specialty, educations, certifications, experiences, display_order
    ) VALUES 
    (
        treatment_category_id,
        '김채영',
        '언어치료사',
        '센터장',
        '["나사렛대학교 언어치료학 학사"]'::jsonb,
        '["[보건복지부] 언어재활사 1급", "인지학습상담전문가 2급", "[보건복지부] 사회복지사 2급", "한국언어재활사협회 정회원", "한국언어청각임상학회 정회원", "Auditory Verbal Therapy and Practice 심화과정 수료", "보완대체의사소통 외 다수 전문과정 수료", "TCI 수료"]'::jsonb,
        '["전) 등촌4종합사회복지관 언어치료사", "전) 소리맘삼성아동발달센터 언어치료사", "전) 풍무열린나무의원 언어치료사", "전) 마곡웰소아청소년과의원 아동발달센터 치료팀장", "전) 서울시장애인의사소통권리증진센터 사례관리", "전) 연세늘봄정신건강의학과의원 부설 심리발달센터 언어치료사", "현) 나란히심리발달센터 언어치료사/센터장"]'::jsonb,
        1
    ),
    (
        treatment_category_id,
        '이지민',
        '언어치료사',
        NULL,
        '["루터대학교 언어치료학 학사졸업", "명지대학교 통합치료대학원 언어치료학과 석사 재학"]'::jsonb,
        '["[보건복지부] 언어재활사 2급"]'::jsonb,
        '["전) 군포시주몽종합사회복지관 언어치료사", "전) 동대문구 육아종합지원센터 어린이집 순회 언어치료사", "전) 우리아이학습심리센터 언어치료사", "전) 해피미아동청소년발달센터 언어치료사", "현) 또바기인지학습발달연구소 언어치료사", "현) 나란히심리발달센터 언어치료사"]'::jsonb,
        2
    ),
    (
        treatment_category_id,
        '장연',
        '언어치료사',
        NULL,
        '["동국대학교 국어국문학과 학사졸업", "연세대학교 언어병리학협동과정 석사졸업", "이화여자대학교 특특수교육학과 자폐성장애 전공 박사과정"]'::jsonb,
        '["[보건복지부] 언어재활사 1급"]'::jsonb,
        '["전) 연세언어청각연구원 언어치료사", "전) 한양대학교 행동발달증진센터 언어치료사", "전) 푸르메재단 넥슨 어린이재활병원 언어치료사"]'::jsonb,
        3
    ),
    (
        treatment_category_id,
        '김보람',
        '인지치료사/심리상담사',
        NULL,
        '["중앙대학교 심리학 학사", "중앙대학교 임상 및 상담심리학 석사"]'::jsonb,
        '["[한국심리학회] 일반심리사", "[여성가족부] 청소년상담사 2급", "[보건복지부] 임상심리사 2급", "[한국상담심리학회] 상담심리사 2급"]'::jsonb,
        '["전) 아이코리아 동작아이존 심리상담사", "전) 까리따스 심리상담센터 심리상담사", "전) 1393 자살예방센터 상담사", "전) 한성대학교 학생삼담센터 인턴상담사", "현) 심리상담센터 헤세드 심리상담사/임상심리사", "현) 아동발달센터 인지치료사", "현) 나란히 심리발달센터 인지치료사/심리상담사"]'::jsonb,
        4
    ),
    (
        treatment_category_id,
        '최민경',
        '놀이치료사',
        NULL,
        '["이화여자대학교 사회학 학사", "이화여자대학교 아동학 석사"]'::jsonb,
        '["[한국영유아아동정신건강학회] 놀이심리상담사 2급", "[여성가족부] 청소년상담사 2급", "DIRFloortime Certificate of Proficiency"]'::jsonb,
        '["전) 초록우산 어린이재단 팀원", "전) 이화여대 SSK 아동가족연구소 참여연구원", "전) 아이코리아 아동발달교육연구원/놀이치료사", "전) 성북우리아이들병원 소아청소년 정신건강의학과 놀이치료사", "현) 나란히 심리발달센터 놀이치료사"]'::jsonb,
        5
    ),
    (
        treatment_category_id,
        '김빛나',
        '놀이치료사',
        NULL,
        '["숙명여자대학교 놀이치료전공 석사"]'::jsonb,
        '["[여성가족부] 청소년상담사 2급", "[한국놀이치료학회] 놀이심리상담사 2급"]'::jsonb,
        '["전) 숙명여자대학교 놀이치료실 놀이치료사", "전) 한신플러스케어 놀이치료사", "전) 희망찬 심리발달센터 놀이치료사", "전) 희망가득의원 놀이치료사", "현) 해솔마음클리닉 놀이치료사", "현) 나란히 심리발달센터 놀이치료사"]'::jsonb,
        6
    ),
    (
        treatment_category_id,
        '강한나',
        '심리상담사',
        NULL,
        '["서울여자대학교 교육심리학과 상담심리학 석사 수료", "한양대학교 상담심리학 박사 수료", "World Mission University Graduate Master of Arts Counseling Psychology 졸업", "World Mission University Graduate PhD in Spirituality and Counseling Coaching 박사과정"]'::jsonb,
        '["[한국상담심리학회] 상담심리사 2급", "[한국상담학회] 전문상담사 2급", "[한국모래놀이치료료학회] 모래놀이치료사 1급", "[여성가족부] 청소년상담사 3급", "[여성가족부] 가정폭력상담원", "[여성가족부] 성폭력상담원", "[PREPARE-ENRICH협회] PREPARE-ENRICH 상담사"]'::jsonb,
        '["전) 백석대학교 부설 아동가족상담센터 상담사", "전) 서울TOP마음클리닉 네그루심리상담소 상담사", "전) 생각과 느낌의원 집단상담", "전) 초록우산어린이재단 중탑종합사회복지관 상담센터장", "전) 한양아이소리 부원장", "전) LPJ마음건강의원 연구실장", "현) 나란히 정신건강의학과의원/ 나란히 심리발달센터 심리상담사"]'::jsonb,
        7
    ),
    (
        treatment_category_id,
        '조은애',
        '심리상담사',
        NULL,
        '["이화여자대학교 기독교학과/심리학과 학사", "이화여자대학교 일반대학원 심리학과(상담심리전공) 석사"]'::jsonb,
        '["[한국상담심리학회] 상담심리사 1급"]'::jsonb,
        '["전) 이화여자대학교 학생상담센터 인턴 과정 수료", "전) SK하이닉스 마음산책 상담실 상담사", "전) 서울과학기술대학교 학생생활상담실 객원 상담사", "전) 동덕여자대학교 학생상담센터 객원 상담사", "전) 내맘애봄 심리상담센터 상담사", "전) 파크심리상담센터 상담사", "전) 경희대학교 심리상담센터 객원 상담사", "현) 나란히 정신건강의학과의원/ 나란히 심리발달센터 심리상담사"]'::jsonb,
        8
    ),
    (
        treatment_category_id,
        '금도연',
        '심리상담사',
        NULL,
        '["가톨릭대학교 상담심리대학원 상담심리학 석사", "건국대학교 예술디자인대학원 미술치료학과 (휴학)", "건국대학교 일반대학원 문학에술심리치료학과 예술치료 박사과정"]'::jsonb,
        '["[한국상담학회] 전문상담사 2급", "[한국상담심리학회] 상담심리사 2급", "[산업인력공단] 임상심리사 1급", "[산업인력공단] 청소년상담사 2급", "[산업인력공단] 사회조사분석사 2급"]'::jsonb,
        '["전) 아이아트 미술심리상담사", "전) 상명대학교 학생상담센터 일반연구원", "전) 경기여자고등학교, 동국대학교부속여자고등학교 외부강사", "전) 광진구 청소년상담복지센터 외래상담원", "전) 상명대학교 학생상담센터 객원상담원", "전) 영락고등학교 Wee클래스 외부강사", "전) 정다운클리닉전문상담사 / 임상심리사", "현) 상명대학교 학생상담센터 객원상담사", "현) 나란히심리발달센터 심리상담사"]'::jsonb,
        9
    ),
    (
        treatment_category_id,
        '이재갑',
        '심리상담사',
        NULL,
        '["고려대학교 일반대학원 임상심리학 석사 졸업", "서울대학교 생물심리학 석사 수료", "서울불교대학원대학교 상담심리학 박사 졸업"]'::jsonb,
        '["[보건복지부] 정신보건임상심리사 1급 232호", "[한국심리학회] 임상심리전문가 181호"]'::jsonb,
        '["전) 국립법무병원 임상심리전문가", "전) 한국마사회 유캔센터 임상심리전문가", "전) 국립공주정신병원 자문위원", "전) 서울경찰청 자문교수", "전) 서울고등법원 및 서울지방법원 전문심리위원", "현) 보건복지부 국립정신건강복지센터 평가위원", "현) 경기남부경찰청 피해조사 전문위원"]'::jsonb,
        10
    ),
    (
        treatment_category_id,
        '이숙영',
        '임상심리사',
        NULL,
        '["가톨릭대학교 심리학 석사"]'::jsonb,
        '["[보건복지부] 정신건강임상심리사 1급", "[한국심리학회] 임상심리전문가"]'::jsonb,
        '["전) 가천대 길병원 정신건강의학과 임상심리 수련", "전) 가천대학교 산학협력단 연구원", "전) 가천대 길병원 가천의생명융합 연구원", "전) 의료법인 구로다나병원 임상심리사", "현) 나란히정신건강의학과의원 임상심리사"]'::jsonb,
        11
    ),
    (
        treatment_category_id,
        '박초롱',
        '임상심리사',
        NULL,
        '["가톨릭대학교 아동학과 심리학과 학사", "가톨릭대학교 일반대학원 임상심리 석사"]'::jsonb,
        '["[보건복지부] 정신건강임상심리사 1급", "[여성가족부] 청소년상담사 2급", "동물교감상담사 2급"]'::jsonb,
        '["전) 가톨릭대학교 인천성모병원 임상심리전문가 수련", "전) 새희망병원 임상심리사", "전) 모모사회성발달심리센터 임상심리사 / 상담사", "전) 드림 수면 클리닉 임상심리사", "현) 라온 정신건강의학과의원 임상심리사 / 상담사", "현) 나란히 정신건강의학과의원 임상심리사", "현) 나란히 심리발달센터 임상심리사"]'::jsonb,
        12
    );

END $$;

-- Migrate existing facility photos from /src/app/facilities/photos.ts

DO $$
DECLARE
    hospital_category_id UUID;
    center_category_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO hospital_category_id FROM facility_categories WHERE name = 'hospital';
    SELECT id INTO center_category_id FROM facility_categories WHERE name = 'center';

    -- Insert hospital photos
    INSERT INTO facility_photos (
        category_id, title, image_url, alt_text, caption, width, height, display_order
    ) VALUES
    (hospital_category_id, '입구', '/facilities/front.png', '입구', '입구', 3, 2, 1),
    (hospital_category_id, '병원전경', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_273%2F16953503465036UBVm_JPEG%2F_DSC0568.jpg', '병원전경', '병원전경', 3, 2, 2),
    (hospital_category_id, '검사실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_225%2F1695350347092GK9Ql_JPEG%2F_DSC0617.jpg', '검사실', '검사실', 2, 3, 3),
    (hospital_category_id, '복도', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_156%2F1695350528819zH1sw_JPEG%2F%25C0%25C7%25BF%25F8%25BB%25E7%25C1%25F8_%25287%2529.jpg', '복도', '복도', 3, 2, 4),
    (hospital_category_id, '복도', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_71%2F1695350535500jmksz_JPEG%2F%25C0%25C7%25BF%25F8%25BB%25E7%25C1%25F8_%25288%2529.jpg', '복도', '복도', 2, 3, 5),
    (hospital_category_id, '대기실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_98%2F169535035021755yhD_JPEG%2FKakaoTalk_20230922_112907718_05.jpg', '대기실', '대기실', 3, 2, 6),
    (hospital_category_id, '대기실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_151%2F16953503464227Au6p_JPEG%2FKakaoTalk_20230922_112907718_02.jpg', '대기실', '대기실', 3, 2, 7),
    (hospital_category_id, '상담검사실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_82%2F1695350346463S3HzV_JPEG%2FKakaoTalk_20230922_112907718.jpg', '상담검사실', '상담, 검사실', 2, 3, 8),
    (hospital_category_id, '상담실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_252%2F1695350346525GXw2c_JPEG%2FKakaoTalk_20230922_112907718_01.jpg', '상담실', '상담실', 2, 3, 9),
    (hospital_category_id, '복도', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_278%2F1695350350276Rkui7_JPEG%2FKakaoTalk_20230922_112907718_06.jpg', '복도', '복도', 3, 2, 10);

    -- Insert center photos
    INSERT INTO facility_photos (
        category_id, title, image_url, alt_text, caption, width, height, display_order
    ) VALUES
    (center_category_id, '입구', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_36%2F1695350827610148uQ_JPEG%2F_DSC0600.jpg', '입구', '입구', 2, 3, 11),
    (center_category_id, '놀이치료실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_107%2F1695350827693iaQpO_JPEG%2F_DSC0671.jpg', '놀이치료실', '놀이치료실', 3, 2, 12),
    (center_category_id, '놀이치료실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_106%2F16953508289959oJSw_JPEG%2F_DSC0676.jpg', '놀이치료실', '놀이치료실', 3, 2, 13),
    (center_category_id, '놀이치료실', 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230922_51%2F1695350828572qpXPX_JPEG%2F_DSC0679.jpg', '놀이치료실', '놀이치료실', 2, 3, 14),
    (center_category_id, '놀이치료실 관찰', '/center/center05.jpg', '놀이치료실 관찰', '놀이치료실 관찰', 3, 2, 15);

END $$;

-- Insert sample notices for testing
INSERT INTO notices (title, slug, content, summary, notice_date, is_published) VALUES
('클리닉 개원 안내', 'clinic-opening', '나란히정신건강의학과의원이 새롭게 개원했습니다.', '클리닉 개원을 알려드립니다.', '2024-01-15', true),
('진료시간 변경 안내', 'schedule-change', '진료시간이 변경되었음을 안내드립니다.', '진료시간 변경 사항 안내', '2024-02-01', true),
('공지사항 테스트', 'test-notice', '이것은 테스트 공지사항입니다.', '테스트용 공지사항', '2024-01-01', false);