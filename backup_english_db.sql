--
-- PostgreSQL database dump
--

\restrict 7x1pL8IzAPXnyVrXKvj87k6T5Hmrtq3Tn2DmdaIldNfLZvWVKjl4iodOSuf41ab

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_certificates_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_certificates_type AS ENUM (
    'unit',
    'course',
    'mini_test',
    'streak',
    'flashcard',
    'error_log'
);


ALTER TYPE public.enum_certificates_type OWNER TO postgres;

--
-- Name: enum_progress_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_progress_status AS ENUM (
    'not_started',
    'in_progress',
    'completed'
);


ALTER TYPE public.enum_progress_status OWNER TO postgres;

--
-- Name: enum_questions_question_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_questions_question_type AS ENUM (
    'multiple_choice',
    'gap_filling',
    'word_formation',
    'sentence_transformation',
    'error_correction',
    'collocation'
);


ALTER TYPE public.enum_questions_question_type OWNER TO postgres;

--
-- Name: enum_units_book_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_units_book_level AS ENUM (
    'B2',
    'C1',
    'A1',
    'A2',
    'B1'
);


ALTER TYPE public.enum_units_book_level OWNER TO postgres;

--
-- Name: enum_units_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_units_type AS ENUM (
    'grammar',
    'vocabulary'
);


ALTER TYPE public.enum_units_type OWNER TO postgres;

--
-- Name: enum_users_rank; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_rank AS ENUM (
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master'
);


ALTER TYPE public.enum_users_rank OWNER TO postgres;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    type public.enum_certificates_type NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    unit_id uuid,
    code character varying(255) NOT NULL,
    earned_at timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- Name: dictionary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dictionary (
    id uuid NOT NULL,
    word character varying(255) NOT NULL,
    definition_en text,
    definition_vi text,
    pronunciation character varying(255),
    audio_url character varying(255),
    example text,
    word_type character varying(255),
    source character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.dictionary OWNER TO postgres;

--
-- Name: flashcards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flashcards (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    unit_id uuid,
    word character varying(255) NOT NULL,
    definition text NOT NULL,
    example text,
    next_review timestamp with time zone,
    ease_factor double precision DEFAULT '2.5'::double precision,
    "interval" integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.flashcards OWNER TO postgres;

--
-- Name: progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.progress (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    unit_id uuid NOT NULL,
    status public.enum_progress_status DEFAULT 'not_started'::public.enum_progress_status,
    score double precision DEFAULT '0'::double precision,
    last_accessed timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.progress OWNER TO postgres;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id uuid NOT NULL,
    unit_id uuid NOT NULL,
    question_type public.enum_questions_question_type NOT NULL,
    content text NOT NULL,
    options json,
    correct_answer text NOT NULL,
    explanation text,
    difficulty integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id uuid NOT NULL,
    book_level public.enum_units_book_level NOT NULL,
    unit_number integer NOT NULL,
    title character varying(255) NOT NULL,
    type public.enum_units_type NOT NULL,
    description text,
    content_html text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.units OWNER TO postgres;

--
-- Name: user_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_answers (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    question_id uuid NOT NULL,
    user_answer text,
    is_correct boolean,
    "timestamp" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.user_answers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'user'::public.enum_users_role,
    is_premium boolean DEFAULT false,
    premium_expiry timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    points integer DEFAULT 0,
    rank public.enum_users_rank DEFAULT 'Bronze'::public.enum_users_rank,
    streak integer DEFAULT 0,
    last_active timestamp with time zone,
    is_verified boolean DEFAULT false,
    verification_token character varying(255),
    reset_password_token character varying(255),
    reset_password_expires timestamp with time zone,
    google_id character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, user_id, type, title, description, unit_id, code, earned_at, "createdAt", "updatedAt") FROM stdin;
5affe32a-a46d-4019-b5ad-5af372291aaf	2035856e-827e-491f-954b-f5d8ed89caaf	streak	Streak 7 ngày	Học liên tục 7 ngày	\N	CERT-1790867950315-M1W3CJ	2026-10-01 22:19:10.315+07	2026-10-01 22:19:10.317+07	2026-10-01 22:19:10.317+07
\.


--
-- Data for Name: dictionary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dictionary (id, word, definition_en, definition_vi, pronunciation, audio_url, example, word_type, source, "createdAt", "updatedAt") FROM stdin;
a13edcee-3512-4cc4-8c93-0f8f7be614d7	ubiquitous	adj\tBeing everywhere at once: omnipresent. 	\N	\N	\N	\N	unknown	Datamuse	2026-09-18 19:44:09.777+07	2026-09-18 19:44:09.777+07
f4b59ce1-8ab8-4e6f-967d-844502fb41f1	xyzabc123	\N	xyzabc123	\N	\N	\N	\N	Google Translate	2026-09-18 19:49:23.325+07	2026-09-18 19:49:23.325+07
f7e95b5b-abfe-4326-965d-1bb56bd8172b	apple	n\tA common, firm, round fruit produced by a tree of the genus Malus. 	\N	\N	\N	\N	unknown	Datamuse	2026-09-18 20:08:01.41+07	2026-09-18 20:08:01.41+07
dd07cdfd-a5b5-4ba2-bd90-9a136380bc58	strong	adj\t(loosely) Possessing power, might, or strength. 	\N	\N	\N	\N	unknown	Datamuse	2026-09-18 20:23:15.79+07	2026-09-18 20:23:15.79+07
1874c57f-7d08-418c-bd5d-c5906d937608	the	adv\t(with a superlative adjective) Beyond all others. 	\N	\N	\N	\N	unknown	Datamuse	2026-09-18 20:24:35.668+07	2026-09-18 20:24:35.668+07
1818d695-265e-49d1-8aaa-7c3385259434	nhi	n\t(ufology, astrobiology) Initialism of nonhuman intelligence. 	\N	\N	\N	\N	unknown	Datamuse	2026-09-18 20:24:42.468+07	2026-09-18 20:24:42.468+07
2c0c6cb1-82d0-423b-9ef0-3be35060b400	she	n\tA female. 	\N	\N	\N	\N	unknown	Datamuse	2026-10-03 14:22:31.319+07	2026-10-03 14:22:31.319+07
f05b5039-76fc-4bde-83ae-649d8eba9b06	quen	\N	làm nguội	\N	\N	\N	\N	Google Translate	2026-10-03 14:22:34.105+07	2026-10-03 14:22:34.105+07
6d7ea177-5694-43c8-837a-9536053df91c	school	n\t(India, Canada, US) An institution dedicated to teaching and learning; an educational institution. 	\N	\N	\N	\N	unknown	Datamuse	2026-10-03 14:22:39.699+07	2026-10-03 14:22:39.699+07
f8c2357f-aa5c-4f59-9e7f-12090b2d2f84	sun	n\tThe star that is closest to the Earth. 	\N	\N	\N	\N	unknown	Datamuse	2026-10-03 14:51:25.33+07	2026-10-03 14:51:25.33+07
c0dd355f-8d55-4624-a6e6-aac69bc9688a	watch	n\tA portable or wearable timepiece. 	\N	\N	\N	\N	unknown	Datamuse	2026-10-03 14:51:34.057+07	2026-10-03 14:51:34.057+07
\.


--
-- Data for Name: flashcards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flashcards (id, user_id, unit_id, word, definition, example, next_review, ease_factor, "interval", "createdAt", "updatedAt") FROM stdin;
5564e1aa-38fb-4b9f-ae42-034f1753b62f	2035856e-827e-491f-954b-f5d8ed89caaf	\N	apple	quả táo	I eat an apple	2026-09-21 20:37:21.135+07	2.3000000000000003	6	2026-08-10 09:44:45.979+07	2026-09-15 20:37:21.136+07
d44c7b2b-846c-40ec-afe9-26d49a68fcb3	2035856e-827e-491f-954b-f5d8ed89caaf	\N	ok	ok	\N	2026-09-21 20:37:25.243+07	2.3000000000000003	6	2026-08-20 17:34:29.261+07	2026-09-15 20:37:25.244+07
\.


--
-- Data for Name: progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.progress (id, user_id, unit_id, status, score, last_accessed, "createdAt", "updatedAt") FROM stdin;
38e2463f-d374-45dc-9831-4118c3a67b4b	2035856e-827e-491f-954b-f5d8ed89caaf	b5e9eead-0d6e-4e15-892d-389da5080ca8	in_progress	75	2026-10-03 14:51:08.192+07	2026-10-03 14:51:08.192+07	2026-10-03 14:51:08.192+07
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, unit_id, question_type, content, options, correct_answer, explanation, difficulty, "createdAt", "updatedAt") FROM stdin;
5c058bef-b80e-4e06-93d0-9a063cfbb002	b5e9eead-0d6e-4e15-892d-389da5080ca8	multiple_choice	???	["a","b","c","d"]	b	!!!	1	2026-09-15 20:17:35.888+07	2026-09-15 20:17:35.888+07
8a67abe5-6162-441a-8715-5ac9c90477bc	b5e9eead-0d6e-4e15-892d-389da5080ca8	gap_filling	She ___ to school every day.	\N	goes	ừ	1	2026-09-15 20:35:22.053+07	2026-09-15 20:35:22.053+07
a8cd2679-df3e-43b4-94eb-29e747ae47bb	b5e9eead-0d6e-4e15-892d-389da5080ca8	gap_filling	They ___ football every Sunday.	\N	play	ừ kệ m	1	2026-09-15 20:35:57.755+07	2026-09-15 20:35:57.755+07
8036339b-6167-46e1-83c6-f1e323bade13	b5e9eead-0d6e-4e15-892d-389da5080ca8	gap_filling	He ___ (watch) TV every night.	\N	watches	ko giải thích j hết, tự hiểu	1	2026-09-15 20:36:43.149+07	2026-09-15 20:36:43.149+07
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, book_level, unit_number, title, type, description, content_html, "createdAt", "updatedAt") FROM stdin;
b5e9eead-0d6e-4e15-892d-389da5080ca8	A2	1	Thì ht đơn	grammar	\tTổng quan về các thì hiện tại trong tiếng Anh	<h2>Present Simple</h2>\n<p><strong>Công thức:</strong> S + V(s/es) + O</p>\n<p><strong>Cách dùng:</strong></p>\n<ul>\n    <li>Thói quen, hành động lặp đi lặp lại: <em>She goes to school every day.</em></li>\n    <li>Sự thật hiển nhiên: <em>The sun rises in the east.</em></li>\n    <li>Lịch trình, thời khóa biểu: <em>The train leaves at 8 AM.</em></li>\n</ul>\n<p><strong>Dấu hiệu nhận biết:</strong> always, usually, often, sometimes, never, every day/week/month...</p>\n\n<h2>Present Continuous</h2>\n<p><strong>Công thức:</strong> S + am/is/are + V-ing + O</p>\n<p><strong>Cách dùng:</strong></p>\n<ul>\n    <li>Hành động đang diễn ra ngay lúc nói: <em>She is reading a book now.</em></li>\n    <li>Hành động tạm thời: <em>I am staying at a hotel this week.</em></li>\n    <li>Kế hoạch trong tương lai gần: <em>We are meeting them tomorrow.</em></li>\n</ul>\n<p><strong>Dấu hiệu nhận biết:</strong> now, right now, at the moment, at present, Look!, Listen!...</p>\n\n<h2>Present Perfect</h2>\n<p><strong>Công thức:</strong> S + have/has + V3/ed + O</p>\n<p><strong>Cách dùng:</strong></p>\n<ul>\n    <li>Hành động đã xảy ra trong quá khứ, kéo dài đến hiện tại: <em>I have lived here for 5 years.</em></li>\n    <li>Hành động vừa mới xảy ra: <em>She has just finished her homework.</em></li>\n    <li>Kinh nghiệm: <em>I have been to Japan twice.</em></li>\n</ul>\n<p><strong>Dấu hiệu nhận biết:</strong> already, yet, just, ever, never, since, for, recently...</p>\n\n<h2>Present Perfect Continuous</h2>\n<p><strong>Công thức:</strong> S + have/has been + V-ing + O</p>\n<p><strong>Cách dùng:</strong></p>\n<ul>\n    <li>Hành động bắt đầu trong quá khứ, tiếp tục đến hiện tại và có thể tiếp diễn: <em>She has been studying English for 3 years.</em></li>\n    <li>Nhấn mạnh tính liên tục của hành động: <em>I have been waiting for you for 2 hours.</em></li>\n</ul>\n<p><strong>Dấu hiệu nhận biết:</strong> for, since, all day, all morning...</p>	2026-09-15 20:13:04.108+07	2026-09-15 20:34:39.384+07
\.


--
-- Data for Name: user_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_answers (id, user_id, question_id, user_answer, is_correct, "timestamp", "createdAt", "updatedAt") FROM stdin;
0bdeff0b-1105-4b28-bc7d-a308a94d1bd5	2035856e-827e-491f-954b-f5d8ed89caaf	8a67abe5-6162-441a-8715-5ac9c90477bc	goes	t	2026-09-15 20:42:15.393+07	2026-09-15 20:42:15.393+07	2026-09-15 20:42:15.393+07
f11bea0f-d31c-4369-af49-f6aade8084ab	2035856e-827e-491f-954b-f5d8ed89caaf	a8cd2679-df3e-43b4-94eb-29e747ae47bb	ừ	f	2026-09-15 20:42:15.439+07	2026-09-15 20:42:15.439+07	2026-09-15 20:42:15.439+07
68cf531d-48ff-4104-b87e-916709c33da1	2035856e-827e-491f-954b-f5d8ed89caaf	5c058bef-b80e-4e06-93d0-9a063cfbb002	c	f	2026-09-15 20:42:15.44+07	2026-09-15 20:42:15.441+07	2026-09-15 20:42:15.441+07
08a1ee32-f822-466d-a56f-3f97ecf7fc6f	2035856e-827e-491f-954b-f5d8ed89caaf	8a67abe5-6162-441a-8715-5ac9c90477bc	ừ	f	2026-09-15 20:42:51.073+07	2026-09-15 20:42:51.074+07	2026-09-15 20:42:51.074+07
203074d5-e74e-471d-9634-e05f66532426	2035856e-827e-491f-954b-f5d8ed89caaf	8a67abe5-6162-441a-8715-5ac9c90477bc		f	2026-09-15 20:43:15.794+07	2026-09-15 20:43:15.795+07	2026-09-15 20:43:15.795+07
e77d2850-b532-4342-bca1-8c7273268595	2035856e-827e-491f-954b-f5d8ed89caaf	8036339b-6167-46e1-83c6-f1e323bade13	ừ	f	2026-09-15 20:43:15.841+07	2026-09-15 20:43:15.841+07	2026-09-15 20:43:15.841+07
3b454267-58ac-4db2-a283-4c2544b79c4d	2035856e-827e-491f-954b-f5d8ed89caaf	5c058bef-b80e-4e06-93d0-9a063cfbb002	d	f	2026-10-03 14:21:50.235+07	2026-10-03 14:21:50.236+07	2026-10-03 14:21:50.236+07
9252c8fe-bc6e-4e85-b251-399d3d7fbbe4	2035856e-827e-491f-954b-f5d8ed89caaf	a8cd2679-df3e-43b4-94eb-29e747ae47bb	play	t	2026-10-03 14:21:50.297+07	2026-10-03 14:21:50.297+07	2026-10-03 14:21:50.297+07
49ef96ba-fbcd-46c1-b1a8-a369ac0ec359	2035856e-827e-491f-954b-f5d8ed89caaf	8a67abe5-6162-441a-8715-5ac9c90477bc	goes	t	2026-10-03 14:21:50.299+07	2026-10-03 14:21:50.299+07	2026-10-03 14:21:50.299+07
148877f2-9ad6-4740-b88d-ef340c5b51ed	2035856e-827e-491f-954b-f5d8ed89caaf	8036339b-6167-46e1-83c6-f1e323bade13	watches	t	2026-10-03 14:21:50.301+07	2026-10-03 14:21:50.301+07	2026-10-03 14:21:50.301+07
87c60eea-c78f-47de-b640-d9a707807bbf	2035856e-827e-491f-954b-f5d8ed89caaf	5c058bef-b80e-4e06-93d0-9a063cfbb002	c	f	2026-10-03 14:51:08.122+07	2026-10-03 14:51:08.123+07	2026-10-03 14:51:08.123+07
7fb1bd8f-6127-43aa-9e13-a6c1e9e03a9d	2035856e-827e-491f-954b-f5d8ed89caaf	8a67abe5-6162-441a-8715-5ac9c90477bc	goes	t	2026-10-03 14:51:08.18+07	2026-10-03 14:51:08.18+07	2026-10-03 14:51:08.18+07
fe9a0521-cc92-40bf-9aee-5b6897d9a12e	2035856e-827e-491f-954b-f5d8ed89caaf	a8cd2679-df3e-43b4-94eb-29e747ae47bb	play	t	2026-10-03 14:51:08.182+07	2026-10-03 14:51:08.182+07	2026-10-03 14:51:08.182+07
a9e36ef2-4226-4779-b4c0-e9475d640ee0	2035856e-827e-491f-954b-f5d8ed89caaf	8036339b-6167-46e1-83c6-f1e323bade13	watches	t	2026-10-03 14:51:08.184+07	2026-10-03 14:51:08.184+07	2026-10-03 14:51:08.184+07
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, role, is_premium, premium_expiry, "createdAt", "updatedAt", points, rank, streak, last_active, is_verified, verification_token, reset_password_token, reset_password_expires, google_id) FROM stdin;
6200654a-d3bb-4d0a-ad53-d3e8578ec88c	Huy	nguyenhuy14052024@gmail.com	$2b$10$EUQGeHOQvPj9sJ6nb69XPOgV5rkOL13npwxMQLE7NHDoRp4Ecm5mW	user	f	\N	2026-10-03 15:45:07.481+07	2026-10-03 16:06:22.714+07	0	Bronze	0	2026-10-03 15:45:07.53+07	f	\N	\N	\N	\N
2035856e-827e-491f-954b-f5d8ed89caaf	test	test@gmail.com	$2b$10$1w9bX2.RvhtGdaoMrW3DIudr.eBkFqErJayjgvmdJXg4WcVSJI5em	admin	f	\N	2026-06-22 10:11:12.279+07	2026-10-03 16:06:37.444+07	6	Bronze	1	2026-10-03 16:06:37.444+07	f	\N	255270c22027c6b37757a0f071ac293881e9acb5856cf22af4c1b1c3280004fc	2026-10-03 15:59:09.047+07	\N
\.


--
-- Name: certificates certificates_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key UNIQUE (code);


--
-- Name: certificates certificates_code_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key1 UNIQUE (code);


--
-- Name: certificates certificates_code_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key10 UNIQUE (code);


--
-- Name: certificates certificates_code_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key11 UNIQUE (code);


--
-- Name: certificates certificates_code_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key12 UNIQUE (code);


--
-- Name: certificates certificates_code_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key13 UNIQUE (code);


--
-- Name: certificates certificates_code_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key14 UNIQUE (code);


--
-- Name: certificates certificates_code_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key2 UNIQUE (code);


--
-- Name: certificates certificates_code_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key3 UNIQUE (code);


--
-- Name: certificates certificates_code_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key4 UNIQUE (code);


--
-- Name: certificates certificates_code_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key5 UNIQUE (code);


--
-- Name: certificates certificates_code_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key6 UNIQUE (code);


--
-- Name: certificates certificates_code_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key7 UNIQUE (code);


--
-- Name: certificates certificates_code_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key8 UNIQUE (code);


--
-- Name: certificates certificates_code_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_code_key9 UNIQUE (code);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: dictionary dictionary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_pkey PRIMARY KEY (id);


--
-- Name: dictionary dictionary_word_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key UNIQUE (word);


--
-- Name: dictionary dictionary_word_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key1 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key10 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key11 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key12 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key13 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key14 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key15 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key16 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key17 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key18 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key2 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key3 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key4 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key5 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key6 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key7 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key8 UNIQUE (word);


--
-- Name: dictionary dictionary_word_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_word_key9 UNIQUE (word);


--
-- Name: flashcards flashcards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT flashcards_pkey PRIMARY KEY (id);


--
-- Name: progress progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: user_answers user_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: users users_username_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key1 UNIQUE (username);


--
-- Name: users users_username_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key10 UNIQUE (username);


--
-- Name: users users_username_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key11 UNIQUE (username);


--
-- Name: users users_username_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key12 UNIQUE (username);


--
-- Name: users users_username_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key13 UNIQUE (username);


--
-- Name: users users_username_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key14 UNIQUE (username);


--
-- Name: users users_username_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key15 UNIQUE (username);


--
-- Name: users users_username_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key16 UNIQUE (username);


--
-- Name: users users_username_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key17 UNIQUE (username);


--
-- Name: users users_username_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key18 UNIQUE (username);


--
-- Name: users users_username_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key19 UNIQUE (username);


--
-- Name: users users_username_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key2 UNIQUE (username);


--
-- Name: users users_username_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key20 UNIQUE (username);


--
-- Name: users users_username_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key21 UNIQUE (username);


--
-- Name: users users_username_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key22 UNIQUE (username);


--
-- Name: users users_username_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key23 UNIQUE (username);


--
-- Name: users users_username_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key24 UNIQUE (username);


--
-- Name: users users_username_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key25 UNIQUE (username);


--
-- Name: users users_username_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key26 UNIQUE (username);


--
-- Name: users users_username_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key27 UNIQUE (username);


--
-- Name: users users_username_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key28 UNIQUE (username);


--
-- Name: users users_username_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key29 UNIQUE (username);


--
-- Name: users users_username_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key3 UNIQUE (username);


--
-- Name: users users_username_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key30 UNIQUE (username);


--
-- Name: users users_username_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key31 UNIQUE (username);


--
-- Name: users users_username_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key32 UNIQUE (username);


--
-- Name: users users_username_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key33 UNIQUE (username);


--
-- Name: users users_username_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key34 UNIQUE (username);


--
-- Name: users users_username_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key35 UNIQUE (username);


--
-- Name: users users_username_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key36 UNIQUE (username);


--
-- Name: users users_username_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key37 UNIQUE (username);


--
-- Name: users users_username_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key38 UNIQUE (username);


--
-- Name: users users_username_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key39 UNIQUE (username);


--
-- Name: users users_username_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key4 UNIQUE (username);


--
-- Name: users users_username_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key40 UNIQUE (username);


--
-- Name: users users_username_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key41 UNIQUE (username);


--
-- Name: users users_username_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key42 UNIQUE (username);


--
-- Name: users users_username_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key43 UNIQUE (username);


--
-- Name: users users_username_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key44 UNIQUE (username);


--
-- Name: users users_username_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key45 UNIQUE (username);


--
-- Name: users users_username_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key46 UNIQUE (username);


--
-- Name: users users_username_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key47 UNIQUE (username);


--
-- Name: users users_username_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key48 UNIQUE (username);


--
-- Name: users users_username_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key49 UNIQUE (username);


--
-- Name: users users_username_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key5 UNIQUE (username);


--
-- Name: users users_username_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key50 UNIQUE (username);


--
-- Name: users users_username_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key51 UNIQUE (username);


--
-- Name: users users_username_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key52 UNIQUE (username);


--
-- Name: users users_username_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key53 UNIQUE (username);


--
-- Name: users users_username_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key54 UNIQUE (username);


--
-- Name: users users_username_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key55 UNIQUE (username);


--
-- Name: users users_username_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key56 UNIQUE (username);


--
-- Name: users users_username_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key57 UNIQUE (username);


--
-- Name: users users_username_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key6 UNIQUE (username);


--
-- Name: users users_username_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key7 UNIQUE (username);


--
-- Name: users users_username_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key8 UNIQUE (username);


--
-- Name: users users_username_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key9 UNIQUE (username);


--
-- Name: certificates certificates_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: flashcards flashcards_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT flashcards_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: flashcards flashcards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flashcards
    ADD CONSTRAINT flashcards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: progress progress_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: progress progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: questions questions_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_answers user_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_answers user_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_answers
    ADD CONSTRAINT user_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 7x1pL8IzAPXnyVrXKvj87k6T5Hmrtq3Tn2DmdaIldNfLZvWVKjl4iodOSuf41ab

