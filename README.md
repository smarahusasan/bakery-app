# Bakery Products App

An **Ionic** application for managing bakery products with real-time updates using **Coa** and **WebSocket**.


---

## Features

- List bakery products.
- Add and update products.
- Each product has the following attributes:
    - `id`: unique identifier
    - `name`: product name
    - `price`: product price
    - `dateOfProduction`: date of production
    - `isGlutenFree`: boolean indicating if the product is gluten-free
- Real-time updates via WebSocket.
- Pagination, search, and filtering (gluten-free or not).
- Offline support: items can be saved locally and synced when back online.
- User authentication and logout support.


---

## Technologies Used

- **Ionic Framework** for mobile-first UI components.
- **React** for building the frontend.
- **Coa** for backend API interactions.
- **WebSocket** for real-time product updates.
- **TypeScript** for type safety.
- **LocalStorage** for offline item management.


