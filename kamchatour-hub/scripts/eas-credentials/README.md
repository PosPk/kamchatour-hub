# EAS Credentials

Upload Android keystore to EAS Credentials once and remove local files:

1. Generate (if needed):
```
keytool -genkey -v -keystore credentials/keystore.jks -storepass <storepass> -keypass <keypass> -alias upload -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Kamchatour, OU=Dev, O=Kamchatour, L=City, ST=State, C=RU"
```
2. Upload to EAS (interactive):
```
EXPO_TOKEN=... npx eas-cli credentials -p android
```
3. Delete local `credentials/` and ensure `.gitignore` contains it.