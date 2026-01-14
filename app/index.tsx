import React, { useRef, useState } from 'react'
import { Text, View, Pressable, Alert, Image } from 'react-native'
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  BarcodeScanningResult,
} from 'expo-camera'

const Index = () => {
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView | null>(null)

  const [facing, setFacing] = useState<CameraType>('back')
  const [scanned, setScanned] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const takePhoto = async () => {
    if (!cameraRef.current) return
    const result = await cameraRef.current.takePictureAsync()
    setPhoto(result.uri)
  }

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return
    setScanned(true)
    Alert.alert('QR Code Scanned', result.data)
  }

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Camera permission is required</Text>
        <Text style={{ marginTop: 10, color: 'blue' }} onPress={requestPermission}>
          Grant Permission
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      {/* Controls */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          width: '100%',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Capture */}
        <Pressable
          onPress={takePhoto}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: 'white',
            borderWidth: 4,
            borderColor: '#ccc',
          }}
        />

        {/* Flip */}
        <Pressable
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: 'black',
            borderRadius: 6,
          }}
        >
          <Text style={{ color: 'white' }}>Flip Camera</Text>
        </Pressable>

        {/* Scan Again */}
        {scanned && (
          <Pressable
            onPress={() => setScanned(false)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: 'green',
              borderRadius: 6,
            }}
          >
            <Text style={{ color: 'white' }}>Scan Again</Text>
          </Pressable>
        )}
      </View>

      {/* Photo Preview */}
      {photo && (
        <Image
          source={{ uri: photo }}
          style={{
            position: 'absolute',
            top: 40,
            right: 20,
            width: 100,
            height: 150,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: 'white',
          }}
        />
      )}
    </View>
  )
}

export default Index
