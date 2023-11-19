import React from "react";
import ResponsiveAppBar from './components/ResponsiveAppBar';
import {Grid} from "@mui/material";

export default function Home() {
    return (
        <>
            <ResponsiveAppBar
                pages={[
                    {label: "Tudo", link: "/"},
                    {label: "Temporada", link: "/season"},
                ]}
            />
        </>
    );
}
