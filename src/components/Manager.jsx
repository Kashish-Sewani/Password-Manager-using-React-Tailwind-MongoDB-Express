// import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';



const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)

    }


    useEffect(() => {
        getPasswords()

    }, [])


    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: "Bounce",
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        if (passwordRef.current.type === "password") {
            passwordRef.current.type = "text";
            ref.current.src = "icons/eyecross.png";
        } else {
            passwordRef.current.type = "password";
            ref.current.src = "icons/eye.png";
        }
    };


    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            // If any such id exists in the db, delete it 
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

            // Otherwise clear the form and show toast
            setform({ site: "", username: "", password: "" })
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            toast('Error: Password not saved!');
        }

    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }


    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true, 
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

    }



    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />

            <div style={{ width: 'max-content' }} className="relative  md:max-w-4xl mx-auto my-12 p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-blue-700 font-extrabold text-5xl text-center">PassSecure</h1>
                <p className="text-blue-600 text-xl text-center mt-4">Easily manage your passwords</p>

                <div className="flex flex-col mt-8 space-y-4">
                    <input type="text" name="site" placeholder="Enter website URL" value={form.site} onChange={handleChange}
                        className="p-3 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="flex space-x-4">
                        <input type="text" name="username" placeholder="Enter Username" value={form.username} onChange={handleChange}
                            className="p-3 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
                        />
                        <div className="relative">
                            <input type="password" ref={passwordRef} name="password" placeholder="Enter Password" value={form.password} onChange={handleChange}
                                className="p-3 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
                            />
                            <span className="absolute right-3 top-3 cursor-pointer" onClick={showPassword}>
                                <img ref={ref} width={25} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className="flex justify-center items-center bg-blue-500 text-white font-semibold rounded-xl px-3 py-2 w-fit gap-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-200 mx-auto">
                        <lord-icon
                            className="w-6 h-6 mr-2"
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save Password
                    </button>

                </div>
                <div className="passwords mt-10">
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-6">Your Passwords</h2>
                    {passwordArray.length === 0 && <div className="text-center">No passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                        <thead>
                            <tr className="bg-blue-100 text-blue-700">
                                <th className="px-4 py-2 border-b border-blue-200">Site</th>
                                <th className="px-4 py-2 border-b border-blue-200">Username</th>
                                <th className="px-4 py-2 border-b border-blue-200">Password</th>
                                <th className="px-4 py-2 border-b border-blue-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passwordArray.map((password, index) => (
                                <tr key={index} className="text-center">
                                    <td className="flex items-center justify-center px-4 py-2 border-b border-blue-200"><a href={password.site} target="_blank">{password.site} </a>
                                        <div className=" lordiconcopy cursor-pointer" onClick={() => copyText(password.site)}>
                                            <lord-icon
                                                style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                                trigger="hover" >
                                            </lord-icon>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border-b border-blue-200">
                                        <div className="flex items-center justify-center">
                                            <span className="mr-2">{password.username}</span>
                                            <div className=" lordiconcopy cursor-pointer" onClick={() => copyText(password.username)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border-b border-blue-200">
                                        <div className="flex items-center justify-center">
                                            <span className="mr-2">{"*".repeat(password.password.length)}</span>
                                            <div className=" lordiconcopy cursor-pointer" onClick={() => copyText(password.password)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border-b border-blue-200">
                                        <span className='cursor-pointer' onClick={() => { editPassword(password.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className='cursor-pointer' onClick={() => { deletePassword(password.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    );
};

export default Manager;
