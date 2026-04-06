'use server'

import { cookies } from "next/headers"

export async function setAuthCookie(token:string) {
    const cookieStore = await cookies();

    cookieStore.set("firebase-auth-token", token, {
        httpOnly: true, // Makes cookie not visible to Javascript
        secure: process.env.NODE_ENV === "production", // Cookies sends only over https
        sameSite: "strict", // Prevent CSRF attacks
        path: "/",  // Available for the whole site
        maxAge: 3600, // One hour cookie life
    })
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("firebase-auth-token");
}