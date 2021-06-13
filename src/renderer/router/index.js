import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/",
			name: "landing-page",
			// component: require("@/components/LandingPage").default,
			// component: require("@/view/home").default,
			component: () => import("@/view/home"),
		},
		{
			path: "*",
			redirect: "/",
		},
	],
});
