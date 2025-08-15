# CI via GitHub Actions + EAS Build

Create `.github/workflows/eas-build.yml` with:

```yaml
name: EAS Build
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
      - run: npm ci
      - run: npm i -g eas-cli
      - run: eas build --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
```

## Expo Webhook (publish after build)
- In Expo dashboard → Project → Webhooks: add webhook that triggers your publish/update endpoint.
- Alternatively, append a job using `eas update` after successful build in workflow.

## Sentry Integration
- Add `sentry-expo` plugin in `app.json` (already added) and set secrets:
  - `SENTRY_AUTH_TOKEN` in GitHub Secrets
  - DSN in `.env` -> runtime usage in app
- Source maps will be uploaded during EAS build when Sentry is configured.