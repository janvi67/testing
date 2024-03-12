import React,{useState} from 'react'
import { MdEmail } from "react-icons/md";
import {FaRegUserCircle, FaEye,FaEyeSlash} from "react-icons/fa";
import {  useHistory } from 'react-router-dom';
import config from './config'
import {toast,Toaster} from 'react-hot-toast';
import moment from 'moment';
import './Login.css';

function Registration(props) {
    
    const [error] = useState('');
    const [name, setName ] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isVisible, setVisible] = useState(false);
    const [isDisable, setDisable] = useState(false);

    const toggle = () => {
        setVisible(!isVisible);
      };
    const toggleBtn = () => { 
        setDisable(!isDisable);
      };
  
    const navigate=useHistory();
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !birthday || !password || !confirmPassword) {
        toast.error('All fields are required!');
        return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address!');
        return;
    }
    if (password !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
    }
    try {
        const addUserDto = {
            Name: name,
            Email: email,
            BirthDate: birthday,
            Password: password
        };

        const response = await fetch(`${config.ApiUrl}User/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addUserDto)
        });
        const result = await response.text();
        console.log(result);
        if (result === "User Created.") 
        {            
            // Redirect to login page with email and password state
            //navigate.push('/', { email });
            setTimeout(() => {
                navigate.push('/') 
              }, 1500);
              toast.success("Registration Successfull!")
            localStorage.setItem('registeredEmail', email);
        } 
        else if (result === "User Already Registered!") {
            toast.error('User with this email already exists!');
        } 
        else 
        {
            toast.error('Signup failed. Please try again later.');
        }

    } catch {
        toast.error('Signup failed. Please try again later.');
    }
};

const customToastStyle = {
    fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
    fontSize: '16px',
    fontWeight: 'bold',
  };

  return (
    <>
        <div className='containerr'>
            <form onSubmit={handleSubmit}>
                <h2 className='signup'>Sign Up</h2>
                <div className='form-groupl'>
                    <label className='labell'>Name:</label>
                    <input className='inputl' type='text' value={name} onChange={(e)=> setName(e.target.value)} placeholder='Name'
                    name='name'  required />
                    <FaRegUserCircle className='iconle' />
                </div>
                <div className='form-groupl'>
                    <label className='labell'>Email:</label>
                    <input className='inputl' type='email' value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Email'
                    name='email'  required />
                    <MdEmail className='iconle' />
                </div>
                <div className='form-groupl'>
                    <label className='labell'>Birthdate:</label>
                    <input className='inputl' type='date' value={birthday} max={moment().format("YYYY-MM-DD")} onChange={(e) => setBirthday(e.target.value)} required />
                </div>
                <div className='form-groupl'>
                <label className='labell'>Password:</label>
                    <input className='inputl' type={!isVisible ? "password" : "text"}
                        name='password' placeholder='Password' 
                        value={password} onChange={(e)=> setPassword(e.target.value)}
                        pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~\@\!\#\$\%\^\&\*\?]).{8,15}$"
                        title="Must contain at least one  number and one uppercase and one lowercase letter and One special Charecter, and at least 8 characters"
                        autoComplete='current-password'
                        required/>
                        <span className='iconle' onClick={toggle}>
                        {isVisible  ? <FaEye /> : <FaEyeSlash /> }</span>
                </div><p className='pass'>{error}</p>
                <div className='form-groupl'>
                    <label className='labell'>Confirm Password:</label>
                    <input className='inputl' type={!isDisable ? "password" : "text"}
                     name='password' placeholder='Confirm-Password'
                     autoComplete='Confirm-Password'
                        //pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~\@\!\#\$\%\^\&\*\?]).{8,15}$"
                        //title="Must contain at least one  number and one uppercase and one lowercase letter and One special Charecter, and at least 8 characters"
                     value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required/>
                     <span className='iconle' onClick={toggleBtn}>
                        {isDisable  ? <FaEye /> : <FaEyeSlash /> }</span>
                 </div><p className='pass'>{error}</p>
                <button className='button' type='submit'>Sign Up</button>
             </form>
        </div>
        <Toaster toastOptions={{style: customToastStyle,duration:1500,}} position="top-center" reverseOrder={false} />
        </>
  )
}


export default Registration;