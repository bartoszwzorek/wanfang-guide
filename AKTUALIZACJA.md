# Aktualizacja kompendium — 2026-09-08

Kompendium zawiera 54 główne opracowania, w tym 31 materiałów zaimportowanych, 17 nowych rozdziałów zbiorczych i 15 odpraw CTF. Katalog obejmuje 177 pozycji, a programy CHT, CJA i CTF mają łącznie sześć wariantów. Każda pozycja katalogu prowadzi teraz do materiału mającego co najmniej 350 słów; każdy z 17 nowych rozdziałów przekracza 500 słów. Nowe teksty są pierwszą pełną wersją przeznaczoną do wspólnej redakcji, nie wersją ostateczną.

## Wprowadzone zmiany

- Wstawiono zaakceptowany rozdział „Alipay, WeChat Pay i życie bez portfela”.
- Przeredagowano zwroty skierowane do prowadzącego na wypowiedzi do uczestników; poprawiono etykiety interfejsu.
- W powitaniu i materiale o rejsie oddzielono przygotowania organizacyjne od tekstu do czytania.
- Dodano style kompendium, katalog, programy, własne objazdy i obsługę pobierania plików do trybu offline.
- Przebudowano mobilny widok dnia: lista tematów znajduje się na górze i na dole, jeden tekst rozwija się w całości, można przejść do następnego oraz dodawać i usuwać tematy z konkretnego dnia.
- Dodano stałe mobilne menu „Dzień / Tematy / Plan”. Zakładka „Tematy” udostępnia cały katalog 177 haseł w jednym miejscu.
- W bibliotece można zaznaczyć kilka tematów, wybrać własny objazd albo program wzorcowy oraz konkretny dzień, a następnie przypisać materiały jedną operacją. Tematy przypisane można również usuwać bez opuszczania biblioteki.
- Globalna wyszukiwarka i skróty kategorii prowadzą teraz do wspólnej biblioteki, zamiast rozdzielać wyniki między dwa katalogi.
- Usunięto z widoku programu panel „Do potwierdzenia”.
- Zmniejszono typografię długich tekstów w widoku mobilnym do 16 px, a w mobilnym trybie przewodnika ustawiono czytelny punkt wyjścia 17 px z zachowaniem przycisków A−/A+.
- Dodano przyklejoną etykietę bieżącej części oraz trzy oszczędne wyróżnienia: kontekst historyczny, ciekawostka i puenta. Zwykłe akapity pozostają bez tła.
- Usunięto quizy z kart poszczególnych tematów i z głównego widoku biblioteki. Osobne wejście „Quiz wiedzy” znajduje się w bocznym menu w sekcji „Kategorie”. Wszystkie 106 odzyskanych pytań z 11 tematów trafiają do jednego widoku, gdzie można wybrać wszystkie materiały, aktywny objazd albo ręcznie wskazane tematy.
- Uzupełniono wszystkie pozycje wcześniej oznaczone jako brakujące lub krótkie. Długie istniejące opracowania (między innymi Zhangjiajie, Hongcun–Tunxi, Changsha, Wielki Mur i Święta Droga) zachowano jako główne zamiast zastępować je krótszymi tekstami zbiorczymi.
- Redakcja całej bazy nie oznacza zakończonego sprawdzenia każdego faktu; materiały należy teraz przejrzeć dzień po dniu, zaczynając od najbliższego programu CTF.

Samodzielny materiał HTML znajduje się w `materials/wanfang-kompendium-po-redakcji.html`, a zatwierdzony rozdział w `materials/alipay-wechat-pay-zatwierdzony.md`. Historyczne pliki źródłowe zachowano jako archiwum; nie są bieżącą wersją redakcyjną.

## Uruchomienie i kontrola

Uruchom statyczny serwer w katalogu projektu, np. `python3 -m http.server 8000`, i otwórz `http://localhost:8000`. Tryb offline wymaga HTTPS lub localhost oraz wcześniejszego pobrania materiałów. Notatki i objazdy są lokalne dla przeglądarki; korzystaj z eksportu kopii zapasowej.

Po zmianie plików uruchom `node scripts/build-precache.cjs`, następnie `node scripts/check-compendium.cjs`. Kontrola obejmuje kompletność plików, spójność odwołań i wybrane reguły danych. Nie zastępuje sprawdzenia wyglądu i trybu offline w przeglądarce.

## Stan publikacji

Repozytorium: https://github.com/bartoszwzorek/wanfang-guide

Aktualizacja jest przygotowywana lokalnie na gałęzi `codex/kompendium-chiny`, a publikowana przez GitHub Pages z gałęzi `main`. Wynik konkretnego wdrożenia jest dostępny w GitHub Actions. Strona z konta firmowego jest osobnym projektem.
