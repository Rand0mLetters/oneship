import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Dimensions, Text, View } from "react-native"
import COLORS from '../util/COLORS'
import { Link } from '@react-navigation/native';
import isWeb from '../util/util';
import { RouteContext } from '../util/contexts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DrawerListItem = ({ navigation, currentRoute, setCurrentRoute, icon, to}) => {
    const insets = useSafeAreaInsets();
    const setRoute = () => {
        navigation.navigate(to);
        setTimeout(()=> setCurrentRoute(to), 10); // I GOT A NEED FOR SPEED
    }

    const component = (
        <>
            <View>
                {icon}
            </View>
            <View style={{width: 12}} />
            <Text style={{
                color: COLORS.GREEN,
                fontSize: 18,
                fontWeight: "bold",
            }}>
                {to}
            </Text>
            <View style={{flexGrow: .9}} />
        </>
    )

    if(isWeb()){
        return (
            <Link
                to={"/" + to}
                onPress={setRoute}
                style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'left',
                    flexDirection: "row",
                    height: 48,
                    paddingLeft: 12,
                    marginLeft: 4,
                    marginRight: 4,
                    borderRadius: 8,
                    pointer: "cursor",
                    backgroundColor: currentRoute == to ? COLORS.LIGHT : COLORS.FOREGROUND_COLOR,
                }}
            >
                {component}
            </Link>
          )
    }

    return (
        <TouchableOpacity
            onPress={setRoute}
            style={{
                display: "flex",
                alignItems: 'center',
                justifyContent: 'left',
                flexDirection: "row",
                height: 56,
                width: "100%",
                paddingLeft: 16,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                marginRight: 4,
                pointer: "cursor",
                backgroundColor: currentRoute == to ? COLORS.LIGHT : COLORS.FOREGROUND_COLOR,
            }}
        >
            {component}
        </TouchableOpacity>
    )
  
}

export default DrawerListItem