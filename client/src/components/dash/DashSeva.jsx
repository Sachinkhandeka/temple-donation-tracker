import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TextInput, Button, Spinner } from 'flowbite-react';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function DashSeva() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [seva, setSeva] = useState([]);
    const [editSevaId, setEditSevaId] = useState(null);
    const [editSevaName, setEditSevaName] = useState("");
    const [loading, setLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [alert, setAlert] = useState({ type  : "", message : "" });

    const getSeva = useCallback(async () => {
        try {
            const data = await fetchWithAuth(
                `/api/seva/get/${currUser.templeId}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setSeva(data.seva);
            }
        } catch (err) {
            setAlert({ type : "error", message : err.message });
        }
    }, [currUser.templeId]);

    const handleEditSeva = async (sevaId) => {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/seva/edit/${sevaId}/${currUser.templeId}`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sevaName: editSevaName })
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
           if(data) {
                setAlert({ type : "success", message : "Seva edited successfully" });
                setLoading(false);
                getSeva();
                setEditSevaId(null);
           }
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };

    const handleDeleteSeva = async (sevaId) => {
        setDelLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/seva/delete/${sevaId}/${currUser.templeId}`, 
                { method: "DELETE" },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setDelLoading,
                setAlert,
                navigate
            );
            if(data) {
                getSeva();
                setAlert({ type : "success", message : "Seva deleted successfully" });
                setDelLoading(false);
            }
        } catch (err) {
            setDelLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };

    useEffect(() => {
        getSeva();
    }, [getSeva]);

    const hasPermission = (action) => {
        return (
            currUser && currUser.isAdmin ||
            (currUser.roles && currUser.roles.some(role => 
                role.permissions.some(p => p.actions.includes(action))
            ))
        );
    };

    return (
        <section className="min-h-screen" >
            <Helmet>
                <title>Seva Management - Dashboard</title>
                <meta name="description" content="Manage Seva offerings efficiently. View, edit, and delete Seva offerings at your temple." />
            </Helmet>
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>
                {seva.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seva.map((sevaItem, index) => (
                            <div key={sevaItem._id} className="p-6 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
                                {editSevaId === sevaItem._id ? (
                                    <div className="flex flex-col gap-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Edit Seva Name:</label>
                                        <TextInput
                                            type="text"
                                            value={editSevaName}
                                            onChange={(e) => setEditSevaName(e.target.value)}
                                            placeholder="Enter new seva name"
                                            className="rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button onClick={() => handleEditSeva(sevaItem._id)} gradientDuoTone="greenToBlue" size="sm" disabled={loading}>
                                                {loading ? <Spinner size="sm" light={true} /> : <FaSave size={20} />}
                                                <span className="ml-2">Save</span>
                                            </Button>
                                            <Button onClick={() => setEditSevaId(null)} color="failure" size="sm" disabled={loading} className="flex items-center justify-center" >
                                                <FaTimes size={20} />
                                                <span className="ml-2">Cancel</span>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4 items-center">
                                            <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{index + 1}.</span>
                                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{sevaItem.sevaName}</h2>
                                        </div>
                                        <div className="flex flex-col gap-2 items-center">
                                            {hasPermission("update") && (
                                                <Button onClick={() => {
                                                    setEditSevaId(sevaItem._id);
                                                    setEditSevaName(sevaItem.sevaName);
                                                }}
                                                    gradientMonochrome="success"
                                                    size="xs"
                                                    pill
                                                >
                                                    <MdModeEdit />
                                                </Button>
                                            )}
                                            {hasPermission("delete") && (
                                                <Button
                                                    onClick={() => handleDeleteSeva(sevaItem._id)}
                                                    gradientMonochrome="failure"
                                                    size="xs"
                                                    pill
                                                    disabled={delLoading}
                                                >
                                                    {delLoading ? <Spinner size="xs" light={true} /> : <FaTrash />}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-screen">
                        <div className="text-center flex flex-col items-center justify-center">
                            <TbFaceIdError size={50} className="animate-bounce text-gray-600 dark:text-gray-300" />
                            <p className="text-gray-600 dark:text-gray-300">No Seva Added Yet!</p>
                        </div>
                    </div>
                )}
        </section>
    );
}
