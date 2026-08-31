# Verwerkingsregister SecurityMatch

Werkdocument volgens AVG artikel 30. Laat doelen, grondslagen, bewaartermijnen en leveranciers controleren door een privacyjurist.

| Verwerking | Gegevens | Doel en grondslag | Ontvangers/verwerkers | Bewaartermijn |
|---|---|---|---|---|
| Account en login | Naam, e-mail, telefoon, wachtwoord-hash, sessiegegevens | Account/overeenkomst en beveiliging | Auth.js, database/hosting | [INVULLEN] |
| Profiel en matching | Werkgebied, ervaring, specialisaties, beschikbaarheid, beoordelingen | Uitvoering overeenkomst | Andere betrokken platformgebruikers | [INVULLEN] |
| Opdrachten en reacties | Opdracht-, tarief-, planning- en reactiegegevens | Uitvoering overeenkomst | Opdrachtgever/professional | [INVULLEN] |
| Berichten en meldingen | Berichtinhoud en metadata | Uitvoering overeenkomst, veiligheid en geschillen | Database/hosting | [INVULLEN] |
| Verificatie | Identiteits-, pas- en certificaatgegevens | [JURIDISCH BEVESTIGEN] | Bevoegde beheerders, Blob-opslag | [INVULLEN] |
| Betaling en facturatie | Betaal-, Stripe-, factuur- en transactiedata | Overeenkomst en wettelijke administratieplicht | Stripe, database, hosting | Wettelijke termijn controleren |
| Support en meldingen | Contactgegevens, melding en auditgegevens | Gerechtvaardigd belang, veiligheid en wettelijke plicht | Bevoegde beheerders, e-mailprovider | [INVULLEN] |

## Leverancierscontrole

- [ ] Vercel: DPA, regio's en subverwerkers gecontroleerd.
- [ ] Neon/PostgreSQL: DPA, regio's en back-ups gecontroleerd.
- [ ] Vercel Blob: private opslag, regio's, verwijdering en DPA gecontroleerd.
- [ ] Resend: DPA, regio's, logs en bewaartermijn gecontroleerd.
- [ ] Stripe: DPA, betaaldata, Connect en internationale doorgifte gecontroleerd.
- [ ] Alleen noodzakelijke gegevens worden naar iedere leverancier gestuurd.
