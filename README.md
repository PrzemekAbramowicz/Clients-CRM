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

## Wdrożenie na Vercel

Projekt eksportuje aplikację Express z `index.js`. Plik `vercel.json` wybiera
framework Express i dołącza szablony Handlebars oraz plik danych do funkcji.
W ustawieniach projektu użyj katalogu głównego repozytorium jako Root Directory.
Usuń własne nadpisania Build Command i Output Directory, jeśli były ustawione.
Po wysłaniu zmian do repozytorium uruchom nowy deployment.

**Ograniczenie przechowywania danych:** odczyt klientów z dołączonego JSON działa,
ale zapis do pliku aplikacji nie jest obsługiwany na Vercel. Do trwałego dodawania,
edytowania i usuwania klientów online trzeba podłączyć zewnętrzną bazę danych.
Katalog tymczasowy ani pamięć procesu nie zastępują trwałej bazy danych.
Lokalne uruchomienie nadal zapisuje dane do JSON.

W razie błędu 500 sprawdź Runtime Logs deploymentu. Nieoczekiwane błędy aplikacji
są logowane po stronie serwera, bez ujawniania szczegółów w interfejsie.
