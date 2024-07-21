import { useState } from "react";
import { Modal, Button, Spinner, Alert } from "flowbite-react";
import { Helmet } from "react-helmet-async";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function DeleteTenant({ tenantId, isOpen, onClose, refreshTenants }) {
    const { currUser } = useSelector( state => state.user );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/tenant/delete/${currUser.templeId}/${tenantId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }

            setLoading(false);
            refreshTenants();
            onClose();
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>Delete Tenant Confirmation - Temple Management</title>
                <meta name="description" content="Confirm deletion of a tenant in the temple management system. Ensure your actions before proceeding." />
            </Helmet>
            <Modal show={isOpen} dismissible onClose={onClose} size={"md"} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Tenant?
                        </h3>
                        {error && (
                            <Alert onDismiss={()=> setError(null)} color={"failure"} className="my-2" >{error}</Alert>
                        )}
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete} disabled={loading}>
                                {loading ? <Spinner color="failure" /> : "Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={onClose}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
