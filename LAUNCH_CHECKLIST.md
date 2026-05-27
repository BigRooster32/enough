# ENOUGH. App Store Launch Checklist

## Accounts
- Apple Developer Program: required for App Store distribution.
- Google Play Console: required for Google Play distribution.

## Required Store Materials
- App name: ENOUGH.
- Short description.
- Full description.
- App icon PNG exports: 1024x1024 for Apple, high-resolution Play icon for Google.
- Screenshots for iPhone, iPad if supported, Android phone, and Android tablet if supported.
- Privacy policy URL.
- Support URL.
- Age rating / content rating questionnaires.
- Data safety answers for Google Play.
- App privacy answers for App Store Connect.

## Product Readiness
- Replace localStorage with a real backend before public launch if users need cross-device accounts.
- Add account deletion if real accounts are stored on a server.
- Review crisis/wellness disclaimers.
- Test every writable section on mobile.
- Test install behavior as a PWA.

## Native Store Path
- Wrap the web app with Capacitor, PWABuilder, or native Swift/Kotlin shells.
- Create iOS bundle ID and Android package name.
- Generate signed iOS and Android builds.
- Submit builds to TestFlight and Google internal testing before public release.
