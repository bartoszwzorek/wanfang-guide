# Aktualizacja kompendium — 2026-09-07

Kompendium zawiera 37 tematów, w tym 31 zaimportowanych opracowań, 15 odpraw CTF oraz katalog 177 tematów i braków. Programy CHT, CJA i CTF mają łącznie sześć wariantów. Statusy i informacje do potwierdzenia pozostają częścią danych: obecność wariantu nie oznacza potwierdzenia jego realizacji.

## Wprowadzone zmiany

- Wstawiono zaakceptowany rozdział „Alipay, WeChat Pay i życie bez portfela”.
- Przeredagowano zwroty skierowane do prowadzącego na wypowiedzi do uczestników; poprawiono etykiety interfejsu.
- W powitaniu i materiale o rejsie oddzielono przygotowania organizacyjne od tekstu do czytania.
- Dodano style kompendium, katalog, programy, własne objazdy i obsługę pobierania plików do trybu offline.
- Zachowano oznaczenia braków i potrzebnej weryfikacji. Redakcja całej bazy nie oznacza pełnego sprawdzenia wszystkich faktów.

Samodzielny materiał HTML znajduje się w `materials/wanfang-kompendium-po-redakcji.html`, a zatwierdzony rozdział w `materials/alipay-wechat-pay-zatwierdzony.md`. Historyczne pliki źródłowe zachowano jako archiwum; nie są bieżącą wersją redakcyjną.

## Uruchomienie i kontrola

Uruchom statyczny serwer w katalogu projektu, np. `python3 -m http.server 8000`, i otwórz `http://localhost:8000`. Tryb offline wymaga HTTPS lub localhost oraz wcześniejszego pobrania materiałów. Notatki i objazdy są lokalne dla przeglądarki; korzystaj z eksportu kopii zapasowej.

Po zmianie plików uruchom `node scripts/build-precache.cjs`, następnie `node scripts/check-compendium.cjs`. Kontrola obejmuje kompletność plików, spójność odwołań i wybrane reguły danych. Nie zastępuje sprawdzenia wyglądu i trybu offline w przeglądarce.

## Stan publikacji

Repozytorium: https://github.com/bartoszwzorek/wanfang-guide

Aktualizacja przygotowana na gałęzi `codex/kompendium-chiny` jest przeznaczona do publikacji przez GitHub Pages z gałęzi `main`. Wynik konkretnego wdrożenia jest dostępny w GitHub Actions. Strona z konta firmowego jest osobnym projektem.
