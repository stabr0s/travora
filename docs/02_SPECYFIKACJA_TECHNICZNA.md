# SPECYFIKACJA TECHNICZNA v1.0

# Travel Planner App

---

# 1. Architektura systemu

Aplikacja będzie aplikacją webową typu SPA/PWA.

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

## Backend

* Supabase

## Baza danych

* PostgreSQL (Supabase)

## Mapy

* OpenStreetMap
* MapLibre GL JS
* OpenRouteService API

## Autoryzacja

* Supabase Auth
* Google Login
* Apple Login
* Email Login

## Hosting

* Vercel

---

# 2. Struktura aplikacji

```text
APP
│
├── Dashboard
├── Trips
│    ├── Overview
│    ├── Inspirations
│    ├── Places
│    ├── Map
│    ├── Planner
│    ├── Reservations
│    ├── Packing
│    ├── Budget
│    └── Archive
│
├── User Profile
└── Settings
```

---

# 3. Model użytkowników

## users

```sql
id UUID PK
email TEXT
name TEXT
avatar_url TEXT
provider TEXT
created_at TIMESTAMP
```

---

# 4. Model podróży

## trips

```sql
id UUID PK
owner_id UUID FK

title TEXT
country TEXT

start_date DATE
end_date DATE

cover_image TEXT

currency TEXT

status TEXT
is_archived BOOLEAN

created_at TIMESTAMP
updated_at TIMESTAMP
```

status:

* planning
* active
* archived

---

# 5. Uczestnicy podróży

## trip_members

```sql
id UUID PK

trip_id UUID FK
user_id UUID FK

role TEXT

created_at TIMESTAMP
```

role:

* owner
* editor
* viewer

---

# 6. Inspiracje

## inspirations

```sql
id UUID PK

trip_id UUID FK

type TEXT

title TEXT
description TEXT

url TEXT
image_url TEXT

created_at TIMESTAMP
```

type:

* image
* youtube
* website
* note

---

# 7. Miejsca

## places

```sql
id UUID PK

trip_id UUID FK

name TEXT
description TEXT

latitude DOUBLE PRECISION
longitude DOUBLE PRECISION

category TEXT

priority INTEGER

status TEXT

estimated_duration INTEGER
estimated_cost DECIMAL

notes TEXT

created_at TIMESTAMP
```

priority:

```text
3 = must_see
2 = recommended
1 = optional
```

status:

```text
idea
planned
visited
rejected
```

category:

```text
attraction
restaurant
hotel
airport
shop
viewpoint
transport
other
```

---

# 8. Kotwice podróży

## anchors

```sql
id UUID PK

trip_id UUID FK

type TEXT

name TEXT

latitude DOUBLE PRECISION
longitude DOUBLE PRECISION

start_datetime TIMESTAMP
end_datetime TIMESTAMP

is_locked BOOLEAN

reservation_id UUID

created_at TIMESTAMP
```

type:

* flight
* hotel
* train
* ferry
* bus
* car

---

# 9. Plan podróży

## trip_days

```sql
id UUID PK

trip_id UUID FK

day_number INTEGER

date DATE

mode TEXT

city TEXT
hotel_anchor UUID

created_at TIMESTAMP
```

mode:

```text
ordered
scheduled
```

---

# 10. Elementy planu

## itinerary_items

```sql
id UUID PK

trip_day_id UUID FK

place_id UUID
anchor_id UUID

title TEXT

position INTEGER

start_time TIME
end_time TIME

duration_minutes INTEGER

is_fixed BOOLEAN

transport_from_previous TEXT

created_at TIMESTAMP
```

transport:

* walk
* car
* train
* bus
* plane
* ferry

---

# 11. Rezerwacje

## reservations

```sql
id UUID PK

trip_id UUID FK

type TEXT

title TEXT

provider TEXT

reservation_number TEXT

start_date TIMESTAMP
end_date TIMESTAMP

total_price DECIMAL

currency TEXT

payer_user_id UUID

notes TEXT

status TEXT

created_at TIMESTAMP
```

status:

* unpaid
* deposit
* paid

type:

* flight
* hotel
* car
* ticket
* insurance
* transport

---

# 12. Uczestnicy rezerwacji

## reservation_members

```sql
id UUID PK

reservation_id UUID FK

user_id UUID FK

amount DECIMAL

settled BOOLEAN

settled_date TIMESTAMP
```

---

# 13. Budżet

Budżet liczony dynamicznie.

Wyliczane pola:

```text
koszt całkowity
koszt na osobę
opłacono
pozostało
```

Kategorie:

* loty
* hotele
* transport
* atrakcje
* ubezpieczenie
* inne

---

# 14. Pakowanie

## packing_categories

```sql
id UUID PK

trip_id UUID FK

name TEXT
shared BOOLEAN
```

---

## packing_items

```sql
id UUID PK

category_id UUID FK

user_id UUID

name TEXT

is_packed BOOLEAN

created_at TIMESTAMP
```

---

# 15. Dokumenty

## files

```sql
id UUID PK

trip_id UUID FK

reservation_id UUID

file_name TEXT
file_url TEXT

file_type TEXT

uploaded_at TIMESTAMP
```

---

# 16. Mapa

Biblioteki:

* MapLibre
* OpenStreetMap

Funkcje:

* clustering
* markers
* polylines
* route preview
* distance calculation
* filtering
* drag and drop planning

---

# 17. Uprawnienia

## Owner

Może wszystko.

## Editor

Może:

* edytować,
* dodawać,
* planować.

Nie może:

* usuwać podróży,
* usuwać właściciela.

## Viewer

Może tylko przeglądać.

---

# 18. Ekrany aplikacji

```text
/login

/dashboard

/trips

/trips/:id

/trips/:id/inspirations

/trips/:id/places

/trips/:id/map

/trips/:id/planner

/trips/:id/reservations

/trips/:id/budget

/trips/:id/packing

/trips/:id/archive
```

---

# 19. MVP - kolejność implementacji

ETAP 1

* autoryzacja
* użytkownicy

ETAP 2

* podróże
* uczestnicy

ETAP 3

* miejsca
* inspiracje

ETAP 4

* mapa

ETAP 5

* kotwice

ETAP 6

* plan podróży

ETAP 7

* rezerwacje

ETAP 8

* budżet

ETAP 9

* pakowanie

ETAP 10

* archiwum

ETAP 11

* eksport PDF

---

# 20. Wersja 1.0

Zakres pierwszego wydania:

✅ logowanie
✅ podróże
✅ współdzielenie
✅ inspiracje
✅ miejsca
✅ mapa
✅ plan podróży
✅ rezerwacje
✅ budżet
✅ rozliczenia
✅ pakowanie
✅ archiwum
✅ eksport PDF
