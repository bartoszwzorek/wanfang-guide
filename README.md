# Wanfang Guide — wersja wizualna 0.2

Statyczna, bogato ilustrowana strona internetowa będąca prywatną bazą wiedzy pilota i przewodnika po Chinach.

## Uruchomienie

Najprościej otworzyć plik `index.html` w przeglądarce. Większość funkcji działa bez serwera.

Lepszy wariant lokalny:

```bash
python3 -m http.server 8000
```

Następnie otwórz `http://localhost:8000`.

## Co już działa

Wersja 0.2 ma całkowicie przebudowany wygląd: editorialowy atlas, lokalne ilustracje SVG, bogatszą stronę główną, wizualne karty materiałów i magazynowy układ rozdziałów.

- wyszukiwarka tematów,
- filtrowanie według miasta i kategorii,
- wersja jasna i ciemna,
- ulubione zapisywane w przeglądarce,
- plan aktualnej trasy z własną kolejnością,
- tryb przewodnika z dużą czcionką,
- własne notatki do każdego materiału,
- dodawanie własnych tematów w przeglądarce,
- eksport i import kopii danych,
- drukowanie materiału albo planu trasy do PDF.

## Ważne o zapisie danych

Ulubione, trasa, notatki i tematy dodane z formularza są przechowywane w `localStorage` konkretnej przeglądarki. Używaj przycisku **Eksport kopii**, aby zachować je przed zmianą komputera lub czyszczeniem danych przeglądarki.

Materiały wbudowane na stałe znajdują się w pliku:

`data/topics.js`

## Publikacja za darmo

### GitHub Pages

1. Utwórz nowe repozytorium na GitHubie.
2. Wgraj całą zawartość folderu `wanfang-guide`.
3. Wejdź w **Settings → Pages**.
4. Wybierz publikację z gałęzi `main` i folderu `/root`.

### Cloudflare Pages

1. Utwórz projekt Pages i połącz repozytorium GitHub.
2. Framework preset: `None`.
3. Build command: pozostaw puste.
4. Output directory: `/`.

### Netlify

Przeciągnij cały folder na stronę Netlify Drop albo połącz repozytorium. Nie jest potrzebna komenda budowania.

## Kolejny etap

Najlepszy następny krok to przeniesienie pełnych materiałów HTML do wspólnego formatu danych, dodanie galerii zdjęć oraz prawdziwych linków do filmów i playlist.
