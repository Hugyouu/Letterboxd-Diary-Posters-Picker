import { legacy_createStore as createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const posterSelectionReducer = (state = {}, action) => {
  switch (action.type) {
    case "SELECT_POSTER":
      return {
        ...state,
        [action.movieId]: [...(state[action.movieId] || []), action.posterId],
      };
    case "DESELECT_POSTER":
      return {
        ...state,
        [action.movieId]: state[action.movieId].filter(
          (id) => id !== action.posterId
        ),
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  posterSelections: posterSelectionReducer,
  // other reducers...
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
