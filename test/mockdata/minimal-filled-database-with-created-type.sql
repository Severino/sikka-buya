--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_user (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password character varying,
    super boolean
);


--
-- Name: app_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.app_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: app_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id;


--
-- Name: coin_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coin_marks (
    id integer NOT NULL,
    name character varying
);


--
-- Name: coin_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coin_marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coin_marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coin_marks_id_seq OWNED BY public.coin_marks.id;


--
-- Name: comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    text character varying(40),
    property character varying(200),
    property_id integer,
    "time" timestamp without time zone DEFAULT now(),
    user_id integer
);


--
-- Name: dynasty; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dynasty (
    id integer NOT NULL,
    name character varying
);


--
-- Name: dynasty_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dynasty_id_seq
    AS integer
    START WITH 10
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dynasty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dynasty_id_seq OWNED BY public.dynasty.id;


--
-- Name: honorific; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.honorific (
    id integer NOT NULL,
    name character varying
);


--
-- Name: honorific_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.honorific_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: honorific_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.honorific_id_seq OWNED BY public.honorific.id;


--
-- Name: issuer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issuer (
    id integer NOT NULL,
    type integer,
    person integer
);


--
-- Name: issuer_honorifics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issuer_honorifics (
    issuer integer,
    honorific integer
);


--
-- Name: issuer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.issuer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: issuer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.issuer_id_seq OWNED BY public.issuer.id;


--
-- Name: issuer_titles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issuer_titles (
    issuer integer,
    title integer
);


--
-- Name: material; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.material (
    id integer NOT NULL,
    name character varying
);


--
-- Name: material_color; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.material_color (
    material integer,
    color character(7)
);


--
-- Name: material_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: mint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mint (
    id integer NOT NULL,
    name character varying,
    unsafe boolean,
    location public.geometry,
    uncertain boolean,
    uncertain_area public.geometry,
    province integer
);


--
-- Name: mint_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mint_id_seq OWNED BY public.mint.id;


--
-- Name: nominal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nominal (
    id integer NOT NULL,
    name character varying
);


--
-- Name: nominal_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nominal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nominal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nominal_id_seq OWNED BY public.nominal.id;


--
-- Name: note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note (
    text text,
    property character varying(40),
    property_id integer
);


--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.comment.id;


--
-- Name: other_person; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.other_person (
    type integer,
    person integer
);


--
-- Name: overlord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.overlord (
    id integer NOT NULL,
    rank integer,
    type integer,
    person integer
);


--
-- Name: overlord_honorifics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.overlord_honorifics (
    overlord_id integer,
    honorific_id integer
);


--
-- Name: overlord_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.overlord_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: overlord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.overlord_id_seq OWNED BY public.overlord.id;


--
-- Name: overlord_titles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.overlord_titles (
    overlord_id integer,
    title_id integer
);


--
-- Name: person; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person (
    id integer NOT NULL,
    name character varying,
    role_legacy character varying,
    dynasty integer,
    short_name character varying,
    role integer
);


--
-- Name: person_color; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_color (
    person integer NOT NULL,
    color character(7)
);


--
-- Name: person_explorer_custom_sorting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_explorer_custom_sorting (
    "position" integer,
    person integer
);


--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: person_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_role (
    id integer NOT NULL,
    name character varying
);


--
-- Name: person_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.person_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: person_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.person_role_id_seq OWNED BY public.person_role.id;


--
-- Name: piece; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.piece (
    id integer NOT NULL,
    piece character varying,
    type integer
);


--
-- Name: piece_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.piece_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: piece_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.piece_id_seq OWNED BY public.piece.id;


--
-- Name: province; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.province (
    id integer NOT NULL,
    name character varying(40)
);


--
-- Name: province_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.province_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.province_id_seq OWNED BY public.province.id;


--
-- Name: title; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.title (
    id integer NOT NULL,
    name character varying
);


--
-- Name: title_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.title_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.title_id_seq OWNED BY public.title.id;


--
-- Name: type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type (
    id integer NOT NULL,
    project_id character varying,
    treadwell_id character varying,
    material integer,
    mint integer,
    mint_as_on_coin character varying,
    nominal integer,
    year_of_mint character varying,
    donativ boolean,
    procedure character varying,
    caliph integer,
    front_side_field_text character varying,
    front_side_inner_inscript character varying,
    front_side_intermediate_inscript character varying,
    front_side_outer_inscript character varying,
    front_side_misc character varying,
    back_side_field_text character varying,
    back_side_inner_inscript character varying,
    back_side_intermediate_inscript character varying,
    back_side_outer_inscript character varying,
    back_side_misc character varying,
    cursive_script boolean,
    isolated_characters character varying,
    literature character varying,
    specials character varying,
    exclude_from_type_catalogue boolean DEFAULT false,
    exclude_from_map_app boolean DEFAULT false,
    internal_notes character varying DEFAULT ''::character varying,
    mint_uncertain boolean,
    year_uncertain boolean,
    plain_text text,
    search_vectors tsvector
);


--
-- Name: type_coin_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_coin_marks (
    type integer,
    coin_mark integer
);


--
-- Name: type_completed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_completed (
    type integer NOT NULL
);


--
-- Name: type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.type_id_seq OWNED BY public.type.id;


--
-- Name: type_reviewed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_reviewed (
    type integer NOT NULL
);


--
-- Name: app_user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass);


--
-- Name: coin_marks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_marks ALTER COLUMN id SET DEFAULT nextval('public.coin_marks_id_seq'::regclass);


--
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: dynasty id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dynasty ALTER COLUMN id SET DEFAULT nextval('public.dynasty_id_seq'::regclass);


--
-- Name: honorific id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.honorific ALTER COLUMN id SET DEFAULT nextval('public.honorific_id_seq'::regclass);


--
-- Name: issuer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer ALTER COLUMN id SET DEFAULT nextval('public.issuer_id_seq'::regclass);


--
-- Name: material id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: mint id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mint ALTER COLUMN id SET DEFAULT nextval('public.mint_id_seq'::regclass);


--
-- Name: nominal id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nominal ALTER COLUMN id SET DEFAULT nextval('public.nominal_id_seq'::regclass);


--
-- Name: overlord id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord ALTER COLUMN id SET DEFAULT nextval('public.overlord_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Name: person_role id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_role ALTER COLUMN id SET DEFAULT nextval('public.person_role_id_seq'::regclass);


--
-- Name: piece id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.piece ALTER COLUMN id SET DEFAULT nextval('public.piece_id_seq'::regclass);


--
-- Name: province id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.province ALTER COLUMN id SET DEFAULT nextval('public.province_id_seq'::regclass);


--
-- Name: title id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.title ALTER COLUMN id SET DEFAULT nextval('public.title_id_seq'::regclass);


--
-- Name: type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type ALTER COLUMN id SET DEFAULT nextval('public.type_id_seq'::regclass);


--
-- Data for Name: app_user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.app_user VALUES (1, NULL, 'admin@sikka-buya.de', '$2b$10$67jHE8fkL/h4qXC7tVldTeNVB3XwnrCi1srM/OV88JQzjp9w2QPYG', true);


--
-- Data for Name: coin_marks; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.coin_marks VALUES (1, 'drei Punkte (∴)');
INSERT INTO public.coin_marks VALUES (2, 'bāʾ/tāʾ/ṯāʾ');


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: dynasty; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dynasty VALUES (1, 'Būyide');
INSERT INTO public.dynasty VALUES (2, 'ʿAbbāside');


--
-- Data for Name: honorific; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.honorific VALUES (1, '… ad-Daula');
INSERT INTO public.honorific VALUES (3, '… al-Mulūk');


--
-- Data for Name: issuer; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.issuer VALUES (5, 4, 1);
INSERT INTO public.issuer VALUES (6, 4, 2);
INSERT INTO public.issuer VALUES (7, 5, 4);
INSERT INTO public.issuer VALUES (8, 5, 5);


--
-- Data for Name: issuer_honorifics; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.issuer_honorifics VALUES (5, 1);
INSERT INTO public.issuer_honorifics VALUES (5, 3);
INSERT INTO public.issuer_honorifics VALUES (7, 1);
INSERT INTO public.issuer_honorifics VALUES (7, 3);
INSERT INTO public.issuer_honorifics VALUES (8, 1);


--
-- Data for Name: issuer_titles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.issuer_titles VALUES (5, 2);
INSERT INTO public.issuer_titles VALUES (6, 1);
INSERT INTO public.issuer_titles VALUES (7, 1);
INSERT INTO public.issuer_titles VALUES (7, 2);
INSERT INTO public.issuer_titles VALUES (8, 1);


--
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.material VALUES (1, 'Gold');
INSERT INTO public.material VALUES (2, 'Silber');


--
-- Data for Name: material_color; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.material_color VALUES (1, '#FFD700');
INSERT INTO public.material_color VALUES (2, '#C0C0C0');


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: mint; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.mint VALUES (2, 'Fārs', NULL, '0101000020E61000003DA5E1CE97B93A4018F503BEEBF14A40', true, '0103000020E610000001000000060000002618CCAC492C3B4056A241FD8F914A4073B1F122F3B03B404265E8E14C394B402618CCAC492C3B4042B327E31BCD4B4063F47559B6C13A40A6CE92AC69D54B40C0F92F4709703A405697207F466F4B40A9671CCD01A73A407873C2C232C94A40', 1);
INSERT INTO public.mint VALUES (1, 'Šīrāz', NULL, '0101000020E6100000E9BACF750A963D40809730D2FF4A4A40', false, '0103000020E610000000000000', 1);


--
-- Data for Name: nominal; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.nominal VALUES (1, 'Dinar');
INSERT INTO public.nominal VALUES (2, 'Ruknī-Dinar');


--
-- Data for Name: note; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.note VALUES ('', 'mint', 2);
INSERT INTO public.note VALUES ('älteste Moschee (Saffaridenzeit)', 'mint', 1);


--
-- Data for Name: other_person; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.other_person VALUES (5, 6);
INSERT INTO public.other_person VALUES (5, 6);


--
-- Data for Name: overlord; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.overlord VALUES (1, 1, 5, 1);
INSERT INTO public.overlord VALUES (2, 2, 5, 2);
INSERT INTO public.overlord VALUES (3, 3, 5, 4);


--
-- Data for Name: overlord_honorifics; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.overlord_honorifics VALUES (1, 3);
INSERT INTO public.overlord_honorifics VALUES (1, 1);
INSERT INTO public.overlord_honorifics VALUES (3, 1);
INSERT INTO public.overlord_honorifics VALUES (3, 3);


--
-- Data for Name: overlord_titles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.overlord_titles VALUES (1, 2);
INSERT INTO public.overlord_titles VALUES (1, 1);
INSERT INTO public.overlord_titles VALUES (2, 1);
INSERT INTO public.overlord_titles VALUES (2, 2);


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.person VALUES (1, 'Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya', NULL, 1, 'Rukn ad-Daula', NULL);
INSERT INTO public.person VALUES (2, 'Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz', NULL, NULL, 'Sulṭān ad-Daula', NULL);
INSERT INTO public.person VALUES (3, 'al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir', NULL, 2, 'al-Muṭīʿ', 5);
INSERT INTO public.person VALUES (4, 'ʿIzz ad-Daula Abū Manṣūr Baḫtiyār b. Muʿizz ad-Daula Aḥmad', NULL, 1, 'ʿIzz ad-Daula', NULL);
INSERT INTO public.person VALUES (5, 'ʿUmdat ad-Daula Abū Isḥāq Ibrāhīm b. Muʿizz ad-Daula Aḥmad', NULL, 1, 'ʿUmdat ad-Daula', NULL);
INSERT INTO public.person VALUES (6, 'Abu ’l-Ḥasan Muḥammad b. al-Mustakfī', NULL, 2, 'Abu ’l-Ḥasan b. al-Mustakfī', 3);
INSERT INTO public.person VALUES (7, 'al-Qādir bi-᾽llāh, Abu ᾽l-ʿAbbās Aḥmad b. Isḥāq', null, 2, 'al-Qādir', 5);


--
-- Data for Name: person_color; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.person_color VALUES (1, '#ff00ff');
INSERT INTO public.person_color VALUES (2, '#00ffff');
INSERT INTO public.person_color VALUES (3, '#ffff00');
INSERT INTO public.person_color VALUES (4, '#d14a46');
INSERT INTO public.person_color VALUES (5, '#ffa953');


--
-- Data for Name: person_explorer_custom_sorting; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: person_role; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.person_role VALUES (3, 'heir');
INSERT INTO public.person_role VALUES (4, 'cutter');
INSERT INTO public.person_role VALUES (5, 'caliph');


--
-- Data for Name: piece; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.piece VALUES (5, 'https://www.zeno.ru/showphoto.php?photo=139208', 4);
INSERT INTO public.piece VALUES (6, 'https://www.zeno.ru/showphoto.php?photo=40340', 4);
INSERT INTO public.piece VALUES (7, 'https://www.fint-ikmk.uni-tuebingen.de/ikmk/object?lang=de&id=ID92', 5);
INSERT INTO public.piece VALUES (8, 'https://www.fint-ikmk.uni-tuebingen.de/ikmk/object?lang=de&id=ID81', 5);


--
-- Data for Name: province; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.province VALUES (1, 'Fārs');
INSERT INTO public.province VALUES (3, 'ʿUmān');
INSERT INTO public.province VALUES (10, 'Ḫūzistān');


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: title; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.title VALUES (1, 'malik');
INSERT INTO public.title VALUES (2, 'šāhānšāh');


--
-- Data for Name: type; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.type VALUES (4, 'Šīr389', 's-389', 2, 1, 'Šīrāz', 1, '389', true, 'cast', 3, '<div style="text-align: center;">لا إله إلا الله</div><div style="text-align: center;">وحده لا شريك له</div>', '<div style="text-align: left;"><b>aaaa</b></div>', '<div style="text-align: right;"><i>bb</i></div>', '<div style="text-align: center;">بسم الله ضرب هذا الدرهم بشيراز سنة تسع وثمانين وثلثمائة<br></div>', '<div style="text-align: center;"><b><i>CCC</i></b></div>', '<div style="text-align: center;">محمد رسول الله</div><div style="text-align: left;"><font color="#808080"><span></span></font></div>', '<div style="text-align: center;"><i>2</i><br></div><div style="text-align: center;"><i>2</i></div><div style="text-align: center;"><i>2</i></div>', '<div style="text-align: right;"><b>3</b></div>', '<div style="text-align: center;">محمد رسول الله + Koran 9:33</div><div style="text-align: center;"></div>', '<div style="text-align: center;">5</div>', true, NULL, '<div style="text-align: center;"><br></div>', 'Im Av.-Feld unten zwei Punkte.

Av.-Randzier: Perlkreis, daran außen vier (?) Ringe, in denen jeweils ein Ringlein sitzt (⊚). Rev.-Feldbegrenzung: Perlkreis.<div><b></b></div>', false, false, '<div style="text-align: center;">FINT 2010-6-33
https://www.fint-ikmk.uni-tuebingen.de/ikmk/mk-edit/mk_object_seiten.php?id=66

muss suchen Nur und Husam ad-Dawala Siraz 389H. ?<br></div>', true, true, 'Šīr389
<h3>material</h3>Silber
<h3>nominal</h3>Dinar
<h3>Av. Feld</h3><div style="text-align: center;">لا إله إلا الله</div><div style="text-align: center;">وحده لا شريك له</div>
<h3>Av. innere Umschrift</h3><div style="text-align: left;"><b>aaaa</b></div>
<h3>Av. mittlere Umschrift</h3><div style="text-align: right;"><i>bb</i></div>
<h3>Av. äußere Umschrift</h3><div style="text-align: center;">بسم الله ضرب هذا الدرهم بشيراز سنة تسع وثمانين وثلثمائة<br></div>
<h3>Av. Randbeschriftung</h3><div style="text-align: center;"><b><i>CCC</i></b></div>
<h3>Rev. Feld</h3><div style="text-align: center;">محمد رسول الله</div><div style="text-align: left;"><font color="#808080"><span></span></font></div>
<h3>Rev. innere Umschrift</h3><div style="text-align: center;"><i>2</i><br></div><div style="text-align: center;"><i>2</i></div><div style="text-align: center;"><i>2</i></div>
<h3>Rev. mittlere Umschrift</h3><div style="text-align: right;"><b>3</b></div>
<h3>Rev. äußere Umschrift</h3><div style="text-align: center;">محمد رسول الله + Koran 9:33</div><div style="text-align: center;"></div>
<h3>Rev. Randbeschriftung</h3><div style="text-align: center;">5</div>
<h3>Besonderheiten/Varianten</h3>Im Av.-Feld unten zwei Punkte.

Av.-Randzier: Perlkreis, daran außen vier (?) Ringe, in denen jeweils ein Ringlein sitzt (⊚). Rev.-Feldbegrenzung: Perlkreis.<div><b></b></div>', '''2'':46,47,48 ''3'':52 ''33'':61 ''5'':64 ''9'':60 ''aaaa'':17 ''auss'':23,54,76 ''av'':4,14,18,22,35,67,72 ''bb'':21 ''besonderheiten/varianten'':65 ''ccc'':37 ''daran'':75 ''den'':80 ''feld'':5,39,68 ''feldbegrenz'':86 ''inn'':15,44 ''jeweil'':81 ''koran'':59 ''material'':2 ''mittl'':19,50 ''perlkreis'':74,87 ''punkt'':71 ''randbeschrift'':36,63 ''randzi'':73 ''rev'':38,43,49,53,62,85 ''ring'':78 ''ringlein'':83 ''silb'':3 ''sitzt'':84 ''umschrift'':16,20,24,45,51,55 ''unt'':69 ''vier'':77 ''zwei'':70 ''šīr389'':1 ''إلا'':8 ''إله'':7 ''الدرهم'':29 ''الله'':9,26,42,58 ''بسم'':25 ''بشيراز'':30 ''تسع'':32 ''رسول'':41,57 ''سنة'':31 ''شريك'':12 ''ضرب'':27 ''لا'':6,11 ''له'':13 ''محمد'':40,56 ''هذا'':28 ''وثلثمائة'':34 ''وثمانين'':33 ''وحده'':10');
INSERT INTO public.type VALUES (5, 'Fārs365Ga', 'tFā365', 1, 2, 'Fāahrs', 2, '365', true, 'cast', 7, '<div style="text-align: center;">ح</div><div style="text-align: center;">لا إله إلا الله</div><div style="text-align: center;">بويه</div>', '<div style="text-align: center;">خمس وستين وثلثمائة</div>', '<div style="text-align: center;">اَنَا اللّٰہُ اَعلَمُ: میں اللہ</div><div style="text-align: center;">اہل روم مغل گئے۔</div>', '<div style="text-align: center;">Koran 30:4‒5</div><div style="text-align: center;">قریب کی زمین میں۔ے۔</div><div style="text-align: center;">تبھی اور</div>', '<div style="text-align: center;">Stern in Mitte</div><div style="text-align: center;">ب کئے گئے۔</div>', '<div style="text-align: center;">لله</div><div style="text-align: center;">محمد رسول الله</div>', '<div style="text-align: center;">محمد رسول + Koran 9:33</div><div style="text-align: center;">اللہ کے نام کے</div>', '<div style="text-align: center;">عذاب آ جائے۔</div><div style="text-align: center;">اپنی قوم کو ڈرا - Koran 71:1</div>', '<div style="text-align: center;">اُس نے کہا۔</div><div style="text-align: center;">second row</div>', '<div style="text-align: center;">He said, ‘O my people!</div>', true, NULL, '<div style="text-align: center;">Besondere Zeichen</div><div style="text-align: center;">#+-!"§$%&amp;/()=?</div>', '<div>Av. extraordinary</div><div><br></div><div>Rev. unusual line:&nbsp; لئے والا ہوں۔</div>', true, true, '<div style="text-align: center;">Diese Zeichen können verwendet werden</div><div style="text-align: center;">#+-!"§$%&amp;/()=?</div>', true, true, 'Fārs365Ga
<h3>Av. Feld</h3><div style="text-align: center;">ح</div><div style="text-align: center;">لا إله إلا الله</div><div style="text-align: center;">بويه</div>
<h3>Av. innere Umschrift</h3><div style="text-align: center;">خمس وستين وثلثمائة</div>
<h3>Av. mittlere Umschrift</h3><div style="text-align: center;">اَنَا اللّٰہُ اَعلَمُ: میں اللہ</div><div style="text-align: center;">اہل روم مغل گئے۔</div>
<h3>Av. äußere Umschrift</h3><div style="text-align: center;">Koran 30:4‒5</div><div style="text-align: center;">قریب کی زمین میں۔ے۔</div><div style="text-align: center;">تبھی اور</div>
<h3>Av. Randbeschriftung</h3><div style="text-align: center;">Stern in Mitte</div><div style="text-align: center;">ب کئے گئے۔</div>
<h3>Rev. Feld</h3><div style="text-align: center;">لله</div><div style="text-align: center;">محمد رسول الله</div>
<h3>Rev. innere Umschrift</h3><div style="text-align: center;">محمد رسول + Koran 9:33</div><div style="text-align: center;">اللہ کے نام کے</div>
<h3>Rev. mittlere Umschrift</h3><div style="text-align: center;">عذاب آ جائے۔</div><div style="text-align: center;">اپنی قوم کو ڈرا - Koran 71:1</div>
<h3>Rev. äußere Umschrift</h3><div style="text-align: center;">اُس نے کہا۔</div><div style="text-align: center;">second row</div>
<h3>Rev. Randbeschriftung</h3><div style="text-align: center;">He said, ‘O my people!</div>
<h3>Literatur & Anmerkungen</h3><div style="text-align: center;">Besondere Zeichen</div><div style="text-align: center;">#+-!"§$%&amp;/()=?</div>
<h3>Besonderheiten/Varianten</h3><div>Av. extraordinary</div><div><br></div><div>Rev. unusual line:&nbsp; لئے والا ہوں۔</div>', '''1'':80 ''30'':32 ''33'':63 ''4'':33 ''5'':34 ''71'':79 ''9'':62 ''anmerk'':97 ''auss'':29,82 ''av'':2,10,16,28,42,101 ''besond'':98 ''besonderheiten/varianten'':100 ''extraordinary'':102 ''feld'':3,51 ''fārs365ga'':1 ''he'':91 ''inn'':11,57 ''koran'':31,61,78 ''lin'':105 ''literatur'':96 ''mitt'':46 ''mittl'':17,69 ''my'':94 ''o'':93 ''peopl'':95 ''randbeschrift'':43,90 ''rev'':50,56,68,81,89,103 ''row'':88 ''said'':92 ''second'':87 ''stern'':44 ''umschrift'':12,18,30,58,70,83 ''unusual'':104 ''zeich'':99 ''آ'':72 ''إلا'':7 ''إله'':6 ''الله'':8,55 ''اللّٰہُ'':20 ''اللہ'':23,64 ''اور'':41 ''اَعلَمُ'':21 ''اَنَا'':19 ''اُس'':84 ''اپنی'':74 ''اہل'':24 ''ب'':47 ''بويه'':9 ''تبھی'':40 ''جائے'':73 ''ح'':4 ''خمس'':13 ''رسول'':54,60 ''روم'':25 ''زمین'':37 ''عذاب'':71 ''قریب'':35 ''قوم'':75 ''لئے'':106 ''لا'':5 ''لله'':52 ''محمد'':53,59 ''مغل'':26 ''میں'':22,38 ''نام'':66 ''نے'':85 ''والا'':107 ''وثلثمائة'':15 ''وستين'':14 ''ڈرا'':77 ''کئے'':48 ''کو'':76 ''کہا'':86 ''کی'':36 ''کے'':65,67 ''گئے'':27,49 ''ہوں'':108 ''ے'':39');


--
-- Data for Name: type_coin_marks; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.type_coin_marks VALUES (4, 1);
INSERT INTO public.type_coin_marks VALUES (4, 2);
INSERT INTO public.type_coin_marks VALUES (5, 2);
INSERT INTO public.type_coin_marks VALUES (5, 1);


--
-- Data for Name: type_completed; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: type_reviewed; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: app_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.app_user_id_seq', 1, true);


--
-- Name: coin_marks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coin_marks_id_seq', 2, true);


--
-- Name: dynasty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dynasty_id_seq', 2, true);


--
-- Name: honorific_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.honorific_id_seq', 3, true);


--
-- Name: issuer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.issuer_id_seq', 8, true);


--
-- Name: material_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.material_id_seq', 2, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: mint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mint_id_seq', 2, true);


--
-- Name: nominal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nominal_id_seq', 2, true);


--
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notes_id_seq', 1, false);


--
-- Name: overlord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.overlord_id_seq', 3, true);


--
-- Name: person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.person_id_seq', 7, true);


--
-- Name: person_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.person_role_id_seq', 5, true);


--
-- Name: piece_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.piece_id_seq', 8, true);


--
-- Name: province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.province_id_seq', 10, true);


--
-- Name: title_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.title_id_seq', 2, true);


--
-- Name: type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.type_id_seq', 5, true);


--
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- Name: app_user app_user_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_name_key UNIQUE (name);


--
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- Name: coin_marks coin_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_marks
    ADD CONSTRAINT coin_marks_pkey PRIMARY KEY (id);


--
-- Name: dynasty dynasty_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_name_key UNIQUE (name);


--
-- Name: dynasty dynasty_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_pkey PRIMARY KEY (id);


--
-- Name: honorific honorific_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.honorific
    ADD CONSTRAINT honorific_pkey PRIMARY KEY (id);


--
-- Name: issuer issuer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_pkey PRIMARY KEY (id);


--
-- Name: material_color material_color_material_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_color
    ADD CONSTRAINT material_color_material_key UNIQUE (material);


--
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: mint mint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT mint_pkey PRIMARY KEY (id);


--
-- Name: nominal nominal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nominal
    ADD CONSTRAINT nominal_pkey PRIMARY KEY (id);


--
-- Name: note note_property_property_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_property_property_id_key UNIQUE (property, property_id);


--
-- Name: comment notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: comment notes_text_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_text_key UNIQUE (text);


--
-- Name: overlord overlord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_pkey PRIMARY KEY (id);


--
-- Name: person_color person_color_person_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_key UNIQUE (person);


--
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_key UNIQUE (person);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: person_role person_role_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_name_key UNIQUE (name);


--
-- Name: person_role person_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_pkey PRIMARY KEY (id);


--
-- Name: piece piece_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_pkey PRIMARY KEY (id);


--
-- Name: province province_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_name_key UNIQUE (name);


--
-- Name: province province_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pkey PRIMARY KEY (id);


--
-- Name: title title_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.title
    ADD CONSTRAINT title_pkey PRIMARY KEY (id);


--
-- Name: type_completed type_completed_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_key UNIQUE (type);


--
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (id);


--
-- Name: type type_project_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_project_id_key UNIQUE (project_id);


--
-- Name: type_reviewed type_reviewed_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_key UNIQUE (type);


--
-- Name: idx_search_vectors; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_vectors ON public.type USING gin (search_vectors);


--
-- Name: type_coin_marks cmt_coin_mark_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_coin_mark_fk FOREIGN KEY (coin_mark) REFERENCES public.coin_marks(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: type_coin_marks cmt_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mint fk_province; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT fk_province FOREIGN KEY (province) REFERENCES public.province(id);


--
-- Name: issuer_honorifics ih_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_honorific_fk FOREIGN KEY (honorific) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: issuer_honorifics ih_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: issuer issuer_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: issuer issuer_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: issuer_titles it_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: issuer_titles it_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_title_fk FOREIGN KEY (title) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: material_color material_color_material_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_color
    ADD CONSTRAINT material_color_material_fkey FOREIGN KEY (material) REFERENCES public.material(id) ON DELETE CASCADE;


--
-- Name: overlord_honorifics oh_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_honorific_fk FOREIGN KEY (honorific_id) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: overlord_honorifics oh_overlord_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_overlord_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: other_person other_person_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: other_person other_person_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: overlord_titles overlord_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_honorific_fk FOREIGN KEY (title_id) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: overlord overlord_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: overlord_titles overlord_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_title_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: overlord overlord_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: person_color person_color_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_fkey FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: person person_dynasty_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_dynasty_fk FOREIGN KEY (dynasty) REFERENCES public.dynasty(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_fkey FOREIGN KEY (person) REFERENCES public.person(id);


--
-- Name: person person_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_role_fk FOREIGN KEY (role) REFERENCES public.person_role(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: piece piece_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: type_completed type_completed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: type type_material_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_material_fk FOREIGN KEY (material) REFERENCES public.material(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type type_mint_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_mint_fk FOREIGN KEY (mint) REFERENCES public.mint(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type type_nominal_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_nominal_fk FOREIGN KEY (nominal) REFERENCES public.nominal(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type type_person_caliph_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_person_caliph_fk FOREIGN KEY (caliph) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type_reviewed type_reviewed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

