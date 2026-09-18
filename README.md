# Hungarian Real-Estate Auction Explorer

A **Next.js + TypeScript** frontend for browsing and filtering Hungarian real-estate auction data.

The project focuses on turning a large auction dataset into a practical, searchable interface with responsive filtering, sorting and pagination.

## Features

- Search by address and execution number
- Filter by county
- Filter by building type and classification
- Filter by auction status
- Filter by move-in availability
- Starting-price and minimum-price ranges
- Current auction-round filtering
- Sortable auction data
- Pagination
- Responsive desktop/mobile layout
- Image slider and lightbox components
- Light/dark theme support

## Tech stack

- **Next.js 14**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Next Themes**
- Heroicons / Iconify

## Project structure

```text
app/
├── components/
│   ├── AuctionTableList/
│   ├── BuildingType/
│   ├── CountyCheckboxList/
│   ├── CurrentRound/
│   ├── MinimalPriceFilter/
│   ├── Pagination/
│   ├── StartingPriceFilter/
│   ├── ThemeSwitcher/
│   └── ...
├── layout.tsx
└── page.tsx
```

The main auction table builds a filter payload from the selected UI controls and requests paginated auction data from a JSON API.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Notes

This repository is a frontend project/prototype and depends on its auction-data API being available.
