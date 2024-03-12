import React,{useState, useEffect} from 'react';
import './Userdetail.css';
import Sidebar from '../Sidebar';

const Userdetail = () => {

    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
        setUserDetails(storedUserDetails);
      }, []); 
     
  return (
    <Sidebar>
        <div className='containeru'>
        <h2>User Details</h2>
            <form>
                <div className='form-groupu'>
                {userDetails && (
                    <>
                        <label>Email:</label>
                        <p>{userDetails.email}</p>
                        <label>Name:</label>
                        <p>{userDetails.name}</p>
                        <label>Gender:</label>
                        <p>{userDetails.gender}</p>
                        <label>Date of Birth:</label>
                        <p>{userDetails.birthday.split("-").reverse().join("-")}</p>
                        <label>Mobile Number:</label>
                        <p>{userDetails.mobileNumber}</p> 
                    </>
                )}
              </div>
            </form>
        </div>
    </Sidebar>
  )
}

export default Userdetail


  
