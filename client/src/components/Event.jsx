import { Button, Label, TextInput, Select, Datepicker, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Event() {
    const { currUser } = useSelector((state) => state.user);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        location: "",
        status: "pending",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDatePickerChange = (date) => {
        setEventData({ ...eventData, ["date"]: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(
                `/api/event/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(eventData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setSuccess("Event created successfully!");
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <>
            <div className="w-full my-8 flex flex-col items-center">
                <div className="w-full">
                    <div className="flex justify-center items-center">
                        <div className="w-full md:w-2/3 border border-gray-200 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-xl">
                            { error && ( <Alert onDismiss={()=> setError(null)} color={"failure"} className="my-4">{error}</Alert> ) }
                            { success && ( <Alert onDismiss={()=> setSuccess(null)} color={"success"} className="my-4">{success}</Alert> ) }
                            <h1 className="text-yellow-500 uppercase font-serif text-lg md:text-2xl font-bold text-center mb-6">
                                Create Event
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col">
                                        <Label htmlFor="name" className="mb-1 text-sm font-medium">
                                            Name of Event
                                        </Label>
                                        <TextInput
                                            type="text"
                                            className="p-2 border rounded-lg"
                                            id="name"
                                            name="name"
                                            placeholder="Add Event Name"
                                            value={eventData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label htmlFor="date" className="mb-1 text-sm font-medium">
                                            Date
                                        </Label>
                                        <Datepicker
                                            weekStart={1}
                                            id="date"
                                            name="date"
                                            onSelectedDateChanged={handleDatePickerChange}
                                            className="p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label htmlFor="location" className="mb-1 text-sm font-medium">
                                            Location of Event
                                        </Label>
                                        <TextInput
                                            type="text"
                                            className="p-2 border rounded-lg"
                                            id="location"
                                            name="location"
                                            placeholder="Add Event Location"
                                            value={eventData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label htmlFor="status" className="mb-1 text-sm font-medium">
                                            Status
                                        </Label>
                                        <Select
                                            id="status"
                                            name="status"
                                            value={eventData.status}
                                            onChange={handleChange}
                                            className="p-2 border rounded-lg"
                                        >
                                            <option value="Select" disabled>
                                                Select
                                            </option>
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <Button
                                        type="submit"
                                        color={"warning"}
                                        pill
                                        className="px-6 py-2"
                                        disabled={loading}
                                    >
                                        { loading ? <Spinner color={"warning"} />  : "Create" }
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}