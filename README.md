# Bakery Products App

An **Ionic** application for managing bakery products with real-time updates using **Coa** and **WebSocket**.

---

## Features

* List bakery products.
* Add and update products.
* Each product has the following attributes:

  * `id`: unique identifier
  * `name`: product name
  * `price`: product price
  * `dateOfProduction`: date of production
  * `isGlutenFree`: boolean indicating if the product is gluten-free
  * `photo`: image taken using the device webcam (via Capacitor Camera)
  * `location`: geographic coordinates saved for each product
* Real-time updates via WebSocket.
* Pagination, search, and filtering (gluten-free or not).
* Location-based filtering: users can select products based on their position on the map (Leaflet integration).
* Offline support: items can be saved locally and synced when back online.
* User authentication and logout support.
* New animations added and existing ones overridden for smoother user experience.

---

## Technologies Used

* **Ionic Framework** for mobile-first UI components.
* **React** for building the frontend.
* **Coa** for backend API interactions.
* **WebSocket** for real-time product updates.
* **TypeScript** for type safety.
* **LocalStorage** for offline item management.
* **Capacitor Camera** for capturing images directly from the device.
* **Leaflet** for map display and location selection.
* **CSS Animations / Ionic Animations** for enhanced UI motion.
