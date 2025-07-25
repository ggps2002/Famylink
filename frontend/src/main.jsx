import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import MyToastContainer from './toastContainer.jsx'
import './index.css'
import { store, persistor } from './store.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SocketProvider } from './Config/socketProvider.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
const STRIPE_PUBLISABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISABLE_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const stripePromise = loadStripe(STRIPE_PUBLISABLE_KEY);

createRoot(document.getElementById('root')).render(
     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <SocketProvider>
            <Elements stripe={stripePromise} fontSize={30}>
                <App />
                <MyToastContainer />
            </Elements>
            </SocketProvider>
        </PersistGate>
    </Provider>
    </GoogleOAuthProvider>

)