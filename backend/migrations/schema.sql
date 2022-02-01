--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

-- Started on 2022-01-27 15:57:22

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
-- TOC entry 2 (class 3079 OID 601948)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4125 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- TOC entry 3 (class 3079 OID 602963)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 4126 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 207 (class 1259 OID 602970)
-- Name: app_user; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.app_user (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password character varying,
    super boolean
);


ALTER TABLE public.app_user OWNER TO rukn;

--
-- TOC entry 208 (class 1259 OID 602976)
-- Name: app_user_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.app_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.app_user_id_seq OWNER TO rukn;

--
-- TOC entry 4127 (class 0 OID 0)
-- Dependencies: 208
-- Name: app_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id;


--
-- TOC entry 209 (class 1259 OID 602978)
-- Name: coin_marks; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.coin_marks (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.coin_marks OWNER TO rukn;

--
-- TOC entry 210 (class 1259 OID 602984)
-- Name: coin_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.coin_marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coin_marks_id_seq OWNER TO rukn;

--
-- TOC entry 4128 (class 0 OID 0)
-- Dependencies: 210
-- Name: coin_marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.coin_marks_id_seq OWNED BY public.coin_marks.id;


--
-- TOC entry 211 (class 1259 OID 602986)
-- Name: comment; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    text character varying(40),
    property character varying(200),
    property_id integer,
    "time" timestamp without time zone DEFAULT now(),
    user_id integer
);


ALTER TABLE public.comment OWNER TO rukn;

--
-- TOC entry 212 (class 1259 OID 602990)
-- Name: dynasty; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.dynasty (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.dynasty OWNER TO rukn;

--
-- TOC entry 213 (class 1259 OID 602996)
-- Name: dynasty_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.dynasty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dynasty_id_seq OWNER TO rukn;

--
-- TOC entry 4129 (class 0 OID 0)
-- Dependencies: 213
-- Name: dynasty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.dynasty_id_seq OWNED BY public.dynasty.id;


--
-- TOC entry 214 (class 1259 OID 602998)
-- Name: honorific; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.honorific (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.honorific OWNER TO rukn;

--
-- TOC entry 215 (class 1259 OID 603004)
-- Name: honorific_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.honorific_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.honorific_id_seq OWNER TO rukn;

--
-- TOC entry 4130 (class 0 OID 0)
-- Dependencies: 215
-- Name: honorific_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.honorific_id_seq OWNED BY public.honorific.id;


--
-- TOC entry 216 (class 1259 OID 603006)
-- Name: issuer; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.issuer (
    id integer NOT NULL,
    type integer,
    person integer
);


ALTER TABLE public.issuer OWNER TO rukn;

--
-- TOC entry 217 (class 1259 OID 603009)
-- Name: issuer_honorifics; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.issuer_honorifics (
    issuer integer,
    honorific integer
);


ALTER TABLE public.issuer_honorifics OWNER TO rukn;

--
-- TOC entry 218 (class 1259 OID 603012)
-- Name: issuer_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.issuer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.issuer_id_seq OWNER TO rukn;

--
-- TOC entry 4131 (class 0 OID 0)
-- Dependencies: 218
-- Name: issuer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.issuer_id_seq OWNED BY public.issuer.id;


--
-- TOC entry 219 (class 1259 OID 603014)
-- Name: issuer_titles; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.issuer_titles (
    issuer integer,
    title integer
);


ALTER TABLE public.issuer_titles OWNER TO rukn;

--
-- TOC entry 220 (class 1259 OID 603017)
-- Name: material; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.material (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.material OWNER TO rukn;

--
-- TOC entry 221 (class 1259 OID 603023)
-- Name: material_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_id_seq OWNER TO rukn;

--
-- TOC entry 4132 (class 0 OID 0)
-- Dependencies: 221
-- Name: material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
-- TOC entry 222 (class 1259 OID 603025)
-- Name: migrations; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations OWNER TO rukn;

--
-- TOC entry 223 (class 1259 OID 603028)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO rukn;

--
-- TOC entry 4133 (class 0 OID 0)
-- Dependencies: 223
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 224 (class 1259 OID 603030)
-- Name: mint; Type: TABLE; Schema: public; Owner: rukn
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


ALTER TABLE public.mint OWNER TO rukn;

--
-- TOC entry 225 (class 1259 OID 603036)
-- Name: mint_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.mint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mint_id_seq OWNER TO rukn;

--
-- TOC entry 4134 (class 0 OID 0)
-- Dependencies: 225
-- Name: mint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.mint_id_seq OWNED BY public.mint.id;


--
-- TOC entry 226 (class 1259 OID 603038)
-- Name: nominal; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.nominal (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.nominal OWNER TO rukn;

--
-- TOC entry 227 (class 1259 OID 603044)
-- Name: nominal_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.nominal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nominal_id_seq OWNER TO rukn;

--
-- TOC entry 4135 (class 0 OID 0)
-- Dependencies: 227
-- Name: nominal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.nominal_id_seq OWNED BY public.nominal.id;


--
-- TOC entry 228 (class 1259 OID 603046)
-- Name: note; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.note (
    text text,
    property character varying(40),
    property_id integer
);


ALTER TABLE public.note OWNER TO rukn;

--
-- TOC entry 229 (class 1259 OID 603052)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notes_id_seq OWNER TO rukn;

--
-- TOC entry 4136 (class 0 OID 0)
-- Dependencies: 229
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.comment.id;


--
-- TOC entry 230 (class 1259 OID 603054)
-- Name: other_person; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.other_person (
    type integer,
    person integer
);


ALTER TABLE public.other_person OWNER TO rukn;

--
-- TOC entry 231 (class 1259 OID 603057)
-- Name: overlord; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.overlord (
    id integer NOT NULL,
    rank integer,
    type integer,
    person integer
);


ALTER TABLE public.overlord OWNER TO rukn;

--
-- TOC entry 232 (class 1259 OID 603060)
-- Name: overlord_honorifics; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.overlord_honorifics (
    overlord_id integer,
    honorific_id integer
);


ALTER TABLE public.overlord_honorifics OWNER TO rukn;

--
-- TOC entry 233 (class 1259 OID 603063)
-- Name: overlord_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.overlord_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.overlord_id_seq OWNER TO rukn;

--
-- TOC entry 4137 (class 0 OID 0)
-- Dependencies: 233
-- Name: overlord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.overlord_id_seq OWNED BY public.overlord.id;


--
-- TOC entry 234 (class 1259 OID 603065)
-- Name: overlord_titles; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.overlord_titles (
    overlord_id integer,
    title_id integer
);


ALTER TABLE public.overlord_titles OWNER TO rukn;

--
-- TOC entry 235 (class 1259 OID 603068)
-- Name: person; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.person (
    id integer NOT NULL,
    name character varying,
    role_legacy character varying,
    dynasty integer,
    short_name character varying,
    role integer
);


ALTER TABLE public.person OWNER TO rukn;

--
-- TOC entry 251 (class 1259 OID 604686)
-- Name: person_color; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person_color (
    person integer NOT NULL,
    color character(7)
);


ALTER TABLE public.person_color OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 603074)
-- Name: person_explorer_custom_sorting; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.person_explorer_custom_sorting (
    "position" integer,
    person integer
);


ALTER TABLE public.person_explorer_custom_sorting OWNER TO rukn;

--
-- TOC entry 237 (class 1259 OID 603077)
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_id_seq OWNER TO rukn;

--
-- TOC entry 4138 (class 0 OID 0)
-- Dependencies: 237
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- TOC entry 238 (class 1259 OID 603079)
-- Name: person_role; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.person_role (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.person_role OWNER TO rukn;

--
-- TOC entry 239 (class 1259 OID 603085)
-- Name: person_role_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.person_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_role_id_seq OWNER TO rukn;

--
-- TOC entry 4139 (class 0 OID 0)
-- Dependencies: 239
-- Name: person_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.person_role_id_seq OWNED BY public.person_role.id;


--
-- TOC entry 240 (class 1259 OID 603087)
-- Name: piece; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.piece (
    id integer NOT NULL,
    piece character varying,
    type integer
);


ALTER TABLE public.piece OWNER TO rukn;

--
-- TOC entry 241 (class 1259 OID 603093)
-- Name: piece_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.piece_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.piece_id_seq OWNER TO rukn;

--
-- TOC entry 4140 (class 0 OID 0)
-- Dependencies: 241
-- Name: piece_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.piece_id_seq OWNED BY public.piece.id;


--
-- TOC entry 242 (class 1259 OID 603095)
-- Name: province; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.province (
    id integer NOT NULL,
    name character varying(40)
);


ALTER TABLE public.province OWNER TO rukn;

--
-- TOC entry 243 (class 1259 OID 603098)
-- Name: province_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.province_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.province_id_seq OWNER TO rukn;

--
-- TOC entry 4141 (class 0 OID 0)
-- Dependencies: 243
-- Name: province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.province_id_seq OWNED BY public.province.id;


--
-- TOC entry 244 (class 1259 OID 603100)
-- Name: title; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.title (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.title OWNER TO rukn;

--
-- TOC entry 245 (class 1259 OID 603106)
-- Name: title_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.title_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.title_id_seq OWNER TO rukn;

--
-- TOC entry 4142 (class 0 OID 0)
-- Dependencies: 245
-- Name: title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.title_id_seq OWNED BY public.title.id;


--
-- TOC entry 246 (class 1259 OID 603108)
-- Name: type; Type: TABLE; Schema: public; Owner: rukn
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


ALTER TABLE public.type OWNER TO rukn;

--
-- TOC entry 247 (class 1259 OID 603117)
-- Name: type_coin_marks; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.type_coin_marks (
    type integer,
    coin_mark integer
);


ALTER TABLE public.type_coin_marks OWNER TO rukn;

--
-- TOC entry 248 (class 1259 OID 603120)
-- Name: type_completed; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.type_completed (
    type integer NOT NULL
);


ALTER TABLE public.type_completed OWNER TO rukn;

--
-- TOC entry 249 (class 1259 OID 603123)
-- Name: type_id_seq; Type: SEQUENCE; Schema: public; Owner: rukn
--

CREATE SEQUENCE public.type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.type_id_seq OWNER TO rukn;

--
-- TOC entry 4143 (class 0 OID 0)
-- Dependencies: 249
-- Name: type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rukn
--

ALTER SEQUENCE public.type_id_seq OWNED BY public.type.id;


--
-- TOC entry 250 (class 1259 OID 603125)
-- Name: type_reviewed; Type: TABLE; Schema: public; Owner: rukn
--

CREATE TABLE public.type_reviewed (
    type integer NOT NULL
);


ALTER TABLE public.type_reviewed OWNER TO rukn;

--
-- TOC entry 3875 (class 2604 OID 603128)
-- Name: app_user id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass);


--
-- TOC entry 3876 (class 2604 OID 603129)
-- Name: coin_marks id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.coin_marks ALTER COLUMN id SET DEFAULT nextval('public.coin_marks_id_seq'::regclass);


--
-- TOC entry 3878 (class 2604 OID 603130)
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 3879 (class 2604 OID 603131)
-- Name: dynasty id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.dynasty ALTER COLUMN id SET DEFAULT nextval('public.dynasty_id_seq'::regclass);


--
-- TOC entry 3880 (class 2604 OID 603132)
-- Name: honorific id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.honorific ALTER COLUMN id SET DEFAULT nextval('public.honorific_id_seq'::regclass);


--
-- TOC entry 3881 (class 2604 OID 603133)
-- Name: issuer id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer ALTER COLUMN id SET DEFAULT nextval('public.issuer_id_seq'::regclass);


--
-- TOC entry 3882 (class 2604 OID 603134)
-- Name: material id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
-- TOC entry 3883 (class 2604 OID 603135)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3884 (class 2604 OID 603136)
-- Name: mint id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.mint ALTER COLUMN id SET DEFAULT nextval('public.mint_id_seq'::regclass);


--
-- TOC entry 3885 (class 2604 OID 603137)
-- Name: nominal id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.nominal ALTER COLUMN id SET DEFAULT nextval('public.nominal_id_seq'::regclass);


--
-- TOC entry 3886 (class 2604 OID 603138)
-- Name: overlord id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord ALTER COLUMN id SET DEFAULT nextval('public.overlord_id_seq'::regclass);


--
-- TOC entry 3887 (class 2604 OID 603139)
-- Name: person id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- TOC entry 3888 (class 2604 OID 603140)
-- Name: person_role id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person_role ALTER COLUMN id SET DEFAULT nextval('public.person_role_id_seq'::regclass);


--
-- TOC entry 3889 (class 2604 OID 603141)
-- Name: piece id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.piece ALTER COLUMN id SET DEFAULT nextval('public.piece_id_seq'::regclass);


--
-- TOC entry 3890 (class 2604 OID 603142)
-- Name: province id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.province ALTER COLUMN id SET DEFAULT nextval('public.province_id_seq'::regclass);


--
-- TOC entry 3891 (class 2604 OID 603143)
-- Name: title id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.title ALTER COLUMN id SET DEFAULT nextval('public.title_id_seq'::regclass);


--
-- TOC entry 3895 (class 2604 OID 603144)
-- Name: type id; Type: DEFAULT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type ALTER COLUMN id SET DEFAULT nextval('public.type_id_seq'::regclass);


--
-- TOC entry 3899 (class 2606 OID 604452)
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- TOC entry 3901 (class 2606 OID 604454)
-- Name: app_user app_user_name_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_name_key UNIQUE (name);


--
-- TOC entry 3903 (class 2606 OID 604456)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3905 (class 2606 OID 604458)
-- Name: coin_marks coin_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.coin_marks
    ADD CONSTRAINT coin_marks_pkey PRIMARY KEY (id);


--
-- TOC entry 3911 (class 2606 OID 604460)
-- Name: dynasty dynasty_name_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_name_key UNIQUE (name);


--
-- TOC entry 3913 (class 2606 OID 604462)
-- Name: dynasty dynasty_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_pkey PRIMARY KEY (id);


--
-- TOC entry 3915 (class 2606 OID 604464)
-- Name: honorific honorific_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.honorific
    ADD CONSTRAINT honorific_pkey PRIMARY KEY (id);


--
-- TOC entry 3917 (class 2606 OID 604466)
-- Name: issuer issuer_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_pkey PRIMARY KEY (id);


--
-- TOC entry 3919 (class 2606 OID 604468)
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- TOC entry 3921 (class 2606 OID 604470)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3923 (class 2606 OID 604472)
-- Name: mint mint_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT mint_pkey PRIMARY KEY (id);


--
-- TOC entry 3925 (class 2606 OID 604474)
-- Name: nominal nominal_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.nominal
    ADD CONSTRAINT nominal_pkey PRIMARY KEY (id);


--
-- TOC entry 3927 (class 2606 OID 604476)
-- Name: note note_property_property_id_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_property_property_id_key UNIQUE (property, property_id);


--
-- TOC entry 3907 (class 2606 OID 604478)
-- Name: comment notes_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3909 (class 2606 OID 604480)
-- Name: comment notes_text_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_text_key UNIQUE (text);


--
-- TOC entry 3929 (class 2606 OID 604482)
-- Name: overlord overlord_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_pkey PRIMARY KEY (id);


--
-- TOC entry 3956 (class 2606 OID 604690)
-- Name: person_color person_color_person_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_key UNIQUE (person);


--
-- TOC entry 3933 (class 2606 OID 604484)
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_key UNIQUE (person);


--
-- TOC entry 3931 (class 2606 OID 604486)
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- TOC entry 3935 (class 2606 OID 604488)
-- Name: person_role person_role_name_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_name_key UNIQUE (name);


--
-- TOC entry 3937 (class 2606 OID 604490)
-- Name: person_role person_role_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_pkey PRIMARY KEY (id);


--
-- TOC entry 3939 (class 2606 OID 604492)
-- Name: piece piece_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_pkey PRIMARY KEY (id);


--
-- TOC entry 3941 (class 2606 OID 604494)
-- Name: province province_name_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_name_key UNIQUE (name);


--
-- TOC entry 3943 (class 2606 OID 604496)
-- Name: province province_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pkey PRIMARY KEY (id);


--
-- TOC entry 3945 (class 2606 OID 604498)
-- Name: title title_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.title
    ADD CONSTRAINT title_pkey PRIMARY KEY (id);


--
-- TOC entry 3952 (class 2606 OID 604500)
-- Name: type_completed type_completed_type_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_key UNIQUE (type);


--
-- TOC entry 3948 (class 2606 OID 604502)
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (id);


--
-- TOC entry 3950 (class 2606 OID 604504)
-- Name: type type_project_id_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_project_id_key UNIQUE (project_id);


--
-- TOC entry 3954 (class 2606 OID 604506)
-- Name: type_reviewed type_reviewed_type_key; Type: CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_key UNIQUE (type);


--
-- TOC entry 3946 (class 1259 OID 604507)
-- Name: idx_search_vectors; Type: INDEX; Schema: public; Owner: rukn
--

CREATE INDEX idx_search_vectors ON public.type USING gin (search_vectors);


--
-- TOC entry 3980 (class 2606 OID 604508)
-- Name: type_coin_marks cmt_coin_mark_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_coin_mark_fk FOREIGN KEY (coin_mark) REFERENCES public.coin_marks(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3981 (class 2606 OID 604513)
-- Name: type_coin_marks cmt_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3963 (class 2606 OID 604518)
-- Name: mint fk_province; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT fk_province FOREIGN KEY (province) REFERENCES public.province(id);


--
-- TOC entry 3959 (class 2606 OID 604523)
-- Name: issuer_honorifics ih_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_honorific_fk FOREIGN KEY (honorific) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3960 (class 2606 OID 604528)
-- Name: issuer_honorifics ih_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3957 (class 2606 OID 604533)
-- Name: issuer issuer_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3958 (class 2606 OID 604538)
-- Name: issuer issuer_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3961 (class 2606 OID 604543)
-- Name: issuer_titles it_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3962 (class 2606 OID 604548)
-- Name: issuer_titles it_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_title_fk FOREIGN KEY (title) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3968 (class 2606 OID 604553)
-- Name: overlord_honorifics oh_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_honorific_fk FOREIGN KEY (honorific_id) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3969 (class 2606 OID 604558)
-- Name: overlord_honorifics oh_overlord_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_overlord_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3964 (class 2606 OID 604563)
-- Name: other_person other_person_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3965 (class 2606 OID 604568)
-- Name: other_person other_person_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3970 (class 2606 OID 604573)
-- Name: overlord_titles overlord_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_honorific_fk FOREIGN KEY (title_id) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3966 (class 2606 OID 604578)
-- Name: overlord overlord_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3971 (class 2606 OID 604583)
-- Name: overlord_titles overlord_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_title_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3967 (class 2606 OID 604588)
-- Name: overlord overlord_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3984 (class 2606 OID 604691)
-- Name: person_color person_color_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_fkey FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3972 (class 2606 OID 604593)
-- Name: person person_dynasty_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_dynasty_fk FOREIGN KEY (dynasty) REFERENCES public.dynasty(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3974 (class 2606 OID 604598)
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_fkey FOREIGN KEY (person) REFERENCES public.person(id);


--
-- TOC entry 3973 (class 2606 OID 604603)
-- Name: person person_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_role_fk FOREIGN KEY (role) REFERENCES public.person_role(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3975 (class 2606 OID 604608)
-- Name: piece piece_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3982 (class 2606 OID 604613)
-- Name: type_completed type_completed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3976 (class 2606 OID 604618)
-- Name: type type_material_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_material_fk FOREIGN KEY (material) REFERENCES public.material(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3977 (class 2606 OID 604623)
-- Name: type type_mint_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_mint_fk FOREIGN KEY (mint) REFERENCES public.mint(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3978 (class 2606 OID 604628)
-- Name: type type_nominal_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_nominal_fk FOREIGN KEY (nominal) REFERENCES public.nominal(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3979 (class 2606 OID 604633)
-- Name: type type_person_caliph_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_person_caliph_fk FOREIGN KEY (caliph) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3983 (class 2606 OID 604638)
-- Name: type_reviewed type_reviewed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: rukn
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2022-01-27 15:57:23

--
-- PostgreSQL database dump complete
--

