const state = {
	editorHtml: null,
	appMousedown: 0, // 暂无用
	filePath: "./",
	model: 0, // 0是简约模式，1是完整模式
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
	setModel(state, model) {
		state.model = model;
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
	setModel({ commit }, model) {
		commit("setModel", model);
	},
};

export default {
	state,
	mutations,
	actions,
};
