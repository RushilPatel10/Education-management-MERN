import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, createTheme } from '@mui/material'
import AppRoutes from './routes'
import store from './redux/store'
import 'react-toastify/dist/ReactToastify.css'

const theme = createTheme({
  // Add any theme customization here
})

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <AppRoutes />
          <ToastContainer />
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
