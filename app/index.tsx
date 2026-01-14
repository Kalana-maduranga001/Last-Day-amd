import React, { useRef, useState } from 'react'
import { Text, View, Pressable, Alert } from 'react-native'
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

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return
    setScanned(true)

    Alert.alert('QR Code Scanned', result.data)
    console.log(result)
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={{ position: 'absolute', bottom: 40, width: '100%', alignItems: 'center', gap: 16 }}>
        <Pressable
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'black', borderRadius: 6 }}
        >
          <Text style={{ color: 'white' }}>Flip Camera</Text>
        </Pressable>

        {scanned && (
          <Pressable
            onPress={() => setScanned(false)}
            style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'green', borderRadius: 6 }}
          >
            <Text style={{ color: 'white' }}>Scan Again</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

export default Index
