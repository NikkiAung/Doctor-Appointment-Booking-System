


//API for adding doctor
const addDoctor = async (req,res) => {
    try {
        const {name,email,password,speciality,degree,experience,about,available,fees,address,date,slots_booked} = req.body
        const imageFile = req.file

        console.log({name,email,password,speciality,degree,experience,about,available,fees,address,date,slots_booked},imageFile);
        
    } catch (error) {
        
    }
}

export {addDoctor}