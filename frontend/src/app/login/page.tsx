import React from 'react'
import { Button } from '@/components/ui/ui/button'
import {
  Card,

  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/ui/card"

const LoginPage = () => {
  return (
    <div className='w-[350px] m-auto mt-[200px]'>
      <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle >Login to The Reading Retreat</CardTitle>
        <CardDescription>
          Login To Your Reading Retreat Account
        </CardDescription>
      
      </CardHeader>
      <CardContent>
      <Button>Login with Google <img src={'/google-icon.png'} className="w-6 h-6" alt='google icon'/></Button>
      </CardContent>
    
    </Card>
    </div>
  )
}

export default LoginPage
