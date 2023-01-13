import React from "react";
import {auth} from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Volunteer = () => {

    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        console.log("Hello");
        if (loading) {
            return;
        }
        if(!user)
        {
            console.log("not logged in")
            return navigate('/login')
        }
        if(user)
        {
            console.log("logged in")
            user.getIdTokenResult().then((idTokenResult) => {
                if(idTokenResult.claims['profileType'] != "Volunteer")
                {
                    return navigate('/books')
                }
        })
    }},[user, loading])
    return (
        <div>
        <h1>Volunteerzcz</h1>
        <p>sdada</p>
        </div>
    );
}

export default Volunteer;