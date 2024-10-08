import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Textarea, Spinner } from "flowbite-react";
import { HiUpload } from "react-icons/hi";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import { app } from "../firebase";
import { Helmet } from "react-helmet-async";
import "react-circular-progressbar/dist/styles.css";
import Alert from "./Alert";

export default function AdditionalTempleInfo({ temple }) {
    const [templeData, setTempleData] = useState({
        foundedYear: 0,
        description: '',
        godsAndGoddesses: [],
    });

    const [currentGod, setCurrentGod] = useState({
        name: '',
        image: ''
    });

    const [imageUploaded, setImageUploaded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (temple) {
            setTempleData({
                foundedYear: temple.foundedYear || 0,
                description: temple.description || '',
                godsAndGoddesses: temple.godsAndGoddesses || [],
            });
        }
    }, [temple]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setTempleData({
            ...templeData,
            [id]: value,
        });
    };

    const handleGodChange = async (e) => {
        const { name, value } = e.target;
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const storage = getStorage(app);
            const fileName = `godImages/${new Date().getTime()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            setUploading(true);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                }, 
                (error) => {
                    console.error("Upload failed:", error);
                    setUploading(false);
                    setError(error.message);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setCurrentGod({
                            ...currentGod,
                            [name]: downloadURL,
                        });
                        setImageUploaded(true);
                        setUploading(false);
                        setSuccess("Image uploaded successfully!");
                    });
                }
            );
        } else {
            setCurrentGod({
                ...currentGod,
                [name]: value,
            });
        }
    };

    const addGodOrGoddess = () => {
        if (!currentGod.name || !currentGod.image) {
            setError("Both name and image are required.");
            return;
        }
        setTempleData({
            ...templeData,
            godsAndGoddesses: [...templeData.godsAndGoddesses, currentGod],
        });
        setCurrentGod({ name: '', image: '' });
        setImageUploaded(false);
        setSuccess(null); // Clear upload success message
    };

    const removeGodOrGoddess = (index) => {
        const updatedGodsAndGoddesses = templeData.godsAndGoddesses.filter((_, i) => i !== index);
        setTempleData({
            ...templeData,
            godsAndGoddesses: updatedGodsAndGoddesses,
        });
    };

    const handleSaveAdditionalInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(
                `/api/temple/edit/${temple._id}`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ templeData }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }

            setSuccess(data.message);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <section className="bg-gray-100 p-4 rounded-md shadow-md">
            <Helmet>
                <title>Additional Temple Information</title>
                <meta name="description" content="Add or edit additional information about the temple including founded year, description, and god-goddesses or deities(devi-devtas and sant-mahant)." />
            </Helmet>

            <header>
                <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            </header>

            <article className="mb-4">
                <Label htmlFor="foundedYear" className="block mb-1">Founded Year</Label>
                <TextInput
                    name="foundedYear"
                    id="foundedYear"
                    type="number"
                    className="w-full"
                    placeholder="Enter the year the temple was founded"
                    value={templeData.foundedYear === 0 ? '' : templeData.foundedYear}
                    onChange={handleChange}
                />
            </article>

            <article className="mb-4">
                <Label htmlFor="description" className="block mb-1">Description</Label>
                <Textarea
                    name="description"
                    id="description"
                    type="text"
                    className="w-full"
                    placeholder="Add a small description about the temple"
                    value={templeData.description}
                    onChange={handleChange}
                />
            </article>

            <article className="w-full mb-4">
                <h3 className="text-lg font-semibold mb-2">Gods and Goddesses (Devi-Devta)</h3>
                <div className="bg-white p-4 rounded-md shadow-md mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="godName" className="block mb-1">Name</Label>
                            <TextInput
                                name="name"
                                id="godName"
                                type="text"
                                className="w-full mb-2"
                                placeholder="Enter the name of the Devi/Devta"
                                value={currentGod.name}
                                onChange={(e) => handleGodChange(e)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="godImage" className="block mb-1">Image</Label>
                            <label
                                htmlFor="godImage"
                                className={`cursor-pointer rounded-md px-4 py-2 flex items-center ${imageUploaded ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                            >
                                {uploading ? (
                                    <div className="flex items-center justify-center gap-2 relative">
                                        <HiUpload className="mr-2" />
                                        <div className="w-10 h-10">
                                            <CircularProgressbar 
                                                value={progress} 
                                                text={`${Math.round(progress)}%`} 
                                                styles={{
                                                    pathColor: '#ffffff',
                                                    trailColor: 'rgba(255, 255, 255, 0.2)',
                                                    text: { fill :'#ffffff', fontSize : '16px'}
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {imageUploaded ? <FaCircleCheck className="mr-2" /> : <HiUpload className="mr-2" />}
                                        {imageUploaded ? 'Image Uploaded' : 'Upload Image'}
                                        <input type="file" accept="image/*" name="image" id="godImage" className="hidden" onChange={handleGodChange} />
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                    <Button color="gray" className="w-full mt-4" onClick={addGodOrGoddess} disabled={uploading}>Add God/Goddess</Button>
                </div>
            </article>

            <section>
                {templeData.godsAndGoddesses.map((god, index) => (
                    <article key={index} className="flex items-center justify-between bg-white p-4 rounded-md shadow-md mb-4">
                        <div className="flex items-center">
                            {god.image && <img src={god.image} alt={god.name} className="w-16 h-16 mr-4 rounded-md" />}
                            <div>
                                <h4 className="text-md font-semibold">{god.name}</h4>
                            </div>
                        </div>
                        <button onClick={() => removeGodOrGoddess(index)} className="text-red-500 hover:text-red-700" aria-label="Remove deity">
                            <MdCancel size={24} />
                        </button>
                    </article>
                ))}
            </section>

            <Button 
                gradientDuoTone="pinkToOrange" 
                className="w-full mt-4" 
                onClick={handleSaveAdditionalInfo}
                disabled={loading}
                aria-label="Save additional information"
            >
                {loading ? <Spinner color={"pink"} /> : 'Save Additional Info'}
            </Button>
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={() => setSuccess(null)} /> )}
                {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
            </div>
        </section>
    );
}
