const state = {
	editorHtml: null,
	appMousedown: 0, // 暂无用
	filePath: "./",
};

const mutations = {
	setEditorHtml(state, editorHtml) {
		state.editorHtml = editorHtml;
	},
	setAppMousedown(state, appMousedown) {
		state.appMousedown = appMousedown;
	},
	setFilePath(state, filePath) {
		state.filePath = filePath;
	},
};

const actions = {
	setEditorHtml({ commit }, editorHtml) {
		commit("setEditorHtml", editorHtml);
	},
	setAppMousedown({ commit }, appMousedown) {
		commit("setAppMousedown", appMousedown);
	},
	setFilePath({ commit }, filePath) {
		commit("setFilePath", filePath);
	},
};

export default {
	state,
	mutations,
	actions,
};
