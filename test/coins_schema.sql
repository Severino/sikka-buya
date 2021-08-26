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
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_user (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password character varying,
    super boolean
);


ALTER TABLE public.app_user OWNER TO postgres;

--
-- Name: app_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.app_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.app_user_id_seq OWNER TO postgres;

--
-- Name: app_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id;


--
-- Name: coin_marks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coin_marks (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.coin_marks OWNER TO postgres;

--
-- Name: coin_marks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coin_marks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coin_marks_id_seq OWNER TO postgres;

--
-- Name: coin_marks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coin_marks_id_seq OWNED BY public.coin_marks.id;


--
-- Name: dynasty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dynasty (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.dynasty OWNER TO postgres;

--
-- Name: dynasty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dynasty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dynasty_id_seq OWNER TO postgres;

--
-- Name: dynasty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dynasty_id_seq OWNED BY public.dynasty.id;


--
-- Name: honorific; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.honorific (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.honorific OWNER TO postgres;

--
-- Name: honorific_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.honorific_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.honorific_id_seq OWNER TO postgres;

--
-- Name: honorific_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.honorific_id_seq OWNED BY public.honorific.id;


--
-- Name: issuer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issuer (
    id integer NOT NULL,
    type integer,
    person integer
);


ALTER TABLE public.issuer OWNER TO postgres;

--
-- Name: issuer_honorifics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issuer_honorifics (
    issuer integer,
    honorific integer
);


ALTER TABLE public.issuer_honorifics OWNER TO postgres;

--
-- Name: issuer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.issuer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.issuer_id_seq OWNER TO postgres;

--
-- Name: issuer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.issuer_id_seq OWNED BY public.issuer.id;


--
-- Name: issuer_titles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.issuer_titles (
    issuer integer,
    title integer
);


ALTER TABLE public.issuer_titles OWNER TO postgres;

--
-- Name: material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.material OWNER TO postgres;

--
-- Name: material_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.material_id_seq OWNER TO postgres;

--
-- Name: material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: mint; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mint (
    id integer NOT NULL,
    name character varying,
    unsafe boolean,
    location public.geometry,
    uncertain boolean,
    uncertain_area public.geometry
);


ALTER TABLE public.mint OWNER TO postgres;

--
-- Name: mint_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mint_id_seq OWNER TO postgres;

--
-- Name: mint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mint_id_seq OWNED BY public.mint.id;


--
-- Name: nominal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nominal (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.nominal OWNER TO postgres;

--
-- Name: nominal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nominal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nominal_id_seq OWNER TO postgres;

--
-- Name: nominal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nominal_id_seq OWNED BY public.nominal.id;


--
-- Name: other_person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.other_person (
    type integer,
    person integer
);


ALTER TABLE public.other_person OWNER TO postgres;

--
-- Name: overlord; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.overlord (
    id integer NOT NULL,
    rank integer,
    type integer,
    person integer
);


ALTER TABLE public.overlord OWNER TO postgres;

--
-- Name: overlord_honorifics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.overlord_honorifics (
    overlord_id integer,
    honorific_id integer
);


ALTER TABLE public.overlord_honorifics OWNER TO postgres;

--
-- Name: overlord_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.overlord_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.overlord_id_seq OWNER TO postgres;

--
-- Name: overlord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.overlord_id_seq OWNED BY public.overlord.id;


--
-- Name: overlord_titles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.overlord_titles (
    overlord_id integer,
    title_id integer
);


ALTER TABLE public.overlord_titles OWNER TO postgres;

--
-- Name: person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person (
    id integer NOT NULL,
    name character varying,
    role_legacy character varying,
    dynasty integer,
    short_name character varying,
    role integer
);


ALTER TABLE public.person OWNER TO postgres;

--
-- Name: person_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.person_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_id_seq OWNER TO postgres;

--
-- Name: person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.person_id_seq OWNED BY public.person.id;


--
-- Name: person_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person_role (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.person_role OWNER TO postgres;

--
-- Name: person_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.person_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.person_role_id_seq OWNER TO postgres;

--
-- Name: person_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.person_role_id_seq OWNED BY public.person_role.id;


--
-- Name: piece; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.piece (
    id integer NOT NULL,
    piece character varying,
    type integer
);


ALTER TABLE public.piece OWNER TO postgres;

--
-- Name: piece_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.piece_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.piece_id_seq OWNER TO postgres;

--
-- Name: piece_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.piece_id_seq OWNED BY public.piece.id;


--
-- Name: title; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.title (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.title OWNER TO postgres;

--
-- Name: title_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.title_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.title_id_seq OWNER TO postgres;

--
-- Name: title_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.title_id_seq OWNED BY public.title.id;


--
-- Name: type; Type: TABLE; Schema: public; Owner: postgres
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
    year_uncertain boolean
);


ALTER TABLE public.type OWNER TO postgres;

--
-- Name: type_coin_marks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_coin_marks (
    type integer,
    coin_mark integer
);


ALTER TABLE public.type_coin_marks OWNER TO postgres;

--
-- Name: type_completed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_completed (
    type integer NOT NULL
);


ALTER TABLE public.type_completed OWNER TO postgres;

--
-- Name: type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.type_id_seq OWNER TO postgres;

--
-- Name: type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_id_seq OWNED BY public.type.id;


--
-- Name: type_reviewed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_reviewed (
    type integer NOT NULL
);


ALTER TABLE public.type_reviewed OWNER TO postgres;

--
-- Name: app_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass);


--
-- Name: coin_marks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_marks ALTER COLUMN id SET DEFAULT nextval('public.coin_marks_id_seq'::regclass);


--
-- Name: dynasty id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dynasty ALTER COLUMN id SET DEFAULT nextval('public.dynasty_id_seq'::regclass);


--
-- Name: honorific id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.honorific ALTER COLUMN id SET DEFAULT nextval('public.honorific_id_seq'::regclass);


--
-- Name: issuer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer ALTER COLUMN id SET DEFAULT nextval('public.issuer_id_seq'::regclass);


--
-- Name: material id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: mint id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mint ALTER COLUMN id SET DEFAULT nextval('public.mint_id_seq'::regclass);


--
-- Name: nominal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nominal ALTER COLUMN id SET DEFAULT nextval('public.nominal_id_seq'::regclass);


--
-- Name: overlord id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord ALTER COLUMN id SET DEFAULT nextval('public.overlord_id_seq'::regclass);


--
-- Name: person id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person ALTER COLUMN id SET DEFAULT nextval('public.person_id_seq'::regclass);


--
-- Name: person_role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_role ALTER COLUMN id SET DEFAULT nextval('public.person_role_id_seq'::regclass);


--
-- Name: piece id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece ALTER COLUMN id SET DEFAULT nextval('public.piece_id_seq'::regclass);


--
-- Name: title id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.title ALTER COLUMN id SET DEFAULT nextval('public.title_id_seq'::regclass);


--
-- Name: type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type ALTER COLUMN id SET DEFAULT nextval('public.type_id_seq'::regclass);


--
-- Name: app_user app_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_email_key UNIQUE (email);


--
-- Name: app_user app_user_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_name_key UNIQUE (name);


--
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id);


--
-- Name: coin_marks coin_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coin_marks
    ADD CONSTRAINT coin_marks_pkey PRIMARY KEY (id);


--
-- Name: dynasty dynasty_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_name_key UNIQUE (name);


--
-- Name: dynasty dynasty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dynasty
    ADD CONSTRAINT dynasty_pkey PRIMARY KEY (id);


--
-- Name: honorific honorific_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.honorific
    ADD CONSTRAINT honorific_pkey PRIMARY KEY (id);


--
-- Name: issuer issuer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_pkey PRIMARY KEY (id);


--
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: mint mint_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mint
    ADD CONSTRAINT mint_pkey PRIMARY KEY (id);


--
-- Name: nominal nominal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nominal
    ADD CONSTRAINT nominal_pkey PRIMARY KEY (id);


--
-- Name: overlord overlord_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_pkey PRIMARY KEY (id);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: person_role person_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_name_key UNIQUE (name);


--
-- Name: person_role person_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person_role
    ADD CONSTRAINT person_role_pkey PRIMARY KEY (id);


--
-- Name: piece piece_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_pkey PRIMARY KEY (id);


--
-- Name: title title_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.title
    ADD CONSTRAINT title_pkey PRIMARY KEY (id);


--
-- Name: type_completed type_completed_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_key UNIQUE (type);


--
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (id);


--
-- Name: type type_project_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_project_id_key UNIQUE (project_id);


--
-- Name: type_reviewed type_reviewed_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_key UNIQUE (type);


--
-- Name: type_coin_marks cmt_coin_mark_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_coin_mark_fk FOREIGN KEY (coin_mark) REFERENCES public.coin_marks(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: type_coin_marks cmt_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_coin_marks
    ADD CONSTRAINT cmt_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: issuer_honorifics ih_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_honorific_fk FOREIGN KEY (honorific) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: issuer_honorifics ih_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer_honorifics
    ADD CONSTRAINT ih_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: issuer issuer_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: issuer issuer_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer
    ADD CONSTRAINT issuer_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: issuer_titles it_issuer_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_issuer_fk FOREIGN KEY (issuer) REFERENCES public.issuer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: issuer_titles it_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.issuer_titles
    ADD CONSTRAINT it_title_fk FOREIGN KEY (title) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: overlord_honorifics oh_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_honorific_fk FOREIGN KEY (honorific_id) REFERENCES public.honorific(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: overlord_honorifics oh_overlord_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord_honorifics
    ADD CONSTRAINT oh_overlord_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: other_person other_person_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: other_person other_person_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.other_person
    ADD CONSTRAINT other_person_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: overlord_titles overlord_honorific_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_honorific_fk FOREIGN KEY (title_id) REFERENCES public.title(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: overlord overlord_person_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_person_fk FOREIGN KEY (person) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: overlord_titles overlord_title_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord_titles
    ADD CONSTRAINT overlord_title_fk FOREIGN KEY (overlord_id) REFERENCES public.overlord(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: overlord overlord_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.overlord
    ADD CONSTRAINT overlord_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: person person_dynasty_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_dynasty_fk FOREIGN KEY (dynasty) REFERENCES public.dynasty(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: person person_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_role_fk FOREIGN KEY (role) REFERENCES public.person_role(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: piece piece_type_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_type_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: type_completed type_completed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_completed
    ADD CONSTRAINT type_completed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: type type_material_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_material_fk FOREIGN KEY (material) REFERENCES public.material(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type type_mint_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_mint_fk FOREIGN KEY (mint) REFERENCES public.mint(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type type_nominal_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_nominal_fk FOREIGN KEY (nominal) REFERENCES public.nominal(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type type_person_caliph_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_person_caliph_fk FOREIGN KEY (caliph) REFERENCES public.person(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: type_reviewed type_reviewed_type_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_reviewed
    ADD CONSTRAINT type_reviewed_type_id_fk FOREIGN KEY (type) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

