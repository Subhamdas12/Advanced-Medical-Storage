export const Provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    default:
      return state;
  }
};
const DEFAULT_MEDICALSTORAGE_STATE = {
  loaded: false,
  contract: {},
  transaction: {
    isSuccessful: false,
  },
  events: [],
};
export const MedicalStorage = (
  state = DEFAULT_MEDICALSTORAGE_STATE,
  action
) => {
  switch (action.type) {
    case "MEDICALSTORAGE_LOADED":
      return {
        ...state,
        loaded: true,
        contract: action.medicalStorage,
      };
    case "ADD_DOCTOR_INITIALIZED":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: true,
        },
        transferInProgress: false,
      };
    case "ADD_DOCTOR_SUCCESS":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
        },
        transferInProgress: true,
        events: [action.event, ...state.events],
      };
    case "ADD_DOCTOR_FAIL":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: false,
          isError: true,
        },
        transferInProgress: false,
      };

    case "REVOKE_DOCTOR_INITIALIZED":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: true,
        },
        transferInProgress: false,
      };
    case "REVOKE_DOCTOR_SUCCESS":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
        },
        transferInProgress: true,
        events: [action.event, ...state.events],
      };
    case "REVOKE_DOCTOR_FAIL":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: false,
          isError: true,
        },
        transferInProgress: false,
      };
    case "PROVIDE_DIAGNOSIS_INITIALIZED":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: true,
        },
        transferInProgress: false,
      };
    case "PROVIDE_DIAGNOSIS_SUCCESS":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
        },
        transferInProgress: true,
        events: [action.event, ...state.events],
      };
    case "PROVIDE_DIAGNOSIS_FAIL":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: false,
          isError: true,
        },
        transferInProgress: false,
      };

    default:
      return state;
  }
};
