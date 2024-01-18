'use client';

import React from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import {Toaster} from "react-hot-toast";

export default function RootLayout({children}) {
    const themeProvider = createTheme({
        palette: {
            mode: 'light',
            background: {
                default: "#eeeeee",
            }
        },
        components: {
            MuiPaper: {
                styleOverrides: {
                    rounded: {borderRadius: '10px'},
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                    },
                }
            },
        }
    });

    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="initial-scale=1, width=device-width"/>
            <title>IIIT - Hyderabad</title>
            <link rel="icon" href="/LOGO.png" sizes="any"/>
        </head>
        <body>
        <ThemeProvider theme={themeProvider}>
            <CssBaseline/>
            <Toaster />
            <Container maxWidth="xl">
                {children}
            </Container>
        </ThemeProvider>
        </body>
        </html>
    )
}

