const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },

  {
    path: "/sobre",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/Sobre.vue") }]
  },
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
