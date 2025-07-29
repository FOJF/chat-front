import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    background: '#f5f5f5'
  }
}

export default createVuetify(
    {
        components,
        theme: {
          defaultTheme: 'myCustomLightTheme',
          themes: {
            myCustomLightTheme
          }
        }
    }
);