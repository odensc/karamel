VERSION=$(jq -r ".version" src/assets/static/manifest.json)

mkdir -p builds/$VERSION
cd dist
zip -r ../builds/$VERSION/$VERSION.zip ./*
