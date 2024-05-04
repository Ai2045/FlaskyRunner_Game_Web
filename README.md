# Relazione Tecnica - Flask_Shooter_Game_Web

## Introduzione
Flask_Shooter_Game_Web è un gioco di sopravvivenza ambientato in un mondo post-apocalittico dilaniato da zombi. I giocatori devono difendersi dalle orde di non morti usando un'arma controllata con un mirino, con l'obbiettivo di ottenere il punteggio più alto possibile. Il progetto è stato pensato per offrire un'esperienza di gioco stimolante ma intuitiva, adatta a giocatori di tutti i livelli di abilità.

## Tecnologie Utilizzate
Il lato client del gioco sfrutta la libreria JavaScript **p5.js** per rendering, animazioni e input degli utenti, mentre il backend è basato su **Flask**, con **SQLAlchemy** per la gestione del database e **Werkzeug** per la sicurezza. L'interfaccia utente è costruita con HTML e CSS standard e utilizza Jinja2 per i template.

## Architettura del Sistema
Flask_Shooter_Game_Web segue il modello architetturale MVC. Il backend Flask si occupa di fornire il sito web, autenticare gli utenti e registrare i punteggi, mentre il frontend gestisce la logica di gioco e la visualizzazione, comunicando col server tramite richieste HTTP.

## Database
Il database del gioco include due tabelle principali: `Users`, per le informazioni degli utilizzatori, e `Scores`, per i punteggi registrati. Vengono utilizzate relazioni one-to-many tra utenti e punteggi, con vincoli di integrità referenziale applicati attraverso chiavi esterne.

## Sviluppo del Software
Lo sviluppo del gioco segue metodologie agili, utilizzando Git per il versioning del codice. Integrazione e deploy continuo sono stati adottati per garantire un'iterazione rapida e basata sui riscontri degli utenti.

## User Stories e Requisiti
- **Come utente:** voglio poter registrare un account per memorizzare i miei punteggi e monitorare i miei progressi.
- **Come utente:** desidero poter accedere al gioco e iniziare immediatamente senza passaggi di configurazione complessi.
- **Come utente:** pretendo di ricevere feedback visivi e sonori che rendano il gioco più coinvolgente e gratificante.
- **Come utente:** voglio essere in grado di visualizzare e confrontare il mio punteggio con quello degli altri giocatori tramite una classifica globale.
- **Come utente:** se vengo sconfitto, desidero avere l'opportunità di riavviare il gioco per cercare di migliorare il mio punteggio.
- **Come utente:** voglio poter utilizzare una funzionalità di ricerca che mi permetta di trovare il profilo di altri giocatori, per poter vedere i loro punteggi.


## Documentazione del Codice
I commenti nel codice forniscono chiarimenti sulle funzioni principali e le logiche implementate. Documentazione aggiuntiva può essere generata utilizzando strumenti standard come JSDoc per JavaScript e Sphinx per Python.

## Test e Validazione
Il gioco è stato testato attraverso una serie di test automatici per client e server per garantire che tutte le funzionalità rispondessero secondo le aspettative. Ciò include test unitari, test di integrazione e test end-to-end.

## Deploy e Manutenzione
non ancora conclusa

## Conclusioni
Flask_Shooter_Game_Web combina semplicità di gioco con una solida architettura tecnica, offrendo un'esperienza utente coinvolgente supportata da un backend affidabile e versatile. Dimostra efficacemente il potenziale creativo e di intrattenimento delle tecnologie web moderne.