"use client";

import { createContext , useState} from "react";

export const user_service="https://localhost:5000";
export const author_service="https://localhost:5001";
export const blog_service="https://localhost:5002";

export interface User {
       _id: string;
       name: string;
       email: string;
       image: string;
       instagram: string;
       facebook: string;
       linkedin: string;
       bio: string;
    }

    export interface Blog {
       id: string;
       title: string;
       description: string;
       blogContent: string;
       image: string;
       category: string;
       author: string;
       created_at: string;
    }

     interface AppContextType {
            // Define any methods or properties you want to expose
       user: User | null;
       
        }

    const AppContext = createContext<AppContextType | undefined>(undefined);

    interface AppProviderProps {
         children: React.ReactNode;
     }

    
     export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
      const [user,setUser]= useState(null);
        return (
                <AppContext.Provider value={{user}}>
                    {children}
                </AppContext.Provider>
            );
        }
export default AppContext;