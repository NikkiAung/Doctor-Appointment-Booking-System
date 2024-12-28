import { assets } from "../../assets/assets_admin/assets"


const AddDoctor = () => {
  return (
    <form className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[60vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img className="w-16 bg-gray-100 cursor-pointer rounded-full" src={assets.upload_area} alt="" />
          </label>
          <input type="file" id="doc-img" hidden/>
          <p>Upload doctor<br/>picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor name</p>
              <input className="px-3 py-2 border rounded" type="text" placeholder="name" required/>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input className="px-3 py-2 border rounded" type="text" placeholder="your email" required/>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input className="px-3 py-2 border rounded" type="number" placeholder="Password" required/>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select className="px-3 py-2 border rounded" name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Years</option>
                <option value="3 Year">3 Years</option>
                <option value="4 Year">4 Years</option>
                <option value="5 Year">5 Years</option>
                <option value="6 Year">6 Years</option>
                <option value="7 Year">7 Years</option>
                <option value="8 Year">8 Years</option>
                <option value="9 Year">9 Years</option>
                <option value="10 Year">10 Years</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input className="px-3 py-2 border rounded" type="number" placeholder="fees" required/>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <p>Speciality</p>
              <select className="px-3 py-2 border rounded" name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <p>Education</p>
              <input className="px-3 py-2 border rounded" type="text" placeholder="Education" required/>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <p>Address</p>
              <input className="px-3 py-2 border rounded" type="text" placeholder="Address 1" required/>
              <input className="px-3 py-2 border rounded" type="text" placeholder="Address 2" required/>
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea className="w-full px-3 py-2 border rounded" type="text" placeholder="write about doctor" rows={5} required/>
        </div>
        
        <button className="bg-primary px-10 py-3 mt-4 text-white rounded-full">Add doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor
