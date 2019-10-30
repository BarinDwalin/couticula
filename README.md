[![](https://github.com/BarinDwalin/couticula/workflows/CI/badge.svg)](https://github.com/BarinDwalin/couticula/actions)

run: ionic serve
     ionic run android
addon: ionic cordova platform add android // выполняется 1 раз для платформы
build dev: ionic cordova build android
build prod: ionic cordova build android --prod --release
formatting: ./node_modules/.bin/prettier --write "**/*.ts"
