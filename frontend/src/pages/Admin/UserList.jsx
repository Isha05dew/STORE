import { useEffect, useState } from "react"
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"
import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from '../../redux/api/usersApiSlice'
import Message from "../../components/Message"

const UserList = () => {
    const [data: users, refetch, isLoading, error] = useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation()
    const [updateUser] = useUpdateUserMutation()

    const [editableUserId, setEditableUserId] = useState(null)
    const [editableUserName, setEditableUserName] = useState('')
    const [editableUserFullName, setEditableUserFullName] = useState('')
    const [editableUserEmail, setEditableUserEmail] = useState('')

    useEffect(() => {
        refetch();
    }, [refetch]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Users</h1>
            {/* {isLoading ? (<Loader />) : error
                ? (
                    <Message variant='danger'>
                        {error?.data.message || error.message}
                    </Message>
                    )
                : (
                <div className="flex flex-col md:flex-row"></div>
            )
            } */}
        </div>
    )
}

export default UserList