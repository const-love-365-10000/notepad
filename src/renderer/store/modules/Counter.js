const state = {
	main: 0,
	editorHtml: null,
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
};

const actions = {
	someAsyncTask({ commit }) {
		// do something async
		commit("INCREMENT_MAIN_COUNTER");
	},
	setEditorHtml({ commit }, editorHtml) {
		commit("setEditorHtml", editorHtml);
	},
};

export default {
	state,
	mutations,
	actions,
};
