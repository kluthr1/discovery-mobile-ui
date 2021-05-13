import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';
import { clone } from 'ramda';

import { actionTypes } from '../action-types';
import { TYPES_SORTED_BY_LABEL } from '../../constants/resource-types';
import { UNMARKED, MARKED, FOCUSED } from '../../constants/marked-status';
import { SORT_ASC, SORT_DESC, sortFields } from '../../constants/sorting';

const preloadedResources = {};

export const flattenedResourcesReducer = (state = preloadedResources, { type, payload }) => {
  switch (type) {
    case actionTypes.CLEAR_PATIENT_DATA: {
      return preloadedResources;
    }
    case actionTypes.RESOURCE_BATCH: {
      Object.entries(payload.resources).forEach(([id, resource]) => {
        if (state[id]) {
          console.warn(`resource ${id} of type ${resource.resourceType} already added.`); // eslint-disable-line no-console
        }
      });
      return {
        ...state,
        ...payload.resources,
      };
    }
    default:
      return state;
  }
};

const defaultAssociations = {
  encounters: {},
};

export const associationsReducer = (state = defaultAssociations, { type, payload }) => {
  switch (type) {
    case actionTypes.CLEAR_PATIENT_DATA: {
      return defaultAssociations;
    }
    case actionTypes.RESOURCE_BATCH: {
      const encounters = {};
      Object.entries(payload.resources).forEach(([id, resource]) => {
        if (state[id]) {
          console.warn(`resource ${id} of type ${resource.resourceType} already processed.`); // eslint-disable-line no-console
        }
        const encounterUrn = resource.encounter?.reference;
        if (encounterUrn) {
          const matches = encounterUrn.match(/(#|\/)(.+)/);
          const encounterId = matches.pop();
          if (encounterId) {
            encounters[id] = encounterId;
          }
        }
      });

      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft.encounters = { ...state.encounters, ...encounters };
      });
    }
    default:
      return state;
  }
};

const { RECORD_TYPE, RECORD_DATE, TIME_SAVED } = sortFields;

const defaultDetailsPanelSortingState = {
  activeSortField: RECORD_TYPE,
  sortDirections: {
    [RECORD_TYPE]: SORT_DESC,
    [RECORD_DATE]: SORT_DESC,
    [TIME_SAVED]: SORT_DESC,
  },
};

// prune items whose values are 0, null, undefined, or empty string:
// const pruneEmpty = ((o) => Object.entries(o)
//   .filter(([, v]) => v)
//   .reduce((acc, [id, v]) => ({ ...acc, [id]: v }), {}));

const createCollection = (label = 'Untitled Collection') => {
  const timeCreated = new Date();

  return {
    id: uuidv4(),
    created: timeCreated,
    lastUpdated: timeCreated,
    label,
    selectedResourceType: TYPES_SORTED_BY_LABEL[0],
    resourceTypeFilters: TYPES_SORTED_BY_LABEL
      .reduce((acc, resourceType) => ({
        ...acc,
        [resourceType]: true,
      }), {}),
    dateRangeFilter: {
      dateRangeStart: undefined,
      dateRangeEnd: undefined,
    },
    showCollectionOnly: false,
    showMarkedOnly: false,
    focusedSubtype: '',
    records: {},
    detailsPanelSortingState: defaultDetailsPanelSortingState,
    notes: {},
  };
};

const createNewCollectionRecord = () => ({
  saved: false,
  dateSaved: null,
  highlight: UNMARKED,
  // highlight:
  //   0 -- unmarked
  //   1 -- marked
  //   2 -- focused
});

let defaultCollection = createCollection();

const preloadCollections = {
  [defaultCollection.id]: defaultCollection,
};

const getNextEnabledType = (resourceType, enabledTypes) => enabledTypes
  .map((type, index, array) => ({
    type,
    next: array[(index === array.length - 1) ? 0 : index + 1],
  }))
  .find(({ type }) => type === resourceType)
  ?.next;

const createNote = (text) => {
  const newDate = new Date();
  return {
    id: uuidv4(),
    text,
    dateCreated: newDate,
    dateEdited: newDate,
  };
};

export const collectionsReducer = (state = preloadCollections, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_PATIENT_DATA: {
      const { id } = defaultCollection;
      defaultCollection = createCollection();
      defaultCollection.id = id;
      return {
        [defaultCollection.id]: defaultCollection,
      };
    }
    case actionTypes.ADD_RESOURCE_TO_COLLECTION: {
      const { collectionId, resourceIds } = action.payload;
      return produce(state, (draft) => {
        resourceIds.forEach((id) => {
          const { records } = draft[collectionId]; // eslint-disable-line no-param-reassign
          records[id] = records[id] ?? createNewCollectionRecord();
          records[id].saved = true;
          records[id].dateSaved = new Date();
        });
      });
    }
    case actionTypes.SELECT_RESOURCE_TYPE: {
      const { collectionId, resourceType } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].selectedResourceType = resourceType;
      });
    }
    case actionTypes.TOGGLE_RESOURCE_TYPE_FILTERS: {
      const { collectionId, resourceType } = action.payload;
      return produce(state, (draft) => {
        const collection = draft[collectionId];
        const { selectedResourceType, resourceTypeFilters } = collection;
        const filterIsEnabled = resourceTypeFilters[resourceType];
        const nextValue = !filterIsEnabled;
        if (nextValue && !resourceTypeFilters[selectedResourceType]) { // eg: all types were off
          collection.selectedResourceType = resourceType;
        }
        if (!nextValue && selectedResourceType === resourceType) { // toggling off the active type
          const enabledTypes = TYPES_SORTED_BY_LABEL.filter((type) => resourceTypeFilters[type]);
          const nextEnabledType = getNextEnabledType(resourceType, enabledTypes);
          if (nextEnabledType) {
            collection.selectedResourceType = nextEnabledType;
          }
        }
        collection.resourceTypeFilters[resourceType] = nextValue; // eslint-disable-line no-param-reassign, max-len
      });
    }
    case actionTypes.UPDATE_DATE_RANGE_FILTER: {
      const { collectionId, dateRangeStart, dateRangeEnd } = action.payload;
      return produce(state, (draft) => {
        if (dateRangeStart) {
          // eslint-disable-next-line no-param-reassign
          draft[collectionId].dateRangeFilter.dateRangeStart = dateRangeStart.toISOString();
        }
        if (dateRangeEnd) {
          // eslint-disable-next-line no-param-reassign
          draft[collectionId].dateRangeFilter.dateRangeEnd = dateRangeEnd.toISOString();
        }
      });
    }
    case actionTypes.REMOVE_RESOURCE_FROM_COLLECTION: {
      const { collectionId, resourceIds } = action.payload;
      return produce(state, (draft) => {
        resourceIds.forEach((id) => {
          const { records } = draft[collectionId]; // eslint-disable-line no-param-reassign
          records[id] = records[id] ?? {};
          records[id].saved = false;
          records[id].dateSaved = null;
        });
      });
    }
    case actionTypes.UPDATE_MARKED_RESOURCES: {
      const { collectionId, subType, resourceIdsMap } = action.payload;

      return produce(state, (draft) => {
        const collection = draft[collectionId];
        const { records } = collection;
        const deFocus = (!subType || subType !== collection.focusedSubtype);
        collection.focusedSubtype = subType;
        if (deFocus) {
          Object.values(records).forEach((attributes) => {
            const prevValue = attributes.highlight;
            attributes.highlight = (prevValue === FOCUSED ? MARKED : prevValue); // eslint-disable-line max-len, no-param-reassign
          });
        }
        Object.entries(resourceIdsMap)
          .forEach(([id, next]) => {
            records[id] = records[id] ?? createNewCollectionRecord();
            const { highlight: prev } = records[id];
            records[id].highlight = ((prev === MARKED && next === FOCUSED) ? FOCUSED : next);
          });
      });
    }
    case actionTypes.CLEAR_MARKED_RESOURCES: {
      const collectionId = action.payload;
      return produce(state, (draft) => {
        Object.values(draft[collectionId].records).forEach((attributes) => {
          attributes.highlight = UNMARKED; // eslint-disable-line no-param-reassign
        });
      });
    }
    case actionTypes.CREATE_COLLECTION: {
      const newCollection = createCollection(action.payload);
      return {
        ...state,
        [newCollection.id]: newCollection,
      };
    }
    case actionTypes.DELETE_COLLECTION: {
      const newState = { ...state };
      delete newState[action.payload.collectionId];
      return newState;
    }
    case actionTypes.RENAME_COLLECTION: {
      const updatedCollection = { ...state[action.payload.collectionId] };
      updatedCollection.label = action.payload.collectionName;
      return { ...state, [action.payload.collectionId]: updatedCollection };
    }
    case actionTypes.CLEAR_COLLECTION: {
      const collectionId = action.payload;
      return produce(state, (draft) => {
        Object.values(draft[collectionId].records).forEach((attributes) => {
          attributes.saved = false; // eslint-disable-line no-param-reassign
          attributes.dateSaved = null; // eslint-disable-line no-param-reassign
        });
      });
    }
    case actionTypes.DUPLICATE_COLLECTION: {
      const { collectionId, collectionName } = action.payload;
      const originalCollection = state[collectionId];
      const newCollection = clone(originalCollection);
      newCollection.id = uuidv4();
      newCollection.label = collectionName;
      return {
        ...state,
        [newCollection.id]: newCollection,
      };
    }
    case actionTypes.TOGGLE_SHOW_COLLECTION_ONLY: {
      const { collectionId, showCollectionOnly } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].showCollectionOnly = showCollectionOnly;
      });
    }
    case actionTypes.TOGGLE_SHOW_MARKED_ONLY: {
      const { collectionId, showMarkedOnly } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].showMarkedOnly = showMarkedOnly;
      });
    }
    case actionTypes.TOGGLE_SORTING_STATE: {
      const { collectionId, sortField } = action.payload;
      return produce(state, (draft) => {
        if (state[collectionId].detailsPanelSortingState.activeSortField === sortField) {
          const prevDir = state[collectionId].detailsPanelSortingState.sortDirections[sortField];
          // eslint-disable-next-line no-param-reassign
          draft[collectionId]
            .detailsPanelSortingState.sortDirections[sortField] = (
              (prevDir === SORT_ASC) ? SORT_DESC : SORT_ASC
            );
        }
        // eslint-disable-next-line no-param-reassign
        draft[collectionId]
          .detailsPanelSortingState.activeSortField = sortField;
      });
    }
    case actionTypes.CREATE_RECORD_NOTE: {
      const { collectionId, resourceId, text } = action.payload;

      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].records[resourceId] = draft[collectionId].records[resourceId] || {};
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].records[resourceId].notes = (
          draft[collectionId].records[resourceId].notes || {}
        );
        const newNote = createNote(text);
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].records[resourceId].notes[newNote.id] = newNote;
      });
    }
    case actionTypes.DELETE_RECORD_NOTE: {
      const { collectionId, resourceId, noteId } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        delete draft[collectionId].records[resourceId].notes[noteId];
      });
    }
    case actionTypes.EDIT_RECORD_NOTE: {
      const {
        collectionId, resourceId, noteId, text,
      } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].records[resourceId].notes[noteId].text = text;
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].records[resourceId].notes[noteId].dateEdited = new Date();
      });
    }
    case actionTypes.CREATE_COLLECTION_NOTE: {
      const { collectionId, text } = action.payload;
      const newNote = createNote(text);
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].notes[newNote.id] = newNote;
      });
    }
    case actionTypes.DELETE_COLLECTION_NOTE: {
      const { collectionId, noteId } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        delete draft[collectionId].notes[noteId];
      });
    }
    case actionTypes.EDIT_COLLECTION_NOTE: {
      const { collectionId, noteId, text } = action.payload;
      return produce(state, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].notes[noteId].text = text;
        // eslint-disable-next-line no-param-reassign
        draft[collectionId].notes[noteId].dateEdited = new Date();
      });
    }
    default:
      return state;
  }
};

export const activeCollectionIdReducer = (state = null, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_PATIENT_DATA: {
      return defaultCollection.id;
    }
    case actionTypes.SELECT_COLLECTION: {
      return action.payload;
    }
    case actionTypes.DELETE_COLLECTION: {
      return null;
    }
    default:
      return state;
  }
};

export const isOnboardingCompleteReducer = (state = false, action) => {
  switch (action.type) {
    case actionTypes.COMPLETE_ONBOARDING: {
      return true;
    }
    default:
      return state;
  }
};
