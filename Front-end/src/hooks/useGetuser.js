import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

function useGetuser(userID) {
    console.log(userID);
    const [user, setuser] = useState();
    const [update, setupdate] = useState();
    const showToast = useShowToast();
    useEffect(() => {
        async function getuser() {
            try {
                //we dont have to pass headers in get request
                const response = await fetch(`/api/users/profile/${userID}`);
                const data = await response.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setuser(data);
            } catch (error) {
                console.log(error);
            } finally {
                setupdate(false);
            }
        }
        getuser();
    }, [userID, showToast]);
    return { user, update };
}

export default useGetuser;