import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({docId,speciality}) => {
  const [relatedDoc, setRelatedDoc] = useState([]);
  const {doctors} = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(()=>{
    if (doctors.length && speciality) {
        const doctorsData = doctors.filter(doc => doc.speciality === speciality && docId != doc._id);
        setRelatedDoc(doctorsData);
        console.log(relatedDoc);
    }
  },[doctors,speciality,docId])
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
            {relatedDoc.slice(0,5).map((item, index)=> (
                    <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" key={index}>
                        <img className='bg-blue-50' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${ item.available ? 'text-green-500' : 'text-gray-500'} `}>
                                {
                                    item.available
                                    ? 
                                    ( 
                                        <>
                                            <span className='relative w-2 h-2 rounded-full bg-emerald-400'> 
                                                <span className='absolute rounded-full inset-0 animate-ping bg-emerald-400'></span>
                                            </span>
                                            <p>Available</p>
                                        </>
                                    )
                                    :
                                    (
                                        <>  
                                            <span className='w-2 h-2 rounded-full bg-gray-500'></span>
                                            <p className='text-gray-500'>Not Available</p>
                                        </>
                                    )
                                }
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default RelatedDoctors
