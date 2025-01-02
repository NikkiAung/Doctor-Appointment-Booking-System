import validator from "validator"
import userModel from '../models/userModel.js'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const registerUser = async (req,res) => {
    const {name, email, password} = req.body
    try {  
        //validating all detail info
        if (!name || !email || !password) {
            return res.json({success:false,message:"Detail Missing!"})
        }
        //validating email
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email!"})
        }
        //validating password
        if(password.length < 8) {
            return res.json({success:false,message:"Enter a stronng password!"})
        }
        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password,salt)
        const userData = {
            name,
            email,
            password : hashpassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})
        if(!user) {
            return res.json({success:false,message:'User does not exist'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:'Invalid Credentials!'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getProfile = async (req,res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true,userData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const updateProfile = async (req,res) => {
    try {
        const {userId,name,address,gender,dob,phone} = req.body
        const imageFile = req.file 
        if (!name || !gender || !dob || !phone) {
            return res.json({success:false,message:"User Info Missing!"})
        }
        await userModel.findByIdAndUpdate(userId,{name,address:JSON.parse(address),gender,dob,phone})
        if(imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
            const imageUrl = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }
        res.json({success:true,message:"User Profile Upadated!"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const bookAppointment = async (req,res) => {
    try {  
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        let slots_booked = docData.slots_booked;

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        } 
        
        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({success:true,message:'Appointment Booked'});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const listAppointment = async (req,res) => {
    try {
        const {userId} = req.body
        // console.log(userId)
        const appointments = await appointmentModel.find({userId})
        // console.log(appointments)
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const cancelAppointment = async (req,res) => {
    try {
        const {userId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData.userId != userId) {
            return res.json({success:false,message:"Unaurthorized Action!"})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        const {docId,slotDate,slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment Cancelled!"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const paymentStripe = async (req,res) => {
    const {appointmentId,doctorId,userId} = req.body
    // console.log('appointmentId ' + appointmentId)
    // console.log('doctorId ' + doctorId)
    // console.log('userId ' + userId)
    const appointmentData = await appointmentModel.findById(appointmentId)
    if(!appointmentData || appointmentData.cancelled) {
        return res.json({success:false,message:"Appointment Cancelled or not found!"})
    }
    try {  
        // get currently booked doctor
        const doctor = await doctorModel.findById(doctorId).select('-password');
        const user = await userModel.findById(userId).select('-password');

        // create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_SITE_URL}/checkout-success?sessionId={CHECKOUT_SESSION_ID}`, // Add session.id dynamically to the success_url
            cancel_url: `${process.env.CLIENT_SITE_URL}/my-appointments`,
            customer_email: user.email,
            client_reference_id: appointmentId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: doctor.fees * 100,
                        product_data: {
                            name: doctor.name,
                            description: doctor.about,
                            images:[doctor.image]
                        }
                    },
                    quantity:1
                }
            ]
        }); 

        res.json({ success: true, session });

    } catch(error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyingPaymentStatus = async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.json({
            status: session.status,
            payment_status: session.payment_status,
            client_reference_id: session.client_reference_id, // Appointment ID
            customer_email: session.customer_details.email,
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Error verifying payment", error });
    }
};


const updatingDBPayment = async (req,res) => {
    console.log('updatingDBPayment backend');
    const {appointmentId} = req.body
    if (!appointmentId) {
        return res.json({ success: false, message: "Appointment ID is missing" });
    }
    
    try {
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
          appointmentId,
          { payment: true },
        );
    
        if (!updatedAppointment) {
          return res.json({ success: false, message: "Appointment not found" });
        }
    
        res.json({ success: true, message: "Payment status updated successfully" });

    } catch (error) {
        console.error("Error updating payment:", error);
        res.json({ success: false, message: error.message });
    }
}

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentStripe,verifyingPaymentStatus,updatingDBPayment}