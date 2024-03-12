import React, { useState, useEffect} from 'react';
import './UpdateUserdetail.css';
import config from '../Login/config';
import { useHistory } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '../Sidebar';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const UpdateUserdetail = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isValidPhone, setIsValidPhone] = useState(false);

    // const location = useLocation();
    // const email = location.state?.email || "";

    useEffect(() => {
      const registeredEmail = localStorage.getItem('loggedInEmail');
      if (registeredEmail) {
          setEmail(registeredEmail);
          //localStorage.removeItem('loggedInEmail'); // Remove the email after fetching it
      }
   }, []);
    const navigate = useHistory();


useEffect(() => {
    const fetchUserName = async () => {
            const response = await fetch(`${config.ApiUrl}User/GetUserName${email}`);
            if (response.ok) {
                const userData = await response.json();
                setName(userData.name);
                setBirthday(userData.birthday);
            } 
    };
    if(email){
      fetchUserName();
    }
}, [email]);


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      const updateUserData = {
        email: email, // Use the logged-in user's email
        name: name,
        gender: gender,
        BirthDate: birthday,
        mobileNumber: mobileNumber
      };
      const response = await fetch(`${config.ApiUrl}User/UpdateUser/${email}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateUserData)
      });

      if (response.ok) {

          setTimeout(() => {
            navigate.push('/Userdetail') 
          }, 1500);
          
          localStorage.setItem("userDetails",JSON.stringify({
            email,
            name,
            gender,
            birthday,
            mobileNumber
          }));
          
          setName(updateUserData.name);
          toast.success("User details updated successfully!");
      } else {
          toast.error('Failed to update user details');
      }
  } catch {
      toast.error('Failed to update user details');
  }
};

const handleNameChange =async (e) => {
  const newName = e.target.value;
  setName(newName); 
};
    
  const handlePhoneChange = (value) => {
    setMobileNumber(value);
    const phoneRegex = /^[+]?[0-9]{8,}$/;
    setIsValidPhone(phoneRegex.test(value));
  };
  
  const customToastStyle = {
    fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
    fontSize: '16px',
    fontWeight: 'bold',
  };
  
    return (
      <Sidebar>
        <div className='containera'>
             <h2>User Details</h2>
               <form onSubmit={handleSubmit}>
                   <div className='form-groupa'>
                   <label>Email:</label>
                   <p>{email}</p>
                     <label>Name:</label>
                     <input type='text' value={name} onChange={handleNameChange}/>
                     {/* Name: {userName} */}
                   </div>
                   <div className='form-groupa'>
                     <label>Gender:</label>
                     <div className="radio-groupa">
                       <input
                         type="radio"
                         value="male"
                     checked={gender === "male"}
                         onChange={() => setGender("male")}
                         required
                       />
                       <label>Male</label>
                       <input
                         type="radio"
                         value="female"
                         checked={gender === "female"}
                         onChange={() => setGender("female")}
                         required
                       />
                       <label>Female</label>
                     </div>
                   </div>
               <div className="form-groupa">
                     <label>Date of Birth:</label>
                     <input
                       type="date"
                       value={birthday}
                       max={moment().format("YYYY-MM-DD")}
                       onChange={(e) => setBirthday(e.target.value)}
                   required
                     />
                   </div>
                 <div className='form-groupa'>
                   <label>Mobile Number:</label>
                   <div className='phone_number'>
                   <PhoneInput
                       country={'in'}
                       value={mobileNumber}
                       onChange={handlePhoneChange}
                       enableSearch={true}
                       isValid={isValidPhone}
                       inputStyle={{backgroundColor: 'white', borderColor: 'white' }}
                       containerStyle={{padding:'1px'}}
                    />
                     </div>
                   </div>
                   <div>
                     <button type="submit" className='save'> Save </button>
                   </div>
               </form>
               <Toaster toastOptions={{style: customToastStyle,duration:1500,}} position="top-center" reverseOrder={false} />
             </div>
           </Sidebar>   );
};

export default UpdateUserdetail;
