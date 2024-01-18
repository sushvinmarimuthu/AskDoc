'use client';

import Loading from "@/app/[id]/loading";
import React, {Suspense} from "react";


export default function FileLayout({children}) {
    console.log('FileLayout Rendered');
    return (
        <Suspense fallback={<Loading/>}>
            {children}
        </Suspense>
    );
}