# Next.js + Capacitor Android 앱 빌드 가이드

이 문서는 Next.js 웹 프로젝트를 Capacitor로 Android 앱처럼 패키징하고, StatusBar 설정, Splash Screen 설정, 앱 아이콘/스플래시 리소스 생성, APK 빌드까지 진행하는 과정을 정리한 문서입니다.

비슷한 프로젝트를 새로 만들거나, 현재 프로젝트를 나중에 유지보수할 때 참고하기 위한 목적입니다.

---

## 0. 전체 흐름 요약

```txt
1. Next.js를 정적 export 가능하게 설정
2. Capacitor 설치 및 초기화
3. Android 플랫폼 추가
4. StatusBar 설정
5. Splash Screen 설정
6. 앱 아이콘 / 스플래시 이미지 생성
7. Next.js 빌드
8. Capacitor sync
9. Gradle 또는 Android Studio로 APK 생성
```

Capacitor는 기본적으로 웹 빌드 결과물을 네이티브 앱 안에 넣어 실행합니다.  
Next.js 프로젝트를 Capacitor와 함께 쓰려면 일반적으로 Next.js를 정적 export 방식으로 빌드하는 구조가 가장 단순합니다.

---

## 1. Next.js 정적 export 설정

`next.config.js`를 다음처럼 설정합니다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

이후 빌드하면 `out/` 폴더가 생성됩니다.

```bash
npm run build
```

또는 pnpm 사용 시:

```bash
pnpm build
```

Capacitor의 `webDir`은 이 `out` 폴더를 바라보게 설정합니다.

---

## 2. Capacitor 설치 및 초기화

프로젝트 루트에서 실행합니다.

```bash
npm install @capacitor/core
npm install -D @capacitor/cli
npx cap init
```

pnpm 사용 시:

```bash
pnpm add @capacitor/core
pnpm add -D @capacitor/cli
pnpm exec cap init
```

초기화 시 예시:

```txt
App name: MyApp
App ID: com.company.myapp
```

예:

```txt
App name: CapacitorStudy
App ID: com.kojaemin.capacitorstudy
```

주의할 점:

- `appId`는 Android package name, iOS bundle identifier와 관련됩니다.
- 나중에 바꾸기 번거로우므로 처음에 신중히 정하는 것이 좋습니다.

---

## 3. Android 플랫폼 추가

```bash
npm install @capacitor/android
npx cap add android
```

pnpm 사용 시:

```bash
pnpm add @capacitor/android
pnpm exec cap add android
```

성공하면 프로젝트 루트에 `android/` 폴더가 생성됩니다.

---

## 4. `capacitor.config.ts` 기본 설정

`capacitor.config.ts` 예시입니다.

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.myapp',
  appName: 'MyApp',
  webDir: 'out',
};

export default config;
```

본인 프로젝트에 맞게 수정합니다.

```ts
appId: 'com.kojaemin.capacitorstudy',
appName: 'CapacitorStudy',
webDir: 'out',
```

---

## 5. StatusBar 설정

StatusBar를 화면마다 동적으로 바꾸지 않고, 앱 전체에 고정 설정만 적용할 경우에는 별도의 React 코드가 필요 없습니다.

즉, 아래 같은 파일을 따로 만들 필요가 없습니다.

```txt
lib/native.ts
app/NativeInitializer.tsx
```

고정 설정만 할 경우 `capacitor.config.ts`에 설정하는 방식으로 충분합니다.

### 5-1. StatusBar 플러그인 설치

```bash
npm install @capacitor/status-bar
```

pnpm:

```bash
pnpm add @capacitor/status-bar
```

### 5-2. `capacitor.config.ts`에 StatusBar 설정 추가

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.myapp',
  appName: 'MyApp',
  webDir: 'out',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DEFAULT',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
```

설정 의미:

```txt
overlaysWebView: false
→ 상태바가 웹 화면 위에 겹치지 않게 함

style: 'DEFAULT'
→ 기본 상태바 스타일 사용

backgroundColor: '#ffffff'
→ Android 상태바 배경색을 흰색으로 설정
```

### 5-3. 언제 코드로 설정해야 하나?

아래처럼 화면별로 StatusBar를 다르게 바꿔야 하면 코드가 필요합니다.

```txt
홈 화면은 흰색 StatusBar
상세 화면은 검은색 StatusBar
로그인 화면은 투명 StatusBar
다크모드에 따라 StatusBar 변경
```

하지만 단순한 앱 전체 고정 설정이라면 `capacitor.config.ts`만 사용합니다.

---

## 6. Splash Screen 설정

### 6-1. Splash Screen 플러그인 설치

```bash
npm install @capacitor/splash-screen
```

pnpm:

```bash
pnpm add @capacitor/splash-screen
```

### 6-2. `capacitor.config.ts`에 SplashScreen 설정 추가

최종 예시는 다음과 같습니다.

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.myapp',
  appName: 'MyApp',
  webDir: 'out',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DEFAULT',
      backgroundColor: '#ffffff',
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
};

export default config;
```

설정 의미:

```txt
launchShowDuration: 1500
→ 앱 시작 시 스플래시를 약 1.5초 표시

launchAutoHide: true
→ 시간이 지나면 자동으로 스플래시 숨김

backgroundColor: '#ffffff'
→ 스플래시 배경색

showSpinner: false
→ 기본 로딩 스피너 숨김
```

---

## 7. 앱 아이콘 / 스플래시 이미지 생성

Capacitor에서는 `@capacitor/assets`를 사용해서 Android/iOS에 필요한 아이콘과 스플래시 리소스를 자동 생성할 수 있습니다.

### 7-1. 패키지 설치

```bash
npm install -D @capacitor/assets
```

pnpm:

```bash
pnpm add -D @capacitor/assets
```

### 7-2. `assets/` 폴더 생성

프로젝트 루트에 `assets/` 폴더를 만듭니다.

```txt
my-app/
  assets/
    icon-only.png
    splash.png
  app/
  public/
  android/
  capacitor.config.ts
  package.json
```

최소 구성:

```txt
assets/icon-only.png
assets/splash.png
```

권장 크기:

```txt
icon-only.png → 1024 x 1024
splash.png    → 2732 x 2732
```

처음에는 위 두 파일만 있어도 됩니다.

### 7-3. Android 리소스 생성

npm:

```bash
npx capacitor-assets generate --android
```

pnpm:

```bash
pnpm exec capacitor-assets generate --android
```

iOS까지 같이 만들 경우:

```bash
npx capacitor-assets generate
```

또는 pnpm:

```bash
pnpm exec capacitor-assets generate
```

---

## 8. pnpm + sharp 문제 해결

`@capacitor/assets`는 내부적으로 이미지 처리를 위해 `sharp`를 사용합니다.  
pnpm 환경에서 `sharp` 네이티브 바이너리가 제대로 설치되지 않으면 아래와 같은 에러가 발생할 수 있습니다.

```txt
Something went wrong installing the "sharp" module
Cannot find module '../build/Release/sharp-darwin-arm64v8.node'
```

또는 다음과 같은 의존성 누락 에러가 발생할 수 있습니다.

```txt
Cannot find module '@ionic/utils-array'
```

### 8-1. Node 버전 확인

```bash
node -v
```

Node 24 등 너무 최신 버전에서 문제가 발생하면 Node LTS를 사용하는 것이 안전합니다.

권장:

```bash
nvm install 22
nvm use 22
```

프로젝트에 고정:

```bash
echo "22" > .nvmrc
```

### 8-2. pnpm 설정 추가

프로젝트 루트에 `.npmrc`를 만들고 다음을 추가합니다.

```txt
shamefully-hoist=true
ignore-scripts=false
```

### 8-3. `package.json`에 sharp build 허용 설정

`package.json`에 다음을 추가합니다.

```json
{
  "pnpm": {
    "onlyBuiltDependencies": [
      "sharp"
    ]
  }
}
```

기존 `package.json`에 이미 내용이 있으면 최상위에 `pnpm` 필드만 추가합니다.

### 8-4. 재설치

```bash
rm -rf node_modules
rm -f pnpm-lock.yaml
pnpm store prune
pnpm install
```

필요하면:

```bash
pnpm approve-builds
```

그리고 `sharp` 재빌드:

```bash
pnpm rebuild sharp
```

정상 설치 확인:

```bash
pnpm exec node -e "console.log(require('sharp').versions)"
```

### 8-5. 누락 패키지 직접 설치

`@ionic/utils-array` 에러가 발생하면:

```bash
pnpm add -D @ionic/utils-array
```

또는:

```bash
pnpm add -D @ionic/utils-array @ionic/utils-subprocess
```

다시 실행:

```bash
pnpm exec capacitor-assets generate --android
```

---

## 9. 웹 빌드 후 Capacitor sync

웹 코드를 수정한 뒤 Android 프로젝트에 반영하려면 다음 순서로 실행합니다.

npm:

```bash
npm run build
npx cap sync android
```

pnpm:

```bash
pnpm build
pnpm exec cap sync android
```

`sync`는 다음을 처리합니다.

```txt
Next.js 빌드 결과물 out/ 복사
Capacitor 플러그인 반영
Android 프로젝트 설정 반영
```

플러그인을 새로 설치했거나 `capacitor.config.ts`를 수정했으면 반드시 `cap sync`를 다시 실행합니다.

---

## 10. Android Studio 열기

```bash
npx cap open android
```

pnpm:

```bash
pnpm exec cap open android
```

Android Studio에서 APK를 만들려면:

```txt
Build
→ Build Bundle(s) / APK(s)
→ Build APK(s)
```

생성 위치:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 11. 터미널에서 Debug APK 만들기

프로젝트 루트에서:

```bash
cd android
./gradlew assembleDebug
```

macOS/Linux에서는 `gradlew` 앞에 반드시 `./`를 붙여야 합니다.

잘못된 명령:

```bash
gradlew assembleDebug
```

정상 명령:

```bash
./gradlew assembleDebug
```

성공하면 APK 위치:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

현재 위치가 `android/`라면:

```txt
app/build/outputs/apk/debug/app-debug.apk
```

---

## 12. JDK 21 / Gradle 문제 해결

Android 빌드 중 아래 에러가 발생할 수 있습니다.

```txt
error: invalid source release: 21
```

이 에러는 Gradle/Android 빌드가 Java 21 기준으로 컴파일하려고 하는데, 실제 Gradle이 Java 17 이하로 실행되고 있을 때 발생합니다.

### 12-1. 현재 Java 확인

```bash
java -version
```

### 12-2. Gradle이 실제로 쓰는 Java 확인

`android` 폴더에서:

```bash
./gradlew -version
```

확인해야 할 부분:

```txt
Launcher JVM: 21.x.x
Daemon JVM: 21.x.x
```

만약 이런 식으로 나오면 문제입니다.

```txt
Launcher JVM: 17.0.14
Daemon JVM: /opt/homebrew/Cellar/openjdk@17/...
```

### 12-3. JDK 21 설치 확인

```bash
/usr/libexec/java_home -V
```

예상 출력:

```txt
21.0.11 ... /opt/homebrew/Cellar/openjdk@21/21.0.11/libexec/openjdk.jdk/Contents/Home
```

없으면 설치:

```bash
brew install openjdk@21
```

### 12-4. 현재 셸에 Java 21 적용

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
```

확인:

```bash
java -version
```

### 12-5. Gradle 데몬 종료

```bash
cd android
./gradlew --stop
```

다시 확인:

```bash
./gradlew -version
```

---

## 13. jenv 때문에 Java 17이 계속 적용되는 경우

실제로 겪은 문제입니다.

Java 21을 설치했고 `java -version`도 21로 나오는데, `./gradlew -version`은 계속 Java 17을 잡는 경우가 있었습니다.

원인은 `jenv`가 Java 17을 사용하도록 설정되어 있었기 때문입니다.

### 13-1. jenv 상태 확인

```bash
jenv versions
jenv version
```

만약 아래 메시지가 나오면 jenv 설정이 꼬인 상태입니다.

```txt
jenv: version `17' is not installed
```

### 13-2. Java 17 제거

Homebrew로 설치된 Java 17을 제거합니다.

```bash
brew uninstall openjdk@17
```

의존성 문제로 막히면:

```bash
brew uninstall --ignore-dependencies openjdk@17
```

확인:

```bash
/usr/libexec/java_home -V
```

Java 21만 남는 것이 좋습니다.

### 13-3. jenv에 Java 21 등록

```bash
jenv add /opt/homebrew/Cellar/openjdk@21/21.0.11/libexec/openjdk.jdk/Contents/Home
```

확인:

```bash
jenv versions
```

예:

```txt
system
21
21.0
21.0.11
openjdk64-21.0.11
```

### 13-4. jenv 전역 버전 21로 설정

```bash
jenv global 21.0.11
```

프로젝트에도 21 지정:

```bash
cd ~/Documents/capacitor-study
jenv local 21.0.11
```

이 명령은 프로젝트 루트에 `.java-version` 파일을 만듭니다.

확인:

```bash
cat .java-version
```

예상:

```txt
21.0.11
```

### 13-5. jenv rehash 에러 해결

아래 에러가 발생할 수 있습니다.

```txt
jenv: cannot rehash: /Users/kojaemin/.jenv/shims/.jenv-shim exists
```

해결:

```bash
rm -f ~/.jenv/shims/.jenv-shim
jenv rehash
```

### 13-6. `.java-version`에 17이 남아있는지 확인

상위 폴더나 프로젝트 폴더에 `.java-version`이 남아있을 수 있습니다.

```bash
find ~ -name ".java-version" -maxdepth 4 -print
```

내용 확인:

```bash
cat ~/Documents/capacitor-study/.java-version 2>/dev/null
cat ~/Documents/.java-version 2>/dev/null
cat ~/.java-version 2>/dev/null
```

`17`이 적힌 파일이 있으면 `21.0.11`로 변경합니다.

```bash
echo "21.0.11" > ~/Documents/capacitor-study/.java-version
```

### 13-7. 셸 재시작

```bash
exec zsh
```

확인:

```bash
jenv version
java -version
```

---

## 14. Debug APK 최종 빌드 순서

정상 환경이 준비된 후 최종 순서입니다.

프로젝트 루트에서:

```bash
pnpm build
pnpm exec cap sync android
cd android
./gradlew clean assembleDebug
```

npm 사용 시:

```bash
npm run build
npx cap sync android
cd android
./gradlew clean assembleDebug
```

APK 위치:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 15. Release APK / AAB 만들기

Debug APK는 테스트용입니다. Google Play 배포용은 보통 AAB를 사용합니다.

### 15-1. 키스토어 생성

프로젝트 루트에서:

```bash
keytool -genkey -v \
  -keystore my-release-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias my-key-alias
```

Windows나 한 줄로 실행해야 하는 경우:

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

주의:

```txt
my-release-key.jks 파일과 비밀번호는 절대 잃어버리면 안 됨.
같은 앱을 업데이트할 때 계속 필요함.
```

### 15-2. Release APK 생성

```bash
npx cap build android \
  --keystorepath my-release-key.jks \
  --keystorepass YOUR_KEYSTORE_PASSWORD \
  --keystorealias my-key-alias \
  --keystorealiaspass YOUR_ALIAS_PASSWORD \
  --androidreleasetype APK
```

pnpm:

```bash
pnpm exec cap build android \
  --keystorepath my-release-key.jks \
  --keystorepass YOUR_KEYSTORE_PASSWORD \
  --keystorealias my-key-alias \
  --keystorealiaspass YOUR_ALIAS_PASSWORD \
  --androidreleasetype APK
```

### 15-3. Google Play용 AAB 생성

```bash
npx cap build android \
  --keystorepath my-release-key.jks \
  --keystorepass YOUR_KEYSTORE_PASSWORD \
  --keystorealias my-key-alias \
  --keystorealiaspass YOUR_ALIAS_PASSWORD \
  --androidreleasetype AAB
```

pnpm:

```bash
pnpm exec cap build android \
  --keystorepath my-release-key.jks \
  --keystorepass YOUR_KEYSTORE_PASSWORD \
  --keystorealias my-key-alias \
  --keystorealiaspass YOUR_ALIAS_PASSWORD \
  --androidreleasetype AAB
```

---

## 16. 추천 `package.json` scripts

pnpm 기준:

```json
{
  "scripts": {
    "build": "next build",
    "cap:sync:android": "pnpm build && pnpm exec cap sync android",
    "android:open": "pnpm run cap:sync:android && pnpm exec cap open android",
    "android:debug": "pnpm run cap:sync:android && cd android && ./gradlew assembleDebug"
  }
}
```

npm 기준:

```json
{
  "scripts": {
    "build": "next build",
    "cap:sync:android": "npm run build && npx cap sync android",
    "android:open": "npm run cap:sync:android && npx cap open android",
    "android:debug": "npm run cap:sync:android && cd android && ./gradlew assembleDebug"
  }
}
```

사용 예:

```bash
pnpm run android:debug
```

또는:

```bash
npm run android:debug
```

---

## 17. 자주 쓰는 명령어 모음

### Next.js 빌드

```bash
pnpm build
```

### Android sync

```bash
pnpm exec cap sync android
```

### Android Studio 열기

```bash
pnpm exec cap open android
```

### Debug APK 생성

```bash
cd android
./gradlew clean assembleDebug
```

### APK 위치

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

### Gradle Java 버전 확인

```bash
cd android
./gradlew -version
```

### Java 설치 목록 확인

```bash
/usr/libexec/java_home -V
```

### jenv 확인

```bash
jenv versions
jenv version
```

---

## 18. 핵심 정리

### Capacitor 쪽 핵심

```txt
Next.js → npm/pnpm build → out/ 생성
Capacitor → out/ 폴더를 Android 앱 안에 복사
Android → Gradle로 APK 생성
```

### StatusBar

```txt
앱 전체 고정 설정이면 capacitor.config.ts만 사용
화면별로 바꾸려면 React 코드에서 @capacitor/status-bar 사용
```

### Splash Screen

```txt
@capacitor/splash-screen 설치
capacitor.config.ts에 SplashScreen 설정
assets/splash.png 준비
capacitor-assets generate 실행
```

### APK

```txt
Debug APK → ./gradlew assembleDebug
Google Play 배포 → Release AAB 권장
```

### 실제로 겪은 주요 문제

```txt
1. pnpm + sharp 네이티브 바이너리 설치 문제
2. @ionic/utils-array 누락 문제
3. JDK 17/21 충돌 문제
4. jenv가 Java 17을 계속 가리키던 문제
```

해결 후에는 Java 21을 기준으로 맞추는 것이 중요합니다.

```bash
java -version
./gradlew -version
jenv version
```

세 곳 모두 Java 21을 가리키는지 확인합니다.
