import { combineReducers, compose, configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';

import authReducer from '../features/auth/authSlice';
import {
  flattenedResourcesReducer,
  collectionsReducer,
  activeCollectionIdReducer,
} from './reducers';
import rootEpic from './epics';
import FhirClient from './middleware/fhir-client';

const createStore = () => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      fhirClient: new FhirClient(),
    },
  });

  const rootReducer = combineReducers({
    auth: authReducer,
    resources: flattenedResourcesReducer,
    activeCollectionId: activeCollectionIdReducer,
    collections: collectionsReducer,
  });

  const store = configureStore({
    reducer: rootReducer,
    middleware: compose([
      thunk,
      epicMiddleware,
      // routerMiddleware(history), // < e.g.: other middleware
    ]),
    devTools: {
      serialize: true, // See: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#serialize
    },
  });

  epicMiddleware.run(rootEpic);

  return store;
};

export default createStore;
