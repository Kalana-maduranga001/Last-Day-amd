import { Text, View } from 'react-native'
import React from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera'

const Index = () => {
  const [permission, requestPermission] = useCameraPermissions()

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Camera permission is required</Text>

        <Text
          className="mt-4 text-blue-600"
          onPress={requestPermission}
        >
          Grant Permission
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-red-50">
      <CameraView style={{ flex: 1 }} facing="back" />
    </View>
  )
}

export default Index
