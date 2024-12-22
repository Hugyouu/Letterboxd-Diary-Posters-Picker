import { legacy_createStore as createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {DESELECT_POSTER, REMOVE_ALL_POSTERS, REMOVE_POSTER, SELECT_POSTER} from "./action";

const posterSelectionReducer = (state = {}, action) => {
  switch (action.type) {
    case SELECT_POSTER: {
        const { movieId, posterId, watchedDate } = action.payload;
        return {
            ...state,
            [movieId]: [...(state[movieId] || []), { posterId, watchedDate }],
        };
    }
      case DESELECT_POSTER: {
          const { movieId, posterId } = action.payload;
          return {
              ...state,
              [movieId]: state[movieId]?.filter(
                  (id) => id !== posterId
              ),
          };
      }
      case REMOVE_POSTER: {
            const { movieId, posterId } = action;
            return {
                ...state,
                [movieId]: state[movieId]?.filter(
                    (id) => id !== posterId
                ),
            };
      }
      case REMOVE_ALL_POSTERS: {
          return {};
      }
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
