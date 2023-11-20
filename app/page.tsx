import React from "react";
import ResponsiveAppBar from './components/ResponsiveAppBar';

export default function Home() {
    return (
        <>
            <ResponsiveAppBar
                pages={[
                    {label: "22/23", link: "/season?y=22-23"},
                    {label: "21/22", link: "/season?y=21-22"},
                    {label: "20/21", link: "/season?y=20-21"},
                    {label: "19/20", link: "/season?y=19-20"},
                    {label: "18/19", link: "/season?y=18-19"},
                    {label: "17/18", link: "/season?y=17-18"},
                ]}
            />
        </>
    );
}
