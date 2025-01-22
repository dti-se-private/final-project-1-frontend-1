"use client"
import {HeroUIProvider} from '@heroui/react'
import {Provider as ReduxProvider} from "react-redux";
import {persistor, store} from "@/src/stores";
import {PersistGate} from "redux-persist/integration/react";
import 'swiper/scss';
import 'swiper/scss/pagination';

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
                    {children}
                </HeroUIProvider>
            </PersistGate>
        </ReduxProvider>
    )
}