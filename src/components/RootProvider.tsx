"use client"
import {HeroUIProvider} from '@heroui/react'
import {Provider as ReduxProvider} from "react-redux";
import {persistor, store} from "@/src/stores";
import {PersistGate} from "redux-persist/integration/react";
import 'swiper/scss';
import 'swiper/scss/pagination';
import {GoogleOAuthProvider} from "@react-oauth/google";

export default function Component(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    return (
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <HeroUIProvider>
                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                        {children}
                    </GoogleOAuthProvider>
                </HeroUIProvider>
            </PersistGate>
        </ReduxProvider>
    )
}