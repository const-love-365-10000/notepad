import Vue from "vue";
import ordinaryModal from "./ordinaryModal.vue";

const OrdinaryModal = Vue.extend(ordinaryModal);

const modal = new OrdinaryModal().$mount();

document.body.appendChild(modal.$el);

export default modal;
