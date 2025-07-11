"use client";

import Link from 'next/link';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { LogIn, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isOpen, setIsOpen ] = useState(false)
    return <nav className="bg-white shadow-md p-3 z-50 dark:bg-gray-800">
        <div className="container mx-auto flex justify-between items-center">
            <Link href={"/"} className="text-xl font-bold text-gray-800 dark:text-white">
                Reading Retreat
            </Link>

            <div className="md:hidden">
                <Button variant={"ghost"} onClick={() => setIsOpen(!isOpen)}>

                    {isOpen ? <X className='w-6 h-6'/> :

                          <Menu className='w-6 h-6'/>
                          
                    }
                </Button>
               
            </div>
             <ul className={`hidden md:flex justify-center items-center space-x-6 text-grey-700`}>
                <li>
                    <Link href={"/"} className="hover:text-blue-500 dark:hover:text-gray-300">
                        Home
                    </Link>
                </li>
                 <li>
                    <Link href={"/blogs/saved"} className="hover:text-blue-500 dark:hover:text-gray-300">
                        Saved Blogs
                    </Link>
                </li>
                 <li>
                    <Link href={"/login"} className="hover:text-blue-500 dark:hover:text-gray-300">
                        <LogIn />
                    </Link>
                </li>
             </ul>

        </div>
        <div className={cn("md:hidden overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>    
            <ul className='flex flex-col justify-center space-y-4 p-4 text-gray-700 bg-white shadow-md'>
                <li>
                    <Link href={"/"} className="hover:text-blue-500 dark:hover:text-gray-300">
                        Home
                    </Link>
                </li>
                 <li>
                    <Link href={"/blogs/saved"} className="hover:text-blue-500 dark:hover:text-gray-300">
                        Saved Blogs
                    </Link>
                </li>
                 <li>
                    <Link href={"/login"} className="hover:text-blue-500 dark:hover:text-gray-300">
                        <LogIn />
                    </Link>
                </li>
            </ul>
            
            </div>    </nav>
}

export default Navbar
