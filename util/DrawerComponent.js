import { View, Image, SafeAreaView } from "react-native";
import DrawerListItem from "../components/DrawerListItem";
import getColors from "./COLORS";
import { CalendarDaysIcon, ClockIcon, CogIcon, HomeIcon, NewspaperIcon, TrophyIcon } from "react-native-heroicons/outline";

function DrawerComponent({ navigation, navRef }) {
    const iconSize = 36;
    const COLORS = getColors();
    const route = navRef.current ? navRef.current.getCurrentRoute().name : "";

    return (
        <SafeAreaView style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: 'center',
            flexDirection: "column",
            backgroundColor: COLORS.FOREGROUND_COLOR,
        }}>
            <View style={{
                paddingRight: 16,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Image source={require("../assets/logo-transparent.png")} style={{width: 128, height: 128}} />
            </View>
            <View style={{height: 24}} />
            <DrawerListItem
                navigation={navigation}
                currentRoute={route}
                to="Home"
                icon={<HomeIcon size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                currentRoute={route}
                to="Schedule"
                icon={<ClockIcon size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                currentRoute={route}
                to="Publications"
                icon={<NewspaperIcon size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                currentRoute={route}
                to="Calendar"
                icon={<CalendarDaysIcon size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                currentRoute={route}
                to="Sports"
                icon={<TrophyIcon size={iconSize} color={COLORS.GREEN} />}
            />
            <DrawerListItem
                navigation={navigation}
                currentRoute={route}
                to="Settings"
                icon={<CogIcon size={iconSize} color={COLORS.GREEN} />}
            />
        </SafeAreaView>
    );
}

export default DrawerComponent;