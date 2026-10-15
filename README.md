# Clients CRM

Prosty CRM w Node.js, Express i Handlebars. Umożliwia dodawanie, przeglądanie,
edytowanie i usuwanie klientów oraz zapisywanie notatek i terminu następnego kontaktu.

## Uruchomienie lokalne

Wymagany Node.js 22 lub nowszy oraz npm.

```sh
npm ci
npm start
```

Otwórz http://127.0.0.1:3000. Aby automatycznie restartować serwer po zmianach:

```sh
npm run dev
```

Opcjonalny port w PowerShell: `$env:PORT = '3001'`, następnie `npm start`.

## Testy

```sh
npm test
```

Test integracyjny używa osobnego, tymczasowego pliku danych. Sprawdza strony,
CRUD, walidację, błędy 404 oraz trwałość zapisu, bez zmieniania danych aplikacji.

## Dane i zakres

Dane są przechowywane w `data/client.json`; repozytorium zawiera przykładowych klientów.
Przed zmianami warto skopiować ten plik. Serwer nasłuchuje wyłącznie lokalnie.
Zapis JSON jest przeznaczony dla jednego procesu i małej bazy demonstracyjnej.
Projekt nie ma jeszcze logowania ani bazy SQL — to lokalny punkt wyjścia do dalszego rozwoju portfolio.
