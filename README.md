Great 👍
Below is **everything explained step-by-step**, **full working code**, and a **ready-to-use README.md** you can paste into your project.

---

# 📸 Expo Camera App (Auto Save + QR Scanner)

This app:

* Opens camera
* Takes photo
* **Automatically saves photo to gallery**
* Scans **QR codes**
* Flips camera (front/back)
* Shows photo preview

---

## 1️⃣ FULL SOURCE CODE

📁 `app/index.tsx`

```tsx
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
  // Camera reference
  const cameraRef = useRef<CameraView | null>(null)

  // Permissions
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions()
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions()

  // States
  const [facing, setFacing] = useState<CameraType>('back')
  const [photo, setPhoto] = useState<string | null>(null)
  const [scanned, setScanned] = useState(false)

  // Ask gallery permission once
  useEffect(() => {
    if (!mediaPermission?.granted) {
      requestMediaPermission()
    }
  }, [])

  // 📸 Take photo and auto-save
  const takePhoto = async () => {
    if (!cameraRef.current) return

    const result = await cameraRef.current.takePictureAsync()
    setPhoto(result.uri)

    try {
      const asset = await MediaLibrary.createAssetAsync(result.uri)
      const album = await MediaLibrary.getAlbumAsync('MyCameraApp')

      if (!album) {
        await MediaLibrary.createAlbumAsync('MyCameraApp', asset, false)
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
      }
    } catch (err) {
      console.log('Save error:', err)
    }
  }

  // 🔍 QR code scan handler
  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return
    setScanned(true)
    Alert.alert('QR Code Scanned', result.data)
  }

  // Permission screen
  if (!cameraPermission?.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Camera permission is required</Text>
        <Text
          style={{ color: 'blue', marginTop: 10 }}
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
            padding: 10,
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
              padding: 10,
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
```

---

# 2️⃣ HOW THIS CODE WORKS (EXPLAINED)

### 📌 `CameraView`

Shows live camera preview.

```tsx
<CameraView facing={facing} />
```

### 📌 `useCameraPermissions()`

Asks camera permission.

### 📌 `useRef`

Gives access to camera methods like:

```ts
cameraRef.current.takePictureAsync()
```

### 📌 Auto Save Logic

This saves photo **immediately** after capture:

```ts
const asset = await MediaLibrary.createAssetAsync(result.uri)
```

### 📌 QR Scanner

Reads QR automatically:

```tsx
onBarcodeScanned={handleBarcodeScanned}
```

### 📌 Album Creation

Creates album if it doesn’t exist:

```ts
MyCameraApp
```

---

# 3️⃣ README.md (COPY & PASTE)

````md
# 📸 Expo Camera App

A React Native Expo app with:
- Camera
- Auto-save to gallery
- QR code scanner
- Camera flip
- Photo preview

---

## 🚀 Features
- 📷 Capture photo
- 💾 Automatically save to gallery
- 🔍 QR code scanning
- 🔄 Flip front/back camera
- 🖼 Preview captured photo

---

## 🧰 Tech Stack
- Expo
- React Native
- expo-camera
- expo-media-library

---

## 📦 Installation

### 1. Create Expo Project
```bash
npx create-expo-app camera-app
cd camera-app
````

### 2. Install Dependencies

```bash
npx expo install expo-camera expo-media-library
```

### 3. Replace Code

Replace:

```
app/index.tsx
```

with the provided source code.

---

## ▶ Run App

```bash
npx expo start
```

Scan QR using **Expo Go** app on your phone.

---

## ⚠ Important Notes

* Camera does NOT work on emulator
* Use real Android or iPhone
* Gallery permission required

---

## 📂 Saved Photos

Photos are saved inside album:

```
MyCameraApp
```

---

## 📜 License

Free to use for learning & projects.

```

---

## 4️⃣ Common Errors & Fixes

| Error | Solution |
|-----|---------|
| `expo: command not found` | Use `npx expo` |
| Camera not opening | Use real device |
| Photo not saved | Grant gallery permission |

---

## 5️⃣ Want Improvements?
I can add:
- Flash 🔦
- Zoom 🔍
- Upload photo to backend ☁
- Save QR + photo together 📂
- Custom camera UI 🎨

Just tell me 🚀
```
