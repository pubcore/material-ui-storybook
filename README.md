## Storybook of material-ui based react components

#### Install and run

```
npm i @pubcore/material-ui-storybook
cd material-ui-storybook
npm run start
```

#### Application component example

```
import {AppDecorator} from '@pubcore/material-ui-storybook'
import { createMuiTheme } from "@material-ui/core/styles";
const useDarkMode = () => null //null or boolean, if null => mediaquery detection
const createTheme = ({darkMode}) => createMuiTheme({/*...*/})

export default function Application() {
  return AppDecorator({ useDarkMode, createTheme })(() => {
    return <div>example</div>
  })
}
```

#### https

To run storybook over https, enable it in .env file and define absolute path to
corresponding cert, ca and key file. The .env file is ignored by git and npm
