import React, {Suspense} from "react";
import NavBar from "@/app/components/NavBar/NavBar";
import Loading from "@/app/[id]/loading";

export default function UserLayout({children, params}) {
    return (
        <Suspense fallback={<Loading/>}>
            <NavBar userId={params.id}/>
            {children}
        </Suspense>
    );
}