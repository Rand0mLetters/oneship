import { TextInput, TouchableOpacity, View, Text } from "react-native"
import tailwind from "tailwind-rn"
import { CONFIG } from "../util/config"

const NiceInput = ({ cb, placeholder, type, error = "", props, style }) => {
    return (
        <View style={tailwind("w-full flex flex-col justify-center items-center m-2")}>
            <TextInput
                style={[
                    tailwind("px-4 h-12 py-2 m-1 font-bold text-lg flex flex-row justify-center items-center"),
                    {
                        backgroundColor: CONFIG.bg,
                        borderRadius: 8,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        width: "80%",
                        color: CONFIG.green,
                        borderColor: error.length != 0 ? CONFIG.red : "#00000000",
                        borderWidth: error.length != 0 ? 1 : 0,
                        lineHeight: 24, // h-12 = 24px
                        ...style
                    }
                ]}
                onChangeText={(e) => cb(e)}
                placeholder={placeholder}
                placeholderTextColor={CONFIG.grey}
                secureTextEntry={type == "password" ? true : false}
                textContentType={type}
                keyboardType="numeric"
                {...props}
            />
            <Text style={{ color: CONFIG.red }}>
                {error}
            </Text>
        </View>
    )
}

export default NiceInput;