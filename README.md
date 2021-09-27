# Antnium UI

This is the UI for the Antnium C2. Antnium itself is private till burned. 

## Development

Its on localhost:4200

```
ng serve
```

## Deploy

Compile for antnium release like:
```
ng build --configuration=production --base-href /webui/ --deploy-url /webui/
cp -R dist/antniumui/* ../antnium/webui
```

## Overview

Home
![Home](https://github.com/dobin/antniumui/blob/main/doc/antnium-home.png?raw=true)

Cmd
![Cmd](https://github.com/dobin/antniumui/blob/main/doc/antnium-cmd.png?raw=true)

