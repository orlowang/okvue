export function bindComputed(...props) {
  const computed = {};
  props.map(prop => {
    computed[prop] = {
      get() {
        return this.$store.state[prop];
      },
      set(val) {
        this.$store.dispatch("UPDATE_BINDING_STATE", { prop, val });
      }
    };
  });
  return computed;
}

export function binding(option) {
  const getters = {};
  const stateKeys = Object.keys(option.state);
  stateKeys.map(key => {
    getters[key] = state => state[key];
  });
  function updateBindingState(state, { prop, val }) {
    console.log(prop, val);
    state[prop] = val;
  }
  const UPDATE_BINDING_STATE = ({ commit }, payload) => {
    commit("updateBindingState", payload);
  };
  return {
    state: option.state,
    getters: {
      ...option.getters,
      ...getters
    },
    mutations: {
      ...option.mutations,
      updateBindingState
    },
    actions: {
      ...option.actions,
      UPDATE_BINDING_STATE
    }
  };
}
