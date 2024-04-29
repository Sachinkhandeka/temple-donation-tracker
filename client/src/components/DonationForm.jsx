import { useEffect, useState } from "react"
import { Button, Label, Select, Spinner, TextInput, Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { FcDonate } from "react-icons/fc";
import { FaFilePdf } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Receipt from "../pdf/Receipt";
import AddressForm from "./AddressForm";

export default function DonationForm({locationAdded}) {
    const [ selectedCountry , setSelectedCountry ] = useState({});
    const [ selectedState , setSelectedState ] = useState({});
    const [ selectedDistrict , setSelectedDistrict ] = useState({});
    const [ selectedTehsil , setSelectedTehsil ] = useState({});
    const [ selectedVillage , setSelectedVillage ] =  useState({});
    const { currUser } = useSelector(state => state.user);
    const [ error , setError ] =  useState(null);
    const [ success , setSuccess ] =  useState(null);
    const [ loading , setLoading ] = useState(false);
    const [ donation , setDonation ] = useState({
        donorName: "",
        sevaName: "",
        country: "",
        state: "",
        district: "",
        tehsil: "",
        village: "",
        contactInfo: 0,
        paymentMethod: "cash",
        donationAmount: 0
    });
    const [ receiptData , setReceiptData ] = useState({});

    const handleChange = (e)=> {
        const { value, id } = e.target ;
        const selectedOption = e.target.options[e.target.selectedIndex];

        //country
        if(id === "country") {
            setSelectedCountry(value);
            setDonation({
                ...donation,
                [id] : selectedOption.text,
            });
        }

        //state
        if(id === "state") {
            setSelectedState(value);
            setDonation({
                ...donation,
                [id] : selectedOption.text,
            })
        }

        //district
        if(id === "district") {
            setSelectedDistrict(value);
            setDonation({
                ...donation,
                [id] : selectedOption.text,
            });
        }

        //tehsil
        if(id === "tehsil") {
            setSelectedTehsil(value);
            setDonation({
                ...donation,
                [id] : selectedOption.text,
            });
        }

        //village
        if(id === "village") {
            setSelectedVillage(value);
            setDonation({
                ...donation,
                [id] : selectedOption.text,
            });
        }
    }
    //handle Donation Creation
    const handleSubmit = async(e)=> {
        e.preventDefault();
        try{
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(
                `/api/donation/create/${currUser.templeId}`,
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(donation),
                }
            );
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                return setError(data.message);
            }

            setLoading(false);
            setSuccess("Donation added successfully.");
            setReceiptData( data.newDaan);
        }catch(err) {
            setError(err.message);
        }
    }
        return(
            <div className="w-full flex flex-col md:flex-row gap-4 border-2 border-gray-300 dark:border-gray-700 rounded-md my-10 relative" >
                <div 
                   className="min-h-20 md:min-h-full w-full md:w-40 flex md:flex-col 
                   justify-around items-center bg-gradient-to-bl from-blue-600 to-blue-300 
                   dark:bg-gradient-to-bl dark:from-gray-600 dark:to-gray-800 rounded-tr-md 
                   md:rounded-tr-none rounded-tl-md md:rounded-bl-md" >
                    <div>
                        <FcDonate size={30} />
                    </div>
                    <div>
                        <MdOutlineWaterDrop size={30} />
                    </div>
                    <div>
                        <FcDonate size={30} />
                    </div>
                </div>  
                <div className="flex-1 p-10" >
                    <h2 className="text-blue-400 dark:text-white font-mono uppercase font-bold p-2 mb-4 text-3xl" >Add Donation</h2>
                    <form onSubmit={handleSubmit} >
                        <div className="flex flex-col md:flex-row flex-wrap gap-4" >  
                            <div className="flex-1 flex flex-col gap-4" >
                                <Label htmlFor="donorName">Name of Donar</Label>
                                <TextInput id="donorName" name="donorName" placeholder="@firstName @lastName" onChange={(e)=> setDonation({...donation,[e.target.id]: e.target.value })} />
                            </div>
                            <div className="flex-1 flex flex-col gap-4" >
                                <Label htmlFor="sevaName">Name of Seva</Label>
                                <TextInput id="sevaName" name="sevaName" placeholder="Dhaja no chadavo" onChange={(e)=> setDonation({...donation,[e.target.id]: e.target.value })}  />
                            </div>
                        </div>
                        <h2 className="my-3 font-bold" >Address</h2>
                        <AddressForm 
                           selectedCountry={selectedCountry}
                           selectedState={selectedState}
                           selectedDistrict={selectedDistrict} 
                           selectedTehsil={selectedTehsil}
                           selectedVillage={selectedVillage}
                           currUser={currUser}
                           locationAdded={locationAdded}
                           handleChange={handleChange}
                        />
                        <div className="flex flex-col md:flex-row flex-wrap gap-4 my-8" >  
                            <div className="flex-1 flex flex-col gap-4"  >
                                <Label htmlFor="contactInfo" >Add Contact Info</Label>
                                <TextInput id="contactInfo" name="contactInfo" placeholder="Mo. 7834XXXXXX" onChange={(e)=> setDonation({ ...donation, [e.target.id] :e.target.value }) } />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row flex-wrap gap-4" >  
                            <div className="flex-1 flex flex-col gap-4" >
                                <Label htmlFor="paymentMethod" >Payment Method</Label>
                                <Select id="paymentMethod" onChange={(e)=> setDonation({ ...donation , [e.target.id]: e.target.value })} >
                                    <option value="select" disabled>Select</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank</option>
                                    <option value="upi">Upi</option>
                                </Select>
                            </div>
                            <div className="flex-1 flex flex-col gap-4" >
                                <Label htmlFor="donationAmount" >Donation Amount</Label>
                                <TextInput type="number" id="donationAmount" name="donationAmount" placeholder="Rs. 2300" onChange={(e)=> setDonation({ ...donation, [e.target.id]: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex flex-row-reverse my-4 gap-3" >
                            <Button gradientMonochrome={"cyan"} pill disabled={loading} onClick={handleSubmit} >
                                {loading ? <Spinner color="info" />:'Add Donation'}
                            </Button>
                            {receiptData && Object.keys(receiptData).length > 0 && (
                                <PDFDownloadLink
                                    document={<Receipt receiptData={receiptData} />} // Passing donationData as props
                                    fileName='Donation.pdf'
                                >
                                    {/* Render a button that shows "Receipt icon" */}
                                    {({ loading }) => (
                                        <Button color="failure" pill disabled={loading}>
                                            {loading ? 'Loading document...' : 'Receipt'}
                                            <FaFilePdf className="ml-2 h-5 w-5" />
                                        </Button>
                                    )}
                                </PDFDownloadLink>
                            )}
                        </div>
                    </form>   
                </div>
                { success && (
                    <Toast className="absolute bottom-[-10px] md:bottom-4 left-4 md:left-48" >
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{ success }</div>
                        <Toast.Toggle />
                    </Toast> 
                ) }
                { error && (
                    <Toast className="absolute bottom-[-10px] md:bottom-4 left-4 md:left-48" >
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <HiX className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{ error }</div>
                        <Toast.Toggle />
                    </Toast> 
                ) }
            </div>
        );
}