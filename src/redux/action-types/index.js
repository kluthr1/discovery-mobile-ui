export const actionTypes = { // eslint-disable-line import/prefer-default-export
  ERROR: 'ERROR',
  SET_AUTH: 'auth/setAuth', // implicitly derived from src/features/auth/authSlice.js
  CLEAR_PATIENT_DATA: 'CLEAR_PATIENT_DATA',
  FHIR_FETCH_SUCCESS: 'FHIR_FETCH_SUCCESS',
  FHIR_FETCH_ERROR: 'FHIR_FETCH_ERROR',
  RESOURCE_BATCH: 'RESOURCE_BATCH',
  REQUEST_NEXT_ITEMS: 'REQUEST_NEXT_ITEMS',
  ADD_FILTER_OPEN_FLAG: 'ADD_FILTER_OPEN_FLAG',
  TOGGLE_RESOURCE_TYPE_FILTERS: 'TOGGLE_RESOURCE_TYPE_FILTERS',
  SELECT_RESOURCE_TYPE: 'SELECT_RESOURCE_TYPE',
  UPDATE_DATE_RANGE_FILTER: 'UPDATE_DATE_RANGE_FILTER',
  ADD_RESOURCE_TO_COLLECTION: 'ADD_RESOURCE_TO_COLLECTION',
  REMOVE_RESOURCE_FROM_COLLECTION: 'REMOVE_RESOURCE_FROM_COLLECTION',
  UPDATE_MARKED_RESOURCES: 'UPDATE_MARKED_RESOURCES',
  CLEAR_MARKED_RESOURCES: 'CLEAR_MARKED_RESOURCES',
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  SELECT_COLLECTION: 'SELECT_COLLECTION',
  DELETE_COLLECTION: 'DELETE_COLLECTION',
  RENAME_COLLECTION: 'RENAME_COLLECTION',
  CLEAR_COLLECTION: 'CLEAR_COLLECTION',
  DUPLICATE_COLLECTION: 'DUPLICATE_COLLECTION',
  TOGGLE_SHOW_COLLECTION_ONLY: 'TOGGLE_SHOW_COLLECTION_ONLY',
  TOGGLE_SHOW_MARKED_ONLY: 'TOGGLE_SHOW_MARKED_ONLY',
  TOGGLE_SORTING_STATE: 'TOGGLE_SORTING_STATE',
  ADD_RECORD_NOTE: 'ADD_RECORD_NOTE',
  DELETE_RECORD_NOTE: 'DELETE_RECORD_NOTE',
  EDIT_RECORD_NOTE: 'EDIT_RECORD_NOTE',
  ADD_COLLECTION_NOTE: 'ADD_COLLECTION_NOTE',
  DELETE_COLLECTION_NOTE: 'DELETE_COLLECTION_NOTE',
  EDIT_COLLECTION_NOTE: 'EDIT_COLLECTION_NOTE',
};
