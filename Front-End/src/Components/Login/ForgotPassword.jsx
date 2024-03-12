import React, { useState , useEffect} from 'react';
//import './ForgotPassword.css';
import './Login.css';
import { useHistory } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { CiLock } from "react-icons/ci";
import moment from 'moment';
import config from './config';
import {MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const navigate = useHistory();

    // useEffect(() => {
    //     const registeredEmail = localStorage.getItem('loggedInEmail');
    //     if (registeredEmail) {
    //         setEmail(registeredEmail);
    //         localStorage.removeItem('loggedInEmail'); // Remove the email after fetching it
    //     }
    //  }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !birthday || !newPassword || !confirmPassword) {
            toast.error('All fields are required!');
            return;
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address!');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${config.ApiUrl}User/ChangePassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    birthDate: birthday,
                    password: newPassword
                }),
            });
            const result = await response.text();
            console.log(result);
            if (result === "Password updated successfully") 
            {      
                toast.success("Changed  Password Successfully!");     
                setTimeout(() => {
                    navigate.push('/') 
                  }, 1500); 
                localStorage.setItem('registeredEmail', email);
                //Redirect to login page with email and password state
                //navigate.push('/', { email, newPassword });
            } 
            else if (result === "Email or BirthDate not Exist") {
                toast.error('Email or Birthday Not Found!');
            } 
            else 
            {
                toast.error('Failed to update password!');
            }
    
        } catch {
            toast.error('Failed to update password!');
        }
    };

    const toggleNewPasswordVisibility = () => { 
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => { 
        setShowConfirmPassword(!showConfirmPassword);
    };

    const customToastStyle = {
        fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
        fontSize: '16px',
        fontWeight: 'bold',
      };

    return (
        <div className='containerr'>
            <form onSubmit={handleSubmit}>
                <h2 className='signup'>Reset Password</h2>
                <div className='form-groupl'>
                    <label className='labell'>Email:</label>
                    <input
                        className='inputl'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter Your Email'
                        required
                    /> 
                </div>
                <MdEmail className='icone'/>
                <div className='form-groupl'>
                    <label className='labell'>Birthdate:</label>
                    <input className='inputl' type='date' value={birthday} max={moment().format("YYYY-MM-DD")} onChange={(e) => setBirthday(e.target.value)} required />
                </div>
                <div className='form-groupl'>
                    <label className='labell'>New Password:</label>
                    <div className='password-input'>
                        <input 
                            className='inputl' 
                            type={showNewPassword ? 'text' : 'password'} 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~\@\!\#\$\%\^\&\*\?]).{8,15}$"
                            title="Must contain at least one  number and one uppercase and one lowercase letter and One special Charecter, and at least 8 characters"
                            placeholder='Enter New Password' 
                            required 
                        />
                        {showNewPassword ? <MdVisibility className='iconl' onClick={toggleNewPasswordVisibility} /> : <MdVisibilityOff className='iconl' onClick={toggleNewPasswordVisibility} />}
                    </div>
                    <CiLock className='iconll' />
                </div>
                <div className='form-groupl'>
                    <label className='labell'>Confirm Password:</label>
                    <div className='password-input'>
                        <input 
                            className='inputl' 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~\@\!\#\$\%\^\&\*\?]).{8,15}$"
                            title="Must contain at least one  number and one uppercase and one lowercase letter and One special Charecter, and at least 8 characters" 
                            placeholder ='Confirm New Password' 
                            required 
                        />
                        {showConfirmPassword ? <MdVisibility className='iconle' onClick={toggleConfirmPasswordVisibility} /> : <MdVisibilityOff className='iconl' onClick={toggleConfirmPasswordVisibility} />}
                    </div>
                    <CiLock className='iconll' />
                </div>
                <div>
                    <button type='submit' className='buttonf'>Reset Password</button>
                </div>
            </form>
            <Toaster toastOptions={{style: customToastStyle,duration:1500,}} position="top-center" reverseOrder={false} />
        </div>
    );
};

export default ForgotPassword;
