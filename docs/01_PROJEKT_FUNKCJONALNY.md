# Dokument projektu v1.0

# Aplikacja do planowania prywatnych podróży turystycznych

## 1. Cel projektu

Celem aplikacji jest stworzenie nowoczesnego narzędzia do planowania prywatnych podróży turystycznych, działającego na komputerach (macOS, Windows) oraz urządzeniach mobilnych (iPhone, Android).

Aplikacja ma umożliwiać kompleksowe przygotowanie podróży – od zbierania inspiracji, przez planowanie trasy i harmonogramu, aż po zarządzanie rezerwacjami, budżetem i archiwizację wyjazdów.

Priorytetem jest prostota obsługi, estetyczny wygląd oraz możliwość współdzielenia podróży z innymi uczestnikami.

---

# 2. Założenia projektu

### Aplikacja ma:

* działać jako aplikacja webowa,
* być dostępna na komputerach i urządzeniach mobilnych,
* umożliwiać współdzielenie podróży,
* działać bez konieczności instalacji,
* umożliwiać późniejszą instalację jako aplikacja PWA.

### Aplikacja nie będzie:

* portalem społecznościowym,
* systemem rezerwacyjnym,
* galerią zdjęć i wspomnień,
* systemem pełnych rozliczeń grupowych.

---

# 3. Użytkownicy

## Role użytkowników

### Właściciel

Może:

* tworzyć podróże,
* zapraszać uczestników,
* edytować wszystkie dane,
* usuwać podróże,
* zarządzać uprawnieniami.

### Edytor

Może:

* edytować podróż,
* dodawać miejsca,
* planować harmonogram,
* dodawać rezerwacje.

### Podgląd

Może:

* przeglądać podróż,
* przeglądać plan,
* przeglądać mapy,
* przeglądać rezerwacje.

---

# 4. Moduły aplikacji

## 4.1 Dashboard podróży

Dashboard zawiera:

* nazwę podróży,
* zdjęcie okładki,
* daty,
* liczbę uczestników,
* liczbę miejsc,
* budżet na osobę,
* status przygotowań.

Przykładowe sekcje:

* Inspiracje
* Miejsca
* Mapa
* Plan podróży
* Rezerwacje
* Pakowanie
* Podsumowanie

---

## 4.2 Inspiracje

Moduł służy do zbierania pomysłów.

Możliwe typy wpisów:

* zdjęcie,
* link,
* film,
* notatka.

Każda inspiracja może zostać przekształcona w miejsce do odwiedzenia.

---

## 4.3 Miejsca

Każde miejsce zawiera:

* nazwę,
* opis,
* współrzędne,
* kategorię,
* priorytet,
* status,
* czas zwiedzania,
* przewidywany koszt,
* notatki.

### Kategorie:

* atrakcja,
* restauracja,
* punkt widokowy,
* sklep,
* lotnisko,
* hotel,
* transport,
* inne.

### Priorytet:

* Must see,
* Warto zobaczyć,
* Opcjonalne.

### Status:

* Pomysł,
* Zaplanowane,
* Odwiedzone,
* Odrzucone.

---

## 4.4 Kotwice podróży

Kotwice są elementami stałymi podróży.

Typy kotwic:

* lot,
* hotel,
* prom,
* pociąg,
* autobus,
* wynajem samochodu.

Kotwice:

* mają przypisane daty,
* nie mogą zostać przypadkowo przesunięte,
* stanowią podstawę planowania podróży.

---

## 4.5 Mapa

Mapa jest głównym elementem aplikacji.

### Funkcje:

* wyświetlanie wszystkich miejsc,
* filtrowanie po dniach,
* filtrowanie po kategoriach,
* wyświetlanie tras,
* wyświetlanie hoteli,
* wyświetlanie lotnisk,
* grupowanie miejsc,
* podgląd odległości,
* podgląd czasów przejazdu.

### Tryby mapy:

#### Wszystkie miejsca

Pokazuje całą podróż.

#### Widok dnia

Pokazuje wyłącznie aktualny dzień.

#### Tryb planowania

Pozwala przeciągać miejsca do konkretnych dni.

---

## 4.6 Plan podróży

Plan podróży działa w dwóch trybach.

### Tryb kolejności

Przykład:

1. Świątynia
2. Obiad
3. Zamek
4. Spacer

### Tryb godzinowy

Przykład:

09:00 Świątynia
12:30 Obiad
15:00 Zamek

---

### Funkcje:

* przeciąganie atrakcji,
* automatyczne obliczanie przejazdów,
* obliczanie czasu dnia,
* oznaczanie wydarzeń stałych,
* ostrzeganie o przeładowaniu dnia,
* podgląd trasy dnia.

---

## 4.7 Rezerwacje

Obsługiwane typy:

* loty,
* hotele,
* wynajem samochodu,
* bilety,
* ubezpieczenia,
* transport.

Każda rezerwacja zawiera:

* nazwę,
* numer rezerwacji,
* datę,
* koszt,
* płatnika,
* uczestników,
* status płatności,
* pliki,
* linki.

---

## 4.8 Budżet

Budżet liczony jest na osobę.

Kategorie:

* loty,
* hotele,
* transport,
* atrakcje,
* ubezpieczenie,
* inne.

System automatycznie oblicza:

* koszt całkowity,
* koszt na osobę,
* kwotę opłaconą,
* kwotę pozostałą.

---

## 4.9 Rozliczenia

System rozliczeń ma charakter uproszczony.

Dla każdej rezerwacji:

* wskazywany jest płatnik,
* określane są osoby uczestniczące,
* oznacza się, czy uczestnik zwrócił pieniądze.

Przykładowe statusy:

* Rozliczony,
* Do oddania.

---

## 4.10 Pakowanie

Lista pakowania składa się z:

### List wspólnych:

* dokumenty,
* elektronika,
* apteczka.

### List prywatnych:

* ubrania,
* kosmetyki,
* sprzęt.

Każdy uczestnik może mieć własną listę.

---

## 4.11 Archiwum

Po zakończeniu podróży wyjazd trafia do archiwum.

Archiwum przechowuje:

* plan podróży,
* mapy,
* rezerwacje,
* budżety,
* uczestników,
* miejsca,
* inspiracje,
* dokumenty.

Dodatkowo przechowywane są statystyki:

* liczba odwiedzonych miejsc,
* liczba dni,
* koszt na osobę.

---

## 4.12 Eksport PDF

Aplikacja generuje raport PDF zawierający:

* dane podróży,
* uczestników,
* plan podróży,
* mapy,
* rezerwacje,
* budżet,
* listę pakowania.

---

# 5. Logowanie

Obsługiwane metody:

* Apple,
* Google,
* adres e-mail.

---

# 6. Technologie

## Frontend

* Next.js
* React
* TypeScript

## Backend

* Supabase

## Baza danych

* PostgreSQL (Supabase)

## Mapy

* OpenStreetMap
* MapLibre
* OpenRouteService

## Hosting

* Vercel

---

# 7. Wersja MVP

Pierwsza wersja aplikacji będzie zawierać:

✅ logowanie
✅ tworzenie podróży
✅ uczestników
✅ inspiracje
✅ miejsca
✅ mapę
✅ kotwice
✅ plan podróży
✅ rezerwacje
✅ budżet
✅ rozliczenia
✅ pakowanie
✅ archiwum
✅ eksport PDF

---

# 8. Cel długoterminowy

Stworzenie najlepszego prywatnego planera podróży, który:

* działa na wszystkich urządzeniach,
* umożliwia współdzielenie wyjazdów,
* upraszcza planowanie podróży,
* pozwala przechowywać historię wszystkich wyjazdów w jednym miejscu.
