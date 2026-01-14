import React, { useRef, useState } from 'react'
import { View, Text, Pressable, Alert, Image } from 'react-native'
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  BarcodeScanningResult,
} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'

export default function Index() {
  const cameraRef = useRef<CameraView | null>(null)

  // Camera permission
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions()

  // Media library permission
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions()

  const [facing, setFacing] = useState<CameraType>('back')
  const [photo, setPhoto] = useState<string | null>(null)
  const [scanned, setScanned] = useState(false)

  // Take photo
  const takePhoto = async () => {
    if (!cameraRef.current) return
    const result = await cameraRef.current.takePictureAsync()
    setPhoto(result.uri)
  }

  // Save photo to gallery
  const savePhoto = async () => {
    if (!photo) return

    if (!mediaPermission?.granted) {
      await requestMediaPermission()
    }

    const asset = await MediaLibrary.createAssetAsync(photo)
    const album = await MediaLibrary.getAlbumAsync('MyCameraApp')

    if (!album) {
      await MediaLibrary.createAlbumAsync('MyCameraApp', asset, false)
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
    }

    Alert.alert('Saved', 'Photo saved to gallery')
  }

  // QR code handler
  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return
    setScanned(true)
    Alert.alert('QR Code Scanned', result.data)
  }

  // Permission UI
  if (!cameraPermission?.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Camera permission is required</Text>
        <Text
          style={{ marginTop: 10, color: 'blue' }}
          onPress={requestCameraPermission}
        >
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

        {/* Save */}
        {photo && (
          <Pressable
            onPress={savePhoto}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: '#2563eb',
              borderRadius: 6,
            }}
          >
            <Text style={{ color: 'white' }}>Save to Gallery</Text>
          </Pressable>
        )}

        {/* Flip */}
        <Pressable
          onPress={() =>
            setFacing(facing === 'back' ? 'front' : 'back')
          }
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
