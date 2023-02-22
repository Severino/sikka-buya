<template>
  <div id="landing-page" class="page">
    <header id="hero-header">
      <div class="content-wrapper">
        <div class="content">
          <CMSImage id="header-left-image" mode="contain" identity="landing-page-header-left-image" />
        </div>
      </div>
      <CMSImage id="hero-image" identity="landing-page-hero-image" alt="Vorschaubild der politischen Karte" />
    </header>
    <navigation :hideLogo="true" />
    <section>
      <div class="logo-showcase">
        <div class="content-wrapper grid col-3">
          <div id="uni-logo" class="cell smaller">
            <img src="/image/logos/Logo_Universitaet_Tuebingen.svg" alt="Logo der Universität Tübingen" />
          </div>
          <div class="cell">
            <img src="/image/logos/sikka-buya-big-old-logo.svg" alt="Logo des Sikka-Buya Projektes" />
          </div>
          <div id="thyssen-logo" class="cell smaller">
            <img src="/image/logos/thyssen_stiftung.jpg" alt="Logo der Thyssen Stiftung" />
          </div>
        </div>
      </div>
    </section>

    <div class="columns content-wrapper">
      <div class="main-column">
        <section>
          <div class="subtitled">
            <h1>Willkommen bei sikka:būya</h1>
            <span class="subtitle">Ein Online-Portal zur Münzprägung der Būyiden</span>
          </div>

          <p>
            Gefördert von der Fritz Thyssen Stiftung sollen im ersten
            Online-Themenportal der islamischen Numismatik neben einem
            innovativen Typenkatalog vor allem neue digitale Anwendungen zur
            Analyse und aussagekräftigen Visualisierung jener einzigartigen
            Informationsfülle geboten werden, welche insbesondere in den
            umfangreichen Inschriften islamischer Münzen gespeichert ist.
            Ausgewählt wurden hierfür die Prägungen der
            <a href="https://de.wikipedia.org/wiki/Buyiden" target="_blank" class="external-link"
              rel="noreferrer">Būyiden-Dynastie</a>, welche im 10. und 11. Jh. über weite Teile Irans und des Iraks
            gebot (ca. 100 bekannte Prägeorte). Ihr Reich stellte einen
            komplexen Herrschaftsverband dar, in dem unter wechselnder Führung
            verschiedene, oft rivalisierende Būyiden-Linien regierten und auch
            diverse Vasallendynastien integriert waren. Die Münzen geben
            hierüber urkundenartig Auskunft, indem auf ihnen nicht nur Prägeort
            und -jahr genau angegeben sind, sondern auch all die Machthaber,
            welche es auf Grund ihrer Stellung in der hierarchischen Ordnung zu
            nennen galt. Zu den Zielen unseres interdisziplinären Projekts
            gehört es, diese detaillierten Informationen zu Machtverhältnissen,
            Herrschaftsstrukturen und Beziehungsgeflechten, aber auch weitere
            numismatische Merkmale, welche etwa Rückschlüsse auf die ökonomische
            Situation und kulturelle Entwicklung erlauben, systematisch zu
            erfassen, zu verknüpfen und so auswertbar zu machen. Hierzu soll in
            erster Linie eine interaktive Kartographie-Anwendung dienen, die
            etwa gezielte Abfragen in Form auswählbarer Kombinationen von Orten,
            Personen und Zeiten ermöglicht. Beispielsweise kann so in Hinblick
            auf die Entwicklung būyidischer Teilfürstentümer oder rivalisierende
            Kalifen ermittelt werden, wer wo und wann die Oberherrschaft einer
            bestimmten Person anerkannte/ablehnte, wobei die Abhängigkeiten,
            Hoheitsgebiete usw. über eine spezielle (Farb- und Form-)Symbolik
            deutlich werden. Wir wollen zeigen, dass gerade der numismatische
            Ansatz geeignet ist, um zu einer besseren Vorstellung von einem
            Reich wie dem der Būyiden zu gelangen, und vorführen, wie sich aus
            einzelnen Materialdaten ein Gesamtbild generieren lässt, das neue
            Einblicke in den Aufbau und die Funktionsweise so eines Reiches
            gewährt.
          </p>
        </section>
      </div>
      <aside>
        <card-link :to="{ name: 'Map Overview' }" identity="landing-page-map-link"  direction="row">
          Karten
        </card-link>
        <card-link :to="{ name: 'Catalog Overview' }" identity="landing-page-catalog-link" 
          direction="row">
          Typenkatalog
        </card-link>
      </aside>
    </div>
    <news />
    <page-footer />
  </div>
</template>

<script>
import LoginVariant from 'vue-material-design-icons/LoginVariant';
import CMSImage from '../cms/CMSImage.vue';
import Button from '../layout/buttons/Button.vue';
import Row from '../layout/Row.vue';
import Navigation from '../Navigation.vue';
import CardLink from '../navigation/CardLink.vue';
import News from './News.vue';
import PageFooter from './PageFooter.vue';

export default {
  name: 'PlaceholderLandingPage',
  components: {
    LoginVariant,
    Row,
    Button,
    PageFooter,
    Navigation,
    News,
    CardLink,
    CMSImage,
  },
};
</script>

<style lang="scss">
#landing-page {

  .card-link {
    max-height: 300px;

    >* {
      flex: 1;
    }
  }

  .navigation {
    position: relative;

    .brand {
      display: none;
    }

    .nav-menu {
      flex: 1;
      padding: 0;
    }

    nav {
      width: 100%;

      ul {
        display: flex;
        width: 100%;

        >* {
          flex: 1;
          text-align: center;

          $light-border: 1px solid whitesmoke;

          &:first-of-type {
            border-left: $light-border;
          }

          border-right: $light-border;

          transition: all 0.3s;

          a {
            font-weight: bold;
            box-sizing: border-box;
            padding: 0.8em 0;
            color: $gray;
            border-bottom: 2px solid $white;

            transition: all 0.3s;

            &:hover {
              color: $dark-gray;
              background-color: whitesmoke;
              border-bottom: 2px solid $primary-color;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
#header-left-image {
  position: absolute;
  top: 50%;
  left: 0;
  height: 66%;
  min-width: 300px;
  transform: translateY(-50%);
  pointer-events: all;
}

#hero-header {
  display: flex;
  min-height: 100px;
  max-height: 35vh;
  background-color: pink;

  .image {
    flex: 1;
  }

  .content-wrapper {
    z-index: 1;
  }

  .content {
    height: 100%;
  }

  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    box-shadow: inset 0 0 $shadow-spread $strong-shadow-color;
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    right: -10px;
    z-index: 1;
    pointer-events: none;
  }

  .content-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}

section:first-of-type {
  margin-top: 0;
}

.logo-showcase {
  position: relative;
  background-color: white;
  min-height: 50px;
  height: 150px;
  padding: 10px;
  box-sizing: border-box;

  .content-wrapper {
    padding: 0 150px;

    @include media_tablet {
      padding: 0 20px;
    }
  }

  .cell {
    align-self: center;
    max-height: 80%;
  }

  #thyssen-logo {
    max-height: 80%;
  }

  #uni-logo {
    max-height: 50%;
  }

  &:before {
    content: '';
    position: absolute;
    bottom: 2px;
    width: 100%;
    border-bottom: 6px dotted whitesmoke;
  }

  .grid {
    grid-template-columns: 1fr 2fr 1fr;

    height: 100%;
    max-height: 100%;
    gap: 100px;

    @include media-tablet {
      gap: 20px;
    }

    .cell {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      overflow: hidden;

      >img {
        display: block;
        width: 100%;
        // height: 100%;
        object-fit: contain;
      }
    }
  }
}

.box {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: $small-border-radius;
  border: $border;

  color: $black;

  .body {
    padding: $large-padding;
    // flex: 1;
  }

  header {
    position: relative;
    background-color: $gray;
    min-height: 200px;
    padding: $large-padding;

    flex: 1;

    h3 {
      position: absolute;
      bottom: $large-padding;
      margin: 0;
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    padding: $large-padding;

    .button {
      align-self: flex-end;
    }
  }
}

.columns {
  display: grid;
  grid-template-columns: 10fr 10fr;
  gap: 50px;
}

aside {
  // background-color: $dark-gray;
  padding: 50px;
  padding-right: 0;

  display: flex;
  flex-direction: column;

  gap: $large-padding;
  // border-radius: $border-radius;
  // box-shadow: inset $shadow;
  border-left: 5px dotted $white;

  h2 {
    color: gray;
  }
}
</style>