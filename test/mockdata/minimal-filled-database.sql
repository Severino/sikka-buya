--
-- PostgreSQL database dump
--

-- Dumped from database version 13.1
-- Dumped by pg_dump version 13.1

-- Started on 2022-11-17 16:57:34

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
-- TOC entry 3 (class 3079 OID 4192253)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4200 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- TOC entry 2 (class 3079 OID 4193268)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 4201 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 207 (class 1259 OID 4193275)
-- Name: app_user; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.app_user (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password character varying,
    super boolean
);


ALTER TABLE public.app_user OWNER TO adub;

--
-- TOC entry 208 (class 1259 OID 4193281)
-- Name: app_user_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.app_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.app_user_id_seq OWNER TO adub;

--
-- TOC entry 4203 (class 0 OID 0)
-- Dependencies: 208
-- Name: app_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id;


--
-- TOC entry 209 (class 1259 OID 4193283)
-- Name: coin_marks; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.coin_marks (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.coin_marks OWNER TO adub;

--
-- TOC entry 210 (class 1259 OID 4193289)
-- Name: coin_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.coin_marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coin_marks_id_seq OWNER TO adub;

--
-- TOC entry 4206 (class 0 OID 0)
-- Dependencies: 210
-- Name: coin_marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.coin_marks_id_seq OWNED BY public.coin_marks.id;


--
-- TOC entry 254 (class 1259 OID 4193798)
-- Name: coin_verse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coin_verse (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.coin_verse OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 4193796)
-- Name: coin_verse_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coin_verse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coin_verse_id_seq OWNER TO postgres;

--
-- TOC entry 4209 (class 0 OID 0)
-- Dependencies: 253
-- Name: coin_verse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coin_verse_id_seq OWNED BY public.coin_verse.id;


--
-- TOC entry 211 (class 1259 OID 4193291)
-- Name: comment; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    text character varying(40),
    property character varying(200),
    property_id integer,
    "time" timestamp without time zone DEFAULT now(),
    user_id integer
);


ALTER TABLE public.comment OWNER TO adub;

--
-- TOC entry 212 (class 1259 OID 4193295)
-- Name: dynasty; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.dynasty (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.dynasty OWNER TO adub;

--
-- TOC entry 213 (class 1259 OID 4193301)
-- Name: dynasty_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.dynasty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dynasty_id_seq OWNER TO adub;

--
-- TOC entry 4212 (class 0 OID 0)
-- Dependencies: 213
-- Name: dynasty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.dynasty_id_seq OWNED BY public.dynasty.id;


--
-- TOC entry 214 (class 1259 OID 4193303)
-- Name: honorific; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.honorific (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.honorific OWNER TO adub;

--
-- TOC entry 215 (class 1259 OID 4193309)
-- Name: honorific_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.honorific_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.honorific_id_seq OWNER TO adub;

--
-- TOC entry 4217 (class 0 OID 0)
-- Dependencies: 215
-- Name: honorific_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.honorific_id_seq OWNED BY public.honorific.id;


--
-- TOC entry 216 (class 1259 OID 4193311)
-- Name: issuer; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.issuer (
    id integer NOT NULL,
    type integer,
    person integer
);


ALTER TABLE public.issuer OWNER TO adub;

--
-- TOC entry 217 (class 1259 OID 4193314)
-- Name: issuer_honorifics; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.issuer_honorifics (
    issuer integer,
    honorific integer
);


ALTER TABLE public.issuer_honorifics OWNER TO adub;

--
-- TOC entry 218 (class 1259 OID 4193317)
-- Name: issuer_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.issuer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.issuer_id_seq OWNER TO adub;

--
-- TOC entry 4221 (class 0 OID 0)
-- Dependencies: 218
-- Name: issuer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.issuer_id_seq OWNED BY public.issuer.id;


--
-- TOC entry 219 (class 1259 OID 4193319)
-- Name: issuer_titles; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.issuer_titles (
    issuer integer,
    title integer
);


ALTER TABLE public.issuer_titles OWNER TO adub;

--
-- TOC entry 220 (class 1259 OID 4193322)
-- Name: material; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.material (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.material OWNER TO adub;

--
-- TOC entry 221 (class 1259 OID 4193328)
-- Name: material_color; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.material_color (
    material integer,
    color character(7)
);


ALTER TABLE public.material_color OWNER TO adub;

--
-- TOC entry 222 (class 1259 OID 4193331)
-- Name: material_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_id_seq OWNER TO adub;

--
-- TOC entry 4226 (class 0 OID 0)
-- Dependencies: 222
-- Name: material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
-- TOC entry 223 (class 1259 OID 4193333)
-- Name: migrations; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations OWNER TO adub;

--
-- TOC entry 224 (class 1259 OID 4193336)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO adub;

--
-- TOC entry 4229 (class 0 OID 0)
-- Dependencies: 224
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 225 (class 1259 OID 4193338)
-- Name: mint; Type: TABLE; Schema: public; Owner: adub
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


ALTER TABLE public.mint OWNER TO adub;

--
-- TOC entry 226 (class 1259 OID 4193344)
-- Name: mint_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.mint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mint_id_seq OWNER TO adub;

--
-- TOC entry 4232 (class 0 OID 0)
-- Dependencies: 226
-- Name: mint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.mint_id_seq OWNED BY public.mint.id;


--
-- TOC entry 227 (class 1259 OID 4193346)
-- Name: nominal; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.nominal (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.nominal OWNER TO adub;

--
-- TOC entry 228 (class 1259 OID 4193352)
-- Name: nominal_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.nominal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nominal_id_seq OWNER TO adub;

--
-- TOC entry 4235 (class 0 OID 0)
-- Dependencies: 228
-- Name: nominal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.nominal_id_seq OWNED BY public.nominal.id;


--
-- TOC entry 229 (class 1259 OID 4193354)
-- Name: note; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.note (
    text text,
    property character varying(40),
    property_id integer
);


ALTER TABLE public.note OWNER TO adub;

--
-- TOC entry 230 (class 1259 OID 4193360)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notes_id_seq OWNER TO adub;

--
-- TOC entry 4238 (class 0 OID 0)
-- Dependencies: 230
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.comment.id;


--
-- TOC entry 231 (class 1259 OID 4193362)
-- Name: other_person; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.other_person (
    type integer,
    person integer
);


ALTER TABLE public.other_person OWNER TO adub;

--
-- TOC entry 232 (class 1259 OID 4193365)
-- Name: overlord; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.overlord (
    id integer NOT NULL,
    rank integer,
    type integer,
    person integer
);


ALTER TABLE public.overlord OWNER TO adub;

--
-- TOC entry 233 (class 1259 OID 4193368)
-- Name: overlord_honorifics; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.overlord_honorifics (
    overlord_id integer,
    honorific_id integer
);


ALTER TABLE public.overlord_honorifics OWNER TO adub;

--
-- TOC entry 234 (class 1259 OID 4193371)
-- Name: overlord_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.overlord_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.overlord_id_seq OWNER TO adub;

--
-- TOC entry 4243 (class 0 OID 0)
-- Dependencies: 234
-- Name: overlord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.overlord_id_seq OWNED BY public.overlord.id;


--
-- TOC entry 235 (class 1259 OID 4193373)
-- Name: overlord_titles; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.overlord_titles (
    overlord_id integer,
    title_id integer
);


ALTER TABLE public.overlord_titles OWNER TO adub;

--
-- TOC entry 236 (class 1259 OID 4193376)
-- Name: person; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.person (
    id integer NOT NULL,
    name character varying,
    role_legacy character varying,
    dynasty integer,
    short_name character varying,
    role integer
);


ALTER TABLE public.person OWNER TO adub;

--
-- TOC entry 237 (class 1259 OID 4193382)
-- Name: person_color; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.person_color (
    person integer NOT NULL,
    color character(7)
);


ALTER TABLE public.person_color OWNER TO adub;

--
-- TOC entry 238 (class 1259 OID 4193385)
-- Name: person_explorer_custom_sorting; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.person_explorer_custom_sorting (
    "position" integer,
    person integer
);


ALTER TABLE public.person_explorer_custom_sorting OWNER TO adub;

--
-- TOC entry 239 (class 1259 OID 4193388)
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_id_seq OWNER TO adub;

--
-- TOC entry 4249 (class 0 OID 0)
-- Dependencies: 239
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- TOC entry 240 (class 1259 OID 4193390)
-- Name: person_role; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.person_role (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.person_role OWNER TO adub;

--
-- TOC entry 241 (class 1259 OID 4193396)
-- Name: person_role_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.person_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_role_id_seq OWNER TO adub;

--
-- TOC entry 4252 (class 0 OID 0)
-- Dependencies: 241
-- Name: person_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.person_role_id_seq OWNED BY public.person_role.id;


--
-- TOC entry 242 (class 1259 OID 4193398)
-- Name: piece; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.piece (
    id integer NOT NULL,
    piece character varying,
    type integer
);


ALTER TABLE public.piece OWNER TO adub;

--
-- TOC entry 243 (class 1259 OID 4193404)
-- Name: piece_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.piece_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.piece_id_seq OWNER TO adub;

--
-- TOC entry 4255 (class 0 OID 0)
-- Dependencies: 243
-- Name: piece_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.piece_id_seq OWNED BY public.piece.id;


--
-- TOC entry 244 (class 1259 OID 4193406)
-- Name: province; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.province (
    id integer NOT NULL,
    name character varying(40)
);


ALTER TABLE public.province OWNER TO adub;

--
-- TOC entry 245 (class 1259 OID 4193409)
-- Name: province_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.province_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.province_id_seq OWNER TO adub;

--
-- TOC entry 4258 (class 0 OID 0)
-- Dependencies: 245
-- Name: province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.province_id_seq OWNED BY public.province.id;


--
-- TOC entry 246 (class 1259 OID 4193411)
-- Name: title; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.title (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.title OWNER TO adub;

--
-- TOC entry 247 (class 1259 OID 4193417)
-- Name: title_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.title_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.title_id_seq OWNER TO adub;

--
-- TOC entry 4262 (class 0 OID 0)
-- Dependencies: 247
-- Name: title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.title_id_seq OWNED BY public.title.id;


--
-- TOC entry 248 (class 1259 OID 4193419)
-- Name: type; Type: TABLE; Schema: public; Owner: adub
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


ALTER TABLE public.type OWNER TO adub;

--
-- TOC entry 249 (class 1259 OID 4193428)
-- Name: type_coin_marks; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.type_coin_marks (
    type integer,
    coin_mark integer
);


ALTER TABLE public.type_coin_marks OWNER TO adub;

--
-- TOC entry 255 (class 1259 OID 4193807)
-- Name: type_coin_verse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_coin_verse (
    type integer,
    coin_verse integer
);


ALTER TABLE public.type_coin_verse OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 4193431)
-- Name: type_completed; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.type_completed (
    type integer NOT NULL
);


ALTER TABLE public.type_completed OWNER TO adub;

--
-- TOC entry 251 (class 1259 OID 4193434)
-- Name: type_id_seq; Type: SEQUENCE; Schema: public; Owner: adub
--

CREATE SEQUENCE public.type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.type_id_seq OWNER TO adub;

--
-- TOC entry 4268 (class 0 OID 0)
-- Dependencies: 251
-- Name: type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: adub
--

ALTER SEQUENCE public.type_id_seq OWNED BY public.type.id;


--
-- TOC entry 252 (class 1259 OID 4193436)
-- Name: type_reviewed; Type: TABLE; Schema: public; Owner: adub
--

CREATE TABLE public.type_reviewed (
    type integer NOT NULL
);


ALTER TABLE public.type_reviewed OWNER TO adub;

--
-- TOC entry 3891 (class 2604 OID 4193439)
-- Name: app_user id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass);


--
-- TOC entry 3892 (class 2604 OID 4193440)
-- Name: coin_marks id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.coin_marks ALTER COLUMN id SET DEFAULT nextval('public.coin_marks_id_seq'::regclass);


--
-- TOC entry 3913 (class 2604 OID 4193801)
-- Name: coin_verse id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_verse ALTER COLUMN id SET DEFAULT nextval('public.coin_verse_id_seq'::regclass);


--
-- TOC entry 3894 (class 2604 OID 4193441)
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 3895 (class 2604 OID 4193442)
-- Name: dynasty id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.dynasty ALTER COLUMN id SET DEFAULT nextval('public.dynasty_id_seq'::regclass);


--
-- TOC entry 3896 (class 2604 OID 4193443)
-- Name: honorific id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.honorific ALTER COLUMN id SET DEFAULT nextval('public.honorific_id_seq'::regclass);


--
-- TOC entry 3897 (class 2604 OID 4193444)
-- Name: issuer id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer ALTER COLUMN id SET DEFAULT nextval('public.issuer_id_seq'::regclass);


--
-- TOC entry 3898 (class 2604 OID 4193445)
-- Name: material id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
-- TOC entry 3899 (class 2604 OID 4193446)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 3900 (class 2604 OID 4193447)
-- Name: mint id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.mint ALTER COLUMN id SET DEFAULT nextval('public.mint_id_seq'::regclass);


--
-- TOC entry 3901 (class 2604 OID 4193448)
-- Name: nominal id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.nominal ALTER COLUMN id SET DEFAULT nextval('public.nominal_id_seq'::regclass);


--
-- TOC entry 3902 (class 2604 OID 4193449)
-- Name: overlord id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord ALTER COLUMN id SET DEFAULT nextval('public.overlord_id_seq'::regclass);


--
-- TOC entry 3903 (class 2604 OID 4193450)
-- Name: person id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- TOC entry 3904 (class 2604 OID 4193451)
-- Name: person_role id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person_role ALTER COLUMN id SET DEFAULT nextval('public.person_role_id_seq'::regclass);


--
-- TOC entry 3905 (class 2604 OID 4193452)
-- Name: piece id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.piece ALTER COLUMN id SET DEFAULT nextval('public.piece_id_seq'::regclass);


--
-- TOC entry 3906 (class 2604 OID 4193453)
-- Name: province id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.province ALTER COLUMN id SET DEFAULT nextval('public.province_id_seq'::regclass);


--
-- TOC entry 3907 (class 2604 OID 4193454)
-- Name: title id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.title ALTER COLUMN id SET DEFAULT nextval('public.title_id_seq'::regclass);


--
-- TOC entry 3911 (class 2604 OID 4193455)
-- Name: type id; Type: DEFAULT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type ALTER COLUMN id SET DEFAULT nextval('public.type_id_seq'::regclass);


--
-- TOC entry 4145 (class 0 OID 4193275)
-- Dependencies: 207
-- Data for Name: app_user; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.app_user (id, name, email, password, super) FROM stdin;
1	\N	tom.testa@example.com	$2b$10$KCyRoBN.hXpyKIV2/T9BK.RYpMqXJo1oQCt5HqTLZZSZdKm7YwEAe	t
2	\N	susan.sugar@example.com	$2b$10$dWxHk7qVs.ScNw7iDKrbaOgQQx2cYXdfmmqCxn1yppfhngEIzBkIy	\N
\.


--
-- TOC entry 4147 (class 0 OID 4193283)
-- Dependencies: 209
-- Data for Name: coin_marks; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.coin_marks (id, name) FROM stdin;
1	Ä
2	Ü
3	ê
4	π
5	Ẳ
\.


--
-- TOC entry 4192 (class 0 OID 4193798)
-- Dependencies: 254
-- Data for Name: coin_verse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coin_verse (id, name) FROM stdin;
1	Book 6, Hadith 346
2	Book 66, Hadith 9
\.


--
-- TOC entry 4149 (class 0 OID 4193291)
-- Dependencies: 211
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.comment (id, text, property, property_id, "time", user_id) FROM stdin;
\.


--
-- TOC entry 4150 (class 0 OID 4193295)
-- Dependencies: 212
-- Data for Name: dynasty; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.dynasty (id, name) FROM stdin;
1	Deutsche
2	Franzosen
3	Briten
4	Österreicher
5	Atlant
\.


--
-- TOC entry 4152 (class 0 OID 4193303)
-- Dependencies: 214
-- Data for Name: honorific; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.honorific (id, name) FROM stdin;
1	der Schwarze Riese
2	die Birne
3	bulldozer
4	le Français
5	le générale
6	von Deutschland
7	Meerjungfrau
8	der Große
9	Wesen des Meeres
\.


--
-- TOC entry 4154 (class 0 OID 4193311)
-- Dependencies: 216
-- Data for Name: issuer; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.issuer (id, type, person) FROM stdin;
1	1	1
2	2	10
3	2	9
\.


--
-- TOC entry 4155 (class 0 OID 4193314)
-- Dependencies: 217
-- Data for Name: issuer_honorifics; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.issuer_honorifics (issuer, honorific) FROM stdin;
1	1
1	2
2	3
2	5
3	3
3	4
\.


--
-- TOC entry 4157 (class 0 OID 4193319)
-- Dependencies: 219
-- Data for Name: issuer_titles; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.issuer_titles (issuer, title) FROM stdin;
1	1
1	2
2	3
3	1
3	2
3	3
\.


--
-- TOC entry 4158 (class 0 OID 4193322)
-- Dependencies: 220
-- Data for Name: material; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.material (id, name) FROM stdin;
1	Gøld
2	Kupfer
3	Perlmutt
4	Silber
\.


--
-- TOC entry 4159 (class 0 OID 4193328)
-- Dependencies: 221
-- Data for Name: material_color; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.material_color (material, color) FROM stdin;
1	#fcba03
2	#fc3903
3	#006eff
4	#cccccc
\.


--
-- TOC entry 4161 (class 0 OID 4193333)
-- Dependencies: 223
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.migrations (id, name, run_on) FROM stdin;
\.


--
-- TOC entry 4163 (class 0 OID 4193338)
-- Dependencies: 225
-- Data for Name: mint; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.mint (id, name, unsafe, location, uncertain, uncertain_area, province) FROM stdin;
1	Berlin	\N	0101000000255B3FF084424A40B9B81B6ADDC02A40	f	\N	3
2	Paris	\N	0101000000F852C8807A6E48407BCE1CACCDB30240	f	\N	1
3	Ǎtlantis	\N	01010000006893AA2BAA3944407C42571A1A9E1840	t	010300000001000000070000000000000000181540C6ED6F8748D9444000000000003C0E400CA1BA215C6B4440C1250200C0C015405571273470A643407DB4FBFF7F821B40934137F942A443407DB4FBFF7FF81D40FEB7B32BC44144407DB4FBFF7FCE1A40119F69F969C744400000000000181540C6ED6F8748D94440	2
\.


--
-- TOC entry 4165 (class 0 OID 4193346)
-- Dependencies: 227
-- Data for Name: nominal; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.nominal (id, name) FROM stdin;
1	⅟₂ ₳die
2	1 Mark
3	1 Taler
4	1 Złoty
\.


--
-- TOC entry 4167 (class 0 OID 4193354)
-- Dependencies: 229
-- Data for Name: note; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.note (text, property, property_id) FROM stdin;
\.


--
-- TOC entry 4169 (class 0 OID 4193362)
-- Dependencies: 231
-- Data for Name: other_person; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.other_person (type, person) FROM stdin;
1	5
2	12
2	13
\.


--
-- TOC entry 4170 (class 0 OID 4193365)
-- Dependencies: 232
-- Data for Name: overlord; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.overlord (id, rank, type, person) FROM stdin;
1	2	1	2
2	1	1	17
3	1	2	6
4	2	2	7
5	3	2	8
\.


--
-- TOC entry 4171 (class 0 OID 4193368)
-- Dependencies: 233
-- Data for Name: overlord_honorifics; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.overlord_honorifics (overlord_id, honorific_id) FROM stdin;
1	1
1	6
2	6
3	6
4	4
4	3
5	4
\.


--
-- TOC entry 4173 (class 0 OID 4193373)
-- Dependencies: 235
-- Data for Name: overlord_titles; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.overlord_titles (overlord_id, title_id) FROM stdin;
1	1
2	2
3	1
3	3
4	2
4	3
5	3
\.


--
-- TOC entry 4174 (class 0 OID 4193376)
-- Dependencies: 236
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.person (id, name, role_legacy, dynasty, short_name, role) FROM stdin;
1	Helmut Kohl	\N	1	Kohl	\N
2	Angela Merkel	\N	1	Merkel	\N
3	Joachim Gauck	\N	1	Gauck	\N
4	Karl der Große	\N	1	Karl	1
5	Albrecht Dürer	\N	1	Dürer	2
6	Emmanuel Macron	\N	2	Macron	\N
7	François Hollande	\N	2	Hollande	\N
8	Nicolas Sarkozy	\N	2	Sarkozy	\N
9	Jaques Chirac	\N	2	Chirac	\N
10	Charles de Gaulle	\N	2	de Gaulle	\N
11	Louis XVI	\N	2	Louis	1
12	Albert Uderzo	\N	2	Uderzo	2
13	René Goscinny	\N	2	Goscinny	2
14	Winston Churchill	\N	3	Churchill	\N
15	Elizabeth II	\N	3	The Queen	1
16	William Turner	\N	3	Turner	2
17	Guido Westerwelle	\N	1	Westerwelle	\N
18	Poseidon	\N	5	Neptun	1
19	Plankton	\N	5	Planki	\N
20	Fisch	\N	5	\N	\N
21	Wal	\N	5	\N	2
22	Arielle	\N	5	Ari	\N
23	Sebastian	\N	\N	Sebi	\N
24	Michelangelo	\N	5	Miquel	2
25	Gian Lorenzo Bernini	\N	5	Bernini	2
\.


--
-- TOC entry 4175 (class 0 OID 4193382)
-- Dependencies: 237
-- Data for Name: person_color; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.person_color (person, color) FROM stdin;
12	#FFFF00
5	#FF00FF
2	#0000FF
22	#FF0000
10	#DDDD00
15	#DDDDFF
6	#00CC0F
20	#0000FF
7	#58ecF0
25	#AB87DF
17	#DD33FF
1	#111111
9	#FF1996
3	#EE3333
4	#F3C3A3
11	#3333FF
24	#3FF3FF
8	#EECCAA
19	#11FFAA
18	#99FFAA
13	#FE0101
23	#DD0101
21	#222222
16	#555555
14	#004433
\.


--
-- TOC entry 4176 (class 0 OID 4193385)
-- Dependencies: 238
-- Data for Name: person_explorer_custom_sorting; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.person_explorer_custom_sorting ("position", person) FROM stdin;
\.


--
-- TOC entry 4178 (class 0 OID 4193390)
-- Dependencies: 240
-- Data for Name: person_role; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.person_role (id, name) FROM stdin;
1	caliph
2	cutter
3	Dāula
\.


--
-- TOC entry 4180 (class 0 OID 4193398)
-- Dependencies: 242
-- Data for Name: piece; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.piece (id, piece, type) FROM stdin;
1	https://www.berlin.de/	1
2	https://de.wikipedia.org/wiki/Berlin	1
3	https://de.wikipedia.org/wiki/Paris	2
\.


--
-- TOC entry 4182 (class 0 OID 4193406)
-- Dependencies: 244
-- Data for Name: province; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.province (id, name) FROM stdin;
1	France
2	The Sea
3	Germany
\.


--
-- TOC entry 3889 (class 0 OID 4192560)
-- Dependencies: 203
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- TOC entry 4184 (class 0 OID 4193411)
-- Dependencies: 246
-- Data for Name: title; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.title (id, name) FROM stdin;
1	Prof.
2	Dr.
3	Monsieur
4	König
5	Königin
6	Tier
\.


--
-- TOC entry 4186 (class 0 OID 4193419)
-- Dependencies: 248
-- Data for Name: type; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.type (id, project_id, treadwell_id, material, mint, mint_as_on_coin, nominal, year_of_mint, donativ, procedure, caliph, front_side_field_text, front_side_inner_inscript, front_side_intermediate_inscript, front_side_outer_inscript, front_side_misc, back_side_field_text, back_side_inner_inscript, back_side_intermediate_inscript, back_side_outer_inscript, back_side_misc, cursive_script, isolated_characters, literature, specials, exclude_from_type_catalogue, exclude_from_map_app, internal_notes, mint_uncertain, year_uncertain, plain_text, search_vectors, purity, small) FROM stdin;
1	GER1989	GD89	1	1	Börlin	2	1989	t	pressed	4	<div>Abbildung des deutschen Michels</div>	<div>Danach lasst uns alle streben</div>	<div>für das deutsche Vaterland!</div>	<div>Einigkeit und Recht und Freiheit</div>	<div>Michel ohne Mütze</div>	<div>Abbildung eines Birnbaums</div>	<div>Und kam die goldene Herbsteszeit,</div>	<div>Ein Birnbaum in seinem Garten stand,</div>	<div>Herr von Ribbeck auf Ribbeck im Havelland,</div>	<div>Birnbaum ohne Früchte</div>	f	\N	<div style=" text - align: center;">Av: Nationalhymne</div><div style=" text - align: center;">Rev. Gedicht Fontane</div>	<div style=" text - align: center;">Keine</div>	f	f	<div style=" text - align: center;">Bitte nochmal neu!</div>	f	f	\N	\N	\N	f
2	FRévô1789	FR1789	4	2	Paris	3	1789	t	cast	11	<div>Abb. Französische Flagge</div>	<div>Contre nous de la tyrannie</div>	<div>Le jour de gloire est arrivé!</div>	<div>Allons enfants de la Patrie,</div>	<div>Flagge wehend</div>	<div>Französischer Hahn</div>	<div>Fraternité</div>	<div>Égalité</div>	<div>Liberté</div>	<div>Hahn trägt Hose</div>	f	\N	<div style=" text - align: center;">Av: Nationalhymne</div><div style=" text - align: center;">Rev. revolutionärer Asusspruch</div>	<div style=" text - align: center;">Revolutionsmünze mit König</div>	f	f	<div style=" text - align: center;">Unfug</div>	t	t	\N	\N	\N	f
\.


--
-- TOC entry 4187 (class 0 OID 4193428)
-- Dependencies: 249
-- Data for Name: type_coin_marks; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.type_coin_marks (type, coin_mark) FROM stdin;
1	1
1	2
1	4
2	3
2	4
\.


--
-- TOC entry 4193 (class 0 OID 4193807)
-- Dependencies: 255
-- Data for Name: type_coin_verse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_coin_verse (type, coin_verse) FROM stdin;
\.


--
-- TOC entry 4188 (class 0 OID 4193431)
-- Dependencies: 250
-- Data for Name: type_completed; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.type_completed (type) FROM stdin;
\.


--
-- TOC entry 4190 (class 0 OID 4193436)
-- Dependencies: 252
-- Data for Name: type_reviewed; Type: TABLE DATA; Schema: public; Owner: adub
--

COPY public.type_reviewed (type) FROM stdin;
\.


--
-- TOC entry 4271 (class 0 OID 0)
-- Dependencies: 208
-- Name: app_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.app_user_id_seq', 2, true);


--
-- TOC entry 4272 (class 0 OID 0)
-- Dependencies: 210
-- Name: coin_marks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.coin_marks_id_seq', 6, true);


--
-- TOC entry 4273 (class 0 OID 0)
-- Dependencies: 253
-- Name: coin_verse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coin_verse_id_seq', 2, true);


--
-- TOC entry 4274 (class 0 OID 0)
-- Dependencies: 213
-- Name: dynasty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.dynasty_id_seq', 6, true);


--
-- TOC entry 4275 (class 0 OID 0)
-- Dependencies: 215
-- Name: honorific_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.honorific_id_seq', 10, true);


--
-- TOC entry 4276 (class 0 OID 0)
-- Dependencies: 218
-- Name: issuer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.issuer_id_seq', 7, true);


--
-- TOC entry 4277 (class 0 OID 0)
-- Dependencies: 222
-- Name: material_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.material_id_seq', 5, true);


--
-- TOC entry 4278 (class 0 OID 0)
-- Dependencies: 224
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- TOC entry 4279 (class 0 OID 0)
-- Dependencies: 226
-- Name: mint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.mint_id_seq', 4, true);


--
-- TOC entry 4280 (class 0 OID 0)
-- Dependencies: 228
-- Name: nominal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.nominal_id_seq', 5, true);


--
-- TOC entry 4281 (class 0 OID 0)
-- Dependencies: 230
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.notes_id_seq', 1, false);


--
-- TOC entry 4282 (class 0 OID 0)
-- Dependencies: 234
-- Name: overlord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.overlord_id_seq', 10, true);


--
-- TOC entry 4283 (class 0 OID 0)
-- Dependencies: 239
-- Name: person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.person_id_seq', 26, true);


--
-- TOC entry 4284 (class 0 OID 0)
-- Dependencies: 241
-- Name: person_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.person_role_id_seq', 4, true);


--
-- TOC entry 4285 (class 0 OID 0)
-- Dependencies: 243
-- Name: piece_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.piece_id_seq', 6, true);


--
-- TOC entry 4286 (class 0 OID 0)
-- Dependencies: 245
-- Name: province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.province_id_seq', 1, false);


--
-- TOC entry 4287 (class 0 OID 0)
-- Dependencies: 247
-- Name: title_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.title_id_seq', 7, true);


--
-- TOC entry 4288 (class 0 OID 0)
-- Dependencies: 251
-- Name: type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: adub
--

SELECT pg_catalog.setval('public.type_id_seq', 3, true);


--
-- TOC entry 3917 (class 2606 OID 4193457)
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- TOC entry 3919 (class 2606 OID 4193459)
-- Name: app_user app_user_name_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_name_key UNIQUE (name);


--
-- TOC entry 3921 (class 2606 OID 4193461)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3923 (class 2606 OID 4193463)
-- Name: coin_marks coin_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.coin_marks
    ADD CONSTRAINT coin_marks_pkey PRIMARY KEY (id);


--
-- TOC entry 3978 (class 2606 OID 4193806)
-- Name: coin_verse coin_verse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_verse
    ADD CONSTRAINT coin_verse_pkey PRIMARY KEY (id);


--
-- TOC entry 3929 (class 2606 OID 4193465)
-- Name: dynasty dynasty_name_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_name_key UNIQUE (name);


--
-- TOC entry 3931 (class 2606 OID 4193467)
-- Name: dynasty dynasty_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_pkey PRIMARY KEY (id);


--
-- TOC entry 3933 (class 2606 OID 4193469)
-- Name: honorific honorific_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.honorific
    ADD CONSTRAINT honorific_pkey PRIMARY KEY (id);


--
-- TOC entry 3935 (class 2606 OID 4193471)
-- Name: issuer issuer_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_pkey PRIMARY KEY (id);


--
-- TOC entry 3939 (class 2606 OID 4193473)
-- Name: material_color material_color_material_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.material_color
    ADD CONSTRAINT material_color_material_key UNIQUE (material);


--
-- TOC entry 3937 (class 2606 OID 4193475)
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- TOC entry 3941 (class 2606 OID 4193477)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3943 (class 2606 OID 4193479)
-- Name: mint mint_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT mint_pkey PRIMARY KEY (id);


--
-- TOC entry 3945 (class 2606 OID 4193481)
-- Name: nominal nominal_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.nominal
    ADD CONSTRAINT nominal_pkey PRIMARY KEY (id);


--
-- TOC entry 3947 (class 2606 OID 4193483)
-- Name: note note_property_property_id_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_property_property_id_key UNIQUE (property, property_id);


--
-- TOC entry 3925 (class 2606 OID 4193485)
-- Name: comment notes_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3927 (class 2606 OID 4193487)
-- Name: comment notes_text_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT notes_text_key UNIQUE (text);


--
-- TOC entry 3949 (class 2606 OID 4193489)
-- Name: overlord overlord_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_pkey PRIMARY KEY (id);


--
-- TOC entry 3953 (class 2606 OID 4193491)
-- Name: person_color person_color_person_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_key UNIQUE (person);


--
-- TOC entry 3955 (class 2606 OID 4193493)
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_key UNIQUE (person);


--
-- TOC entry 3951 (class 2606 OID 4193495)
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- TOC entry 3957 (class 2606 OID 4193497)
-- Name: person_role person_role_name_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_name_key UNIQUE (name);


--
-- TOC entry 3959 (class 2606 OID 4193499)
-- Name: person_role person_role_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_pkey PRIMARY KEY (id);


--
-- TOC entry 3961 (class 2606 OID 4193501)
-- Name: piece piece_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_pkey PRIMARY KEY (id);


--
-- TOC entry 3963 (class 2606 OID 4193503)
-- Name: province province_name_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_name_key UNIQUE (name);


--
-- TOC entry 3965 (class 2606 OID 4193505)
-- Name: province province_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pkey PRIMARY KEY (id);


--
-- TOC entry 3967 (class 2606 OID 4193507)
-- Name: title title_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.title
    ADD CONSTRAINT title_pkey PRIMARY KEY (id);


--
-- TOC entry 3974 (class 2606 OID 4193509)
-- Name: type_completed type_completed_type_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_key UNIQUE (type);


--
-- TOC entry 3970 (class 2606 OID 4193511)
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (id);


--
-- TOC entry 3972 (class 2606 OID 4193513)
-- Name: type type_project_id_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_project_id_key UNIQUE (project_id);


--
-- TOC entry 3976 (class 2606 OID 4193515)
-- Name: type_reviewed type_reviewed_type_key; Type: CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_key UNIQUE (type);


--
-- TOC entry 3968 (class 1259 OID 4193516)
-- Name: idx_search_vectors; Type: INDEX; Schema: public; Owner: adub
--

CREATE INDEX idx_search_vectors ON public.type USING gin (search_vectors);


--
-- TOC entry 4004 (class 2606 OID 4193517)
-- Name: type_coin_marks cmt_coin_mark_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_coin_mark_fk FOREIGN KEY (coin_mark) REFERENCES public.coin_marks(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4005 (class 2606 OID 4193522)
-- Name: type_coin_marks cmt_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3986 (class 2606 OID 4193527)
-- Name: mint fk_province; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT fk_province FOREIGN KEY (province) REFERENCES public.province(id);


--
-- TOC entry 3981 (class 2606 OID 4193532)
-- Name: issuer_honorifics ih_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_honorific_fk FOREIGN KEY (honorific) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3982 (class 2606 OID 4193537)
-- Name: issuer_honorifics ih_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3979 (class 2606 OID 4193542)
-- Name: issuer issuer_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3980 (class 2606 OID 4193547)
-- Name: issuer issuer_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3983 (class 2606 OID 4193552)
-- Name: issuer_titles it_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3984 (class 2606 OID 4193557)
-- Name: issuer_titles it_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_title_fk FOREIGN KEY (title) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3985 (class 2606 OID 4193562)
-- Name: material_color material_color_material_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.material_color
    ADD CONSTRAINT material_color_material_fkey FOREIGN KEY (material) REFERENCES public.material(id) ON DELETE CASCADE;


--
-- TOC entry 3991 (class 2606 OID 4193567)
-- Name: overlord_honorifics oh_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_honorific_fk FOREIGN KEY (honorific_id) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3992 (class 2606 OID 4193572)
-- Name: overlord_honorifics oh_overlord_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_overlord_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3987 (class 2606 OID 4193577)
-- Name: other_person other_person_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3988 (class 2606 OID 4193582)
-- Name: other_person other_person_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3993 (class 2606 OID 4193587)
-- Name: overlord_titles overlord_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_honorific_fk FOREIGN KEY (title_id) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3989 (class 2606 OID 4193592)
-- Name: overlord overlord_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3994 (class 2606 OID 4193597)
-- Name: overlord_titles overlord_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_title_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3990 (class 2606 OID 4193602)
-- Name: overlord overlord_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3997 (class 2606 OID 4193607)
-- Name: person_color person_color_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person_color
    ADD CONSTRAINT person_color_person_fkey FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3995 (class 2606 OID 4193612)
-- Name: person person_dynasty_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_dynasty_fk FOREIGN KEY (dynasty) REFERENCES public.dynasty(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3998 (class 2606 OID 4193617)
-- Name: person_explorer_custom_sorting person_explorer_custom_sorting_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person_explorer_custom_sorting
    ADD CONSTRAINT person_explorer_custom_sorting_person_fkey FOREIGN KEY (person) REFERENCES public.person(id);


--
-- TOC entry 3996 (class 2606 OID 4193622)
-- Name: person person_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_role_fk FOREIGN KEY (role) REFERENCES public.person_role(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3999 (class 2606 OID 4193627)
-- Name: piece piece_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4008 (class 2606 OID 4193815)
-- Name: type_coin_verse type_coin_verse_coin_verse_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_coin_verse
    ADD CONSTRAINT type_coin_verse_coin_verse_fkey FOREIGN KEY (coin_verse) REFERENCES public.coin_verse(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4009 (class 2606 OID 4193810)
-- Name: type_coin_verse type_coin_verse_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_coin_verse
    ADD CONSTRAINT type_coin_verse_type_fkey FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4006 (class 2606 OID 4193632)
-- Name: type_completed type_completed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4000 (class 2606 OID 4193637)
-- Name: type type_material_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_material_fk FOREIGN KEY (material) REFERENCES public.material(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4001 (class 2606 OID 4193642)
-- Name: type type_mint_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_mint_fk FOREIGN KEY (mint) REFERENCES public.mint(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4002 (class 2606 OID 4193647)
-- Name: type type_nominal_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_nominal_fk FOREIGN KEY (nominal) REFERENCES public.nominal(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4003 (class 2606 OID 4193652)
-- Name: type type_person_caliph_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_person_caliph_fk FOREIGN KEY (caliph) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4007 (class 2606 OID 4193657)
-- Name: type_reviewed type_reviewed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: adub
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4199 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: adub
--

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT USAGE ON SCHEMA public TO test_visitor;


--
-- TOC entry 4202 (class 0 OID 0)
-- Dependencies: 207
-- Name: TABLE app_user; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.app_user TO test_visitor;


--
-- TOC entry 4204 (class 0 OID 0)
-- Dependencies: 208
-- Name: SEQUENCE app_user_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.app_user_id_seq TO test_visitor;


--
-- TOC entry 4205 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE coin_marks; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.coin_marks TO test_visitor;


--
-- TOC entry 4207 (class 0 OID 0)
-- Dependencies: 210
-- Name: SEQUENCE coin_marks_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.coin_marks_id_seq TO test_visitor;


--
-- TOC entry 4208 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE coin_verse; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.coin_verse TO test_visitor;


--
-- TOC entry 4210 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE comment; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.comment TO test_visitor;


--
-- TOC entry 4211 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE dynasty; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.dynasty TO test_visitor;


--
-- TOC entry 4213 (class 0 OID 0)
-- Dependencies: 213
-- Name: SEQUENCE dynasty_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.dynasty_id_seq TO test_visitor;


--
-- TOC entry 4214 (class 0 OID 0)
-- Dependencies: 205
-- Name: TABLE geography_columns; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.geography_columns TO test_visitor;


--
-- TOC entry 4215 (class 0 OID 0)
-- Dependencies: 206
-- Name: TABLE geometry_columns; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.geometry_columns TO test_visitor;


--
-- TOC entry 4216 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE honorific; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.honorific TO test_visitor;


--
-- TOC entry 4218 (class 0 OID 0)
-- Dependencies: 215
-- Name: SEQUENCE honorific_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.honorific_id_seq TO test_visitor;


--
-- TOC entry 4219 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE issuer; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.issuer TO test_visitor;


--
-- TOC entry 4220 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE issuer_honorifics; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.issuer_honorifics TO test_visitor;


--
-- TOC entry 4222 (class 0 OID 0)
-- Dependencies: 218
-- Name: SEQUENCE issuer_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.issuer_id_seq TO test_visitor;


--
-- TOC entry 4223 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE issuer_titles; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.issuer_titles TO test_visitor;


--
-- TOC entry 4224 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE material; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.material TO test_visitor;


--
-- TOC entry 4225 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE material_color; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.material_color TO test_visitor;


--
-- TOC entry 4227 (class 0 OID 0)
-- Dependencies: 222
-- Name: SEQUENCE material_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.material_id_seq TO test_visitor;


--
-- TOC entry 4228 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE migrations; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.migrations TO test_visitor;


--
-- TOC entry 4230 (class 0 OID 0)
-- Dependencies: 224
-- Name: SEQUENCE migrations_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.migrations_id_seq TO test_visitor;


--
-- TOC entry 4231 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE mint; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.mint TO test_visitor;


--
-- TOC entry 4233 (class 0 OID 0)
-- Dependencies: 226
-- Name: SEQUENCE mint_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.mint_id_seq TO test_visitor;


--
-- TOC entry 4234 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE nominal; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.nominal TO test_visitor;


--
-- TOC entry 4236 (class 0 OID 0)
-- Dependencies: 228
-- Name: SEQUENCE nominal_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.nominal_id_seq TO test_visitor;


--
-- TOC entry 4237 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE note; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.note TO test_visitor;


--
-- TOC entry 4239 (class 0 OID 0)
-- Dependencies: 230
-- Name: SEQUENCE notes_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.notes_id_seq TO test_visitor;


--
-- TOC entry 4240 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE other_person; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.other_person TO test_visitor;


--
-- TOC entry 4241 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE overlord; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.overlord TO test_visitor;


--
-- TOC entry 4242 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE overlord_honorifics; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.overlord_honorifics TO test_visitor;


--
-- TOC entry 4244 (class 0 OID 0)
-- Dependencies: 234
-- Name: SEQUENCE overlord_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.overlord_id_seq TO test_visitor;


--
-- TOC entry 4245 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE overlord_titles; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.overlord_titles TO test_visitor;


--
-- TOC entry 4246 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE person; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.person TO test_visitor;


--
-- TOC entry 4247 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE person_color; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.person_color TO test_visitor;


--
-- TOC entry 4248 (class 0 OID 0)
-- Dependencies: 238
-- Name: TABLE person_explorer_custom_sorting; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.person_explorer_custom_sorting TO test_visitor;


--
-- TOC entry 4250 (class 0 OID 0)
-- Dependencies: 239
-- Name: SEQUENCE person_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.person_id_seq TO test_visitor;


--
-- TOC entry 4251 (class 0 OID 0)
-- Dependencies: 240
-- Name: TABLE person_role; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.person_role TO test_visitor;


--
-- TOC entry 4253 (class 0 OID 0)
-- Dependencies: 241
-- Name: SEQUENCE person_role_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.person_role_id_seq TO test_visitor;


--
-- TOC entry 4254 (class 0 OID 0)
-- Dependencies: 242
-- Name: TABLE piece; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.piece TO test_visitor;


--
-- TOC entry 4256 (class 0 OID 0)
-- Dependencies: 243
-- Name: SEQUENCE piece_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.piece_id_seq TO test_visitor;


--
-- TOC entry 4257 (class 0 OID 0)
-- Dependencies: 244
-- Name: TABLE province; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.province TO test_visitor;


--
-- TOC entry 4259 (class 0 OID 0)
-- Dependencies: 245
-- Name: SEQUENCE province_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.province_id_seq TO test_visitor;


--
-- TOC entry 4260 (class 0 OID 0)
-- Dependencies: 203
-- Name: TABLE spatial_ref_sys; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.spatial_ref_sys TO test_visitor;


--
-- TOC entry 4261 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE title; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.title TO test_visitor;


--
-- TOC entry 4263 (class 0 OID 0)
-- Dependencies: 247
-- Name: SEQUENCE title_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.title_id_seq TO test_visitor;


--
-- TOC entry 4264 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE type; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.type TO test_visitor;


--
-- TOC entry 4265 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE type_coin_marks; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.type_coin_marks TO test_visitor;


--
-- TOC entry 4266 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE type_coin_verse; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.type_coin_verse TO test_visitor;


--
-- TOC entry 4267 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE type_completed; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.type_completed TO test_visitor;


--
-- TOC entry 4269 (class 0 OID 0)
-- Dependencies: 251
-- Name: SEQUENCE type_id_seq; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON SEQUENCE public.type_id_seq TO test_visitor;


--
-- TOC entry 4270 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE type_reviewed; Type: ACL; Schema: public; Owner: adub
--

GRANT SELECT ON TABLE public.type_reviewed TO test_visitor;


--
-- TOC entry 2723 (class 826 OID 4193662)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: adub
--

ALTER DEFAULT PRIVILEGES FOR ROLE adub IN SCHEMA public REVOKE ALL ON TABLES  FROM adub;
ALTER DEFAULT PRIVILEGES FOR ROLE adub IN SCHEMA public GRANT SELECT ON TABLES  TO test_visitor;


-- Completed on 2022-11-17 16:57:36

--
-- PostgreSQL database dump complete
--

