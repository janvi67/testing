import React, { useState, useEffect } from 'react';
import './Login.css';
import config from './config'; 
import { useHistory,useLocation } from 'react-router-dom';
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md"; 
import { CiLock } from "react-icons/ci";
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getEmail} from './actions';
//commit
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [id, setId] = useState();
    const dispatch = useDispatch();
    const location=useLocation();
    const navigate = useHistory();

useEffect(() => {
        const registeredEmail = localStorage.getItem('registeredEmail');
        if (registeredEmail) {
            setEmail(registeredEmail);
            localStorage.removeItem('registeredEmail'); // Remove the email after fetching it
        }
     }, []); // Empty dependency array means this effect runs only once when component mounts

     useEffect(() => {
        const fetchUserName = async () => {
                const response = await fetch(`${config.ApiUrl}User/GetUserName${email}`);
                if (response.ok) {
                    const userData = await response.json();
                    setId(userData.id);
                    //setBirthday(userData.birthday);
                } 
        };
        if(email)
        {
            fetchUserName();
        }
    }, [email]);

const handleUserChange = (e) => {
    setEmail(e.target.value);
};
    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => { 
        setShowPassword(!showPassword);
    };
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.ApiUrl}User/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {

                const data = await response.json();
                setPassword(data.password);
                dispatch(getEmail(email));
                localStorage.setItem('loggedInEmail', email);

                // Delay navigation to ensure toast message is visible
                setTimeout(() => {
                    navigate.push('/UpdateUserDetail'); 
                }, 1500); 
                
                toast.success("Login Successfully!")
                localStorage.setItem("loggedEmail",JSON.stringify({
                    email,
                    id
                  }));
        
            } else if (response.status === 401) {
                const errorMessage = await response.text();
                toast.error(errorMessage);
            } else {
                toast.error('Login failed. Please try again later.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed');
        }
    };

    const customToastStyle = {
        fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
        fontSize: '16px',
        fontWeight: 'bold',
      };

    return (
        <div className='containerl'>
            <form onSubmit={handleSubmit}>
                <h2>Login Form</h2>
                <input type='hidden' value={id}/>
                <div className='form-groupl'>
                    <label className='labell'>Email:</label>
                    <input
                        className='inputl'
                        type='email'
                        value={ email}
                        onChange={handleUserChange}
                        placeholder='Enter Your Email'
                        required
                    /> 
                </div>
                <MdEmail className='icone'/>
                <div className='form-groupl'>
                    <label className='labell'>Password:</label>
                    <div className='password-input'>
                    <input className='inputl' type={showPassword ? 'text' : 'password'} value={password}     autoComplete="current-password"
                            onChange={handlePasswordChange} placeholder='Enter Your Password'
                         pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~\@\!\#\$\%\^\&\*\?]).{8,15}$"
                         title="Must contain at least one  number and one uppercase and one lowercase letter and One special Charecter, and at least 8 characters"
                         required />
                        {showPassword ? <MdVisibility className='iconl' onClick={togglePasswordVisibility} /> : <MdVisibilityOff className='iconl' onClick={togglePasswordVisibility} />}
                    </div>
                    <CiLock className='iconll' />
                </div>
                <div className='forgotl'>
                     <input type='checkbox' /><span>Remember me</span> {/*checked={rememberMe} onChange={handleRememberMeChange}*/}
                    <a href='ForgotPassword' className='f'>Forgot Password?</a>
                </div>
                <div>
                    <button type='submit' className='button'> Login </button>
                </div>
                <div className='register-link'>
                <p className='p'>Don't have an account? <a href='Registration' className='f'>Register</a></p>
            </div>
            </form>
            <Toaster toastOptions={{style: customToastStyle,duration:1500,}} position="top-center" reverseOrder={false} />
        </div>
    );
};

export default Login;

//    //const [rememberMe, setRememberMe] = useState(false);

    // const handleRememberMeChange = () => {
    //     setRememberMe(!rememberMe);
    // };


//setEmail(data.email);
                
                // if (rememberMe) {
                //     // Store email and password in local storage
                //     localStorage.setItem('recentlyRegisteredEmail', data.email);
                //     localStorage.setItem('recentlyRegisteredPassword', data.password);
                // }
                

// useEffect(() => {
    //     const storedUser = localStorage.getItem('rememberedUser');
    //     const storedPassword = localStorage.getItem('loginPassword');
    //     if (storedUser && storedPassword) {
    //         setEmail(storedUser);
    //         setPassword(storedPassword);
    //         setRememberMe(true);
    //     }
    // }, []);
    //const [recentlyLoggedInEmail, setRecentlyLoggedInEmail] = useState('');
//const [recentlyLoggedInPassword, setRecentlyLoggedInPassword] = useState('');

// useEffect(() => {
//     const fetchRecentlyLoggedInUserData = async () => {
//         try {
//             //if (!email) return; // Check if email is defined
//             const response = await fetch(`${config.ApiUrl}User/RecentlyLoggedInUserData`);
//             if (response.ok) {
//                 const data = await response.json();
//                 setEmail(data.email);
//                 setPassword(data.password);
//             } else {
//                 throw new Error('Failed to fetch recently logged-in user data'); 
//             }
//         } catch (error) {
//             console.error('Error fetching recently logged-in user data:', error);
//             toast.error('Failed to fetch recently logged-in user data');
//         }
//     };
//     fetchRecentlyLoggedInUserData();
// }, []); // Add email as a dependency

 // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const storedPassword = localStorage.getItem('loginPassword');
    //     if (user === 'Admin@gmail.com' && password === storedPassword) {
    //         toast.success("Login Successfully!")
    //         if (rememberMe) {
    //             localStorage.setItem('rememberedUser', user);
    //             localStorage.setItem('rememberedPassword', password);
    //         } else {
    //             localStorage.removeItem('rememberedUser');
    //             localStorage.removeItem('rememberedPassword');
    //         }
            
    //     }
    //     else {
    //         toast.error("Invalid email or password!");
    //     }