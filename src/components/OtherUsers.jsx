import React from 'react';
import OtherUser from './OtherUser';
import useGetOtherUser from './hooks/useGetOtherUser';
import { useSelector } from 'react-redux';

const OtherUsers = () => {
    useGetOtherUser();
    const { OtherUsers } = useSelector(store => store.user);

    if (!OtherUsers) return null;

    return (
        <div className="overflow-auto flex-1">
            {OtherUsers.map(user => (
                <OtherUser key={user.id} user={user} />
            ))}
        </div>
    );
};

export default OtherUsers;
