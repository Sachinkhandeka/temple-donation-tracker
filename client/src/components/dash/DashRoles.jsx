import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";

const EditRoleModal = React.lazy(()=> import("../edit/EditRoleModal"));
const DeleteRoleModal = React.lazy(()=> import("../delete/DeleteRoleModal"));

export default function DashRoles() {
    const { currUser } = useSelector(state => state.user);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [roles, setRoles] = useState([]);
    const [ showModal , setShowModal ] = useState(false);
    const [ deleteModal , setDeleteModal ] = useState(false);
    const [ roleData , setRoleData ] = useState({});
    const [ roleUpdated , setRoleUpdated ] = useState(false);

    
    useEffect(() => {
        if (roleUpdated) {
            getRolesData(); // Re-fetch user data
            setRoleUpdated(false); // Reset userDataUpdated state
        }
    }, [roleUpdated]);

    // Function to fetch roles data
    const getRolesData = async () => {
        try {
            setError(null);
            setSuccess(null);

            const response = await fetch(`/api/role/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                return setError(data.message);
            }
            setRoles(data.roles);
            setSuccess("Role data fetched successfully.");
        } catch (err) {
            setError(err.message);
        }
    };
    // Fetch roles data on component mount or when currUser changes
    useEffect(() => {
        getRolesData();
    }, [currUser]);

    //function to edit roles
    const handleEdit = (role)=> {
        setShowModal(true);
        setRoleData(role);
    }

    //function to delete roles
    const handleDelete = async(role)=> {
        setDeleteModal(true);
        setRoleData(role);
    }

    return (
        <>
            <Helmet>
                <title>Manage Roles - Dashboard</title>
                <meta name="description" content="View, edit, and delete roles for your temple. Manage user access rights efficiently." />
            </Helmet>
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {/* Success toast */}
                {success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={()=> setSuccess(null)} /> )}
                {/* Error toast */}
                {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={()=> setError(null)} /> )}
            </div>
            {/* Displaying roles table if isAdmin and roles array has length > 0 */}
            {currUser.isAdmin && roles.length > 0 ? (
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>Role Name</Table.HeadCell>
                        <Table.HeadCell>Permission Name</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    {roles.map((role) => (
                        <Table.Body className="divide-y" key={role._id}>
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{role.name}</Table.Cell>
                                <Table.Cell>
                                    {role.permissions.map((permission, index) => (
                                        <div  key={index} >
                                            <p>{ permission.permissionName }</p>
                                            <span className="block text-xs">
                                                [{permission.actions.join(', ')}]
                                            </span>
                                        </div>
                                    ))}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-4" >
                                        <span onClick={()=> handleEdit(role)} className="cursor-pointer" >
                                            <MdOutlineEdit size={20} color="teal"/>
                                        </span>
                                        <span onClick={()=> handleDelete(role)} className="cursor-pointer" >
                                            <MdDeleteOutline size={20} color="red"/>
                                        </span>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            ) : (
                // Displaying message if there are no roles
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center flex flex-col items-center justify-center">
                        <TbFaceIdError size={50} className="animate-bounce" />
                        <p>No Roles Created Yet!</p>
                    </div>
                </div>
            )}
            {/* edit role component */}
            <EditRoleModal 
                roleData={roleData}
                setRoleData={setRoleData}
                showModal={showModal}
                setShowModal={setShowModal}
                setRoleUpdated={setRoleUpdated}
            />
            {/* delete role component */}
            <DeleteRoleModal 
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                setError={setError}
                setRoleUpdated={setRoleUpdated}
                roleId={ roleData && roleData._id }
            />
        </>
    );
}
