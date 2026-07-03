# Contenu juridique — CGU & Mentions légales

## Version

- **Version** : `v1`
- **Date d'entrée en vigueur** : `2026-07-03`
- **Constante de référence** : `src/lib/termsVersion.ts` (`TERMS_VERSION`, `TERMS_VERSION_DATE`)
- Cette version sert de référence à la persistance back (`terms_version`).

## Statut de validation juridique

> **À FAIRE VALIDER PAR LE JURIDIQUE**

Le contenu ci-dessous est une rédaction de travail. Il n'a pas encore été relu ni
approuvé par un juriste. Aucune valeur réelle n'est renseignée dans les mentions
légales : tous les champs à caractère factuel sont laissés sous forme de
placeholders explicites à compléter avant mise en production.

| Élément | Statut |
| --- | --- |
| Texte des CGU | À valider par le juridique |
| Texte des mentions légales | À valider par le juridique |
| Placeholders LCEN | À compléter par le juridique |

## Emplacement du contenu

Le contenu est intégrable via le catalogue i18n existant du portail :
`src/i18n/messages.ts`, langues `fr` et `en`.

- CGU : clés `auth.cgu.*`
- Mentions légales : clés `auth.legal.*`

## Placeholders à compléter (mentions légales — LCEN)

Chaque champ possède une clé `.label` (libellé) et une clé `.value` (valeur à
remplacer). Les valeurs sont actuellement des placeholders au format
`[À COMPLÉTER PAR LE JURIDIQUE — …]` (fr) et `[TO BE COMPLETED BY LEGAL — …]` (en).

| Champ LCEN | Clé i18n (`.value`) |
| --- | --- |
| Raison sociale | `auth.legal.editor.companyName.value` |
| Forme juridique | `auth.legal.editor.legalForm.value` |
| Capital social | `auth.legal.editor.shareCapital.value` |
| Siège social | `auth.legal.editor.headOffice.value` |
| Immatriculation (RCS) | `auth.legal.editor.rcs.value` |
| TVA intracommunautaire | `auth.legal.editor.vat.value` |
| Contact — adresse électronique | `auth.legal.contact.email.value` |
| Contact — téléphone | `auth.legal.contact.phone.value` |
| Directeur de la publication | `auth.legal.publicationDirector.name.value` |
| Hébergeur — dénomination | `auth.legal.host.name.value` |
| Hébergeur — adresse | `auth.legal.host.address.value` |
| Hébergeur — contact | `auth.legal.host.contact.value` |

## Structure des clés CGU

- `auth.cgu.title` — titre du document
- `auth.cgu.versionLabel` — libellé de version (variables `{version}` et `{date}`)
- `auth.cgu.object.{title,body}` — 1. Objet
- `auth.cgu.acceptance.{title,body}` — 2. Acceptation des CGU
- `auth.cgu.services.{title,intro,authenticator,drive,budgy,admin}` — 3. Description des Services
- `auth.cgu.account.{title,body}` — 4. Compte utilisateur
- `auth.cgu.obligations.{title,intro,item1,item2,item3,item4}` — 5. Obligations de l'Utilisateur
- `auth.cgu.driveStorage.{title,body}` — 6. Stockage et partage de fichiers (Drive)
- `auth.cgu.banking.{title,body}` — 7. Agrégation bancaire (Budgy)
- `auth.cgu.personalData.{title,body}` — 8. Données personnelles
- `auth.cgu.intellectualProperty.{title,body}` — 9. Propriété intellectuelle
- `auth.cgu.liability.{title,body}` — 10. Responsabilité
- `auth.cgu.availability.{title,body}` — 11. Disponibilité et évolution des Services
- `auth.cgu.termination.{title,body}` — 12. Suspension et résiliation
- `auth.cgu.modifications.{title,body}` — 13. Modification des CGU
- `auth.cgu.governingLaw.{title,body}` — 14. Droit applicable et juridiction compétente
