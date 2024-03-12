import React,{useState,useEffect} from 'react';
import './Familydetail.css';
import moment from 'moment';
import { BiMale ,BiFemale} from "react-icons/bi";
import { SlCalender } from "react-icons/sl";
import Sidebar from '../Sidebar';
import config from '../Login/config';
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'; 

const Familydetail = () => {

  //const [email, setEmail] = useState('');
  //const [userId,setUserId]=useState('');
  const [userData, setUserData] = useState({id:'',email:''});
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    relation: '',
  });

  const [familyMembers, setFamilyMembers] = useState([]);
  const [genderError, setGenderError] = useState('');
  const [relationError, setRelationError] = useState('');

  const relations=[ "Father", "Mother", "Brother", "Sister", "GrandMother", "GrandFather", "Uncle", "Aunty", "Cousin" ];

//   useEffect(() => {
//     const registeredEmail = localStorage.getItem('loggedInEmail');
//     if (registeredEmail) {
//         setUserData({email:userData.email});
//     }
//  }, []);

 useEffect(() => {
  const storedUserDetails = JSON.parse(localStorage.getItem('loggedEmail'));
  if(storedUserDetails){
    setUserData({id:storedUserDetails.id,email:storedUserDetails.email});
  }
}, []); 

  useEffect(() => {
      const fetchFamilyMembers = async () => {
          try {
              const response = await fetch(`${config.ApiUrl}FamilyMember/GetByEmail?email=${userData.email}`);
              if (!response.ok) {
                  console.log('Failed to fetch family members');
              }
              const data = await response.json();
              console.log(data);
              //setUserData(data[0]?.userId); //Assuming the userId is available in first data
              setFamilyMembers(data);
          } catch (error) {
              console.error('Error fetching family members:', error);
          }
      };
      if(userData.email){
        fetchFamilyMembers();
      }
  }, [userData.email]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gender) {
      setGenderError('Please select a gender');
      return;
    }
    if (!formData.relation) {
      setRelationError('Please select a Relation');
      return;
    }
    try {
      const familyMember = {
        Id:formData.id,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Gender: formData.gender,
        BirthDate: formData.birthDate,
        Relation: formData.relation,
        UserId: userData.id
      };
      
      let response;
      if (editing) {
        familyMember.Id = formData.id; // Add member id for editing
        response = await fetch(`${config.ApiUrl}FamilyMember/UpdateFamilyMember`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Id:formData.id,
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Gender: formData.gender,
            BirthDate: formData.birthDate,
            Relation: formData.relation,
            //UserId: userData.id
          })
        });
      } else {
        //familyMember.UserId = userData.id;
        response = await fetch(`${config.ApiUrl}FamilyMember/AddFamilyMember/${userData.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            //Id:formData.id,
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Gender: formData.gender,
            BirthDate: formData.birthDate,
            Relation: formData.relation,
            UserId: userData.id
          })
        });
      }
  
      if (response.ok) {
        const result = await response.json();
        if (editing) {
          const updatedFamilyMembers = familyMembers.map(member => 
            member.id === result.id ? result : member
          );
          setFamilyMembers(updatedFamilyMembers); // Update the state with the edited member
          toast.success("Edited Successfully!");
          setEditing(false); // Exit editing mode
        } else if(familyMembers.length <= 5){
          setFamilyMembers([...familyMembers, result]); // Fetch updated data after adding
          toast.success("Added Successfully!");
        }
        else{
          toast.error("Sorry,the maximun number of members has been reached.");
        }
        setFormData({ // Reset form fields
          id: '',
          firstName: '',
          lastName: '',
          gender: '',
          birthDate: '',
          relation: '',
        });
      } else {
        toast.error(editing ? "Editing Failed!" : "Adding Failed!");
      }
  
    } catch (error) {
      toast.error(error.message || (editing ? 'Failed to edit family member' : 'Failed to add family member'));
    }
  }

const handleEdit = async (user) => {
  setFormData(user);
  setEditing(true);
};

const handleDelete = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this user!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#29c2a6',
    cancelButtonColor: '#ee8686',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result)=> {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${config.ApiUrl}FamilyMember/DeleteFamilyMember/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          toast.success('User deleted successfully');
          setFamilyMembers(familyMembers.filter(user => user.id !== id));
        } 
        else {
          toast.error('Failed to delete userrrr');
        }
      } catch  {
        
        toast.error('Failed to delete user');
      }
    }
  })
};

const customToastStyle = {
  fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
  fontSize: '16px',
  fontWeight: 'bold',
};

  return (
    <Sidebar>
      <div className='main'>
        <div className='containerf'>
          <form onSubmit={handleSubmit}>
            <h2>Family Details</h2>
            <input type='hidden' value={formData.id} readOnly/>
            <input type='hidden' value={userData.email} readOnly/>
            <input type='hidden' value={userData.id} readOnly/>
            <div className='form-groupf'>
              <label>First Name:</label>
              <input
                type="text"
                value={formData.firstName}
                placeholder='First Name'
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className='form-groupf'>
              <label>Last Name:</label>
              <input
                type='text'
                value={formData.lastName}
                placeholder='Last Name'
                onChange={(e)=>setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className='form-groupf'>
              <label>Gender:</label>
              <div className="radio-groupf">
                <input
                  type="radio"
                  value="male"
                  checked={formData.gender === "male" }
                  onChange={(e) => {
                    setFormData({...formData, gender: e.target.value});
                    setGenderError('');
                  }}
                  required
                />
                <label>Male</label>
                <input
                  type="radio"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={(e) => {
                    setFormData({...formData, gender: e.target.value});
                    setGenderError('');
                  }}
                  required
                />
                <label>Female</label>
              </div>
              {genderError && <p style={{color: 'red'}}>{ }</p>}
            </div>
            <div className="form-groupf">
              <label>Date of Birth:</label>
              <input
                type="date"
                value={formData.birthDate}
                max={moment().format("YYYY-MM-DD")}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
              />
            </div>
            <div className="form-groupf">
              <label>Relation:</label>
              <select
                value={formData.relation}
                className='relation'
                required
                onChange={(e) => {
                  setFormData({ ...formData, relation: e.target.value });
                  setRelationError('');
                }}
              >
                <option value="">Select Relation</option>
                {relations.map((relation) => (
                  <option key={relation} value={relation}>
                    {relation}
                  </option>
                ))}
              </select>
              {relationError && <p style={{ color: 'red'}}>{relationError}</p>}
            </div>
            <button type="submit" onClick={handleSubmit}>{formData.id? 'Save Change':'Add Family Member'}</button>
          </form>
        </div>
      </div>
      <div className='disp'>
        {familyMembers.map((user) => {
                console.log(familyMembers.length);
                return(
                  <div className= {editing && user.id === formData.id ?'display editing':'display'} key={user.id}>
                     <h2>{user.relation}</h2>
                    <div className="icon_f_m">
                              {user.gender === 'male' ? (
                                <BiMale  size='20px'/>
                              ) : (
                                <BiFemale size='20px' />
                              )}
                              <span>{user.firstName} {user.lastName}</span>
                            </div>
                            <div className="dob">
                            <SlCalender />
                                <span> {user.birthDate.split("-").reverse().join("-")} </span>
                              </div>
                     <button  onClick={() =>handleEdit(user)}>Edit</button>
                    <button onClick={() =>handleDelete(user.id)}>Delete</button>
                  </div>
                );
        })}
      </div>
      <Toaster toastOptions={{style: customToastStyle,duration:1500,}} position="top-center" reverseOrder={false} />
    </Sidebar>
  );
};

export default Familydetail;

/*FamilyDetail.jsx with Redux*/ 
/*// import React,{useState,useEffect} from 'react';
// import './Familydetail.css';
// import moment from 'moment';
// import { useHistory } from 'react-router-dom';
// import { BiMale ,BiFemale} from "react-icons/bi";
// import { SlCalender } from "react-icons/sl";
// import { useDispatch, useSelector } from 'react-redux';
// import { addUser, editUser, deleteUser } from './Users';
// import Sidebar from '../Sidebar';
// import config from '../Login/config';
// import { toast, Toaster } from 'react-hot-toast';
// import Swal from 'sweetalert2';

// const Familydetail = () => {
//     const [email, setEmail] = useState("");
//     const [editing, setEditing] = useState(false);
//     const [formData, setFormData] = useState({
//         id: '',
//         firstName: '',
//         lastName: '',
//         gender: '',
//         birthday: '',
//         relation: '',
//         userId: '' // Added userId field
//     });

//     const [genderError, setGenderError] = useState('');
//     const [relationError, setRelationError] = useState('');
//     const [familyMembers, setFamilyMembers] = useState([]);
//     const relations=[ "Father", "Mother", "Brother", "Sister", "GrandMother", "GrandFather", "Uncle", "Aunty", "Cousin" ];
//     const history = useHistory();

//     const dispatch = useDispatch();
//     const users = useSelector(state => state.users.value);

//     useEffect(() => {
//         const registeredEmail = localStorage.getItem('loggedInEmail');
//         if (registeredEmail) {
//             setEmail(registeredEmail);
//         }
//     }, []);
//     useEffect (()=>{

//     })
//     const fetchFamilyMembers = async (userId) => {
//         try {
//             const response = await fetch(`${config.ApiUrl}FamilyMember/GetByUserEmail?email=${userId}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch family members');
//             }
//             const data = await response.json();
//             setFamilyMembers(data);
//         } catch (error) {
//             console.error('Error fetching family members:', error);
//             toast.error('Failed to fetch family members');
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.gender) {
//             setGenderError('Please select a gender');
//             return;
//         }
//         if (!formData.relation) {
//             setRelationError('Please select a Relation');
//             return;
//         }

//         try {
//             const response = await fetch(`${config.ApiUrl}FamilyMember/Add`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     ...formData,
//                     birthday: moment(formData.birthday, 'DD-MM-YYYY').format('YYYY-MM-DD')
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to add family member');
//             }

//             toast.success("Added Successfully!");
//             resetFormData();
//             fetchFamilyMembers(email);
//         } catch (error) {
//             console.error('Error adding family member:', error);
//             toast.error('Failed to add family member');
//         }
//     };

//     const handleEdit = async (user) => {
//         setFormData(user);
//         setEditing(true);
//     };

//     const handleDelete = async (id) => {
//         Swal.fire({
//             title: 'Are You Sure?',
//             text: 'You want to delete this record!',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'No, cancel!',
//             confirmButtonColor: '#29c2a6',
//             cancelButtonColor: '#ee8686',
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const response = await fetch(`${config.ApiUrl}FamilyMember/DeleteFamilyMember/${id}`, {
//                         method: 'DELETE'
//                     });

//                     if (!response.ok) {
//                         throw new Error('Failed to delete family member');
//                     }

//                     toast.success("Deleted Successfully!");
//                     fetchFamilyMembers(email);
//                 } catch (error) {
//                     console.error('Error deleting family member:', error);
//                     toast.error('Failed to delete family member');
//                 }
//             }
//         });
//     };

//     const resetFormData = () => {
//         setFormData({
//             id: null,
//             firstName: '',
//             lastName: '',
//             gender: '',
//             birthday: '',
//             relation: '',
//             userId: '' // Reset userId field
//         });
//     };
// const customToastStyle = {
//   fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",
//   fontSize: '16px',
//   fontWeight: 'bold',
// };

//   return (
//     <Sidebar>
//       <div className='main'>
//         <div className='containerf'>
//           <form onSubmit={handleSubmit}>
//             <h2>Family Details</h2>
//             <input type='hidden' value={email}/>
//             <div className='form-groupf'>
//               <label>First Name:</label>
//               <input
//                 type="text"
//                 value={formData.firstName}
//                 placeholder='First Name'
//                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                 required
//               />
//             </div>
//             <div className='form-groupf'>
//               <label>Last Name:</label>
//               <input
//                 type='text'
//                 value={formData.lastName}
//                 placeholder='Last Name'
//                 onChange={(e)=>setFormData({ ...formData, lastName: e.target.value })}
//                 required
//               />
//             </div>
//             <div className='form-groupf'>
//               <label>Gender:</label>
//               <div className="radio-groupf">
//                 <input
//                   type="radio"
//                   value="male"
//                   checked={formData.gender === "male" }
//                   onChange={(e) => {
//                     setFormData({...formData, gender: e.target.value});
//                     setGenderError('');
//                   }}
//                   required
//                 />
//                 <label>Male</label>
//                 <input
//                   type="radio"
//                   value="female"
//                   checked={formData.gender === "female"}
//                   onChange={(e) => {
//                     setFormData({...formData, gender: e.target.value});
//                     setGenderError('');
//                   }}
//                   required
//                 />
//                 <label>Female</label>
//               </div>
//               {genderError && <p style={{color: 'red'}}>{ }</p>}
//             </div>
//             <div className="form-groupf">
//               <label>Date of Birth:</label>
//               <input
//                 type="date"
//                 value={formData.birthday}
//                 max={moment().format("YYYY-MM-DD")}
//                 onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="form-groupf">
//               <label>Relation:</label>
//               <select
//                 value={formData.relation}
//                 className='relation'
//                 required
//                 onChange={(e) => {
//                   setFormData({ ...formData, relation: e.target.value });
//                   setRelationError('');
//                 }}
//               >
//                 <option value="">Select Relation</option>
//                 {relations.map((relation) => (
//                   <option key={relation} value={relation}>
//                     {relation}
//                   </option>
//                 ))}
//               </select>
//               {relationError && <p style={{ color: 'red'}}>{relationError}</p>}
//             </div>
//             <button type="submit" onClick={handleSubmit}>{formData.id? 'Save Change':'Add Family Member'}</button>
//           </form>
//         </div>
//       </div>
//       <div className='disp'>
//         {users.map((user) => {
//                 console.log(users.length);
//                 return(
//                   <div className= {editing && user.id === formData.id ?'display editing':'display'} key={user.id}>
//                      <h2>{user.relation}</h2>
//                     <div className="icon_f_m">
//                               {user.gender === 'male' ? (
//                                 <BiMale  size='20px'/>
//                               ) : (
//                                 <BiFemale size='20px' />
//                               )}
//                               <span>{user.firstName} {user.lastName}</span>
//                             </div>
//                             <div className="dob">
//                             <SlCalender />
//                                 <span>  {moment(user.birthday,'YYYY-MM-DD').format('DD-MM-YYYY')}</span>
//                               </div>
//                      <button  onClick={() =>handleEdit(user)}>Edit</button>
//                     <button onClick={() =>handleDelete(user.id)}>Delete</button>
//                   </div>
//                 );
//         })}
//       </div>
//       <Toaster toastOptions={{style: customToastStyle,duration:1500,}} position="top-center" reverseOrder={false} />
//     </Sidebar>
//   );
// };

// export default Familydetail;
 */