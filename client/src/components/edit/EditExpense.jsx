import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Datepicker, Label, Modal, Select, Spinner, TextInput, Checkbox } from "flowbite-react";
import { FaFileAlt, FaMoneyBillWave, FaClipboardCheck, FaListAlt, FaCalendarAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function EditExpense({ showModal, setShowModal, setIsUpdated, expense }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        category: "",
        status: "",
        amount: 0,
        event: null
    });
    const [events, setEvents] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [showEventSelect, setShowEventSelect] = useState(false); 

    const categories = [
        "Rituals & Poojas",
        "Festivals & Events",
        "Maintenance & Repairs",
        "Utilities",
        "Staff Salaries",
        "Charity & Donations",
        "Food & Prasadam",
        "Decorations & Flowers",
        "Security",
        "Miscellaneous"
    ];

    useEffect(() => {
        if (expense) {
            setFormData({
                ...formData,
                title: expense.title || '',
                amount: expense.amount || '',
                date: expense.date || '',
                category: expense.category || '',
                status: expense.status || 'pending',
                event: expense.event?._id || ""
            });

            setShowEventSelect(!!expense.event);
        }

        // Fetch events from the backend
        const fetchEvents = async () => {
            try {
                const data = await fetchWithAuth(
                    `/api/event/get/${currUser.templeId}`,
                    {},
                    refreshSuperAdminOrUserAccessToken,
                    "User",
                    setLoading,
                    setAlert,
                    navigate
                );
                if(data){
                    setEvents(data.events); 
                } else {
                    setAlert({ type : "error", message : "Failed to fetch events" });
                }
            } catch (err) {
                setAlert({ type : "error", message : err.message });
            }
        };

        fetchEvents();
    }, [expense, currUser.templeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleDatePickerChange = (date) => {
        setFormData({ ...formData, date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type : "", message : "" });
        const updatedFormData = {
            ...formData,
            event: formData.event === "" ? null : formData.event,
        };
        try {
            const data = await fetchWithAuth(
                `/api/expense/edit/${expense._id}/${currUser.templeId}`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedFormData)
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setIsUpdated(true);
                setAlert({ type : "success", message : "Expense updated successfully." });
            }
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };

    const handleEventToggle = () => {
        setFormData({ ...formData, event: "" });
        setShowEventSelect(!showEventSelect);
    };

    return (
        <>
            <Helmet>
                <title>Edit Expense - Temple Management</title>
                <meta name="description" content="Edit a expense record in the temple management system. Update expense details like title, description, date, category, status, and amount." />
            </Helmet>
            <Modal show={showModal} dismissible onClose={() => setShowModal(false)} position={"top-right"}>
                <Modal.Header>{expense.category}</Modal.Header>
                <Modal.Body className="w-full flex flex-col" >
                    <div>
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                            {alert && alert.message && (
                                <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                            )}
                        </div>
                        <form className="my-3" onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="title" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                        <FaFileAlt className="inline mr-2 text-xl text-gray-500" />
                                        Title
                                    </Label>
                                    <TextInput
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="date" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                        <FaCalendarAlt className="inline mr-2 text-xl text-gray-500" />
                                        Date
                                    </Label>
                                    <Datepicker
                                        weekStart={1}
                                        id="date"
                                        name="date"
                                        value={new Date(formData.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: '2-digit',
                                            year: 'numeric',
                                        })}
                                        onSelectedDateChanged={handleDatePickerChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="category" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                        <FaListAlt className="inline mr-2 text-xl text-gray-500" />
                                        Category
                                    </Label>
                                    <Select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="status" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                        <FaClipboardCheck className="inline mr-2 text-xl text-gray-500" />
                                        Status
                                    </Label>
                                    <Select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="completed">Completed</option>
                                        <option value="rejected">Rejected</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <Label htmlFor="amount" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <FaMoneyBillWave className="inline mr-2 text-xl text-gray-500" />
                                    Amount
                                </Label>
                                <TextInput
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <div className="flex items-center gap-2 my-4">
                                    <Checkbox
                                        id="event-checkbox"
                                        checked={showEventSelect}
                                        onChange={handleEventToggle}
                                    />
                                    <Label htmlFor="associateEvent" className="text-sm font-medium">
                                        {showEventSelect
                                            ? "Remove event association"
                                            : "Associate this expense with an event"
                                        }
                                    </Label>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                {showEventSelect && (
                                    <div className="mt-4">
                                        <Label htmlFor="event" className="mb-4 text-sm font-medium flex items-center gap-2">
                                            Event
                                        </Label>
                                        <Select
                                            id="event"
                                            name="event"
                                            value={formData.event}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select an event</option>
                                            {events.length > 0 && events.map(event => (
                                                <option key={event._id} value={event._id}>
                                                    {event.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row-reverse my-4">
                                <Button gradientDuoTone="pinkToOrange" pill onClick={handleSubmit} disabled={loading}>
                                    {loading ? <Spinner color={"purple"} /> : "Update Expense"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
