# SecurityMatch - voortgangsoverzicht

Datum: 27 augustus 2026

## Laatst bevestigde status

De laatste geregistreerde werkzaamheden gingen over een lokale productie-preview en een mogelijke online deployment.

- Productiebuild geslaagd.
- 53 routes waren tijdens de laatste controle beschikbaar.
- Laatst bevestigde lokale preview: http://localhost:3001
- De preview draait nu niet meer als actief Node-proces.
- Een online deployment is in de sessiehistorie niet bevestigd.
- De git-status kon niet worden gecontroleerd omdat .git/config beschadigd lijkt.

## Wat is gebouwd

### Basis en techniek

- Next.js 16.3.1 met App Router
- TypeScript, React en Tailwind CSS
- ESLint en productiebuild
- Prisma met PostgreSQL-schema en migraties
- Auth.js / NextAuth-authenticatie
- Projectstructuur voor components, hooks, lib, types, docs en tests
- .env.example en README.md

### Accounts en rollen

- Registreren en inloggen
- E-mailverificatie
- Wachtwoord vergeten en resetten
- Rollen voor opdrachtgever, ZZP-beveiliger en admin
- Rolafhankelijke dashboards en navigatie
- Verplichte profielgegevens per rol

### Marketplace en werkstromen

- Opdrachten aanmaken, publiceren en bekijken
- Beveiligers kunnen reageren
- Opdrachtgever kan reacties beoordelen en een beveiliger koppelen
- Beschikbaarheid en agenda
- Privéberichten tussen gebruikers
- Reviews
- Documenten en verificatie

### Betalingen

- Stripe Connect Express onboarding voor beveiligers
- Stripe Checkout in testmodus
- Instelbare platformcommissie, standaard 10 procent
- Webhook-signature-verificatie
- Betaling- en payoutregistratie
- PDF-facturen
- Overzichten voor opdrachtgever, beveiliger en admin

### Juridisch en beheer

- Voorwaarden
- Privacy
- Cookies
- Klachten
- Annuleren
- Verificatie
- Veiligheid en moderatie
- Toegankelijkheid
- Juridische footer op de pagina's
- Meldpunt voor ingelogde gebruikers
- Adminqueue voor meldingen
- Admininstellingen en rapportages

## Validaties die zijn uitgevoerd

- Node.js 24.14.1 beschikbaar
- npm 11.11.0 beschikbaar
- npm run lint geslaagd tijdens de laatste geregistreerde controle
- npm run build geslaagd tijdens de laatste geregistreerde controle
- TypeScript-controle zonder foutuitvoer tijdens de laatste controle
- Beschermde routes getest op doorsturen naar login

## Nog open of te controleren

- Deployment naar een online hostingomgeving afronden en de echte URL vastleggen.
- Productieomgeving instellen met PostgreSQL, Auth.js, e-mail en Stripe-webhooks.
- Juridische bedrijfsgegevens invullen in de environment-variabelen.
- Stripe- en betaalflows volledig doorlopen met testaccounts.
- Git-configuratie herstellen voordat commit- of branchinformatie betrouwbaar kan worden gecontroleerd.
- End-to-end tests en gebruikersacceptatietest uitvoeren op desktop en mobiel.
- Productie-eisen afronden: object storage, back-ups, monitoring, btw-regels en supportproces.

## Conclusie

SecurityMatch is verder dan een basispagina en vormt momenteel een uitgebreide lokale marketplace-basis. De applicatie is lokaal gebouwd en gecontroleerd met een geslaagde productiebuild. De online publicatie en productie-inrichting zijn nog niet aantoonbaar afgerond.
