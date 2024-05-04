/*********** Reducers defined here *********/

import { persistCombineReducers } from "redux-persist";
import { user } from "./user";
import { categories } from "./categories";
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
};

export default persistCombineReducers(rootPersistConfig, { user, categories });
