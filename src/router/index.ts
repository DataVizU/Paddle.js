import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import OcrView from "../views/cv/ocr/OcrView.vue";
import OcrIntroduction from "../views/cv/ocr/OcrIntroduction.vue";
import TextRecognition from "../views/cv/ocr/TextRecognition/TextRecognition.vue";
import TextDetection from "../views/cv/ocr/TextDetection/TextDetection.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/ocr",
      name: "ocr",
      component: OcrView,
      children: [
        {
          path: "",
          name: "intro",
          component: OcrIntroduction,
        },
        {
          path: "/text-rec",
          name: "text-rec",
          component: TextRecognition,
        },
        {
          path: "/text-det",
          name: "text-det",
          component: TextDetection,
        },
      ],
    },
  ],
});

export default router;
