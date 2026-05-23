# Android 빌드 문제 해결 가이드

## 해결된 문제

### 1. 라이브러리 버전 호환성
- React Native 0.72.10과 호환되는 라이브러리 버전으로 조정
- `package.json`이 이미 업데이트됨

### 2. `react-native-gesture-handler` 수정
- `build.gradle`에 `buildFeatures.buildConfig true` 추가
- `namespace "com.swmansion.gesturehandler"` 추가
- `compileSdkVersion` 33으로 업데이트

### 3. `react-native-safe-area-context` 수정
- `build.gradle`에 `buildFeatures.buildConfig true` 추가
- `namespace "com.th3rdwave.safeareacontext"` 추가
- `compileSdkVersion` 33으로 업데이트

### 4. `react-native-maps` 수정
- `AndroidManifest.xml` 패키지명 일치화: `com.rnmaps.maps` → `com.airbnb.android.react.maps`

## 사용자 작업 단계

### 단계 1: 패키지 재설치
```bash
npm install --legacy-peer-deps
```

### 단계 2: 수동 파일 수정 (필요시)
다음 파일들이 `node_modules`에 수정되었습니다:
1. `node_modules/react-native-gesture-handler/android/build.gradle`
2. `node_modules/react-native-safe-area-context/android/build.gradle`
3. `node_modules/react-native-maps/android/src/main/AndroidManifest.xml`

만약 `npm install` 후에 수정사항이 손실되었다면, 위 파일들을 직접 수정하세요.

### 단계 3: Android 프로젝트 정리
```bash
cd android
./gradlew clean
```

### 단계 4: 빌드 테스트
```bash
./gradlew build
```

또는 Android Studio에서:
1. **File → Sync Project with Gradle Files**
2. **Build → Clean Project**
3. **Build → Make Project**

## 추가 문제 해결

### 만약 여전히 오류가 발생한다면:

#### 1. `buildConfig` 관련 오류
다른 라이브러리에서도 동일한 오류가 발생할 수 있습니다. 해당 라이브러리의 `build.gradle`에 다음을 추가하세요:
```groovy
android {
    buildFeatures {
        buildConfig true
    }
    namespace "패키지명"  // AndroidManifest.xml의 package와 일치
}
```

#### 2. Kotlin 컴파일 오류
`android/app/build.gradle`에 다음이 이미 추가되어 있습니다:
```groovy
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
}
kotlinOptions {
    jvmTarget = '17'
}
```

#### 3. 중복 클래스 오류
`android/app/build.gradle`에 다음을 추가하세요:
```groovy
configurations {
    all {
        exclude group: 'com.facebook.react', module: 'react-native'
    }
}
```

## 최종 확인사항

1. ✅ `package.json` - 라이브러리 버전 호환성 확인
2. ✅ `android/app/build.gradle` - Kotlin 플러그인 및 옵션 확인
3. ✅ `android/build.gradle` - AGP 및 Kotlin 버전 확인
4. ✅ `node_modules` 라이브러리 수정 - buildConfig 및 namespace

이제 빌드가 성공해야 합니다. 만약 여전히 문제가 있다면, 구체적인 오류 메시지를 확인해주세요.