import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsContact extends Struct.ComponentSchema {
  collectionName: 'components_sections_contacts';
  info: {
    description: 'Section de contact avec formulaire et informations';
    displayName: 'Contact';
  };
  attributes: {
    contactInfo: Schema.Attribute.Component<'ui.contact-info', false>;
    showForm: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Section hero avec titre, description et boutons';
    displayName: 'Hero';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    primaryButton: Schema.Attribute.Component<'ui.button', false>;
    secondaryButton: Schema.Attribute.Component<'ui.button', false>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsServices extends Struct.ComponentSchema {
  collectionName: 'components_sections_services';
  info: {
    description: 'Section de services avec liste de services';
    displayName: 'Services';
  };
  attributes: {
    services: Schema.Attribute.Component<'ui.service', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsTitre extends Struct.ComponentSchema {
  collectionName: 'components_sections_titres';
  info: {
    displayName: 'Titre';
  };
  attributes: {
    texte: Schema.Attribute.String;
  };
}

export interface SeoMetadataSchema extends Struct.ComponentSchema {
  collectionName: 'components_seo_metadata';
  info: {
    description: 'Composant pour g\u00E9rer les m\u00E9tadonn\u00E9es SEO';
    displayName: 'SEO Metadata';
    icon: 'search';
  };
  attributes: {
    author: Schema.Attribute.String;
    canonical: Schema.Attribute.String;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    keywords: Schema.Attribute.Text;
    modifiedTime: Schema.Attribute.DateTime;
    ogDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogType: Schema.Attribute.Enumeration<
      ['website', 'article', 'profile', 'book']
    > &
      Schema.Attribute.DefaultTo<'website'>;
    publishedTime: Schema.Attribute.DateTime;
    robots: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'index, follow'>;
    section: Schema.Attribute.String;
    tags: Schema.Attribute.JSON;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    twitterCard: Schema.Attribute.Enumeration<
      ['summary', 'summary_large_image', 'app', 'player']
    > &
      Schema.Attribute.DefaultTo<'summary_large_image'>;
    twitterCreator: Schema.Attribute.String;
    twitterSite: Schema.Attribute.String;
  };
}

export interface UiButton extends Struct.ComponentSchema {
  collectionName: 'components_ui_buttons';
  info: {
    description: 'Bouton r\u00E9utilisable avec texte et lien';
    displayName: 'Button';
  };
  attributes: {
    icon: Schema.Attribute.String;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface UiContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_ui_contact_infos';
  info: {
    description: 'Informations de contact (email, t\u00E9l\u00E9phone, adresse)';
    displayName: 'Contact Info';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
    socialLinks: Schema.Attribute.JSON;
  };
}

export interface UiService extends Struct.ComponentSchema {
  collectionName: 'components_ui_services';
  info: {
    description: 'Service individuel avec ic\u00F4ne, titre et description';
    displayName: 'Service';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      ['blue', 'green', 'purple', 'red', 'yellow', 'indigo']
    > &
      Schema.Attribute.DefaultTo<'blue'>;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.contact': SectionsContact;
      'sections.hero': SectionsHero;
      'sections.services': SectionsServices;
      'sections.titre': SectionsTitre;
      'seo-metadata.schema': SeoMetadataSchema;
      'ui.button': UiButton;
      'ui.contact-info': UiContactInfo;
      'ui.service': UiService;
    }
  }
}
