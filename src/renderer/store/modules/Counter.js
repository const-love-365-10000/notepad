const state = {
	main: 0,
	editorHtml: null,
	appMousedown: 0,
};

const mutations = {
	DECREMENT_MAIN_COUNTER(state) {
		state.main--;
	},
	INCREMENT_MAIN_COUNTER(state) {
		state.main++;
	},
	setEditorHtml(state, editorHtml) {
		state.editorHtml = editorHtml;
	},
	setAppMousedown(state, appMousedown) {
		state.appMousedown = appMousedown;
	},
};

const actions = {
	someAsyncTask({ commit }) {
		// do something async
		commit("INCREMENT_MAIN_COUNTER");
	},
	setEditorHtml({ commit }, editorHtml) {
		commit("setEditorHtml", editorHtml);
	},
	setAppMousedown({ commit }, appMousedown) {
		commit("setAppMousedown", appMousedown);
	},
};

export default {
	state,
	mutations,
	actions,
};
