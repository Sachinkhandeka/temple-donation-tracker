import React, { Suspense, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";

// Lazy-loaded components
const DevoteeProfile = React.lazy(() => import("./components/templeDetails/DevoteeProfile"));
const Devotees = React.lazy(() => import("./pages/Devotees"));
const TempleDetail = React.lazy(() => import("./components/templeDetails/TempleDetail"));
const TempleList = React.lazy(() => import("./components/templeDetails/TempleList"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const LandingPage = React.lazy(() => import("./components/landingpage/LandingPage"));
const PhoneOtpForm = React.lazy(() => import("./pages/PhoneOtpForm"));
const PrivateRoute = React.lazy(() => import("./components/PrivateRoute"));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex justify-center items-center min-h-screen gap-4">
        <Spinner size="xl" />
        <div>Loading...</div>
    </div>
);

// Suspense wrapper
const SuspenseWrapper = ({ children }) => (
    <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

export default function App() {
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration
            once: false, // Whether animation should happen only once
        });
    }, []);

    return (
        <>
            {/* Helmet for meta tags */}
            <Helmet>
                <title>MandirMitra: Streamline Temple Management</title>
                <meta
                    name="description"
                    content="MandirMitra - The all-in-one temple management solution. Simplify donations, expenses, events, and gain data-driven insights. Empower your temple and connect with your devotees."
                />
                <meta
                    name="keywords"
                    content="temple management software, temple donation management, temple event management, online donation platform for temples, mandir mitra, mandir management app, temple accounting software"
                />
                <meta name="author" content="MandirMitra Team" />
                <meta
                    property="og:title"
                    content="MandirMitra: Streamline Temple Management"
                />
                <meta
                    property="og:description"
                    content="MandirMitra - The all-in-one temple management solution. Simplify donations, expenses, events, and gain data-driven insights. Empower your temple and connect with your devotees."
                />
                <meta property="og:url" content="https://www.mandirmitra.co.in/" />
            </Helmet>

            {/* Router setup */}
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/landingpage"
                        element={
                            <SuspenseWrapper>
                                <LandingPage />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <SuspenseWrapper>
                                <DevoteeProfile />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <SuspenseWrapper>
                                <TempleList />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/temple/:id/*"
                        element={
                            <SuspenseWrapper>
                                <TempleDetail />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <SuspenseWrapper>
                                <PhoneOtpForm />
                            </SuspenseWrapper>
                        }
                    />
                    <Route
                        path="/devotees"
                        element={
                            <SuspenseWrapper>
                                <Devotees />
                            </SuspenseWrapper>
                        }
                    />

                    {/* Private Routes */}
                    <Route
                        element={
                            <SuspenseWrapper>
                                <PrivateRoute />
                            </SuspenseWrapper>
                        }
                    >
                        <Route
                            path="/dashboard"
                            element={
                                <SuspenseWrapper>
                                    <Dashboard />
                                </SuspenseWrapper>
                            }
                        />
                    </Route>

                    {/* Fallback Route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
