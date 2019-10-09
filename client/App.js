import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { Login, Signup, Home, Form, Survey, Registry, Gift, ViewRegistry} from "./screens";
import { SCREENS } from "./constants";

const AuthNavigator = createStackNavigator(
  {
    Login: Login,
    Signup: Signup
  },
  { initialRouteName: SCREENS.LOGIN }
);

const Navigator = createStackNavigator(
  {
    Home: Home,
    Form: Form,
    Survey: Survey,
    Registry: Registry,
    Gift: Gift,
    ViewRegistry: ViewRegistry
  },
  { initialRouteName: SCREENS.HOME}
);

export default createAppContainer(
  createSwitchNavigator(
    {
      auth: AuthNavigator,
      app: Navigator
    },
    { initialRouteName: "auth" }
  )
);
