"use client"
import LogoImage from "@/app/images/logo.jpeg";
import Image from "next/image";
import classNames from 'classnames';
export default function Logo({className}) {
    const classes = classNames(className, 'mx-auto rounded-full w-48 h-48 cursor-pointer hover:scale-110 duration-1000 border-2 border-orange-500');

    return (
        <Image
            src={LogoImage}
            className={classes}
            alt="Resolver Logo"
        />
    )

}

