# Juridische launch-checklist

Dit document is een werkdocument en geen juridisch advies. Laat de uiteindelijke teksten en het bedrijfsmodel beoordelen door een Nederlandse privacy- en ondernemingsrechtjurist.

## Gegevens van de verantwoordelijke

- [ ] Juridische naam, handelsnaam, adres, KvK, btw-nummer en contactgegevens vastgesteld.
- [ ] `NEXT_PUBLIC_LEGAL_*` ingevuld in Vercel Production en Preview waar nodig.
- [ ] Footer en alle juridische pagina's gecontroleerd na deployment.

## AVG

- [ ] Verwerkingsregister opgesteld met doel, grondslag, gegevens, ontvangers en bewaartermijn.
- [ ] Verwerkersovereenkomsten gecontroleerd met Vercel, Neon/PostgreSQL, Resend, Stripe en Vercel Blob.
- [ ] Hostingregio's, subverwerkers en doorgiften buiten de EER gedocumenteerd.
- [ ] DPIA beoordeeld voor identiteitsdocumenten, beveiligingsdocumenten en verificatie.
- [ ] Procedure voor inzage, correctie, verwijdering, beperking, bezwaar en dataportabiliteit getest.
- [ ] Datalekprocedure, contactpersoon en register ingericht.
- [ ] Bewaartermijnen voor documenten, berichten, logs, accounts, betalingen en facturen vastgesteld.
- [ ] Documentverwijdering, expiratie, toegangsaudit en back-ups getest.

## Cookies en tracking

- [ ] Alleen strikt noodzakelijke cookies actief zonder toestemming.
- [ ] Voor analytics/marketing een consentplatform toegevoegd dat scripts blokkeert vóór toestemming.
- [ ] Toestemming, intrekking en leverancierslijst getest en gedocumenteerd.
- [ ] Cookiebeleid exact afgestemd op de werkelijk actieve cookies.

## Platform en beveiliging

- [ ] Rolautorisatie getest met bezoeker, opdrachtgever, beveiliger en admin.
- [ ] Uploadbeveiliging, malwarecontrole, rate limiting en documenttoegang getest.
- [ ] Stripe blijft in testmodus totdat boekhouder/jurist live gebruik heeft goedgekeurd.
- [ ] Support-, klachten-, moderatie- en verwijderproces belegd.
- [ ] Productie-back-up en monitoring getest.

## Go/no-go

Publiceer eerst als besloten bèta met testaccounts. Ga pas commercieel live wanneer alle punten hierboven zijn afgevinkt en de juridische teksten zijn goedgekeurd.
