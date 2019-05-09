VERSION=$(jq -r ".version" src/assets/static/manifest.json)

mkdir -p builds/$VERSION
cd dist
zip -r ../builds/$VERSION/out.zip ./*
cd ../builds/$VERSION
mv out.zip $VERSION.zip
cd ../..
