--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

-- Started on 2022-11-25 15:40:02

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
-- TOC entry 3 (class 3079 OID 837202)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4199 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- TOC entry 2 (class 3079 OID 838218)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 4200 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 207 (class 1259 OID 838225)
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
-- TOC entry 208 (class 1259 OID 838231)
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
-- TOC entry 4201 (class 0 OID 0)
-- Dependencies: 208
-- Name: app_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id;


--
-- TOC entry 209 (class 1259 OID 838233)
-- Name: coin_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coin_marks (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 210 (class 1259 OID 838239)
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
-- TOC entry 4202 (class 0 OID 0)
-- Dependencies: 210
-- Name: coin_marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coin_marks_id_seq OWNED BY public.coin_marks.id;


--
-- TOC entry 211 (class 1259 OID 838241)
-- Name: coin_verse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coin_verse (
    id integer NOT NULL,
    name text
);


--
-- TOC entry 212 (class 1259 OID 838247)
-- Name: coin_verse_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coin_verse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4203 (class 0 OID 0)
-- Dependencies: 212
-- Name: coin_verse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coin_verse_id_seq OWNED BY public.coin_verse.id;


--
-- TOC entry 213 (class 1259 OID 838249)
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
-- TOC entry 214 (class 1259 OID 838253)
-- Name: dynasty; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dynasty (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 215 (class 1259 OID 838259)
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
-- TOC entry 4204 (class 0 OID 0)
-- Dependencies: 215
-- Name: dynasty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dynasty_id_seq OWNED BY public.dynasty.id;


--
-- TOC entry 216 (class 1259 OID 838261)
-- Name: honorific; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.honorific (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 217 (class 1259 OID 838267)
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
-- TOC entry 4205 (class 0 OID 0)
-- Dependencies: 217
-- Name: honorific_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.honorific_id_seq OWNED BY public.honorific.id;


--
-- TOC entry 218 (class 1259 OID 838269)
-- Name: issuer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issuer (
    id integer NOT NULL,
    type integer,
    person integer
);


--
-- TOC entry 219 (class 1259 OID 838272)
-- Name: issuer_honorifics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issuer_honorifics (
    issuer integer,
    honorific integer
);


--
-- TOC entry 220 (class 1259 OID 838275)
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
-- TOC entry 4206 (class 0 OID 0)
-- Dependencies: 220
-- Name: issuer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.issuer_id_seq OWNED BY public.issuer.id;


--
-- TOC entry 221 (class 1259 OID 838277)
-- Name: issuer_titles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.issuer_titles (
    issuer integer,
    title integer
);


--
-- TOC entry 222 (class 1259 OID 838280)
-- Name: material; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.material (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 223 (class 1259 OID 838286)
-- Name: material_color; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.material_color (
    material integer,
    color character(7)
);


--
-- TOC entry 224 (class 1259 OID 838289)
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
-- TOC entry 4207 (class 0 OID 0)
-- Dependencies: 224
-- Name: material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
-- TOC entry 225 (class 1259 OID 838291)
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 838294)
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
-- TOC entry 4208 (class 0 OID 0)
-- Dependencies: 226
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 227 (class 1259 OID 838296)
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
-- TOC entry 228 (class 1259 OID 838302)
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
-- TOC entry 4209 (class 0 OID 0)
-- Dependencies: 228
-- Name: mint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mint_id_seq OWNED BY public.mint.id;


--
-- TOC entry 229 (class 1259 OID 838304)
-- Name: nominal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nominal (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 230 (class 1259 OID 838310)
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
-- TOC entry 4210 (class 0 OID 0)
-- Dependencies: 230
-- Name: nominal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nominal_id_seq OWNED BY public.nominal.id;


--
-- TOC entry 231 (class 1259 OID 838312)
-- Name: note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.note (
    text text,
    property character varying(40),
    property_id integer
);


--
-- TOC entry 232 (class 1259 OID 838318)
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
-- TOC entry 4211 (class 0 OID 0)
-- Dependencies: 232
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.comment.id;


--
-- TOC entry 233 (class 1259 OID 838320)
-- Name: other_person; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.other_person (
    type integer,
    person integer
);


--
-- TOC entry 234 (class 1259 OID 838323)
-- Name: overlord; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.overlord (
    id integer NOT NULL,
    rank integer,
    type integer,
    person integer
);


--
-- TOC entry 235 (class 1259 OID 838326)
-- Name: overlord_honorifics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.overlord_honorifics (
    overlord_id integer,
    honorific_id integer
);


--
-- TOC entry 236 (class 1259 OID 838329)
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
-- TOC entry 4212 (class 0 OID 0)
-- Dependencies: 236
-- Name: overlord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.overlord_id_seq OWNED BY public.overlord.id;


--
-- TOC entry 237 (class 1259 OID 838331)
-- Name: overlord_titles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.overlord_titles (
    overlord_id integer,
    title_id integer
);


--
-- TOC entry 238 (class 1259 OID 838334)
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
-- TOC entry 239 (class 1259 OID 838340)
-- Name: person_color; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_color (
    person integer NOT NULL,
    color character(7)
);


--
-- TOC entry 240 (class 1259 OID 838343)
-- Name: person_explorer_custom_sorting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_explorer_custom_sorting (
    "position" integer,
    person integer
);


--
-- TOC entry 241 (class 1259 OID 838346)
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
-- TOC entry 4213 (class 0 OID 0)
-- Dependencies: 241
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- TOC entry 242 (class 1259 OID 838348)
-- Name: person_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.person_role (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 243 (class 1259 OID 838354)
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
-- TOC entry 4214 (class 0 OID 0)
-- Dependencies: 243
-- Name: person_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.person_role_id_seq OWNED BY public.person_role.id;


--
-- TOC entry 244 (class 1259 OID 838356)
-- Name: piece; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.piece (
    id integer NOT NULL,
    piece character varying,
    type integer
);


--
-- TOC entry 245 (class 1259 OID 838362)
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
-- TOC entry 4215 (class 0 OID 0)
-- Dependencies: 245
-- Name: piece_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.piece_id_seq OWNED BY public.piece.id;


--
-- TOC entry 246 (class 1259 OID 838364)
-- Name: province; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.province (
    id integer NOT NULL,
    name character varying(40)
);


--
-- TOC entry 247 (class 1259 OID 838367)
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
-- TOC entry 4216 (class 0 OID 0)
-- Dependencies: 247
-- Name: province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.province_id_seq OWNED BY public.province.id;


--
-- TOC entry 248 (class 1259 OID 838369)
-- Name: title; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.title (
    id integer NOT NULL,
    name character varying
);


--
-- TOC entry 249 (class 1259 OID 838375)
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
-- TOC entry 4217 (class 0 OID 0)
-- Dependencies: 249
-- Name: title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.title_id_seq OWNED BY public.title.id;


--
-- TOC entry 250 (class 1259 OID 838377)
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
    search_vectors tsvector,
    purity numeric(8,4),
    small boolean DEFAULT false NOT NULL
);


--
-- TOC entry 251 (class 1259 OID 838387)
-- Name: type_coin_marks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_coin_marks (
    type integer,
    coin_mark integer
);


--
-- TOC entry 252 (class 1259 OID 838390)
-- Name: type_coin_verse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_coin_verse (
    type integer,
    coin_verse integer
);


--
-- TOC entry 253 (class 1259 OID 838393)
-- Name: type_completed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_completed (
    type integer NOT NULL
);


--
-- TOC entry 254 (class 1259 OID 838396)
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
-- TOC entry 4218 (class 0 OID 0)
-- Dependencies: 254
-- Name: type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.type_id_seq OWNED BY public.type.id;


--
-- TOC entry 255 (class 1259 OID 838398)
-- Name: type_reviewed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.type_reviewed (
    type integer NOT NULL
);


--
-- TOC entry 3891 (class 2604 OID 838401)
-- Name: app_user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass);


--
-- TOC entry 3892 (class 2604 OID 838402)
-- Name: coin_marks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_marks ALTER COLUMN id SET DEFAULT nextval('public.coin_marks_id_seq'::regclass);


--
-- TOC entry 3893 (class 2604 OID 838403)
-- Name: coin_verse id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_verse ALTER COLUMN id SET DEFAULT nextval('public.coin_verse_id_seq'::regclass);


--
-- TOC entry 3895 (class 2604 OID 838404)
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 3896 (class 2604 OID 838405)
-- Name: dynasty id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dynasty ALTER COLUMN id SET DEFAULT nextval('public.dynasty_id_seq'::regclass);


--
-- TOC entry 3897 (class 2604 OID 838406)
-- Name: honorific id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.honorific ALTER COLUMN id SET DEFAULT nextval('public.honorific_id_seq'::regclass);


--
-- TOC entry 3898 (class 2604 OID 838407)
-- Name: issuer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer ALTER COLUMN id SET DEFAULT nextval('public.issuer_id_seq'::regclass);


--
-- TOC entry 3899 (class 2604 OID 838408)
-- Name: material id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
-- TOC entry 3900 (class 2604 OID 838409)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3901 (class 2604 OID 838410)
-- Name: mint id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mint ALTER COLUMN id SET DEFAULT nextval('public.mint_id_seq'::regclass);


--
-- TOC entry 3902 (class 2604 OID 838411)
-- Name: nominal id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nominal ALTER COLUMN id SET DEFAULT nextval('public.nominal_id_seq'::regclass);


--
-- TOC entry 3903 (class 2604 OID 838412)
-- Name: overlord id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord ALTER COLUMN id SET DEFAULT nextval('public.overlord_id_seq'::regclass);


--
-- TOC entry 3904 (class 2604 OID 838413)
-- Name: person id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- TOC entry 3905 (class 2604 OID 838414)
-- Name: person_role id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_role ALTER COLUMN id SET DEFAULT nextval('public.person_role_id_seq'::regclass);


--
-- TOC entry 3906 (class 2604 OID 838415)
-- Name: piece id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.piece ALTER COLUMN id SET DEFAULT nextval('public.piece_id_seq'::regclass);


--
-- TOC entry 3907 (class 2604 OID 838416)
-- Name: province id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.province ALTER COLUMN id SET DEFAULT nextval('public.province_id_seq'::regclass);


--
-- TOC entry 3908 (class 2604 OID 838417)
-- Name: title id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.title ALTER COLUMN id SET DEFAULT nextval('public.title_id_seq'::regclass);


--
-- TOC entry 3913 (class 2604 OID 838418)
-- Name: type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type ALTER COLUMN id SET DEFAULT nextval('public.type_id_seq'::regclass);


--
-- TOC entry 4145 (class 0 OID 838225)
-- Dependencies: 207
-- Data for Name: app_user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.app_user VALUES (1, NULL, 'admin@sikka-buya.de', '$2b$10$67jHE8fkL/h4qXC7tVldTeNVB3XwnrCi1srM/OV88JQzjp9w2QPYG', true);


--
-- TOC entry 4147 (class 0 OID 838233)
-- Dependencies: 209
-- Data for Name: coin_marks; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.coin_marks VALUES (1, 'drei Punkte (∴)');
INSERT INTO public.coin_marks VALUES (2, 'bāʾ/tāʾ/ṯāʾ');


--
-- TOC entry 4149 (class 0 OID 838241)
-- Dependencies: 211
-- Data for Name: coin_verse; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.coin_verse VALUES (1, 'Koran 9:33');
INSERT INTO public.coin_verse VALUES (2, 'محمد رسول الله');
INSERT INTO public.coin_verse VALUES (3, 'Koran 30:4‒5');


--
-- TOC entry 4151 (class 0 OID 838249)
-- Dependencies: 213
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4152 (class 0 OID 838253)
-- Dependencies: 214
-- Data for Name: dynasty; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dynasty VALUES (1, 'Būyide');
INSERT INTO public.dynasty VALUES (2, 'ʿAbbāside');


--
-- TOC entry 4154 (class 0 OID 838261)
-- Dependencies: 216
-- Data for Name: honorific; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.honorific VALUES (1, '… ad-Daula');
INSERT INTO public.honorific VALUES (3, '… al-Mulūk');


--
-- TOC entry 4156 (class 0 OID 838269)
-- Dependencies: 218
-- Data for Name: issuer; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.issuer VALUES (5, 4, 1);
INSERT INTO public.issuer VALUES (6, 4, 2);


--
-- TOC entry 4157 (class 0 OID 838272)
-- Dependencies: 219
-- Data for Name: issuer_honorifics; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.issuer_honorifics VALUES (5, 1);
INSERT INTO public.issuer_honorifics VALUES (5, 3);


--
-- TOC entry 4159 (class 0 OID 838277)
-- Dependencies: 221
-- Data for Name: issuer_titles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.issuer_titles VALUES (5, 2);
INSERT INTO public.issuer_titles VALUES (6, 1);


--
-- TOC entry 4160 (class 0 OID 838280)
-- Dependencies: 222
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.material VALUES (1, 'Gold');
INSERT INTO public.material VALUES (2, 'Silber');


--
-- TOC entry 4161 (class 0 OID 838286)
-- Dependencies: 223
-- Data for Name: material_color; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.material_color VALUES (1, '#FFD700');
INSERT INTO public.material_color VALUES (2, '#C0C0C0');


--
-- TOC entry 4163 (class 0 OID 838291)
-- Dependencies: 225
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4165 (class 0 OID 838296)
-- Dependencies: 227
-- Data for Name: mint; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.mint VALUES (2, 'Fārs', NULL, '0101000020E61000003DA5E1CE97B93A4018F503BEEBF14A40', true, '0103000020E610000001000000060000002618CCAC492C3B4056A241FD8F914A4073B1F122F3B03B404265E8E14C394B402618CCAC492C3B4042B327E31BCD4B4063F47559B6C13A40A6CE92AC69D54B40C0F92F4709703A405697207F466F4B40A9671CCD01A73A407873C2C232C94A40', 1);
INSERT INTO public.mint VALUES (1, 'Šīrāz', NULL, '0101000020E6100000E9BACF750A963D40809730D2FF4A4A40', false, '0103000020E610000000000000', 1);
INSERT INTO public.mint VALUES (3, 'Aiḏaǧ', NULL, '0101000020E61000009B65026062033E400100000060774940', true, '0103000020E61000000100000005000000ACFD00E5C35343400100000040283F4010EFBBC7F9BF41400100000040283F4010EFBBC7F9BF414001000000608E4140ACFD00E5C353434001000000608E4140ACFD00E5C35343400100000040283F40', 10);


--
-- TOC entry 4167 (class 0 OID 838304)
-- Dependencies: 229
-- Data for Name: nominal; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.nominal VALUES (1, 'Dinar');
INSERT INTO public.nominal VALUES (2, 'Ruknī-Dinar');


--
-- TOC entry 4169 (class 0 OID 838312)
-- Dependencies: 231
-- Data for Name: note; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.note VALUES ('', 'mint', 2);
INSERT INTO public.note VALUES ('älteste Moschee (Saffaridenzeit)', 'mint', 1);
INSERT INTO public.note VALUES ('Newly created mint!', 'mint', 3);


--
-- TOC entry 4171 (class 0 OID 838320)
-- Dependencies: 233
-- Data for Name: other_person; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4172 (class 0 OID 838323)
-- Dependencies: 234
-- Data for Name: overlord; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4173 (class 0 OID 838326)
-- Dependencies: 235
-- Data for Name: overlord_honorifics; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4175 (class 0 OID 838331)
-- Dependencies: 237
-- Data for Name: overlord_titles; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4176 (class 0 OID 838334)
-- Dependencies: 238
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.person VALUES (1, 'Rukn ad-Daula Abū ʿAlī al-Ḥasan b. Būya', NULL, 1, 'Rukn ad-Daula', NULL);
INSERT INTO public.person VALUES (2, 'Sulṭān ad-Daula Abū Šuǧāʿ Fanā-Ḫusra b. Bahāʾ ad-Daula Ḫusra-Fīrūz', NULL, NULL, 'Sulṭān ad-Daula', NULL);
INSERT INTO public.person VALUES (3, 'al-Muṭīʿ li-᾽llāh, Abu ᾽l-Qāsim al-Faḍl b. al-Muqtadir', NULL, 2, 'al-Muṭīʿ', 5);
INSERT INTO public.person VALUES (4, 'ʿIzz ad-Daula Abū Manṣūr Baḫtiyār b. Muʿizz ad-Daula Aḥmad', NULL, 1, 'ʿIzz ad-Daula', NULL);
INSERT INTO public.person VALUES (5, 'ʿUmdat ad-Daula Abū Isḥāq Ibrāhīm b. Muʿizz ad-Daula Aḥmad', NULL, 1, 'ʿUmdat ad-Daula', NULL);
INSERT INTO public.person VALUES (6, 'Abu ’l-Ḥasan Muḥammad b. al-Mustakfī', NULL, 2, 'Abu ’l-Ḥasan b. al-Mustakfī', 3);
INSERT INTO public.person VALUES (7, 'al-Qādir bi-᾽llāh, Abu ᾽l-ʿAbbās Aḥmad b. Isḥāq', NULL, 2, 'al-Qādir', 5);


--
-- TOC entry 4177 (class 0 OID 838340)
-- Dependencies: 239
-- Data for Name: person_color; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.person_color VALUES (1, '#ff00ff');
INSERT INTO public.person_color VALUES (2, '#00ffff');
INSERT INTO public.person_color VALUES (3, '#ffff00');
INSERT INTO public.person_color VALUES (4, '#d14a46');
INSERT INTO public.person_color VALUES (5, '#ffa953');


--
-- TOC entry 4178 (class 0 OID 838343)
-- Dependencies: 240
-- Data for Name: person_explorer_custom_sorting; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4180 (class 0 OID 838348)
-- Dependencies: 242
-- Data for Name: person_role; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.person_role VALUES (3, 'heir');
INSERT INTO public.person_role VALUES (4, 'cutter');
INSERT INTO public.person_role VALUES (5, 'caliph');


--
-- TOC entry 4182 (class 0 OID 838356)
-- Dependencies: 244
-- Data for Name: piece; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.piece VALUES (5, 'https://www.zeno.ru/showphoto.php?photo=139208', 4);
INSERT INTO public.piece VALUES (6, 'https://www.zeno.ru/showphoto.php?photo=40340', 4);


--
-- TOC entry 4184 (class 0 OID 838364)
-- Dependencies: 246
-- Data for Name: province; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.province VALUES (1, 'Fārs');
INSERT INTO public.province VALUES (3, 'ʿUmān');
INSERT INTO public.province VALUES (10, 'Ḫūzistān');


--
-- TOC entry 3889 (class 0 OID 837510)
-- Dependencies: 203
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4186 (class 0 OID 838369)
-- Dependencies: 248
-- Data for Name: title; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.title VALUES (1, 'malik');
INSERT INTO public.title VALUES (2, 'šāhānšāh');


--
-- TOC entry 4188 (class 0 OID 838377)
-- Dependencies: 250
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

Av.-Randzier: Perlkreis, daran außen vier (?) Ringe, in denen jeweils ein Ringlein sitzt (⊚). Rev.-Feldbegrenzung: Perlkreis.<div><b></b></div>', '''2'':46,47,48 ''3'':52 ''33'':61 ''5'':64 ''9'':60 ''aaaa'':17 ''auss'':23,54,76 ''av'':4,14,18,22,35,67,72 ''bb'':21 ''besonderheiten/varianten'':65 ''ccc'':37 ''daran'':75 ''den'':80 ''feld'':5,39,68 ''feldbegrenz'':86 ''inn'':15,44 ''jeweil'':81 ''koran'':59 ''material'':2 ''mittl'':19,50 ''perlkreis'':74,87 ''punkt'':71 ''randbeschrift'':36,63 ''randzi'':73 ''rev'':38,43,49,53,62,85 ''ring'':78 ''ringlein'':83 ''silb'':3 ''sitzt'':84 ''umschrift'':16,20,24,45,51,55 ''unt'':69 ''vier'':77 ''zwei'':70 ''šīr389'':1 ''إلا'':8 ''إله'':7 ''الدرهم'':29 ''الله'':9,26,42,58 ''بسم'':25 ''بشيراز'':30 ''تسع'':32 ''رسول'':41,57 ''سنة'':31 ''شريك'':12 ''ضرب'':27 ''لا'':6,11 ''له'':13 ''محمد'':40,56 ''هذا'':28 ''وثلثمائة'':34 ''وثمانين'':33 ''وحده'':10', NULL, false);


--
-- TOC entry 4189 (class 0 OID 838387)
-- Dependencies: 251
-- Data for Name: type_coin_marks; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.type_coin_marks VALUES (4, 1);
INSERT INTO public.type_coin_marks VALUES (4, 2);


--
-- TOC entry 4190 (class 0 OID 838390)
-- Dependencies: 252
-- Data for Name: type_coin_verse; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4191 (class 0 OID 838393)
-- Dependencies: 253
-- Data for Name: type_completed; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4193 (class 0 OID 838398)
-- Dependencies: 255
-- Data for Name: type_reviewed; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4219 (class 0 OID 0)
-- Dependencies: 208
-- Name: app_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.app_user_id_seq', 1, true);


--
-- TOC entry 4220 (class 0 OID 0)
-- Dependencies: 210
-- Name: coin_marks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coin_marks_id_seq', 2, true);


--
-- TOC entry 4221 (class 0 OID 0)
-- Dependencies: 212
-- Name: coin_verse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coin_verse_id_seq', 3, true);


--
-- TOC entry 4222 (class 0 OID 0)
-- Dependencies: 215
-- Name: dynasty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dynasty_id_seq', 2, true);


--
-- TOC entry 4223 (class 0 OID 0)
-- Dependencies: 217
-- Name: honorific_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.honorific_id_seq', 3, true);


--
-- TOC entry 4224 (class 0 OID 0)
-- Dependencies: 220
-- Name: issuer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.issuer_id_seq', 6, true);


--
-- TOC entry 4225 (class 0 OID 0)
-- Dependencies: 224
-- Name: material_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.material_id_seq', 2, true);


--
-- TOC entry 4226 (class 0 OID 0)
-- Dependencies: 226
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- TOC entry 4227 (class 0 OID 0)
-- Dependencies: 228
-- Name: mint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mint_id_seq', 3, true);


--
-- TOC entry 4228 (class 0 OID 0)
-- Dependencies: 230
-- Name: nominal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nominal_id_seq', 2, true);


--
-- TOC entry 4229 (class 0 OID 0)
-- Dependencies: 232
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notes_id_seq', 1, false);


--
-- TOC entry 4230 (class 0 OID 0)
-- Dependencies: 236
-- Name: overlord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.overlord_id_seq', 1, false);


--
-- TOC entry 4231 (class 0 OID 0)
-- Dependencies: 241
-- Name: person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.person_id_seq', 7, true);


--
-- TOC entry 4232 (class 0 OID 0)
-- Dependencies: 243
-- Name: person_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.person_role_id_seq', 5, true);


--
-- TOC entry 4233 (class 0 OID 0)
-- Dependencies: 245
-- Name: piece_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.piece_id_seq', 6, true);


--
-- TOC entry 4234 (class 0 OID 0)
-- Dependencies: 247
-- Name: province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.province_id_seq', 10, true);


--
-- TOC entry 4235 (class 0 OID 0)
-- Dependencies: 249
-- Name: title_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.title_id_seq', 2, true);


--
-- TOC entry 4236 (class 0 OID 0)
-- Dependencies: 254
-- Name: type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.type_id_seq', 4, true);


--
-- TOC entry 3917 (class 2606 OID 838422)
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- TOC entry 3919 (class 2606 OID 838424)
-- Name: app_user app_user_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_name_key UNIQUE (name);


--
-- TOC entry 3921 (class 2606 OID 838426)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3923 (class 2606 OID 838428)
-- Name: coin_marks coin_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_marks
    ADD CONSTRAINT coin_marks_pkey PRIMARY KEY (id);


--
-- TOC entry 3925 (class 2606 OID 838430)
-- Name: coin_verse coin_verse_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coin_verse
    ADD CONSTRAINT coin_verse_pkey PRIMARY KEY (id);


--
-- TOC entry 3931 (class 2606 OID 838432)
-- Name: dynasty dynasty_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_name_key UNIQUE (name);


--
-- TOC entry 3933 (class 2606 OID 838434)
-- Name: dynasty dynasty_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_pkey PRIMARY KEY (id);


--
-- TOC entry 3935 (class 2606 OID 838436)
-- Name: honorific honorific_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.honorific
    ADD CONSTRAINT honorific_pkey PRIMARY KEY (id);


--
-- TOC entry 3937 (class 2606 OID 838438)
-- Name: issuer issuer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_pkey PRIMARY KEY (id);


--
-- TOC entry 3941 (class 2606 OID 838440)
-- Name: material_color material_color_material_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_color
    ADD CONSTRAINT material_color_material_key UNIQUE (material);


--
-- TOC entry 3939 (class 2606 OID 838442)
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- TOC entry 3943 (class 2606 OID 838444)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3945 (class 2606 OID 838446)
-- Name: mint mint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT mint_pkey PRIMARY KEY (id);


--
-- TOC entry 3947 (class 2606 OID 838448)
-- Name: nominal nominal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nominal
    ADD CONSTRAINT nominal_pkey PRIMARY KEY (id);


--
-- TOC entry 3949 (class 2606 OID 838450)
-- Name: note note_property_property_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_property_property_id_key UNIQUE (property, property_id);


--
-- TOC entry 3927 (class 2606 OID 838452)
-- Name: comment notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3929 (class 2606 OID 838454)
-- Name: comment notes_text_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_text_key UNIQUE (text);


--
-- TOC entry 3951 (class 2606 OID 838456)
-- Name: overlord overlord_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_pkey PRIMARY KEY (id);


--
-- TOC entry 3955 (class 2606 OID 838458)
-- Name: person_color person_color_person_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_key UNIQUE (person);


--
-- TOC entry 3957 (class 2606 OID 838460)
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_key UNIQUE (person);


--
-- TOC entry 3953 (class 2606 OID 838462)
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- TOC entry 3959 (class 2606 OID 838464)
-- Name: person_role person_role_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_name_key UNIQUE (name);


--
-- TOC entry 3961 (class 2606 OID 838466)
-- Name: person_role person_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_pkey PRIMARY KEY (id);


--
-- TOC entry 3963 (class 2606 OID 838468)
-- Name: piece piece_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_pkey PRIMARY KEY (id);


--
-- TOC entry 3965 (class 2606 OID 838470)
-- Name: province province_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_name_key UNIQUE (name);


--
-- TOC entry 3967 (class 2606 OID 838472)
-- Name: province province_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pkey PRIMARY KEY (id);


--
-- TOC entry 3969 (class 2606 OID 838474)
-- Name: title title_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.title
    ADD CONSTRAINT title_pkey PRIMARY KEY (id);


--
-- TOC entry 3976 (class 2606 OID 838476)
-- Name: type_completed type_completed_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_key UNIQUE (type);


--
-- TOC entry 3972 (class 2606 OID 838478)
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (id);


--
-- TOC entry 3974 (class 2606 OID 838480)
-- Name: type type_project_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_project_id_key UNIQUE (project_id);


--
-- TOC entry 3978 (class 2606 OID 838482)
-- Name: type_reviewed type_reviewed_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_key UNIQUE (type);


--
-- TOC entry 3970 (class 1259 OID 838483)
-- Name: idx_search_vectors; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_search_vectors ON public.type USING gin (search_vectors);


--
-- TOC entry 4004 (class 2606 OID 838484)
-- Name: type_coin_marks cmt_coin_mark_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_coin_mark_fk FOREIGN KEY (coin_mark) REFERENCES public.coin_marks(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4005 (class 2606 OID 838489)
-- Name: type_coin_marks cmt_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3986 (class 2606 OID 838494)
-- Name: mint fk_province; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT fk_province FOREIGN KEY (province) REFERENCES public.province(id);


--
-- TOC entry 3981 (class 2606 OID 838499)
-- Name: issuer_honorifics ih_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_honorific_fk FOREIGN KEY (honorific) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3982 (class 2606 OID 838504)
-- Name: issuer_honorifics ih_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3979 (class 2606 OID 838509)
-- Name: issuer issuer_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3980 (class 2606 OID 838514)
-- Name: issuer issuer_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3983 (class 2606 OID 838519)
-- Name: issuer_titles it_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3984 (class 2606 OID 838524)
-- Name: issuer_titles it_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_title_fk FOREIGN KEY (title) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3985 (class 2606 OID 838529)
-- Name: material_color material_color_material_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material_color
    ADD CONSTRAINT material_color_material_fkey FOREIGN KEY (material) REFERENCES public.material(id) ON DELETE CASCADE;


--
-- TOC entry 3991 (class 2606 OID 838534)
-- Name: overlord_honorifics oh_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_honorific_fk FOREIGN KEY (honorific_id) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3992 (class 2606 OID 838539)
-- Name: overlord_honorifics oh_overlord_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_overlord_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3987 (class 2606 OID 838544)
-- Name: other_person other_person_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3988 (class 2606 OID 838549)
-- Name: other_person other_person_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3993 (class 2606 OID 838554)
-- Name: overlord_titles overlord_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_honorific_fk FOREIGN KEY (title_id) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3989 (class 2606 OID 838559)
-- Name: overlord overlord_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3994 (class 2606 OID 838564)
-- Name: overlord_titles overlord_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_title_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3990 (class 2606 OID 838569)
-- Name: overlord overlord_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3997 (class 2606 OID 838574)
-- Name: person_color person_color_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_fkey FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3995 (class 2606 OID 838579)
-- Name: person person_dynasty_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_dynasty_fk FOREIGN KEY (dynasty) REFERENCES public.dynasty(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3998 (class 2606 OID 838584)
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_fkey FOREIGN KEY (person) REFERENCES public.person(id);


--
-- TOC entry 3996 (class 2606 OID 838589)
-- Name: person person_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_role_fk FOREIGN KEY (role) REFERENCES public.person_role(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3999 (class 2606 OID 838594)
-- Name: piece piece_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4006 (class 2606 OID 838599)
-- Name: type_coin_verse type_coin_verse_coin_verse_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_coin_verse
    ADD CONSTRAINT type_coin_verse_coin_verse_fkey FOREIGN KEY (coin_verse) REFERENCES public.coin_verse(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4007 (class 2606 OID 838604)
-- Name: type_coin_verse type_coin_verse_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_coin_verse
    ADD CONSTRAINT type_coin_verse_type_fkey FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4008 (class 2606 OID 838609)
-- Name: type_completed type_completed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4000 (class 2606 OID 838614)
-- Name: type type_material_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_material_fk FOREIGN KEY (material) REFERENCES public.material(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4001 (class 2606 OID 838619)
-- Name: type type_mint_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_mint_fk FOREIGN KEY (mint) REFERENCES public.mint(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4002 (class 2606 OID 838624)
-- Name: type type_nominal_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_nominal_fk FOREIGN KEY (nominal) REFERENCES public.nominal(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4003 (class 2606 OID 838629)
-- Name: type type_person_caliph_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_person_caliph_fk FOREIGN KEY (caliph) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4009 (class 2606 OID 838634)
-- Name: type_reviewed type_reviewed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2022-11-25 15:40:03

--
-- PostgreSQL database dump complete
--

