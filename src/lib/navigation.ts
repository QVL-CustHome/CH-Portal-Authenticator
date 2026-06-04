// Navigation pleine page (hors react-router) : utilisee apres login pour
// repartir vers la ressource demandee. Isolee ici pour etre mockable en test.
export function navigateTo(url: string): void {
  window.location.assign(url);
}
