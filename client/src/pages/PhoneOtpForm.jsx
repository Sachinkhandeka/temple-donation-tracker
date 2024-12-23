import React, { useState, Suspense } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Spinner } from 'flowbite-react';
import OtpInput from '../components/OtpInput';
import { MdMarkEmailRead, MdOutlineAdminPanelSettings } from "react-icons/md";
import { app } from '../firebase';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import brand from "../assets/brand.jpg";
import "../css/PhoneInputCostom.css";
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { signinSuccess, signinFailure } from '../redux/user/userSlice';
import Alert from '../components/Alert';
import { IoHomeOutline } from 'react-icons/io5';

const SignupSuperAdmin = React.lazy(() => import("./SignupSuperAdmin"));
const SigninUser = React.lazy(() => import("./SigninUser"));
const CreateSuperAdmin = React.lazy(() => import("./CreateSuperAdmin"));
const SigninSuperAdmin = React.lazy(()=> import("./SigninSuperAdmin"));

export default function PhoneOtpForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showComponent, setShowComponent] = useState('phoneInput'); // 'phoneInput', 'otpInput', 'addTemple', 'signin', 'createSuperAdmin', 'signinSuperAdmin'
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const auth = getAuth(app);

    const setUpReacptcha = async (phoneNumber) => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
        await recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    };

    const handleOnChange = (value, { dialCode = '' }) => {
        setPhoneNumber(`+${dialCode}${value.slice(dialCode.length)}`);
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(!password) { 
            setError("Please enter password");
            return setLoading(false);
        }

        const regex = /[^0-9]/g;
        const strippedPhoneNumber = phoneNumber.replace(regex, '');
        if (strippedPhoneNumber.length < 10 || regex.test(strippedPhoneNumber)) {
            setError('Invalid Phone Number');
            setLoading(false);
            return;
        }

        try {
            const response = await setUpReacptcha(phoneNumber);
            setConfirmationResult(response);
            setShowComponent('otpInput');
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const onOtpSubmit = async (combinedOtp) => {
        if (confirmationResult) {
            try {
                const result = await confirmationResult.confirm(combinedOtp);
                const phoneNumber = result.user.phoneNumber;
                await LogInWithPhoneNumber(phoneNumber);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const LogInWithPhoneNumber = async (phoneNumber) => {
        if(!password) { 
            setError("Please enter password");
            return setLoading(false);
        }
        try {
            const response = await fetch(
                '/api/superadmin/login',
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ phoneNumber, password }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                dispatch(signinFailure(data.message));
                setLoading(false);
                return setError(data.message);
            }

            if (data.needsSignup) {
                localStorage.setItem('signupPhoneNumber', phoneNumber);
                setShowComponent('addTemple');
            } else {
                dispatch(signinSuccess(data.currUser));
                navigate("/dashboard");
            }
        } catch (err) {
            dispatch(signinFailure(err.message));
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <section className="phone-otp-section w-full bg-white h-screen flex flex-col md:flex-row items-center md:bg-gradient-to-tr md:from-blue-400 md:via-sky-600 md:to-indigo-800" aria-labelledby="phone-otp-title">
            {/* Helmet for SEO Meta Tags and Structured Data */}
            <Helmet>
                <title>MandirMitra - Admin Login and Temple Registration</title>
                <meta
                    name="description"
                    content="Log in or sign up as a temple admin or employee with MandirMitra. Use phone verification or email login to access the temple dashboard or register a new temple."
                />
                <meta
                    name="keywords"
                    content="MandirMitra, temple management, admin login, temple registration, OTP verification, phone login, temple dashboard"
                />
                <meta name="author" content="MandirMitra Team" />
                <meta property="og:title" content="MandirMitra - Admin Login and Temple Registration" />
                <meta property="og:description" content="Log in or sign up as a temple admin or employee with MandirMitra. Use OTP verification to manage temple details and access the dashboard." />
                <meta property="og:image" content={brand} />
                <meta property="og:url" content="https://www.mandirmitra.co.in/login" />
                <meta property="og:type" content="website" />

                {/* Structured Data for Login and Registration */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Admin Login and Temple Registration",
                        "description": "Log in or sign up to access temple details and management dashboard via MandirMitra.",
                        "url": "https://www.mandirmitra.co.in/login",
                        "potentialAction": [
                            {
                                "@type": "RegisterAction",
                                "name": "Sign up as Admin or Employee",
                                "target": "https://www.mandirmitra.co.in/login",
                                "result": {
                                    "@type": "RegisterAction",
                                    "name": "Phone OTP Verification"
                                }
                            },
                            {
                                "@type": "LoginAction",
                                "name": "Login with Phone or Email",
                                "target": "https://www.mandirmitra.co.in/login"
                            }
                        ]
                    })}
                </script>
            </Helmet>
            <div className="flex flex-col items-center justify-center gap-2 p-4 md:hidden">
                <img src={brand} alt="brand_image" className='h-16 w-16 border-2 rounded-md' />
                <span className='text-xs font-serif text-gray-500' >mandirmitra</span>
            </div>
            <div className="hidden md:flex md:w-1/2 flex-col p-12">
                <p className="text-white md:text-4xl lg:text-6xl font-bold italic">"Managing Temple Activities with Ease and Grace."</p>
                <p className="text-white md:text-2xl lg:text-4xl font-bold italic p-6">- mandirmitra</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:max-w-md md:py-6 bg-white md:min-h-40 rounded-lg md:border md:border-blue-500 md:pt-1 md:p-10">
                {showComponent === 'phoneInput' && (
                    <>
                        <h1 className='text-black font-bold text-2xl font-serif md:hidden px-4' id="phone-otp-title">Log in or create an account</h1>
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                            {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
                        </div>
                        <h1 className='text-black font-bold text-4xl font-serif hidden md:block pt-4'>Login / Signup</h1>
                        <h2 className='text-gray-500 md:text-black text-sm font-serif md:font-bold px-8 md:px-1'>Please enter your phone number to continue</h2>
                        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4 px-8 md:px-1 w-full">
                            <PhoneInput
                                country={'in'}
                                value={phoneNumber}
                                onChange={handleOnChange}
                                placeholder="Enter Phone Number"
                                containerClass="custom-phone-input-container"
                                inputClass="custom-phone-input"
                                buttonClass="custom-dropdown-button"
                                dropdownClass="custom-dropdown-container"
                                searchClass="custom-search-field"
                            />
                            <div className="flex flex-col gap-2 text-black" >
                                <label htmlFor="password">Password</label>
                                <input 
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="******"
                                    value={password}
                                    onChange={(e)=> setPassword(e.target.value)}
                                    className="text-black bg-white border border-gray-200 p-4 shadow-lg hover:shadow-xl rounded-md"
                                />
                            </div>
                            <div id='recaptcha-container' className='my-2' />
                            <div>
                                <Button type="submit" color={`${phoneNumber.length >= 10 ? 'warning' : 'light'}`} disabled={phoneNumber.length < 10 || loading}>
                                    {loading ? <Spinner color={"warning"} /> : 'Send verification code'}
                                </Button>
                            </div>
                        </form>
                        <div className='flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500 hover:underline px-8 md:px-2'>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>
                        <Link 
                            to={"/"}
                            className="text-gray-500 hover:text-black cursor-pointer underline flex items-center gap-1 px-8 md:px-2"
                        >
                            <IoHomeOutline /> 
                            <span>Home</span>
                        </Link>
                        <div className='flex items-center justify-center gap-2 mt-2 border-t border-t-gray-500 relative mx-6' >
                            <span className='absolute top-[-15px] px-4 bg-white text-black' >or</span>
                        </div>
                        <div className="flex gap-4 flex-col md:flex-row px-8 text-xs">
                            {/* Login with User Email Button */}
                            <button 
                                onClick={() => setShowComponent('signin')} 
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
                            >
                                <MdMarkEmailRead size={26} />
                                <span>Login with user email</span>
                            </button>

                            {/* Login with Admin Email Button */}
                            <button 
                                onClick={() => setShowComponent('signinSuperAdmin')} 
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-500 text-white rounded-md shadow-lg hover:bg-green-600 transition-colors duration-300 focus:outline-none"
                            >
                                <MdOutlineAdminPanelSettings size={30} />
                                <span>Login with admin email</span>
                            </button>
                        </div>
                    </>
                )}
                {showComponent === 'otpInput' && (
                    <>
                        <h2 className='text-2xl font-bold text-black px-4' >Enter OTP</h2>
                        <p className="text-lg text-black font-medium px-4">We have sent a temporary passcode to you at {phoneNumber}</p>
                        <div className="w-full px-10 max-w-md text-black">
                            <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
                        </div>
                        <p className='text-sm text-gray-500' >* Do not share this OTP with anyone as it is confidential.</p>
                    </>
                )}
                {showComponent === 'addTemple' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <SignupSuperAdmin setShowComponent={setShowComponent} />
                    </Suspense>
                )}
                {showComponent === 'createSuperAdmin' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <CreateSuperAdmin />
                    </Suspense>
                )}
                {showComponent === 'signin' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <SigninUser setShowComponent={setShowComponent} />
                    </Suspense>
                )}
                {showComponent === 'signinSuperAdmin' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <SigninSuperAdmin setShowComponent={setShowComponent} />
                    </Suspense>
                )}
            </div>
        </section>
    );
}
