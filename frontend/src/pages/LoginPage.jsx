import { useState } from "react";
import api from "../services/api";


const LoginPage = () => {
    const [formData, setFormData] = useState({email:"", password:""});
    const [loading, setLoading] = useState(false);

    const onChangeInput = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log()
        try{
            const response = await api.post("/auth/login", formData);
            alert("Login Succesful");
        }
        catch(error){
            alert("Login Failed");
            console.log(error.message)
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="font-xl text-black font-semibold mb-4">Login Page</h2>
            <div className="m-auto bg-white rounded-md shadow-lg flex justify-center p-4">
                <form onSubmit = {handleSubmit} className="flex flex-col gap-4">
                <input type="email" name="email" placeholder="Enter your email" className="md:w-70 rounded border p-3" value={formData.email} onChange={onChangeInput}/>
                <input type="password" name="password" placeholder="Enter your password" className="md:w-70 rounded border p-3" value={formData.password} onChange={onChangeInput}/>
                <button type="submit" className="bg-black mt-4 rounded border px-5 py-3 text-white md:w-70">Login</button>

            </form>
            </div>
        </div>
    )
}

export default LoginPage;