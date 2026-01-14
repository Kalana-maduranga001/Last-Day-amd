import React, { useRef, useState, useEffect } from 'react'
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

  // Permissions
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions()
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions()

  const [facing, setFacing] = useState<CameraType>('back')
  const [photo, setPhoto] = useState<string | null>(null)
  const [scanned, setScanned] = useState(false)

  // Ask gallery permission once
  useEffect(() => {
    if (!mediaPermission?.granted) {
      requestMediaPermission()
    }
  }, [])

  // 📸 TAKE PHOTO + AUTO SAVE
  const takePhoto = async () => {
    if (!cameraRef.current) return

    const result = await cameraRef.current.takePictureAsync()
    setPhoto(result.uri)

    // 💾 Auto save to gallery
    try {
      const asset = await MediaLibrary.createAssetAsync(result.uri)
      const album = await MediaLibrary.getAlbumAsync('MyCameraApp')

      if (!album) {
        await MediaLibrary.createAlbumAsync('MyCameraApp', asset, false)
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
      }
    } catch (error) {
      console.log('Save error:', error)
    }
  }

  // 🔍 QR Scanner
  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return
    setScanned(true)
    Alert.alert('QR Code Scanned', result.data)
  }

  // Permission UI
  if (!cameraPermission?.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
        {/* Capture Button */}
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

        {/* Flip Camera */}
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

      {/* Preview */}
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
